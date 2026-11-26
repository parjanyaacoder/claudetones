import type { EngineInterface, Register } from 'claude-code'

import {
  MUTE_KEY,
  CLAUDETONES_USAGE,
  gainFor,
  parseClaudetones,
  pickClip,
  type EventKey,
} from './logic'

// popUpi, but for Claude Code. Each engine event maps to a claudetones EVENT key; the
// pure selector (logic.ts) turns that into a random mood-matched clip, or nothing.
// Seven universal events cover a whole session; /claudetones toggles mute/test;
// /oops is a manual button that plays even muted. Every play is best-effort: a sound
// glitch (or a surface with no player) must never disturb the tool or the turn.

const LONG_REASONING_MS = 8000
const PAUSE_KEY = 'paused'
const DEBOUNCE_MS = 220

let ponder: { cancel: () => void } | null = null
let currentSessionId: string | null = null
let lastSoundTime = 0

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Isolate active session to prevent multiple concurrent sessions from playing simultaneously
    const sid = (e as any)?.sessionId || (e as any)?.session_id || (e as any)?.id || `session_${Date.now()}`
    currentSessionId = String(sid)

    await $.command.register({
      name: 'claudetones',
      description: 'Control claudetones playback: pause, play, stop, mute, or test sounds',
    })
    await $.command.register({
      name: 'oops',
      description: 'Caught Claude being wrong — play the sad sound',
    })
    await fireIfActive($, e, 'session_start')
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (await isSessionActive($, e)) {
      await fire($, 'reasoning')
      schedulePonder($, e)
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    cancelPonder()
    await fireIfActive($, e, 'done')
    return next(e)
  })

  on('turn.abort', async ($, e, next) => {
    cancelPonder()
    return next(e)
  }).catch(($, e, next) => next(e)) // fail open: a sound must never block an interrupt

  on('session.end', async ($, e, next) => {
    cancelPonder()
    if (isCurrentSession(e)) {
      currentSessionId = null
    }
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const active = await isSessionActive($, e)
    if (active) void fire($, e.tool === 'Bash' ? 'terminal_command' : 'tool_call')
    const r = await next(e)
    if (active && r.isError === true) void fire($, 'error')
    return r
  }).catch(($, e, next) => next(e)) // fail open: a sound must never break a tool call

  on('command.run', { command: 'claudetones' }, async ($, e) => {
    const action = parseClaudetones(e.args ?? '')
    switch (action.kind) {
      case 'toggle': {
        const wasMuted = await isMuted($)
        await $.store.set(MUTE_KEY, !wasMuted)
        return { text: wasMuted ? '🔊 claudetones on — sounds active' : '🔇 claudetones muted' }
      }
      case 'pause': {
        await $.store.set(PAUSE_KEY, true)
        cancelPonder()
        return { text: '⏸️ claudetones paused — sounds suspended' }
      }
      case 'resume': {
        await $.store.set(PAUSE_KEY, false)
        await $.store.set(MUTE_KEY, false)
        return { text: '▶️ claudetones resumed — playback active' }
      }
      case 'stop': {
        await $.store.set(PAUSE_KEY, true)
        cancelPonder()
        return { text: '⏹️ claudetones stopped' }
      }
      case 'test': {
        await fire($, action.event, true)
        return { text: `🎵 Playing sound for [${action.event}]` }
      }
      case 'status': {
        const paused = await isPaused($)
        const muted = await isMuted($)
        if (paused) return { text: '⏸️ Status: Paused (run /claudetones play to resume)' }
        if (muted) return { text: '🔇 Status: Muted (run /claudetones to unmute)' }
        return {
          text: `🔊 Status: Active & listening (Session: ${currentSessionId ? currentSessionId.slice(0, 12) : 'active'})`,
        }
      }
      case 'help': {
        return { text: CLAUDETONES_USAGE }
      }
      default:
        return { text: action.message }
    }
  })

  // /oops plays even while muted — pressing it is an explicit ask for the sound.
  on('command.run', { command: 'oops' }, async $ => {
    void fire($, 'oops', true)
    return { text: '😔 caught in 4k, captain' }
  })
}

function schedulePonder($: EngineInterface, e?: any): void {
  cancelPonder()
  ponder = $.clock.after(LONG_REASONING_MS, () => {
    ponder = null
    void fireIfActive($, e, 'long_reasoning')
  })
}

function cancelPonder(): void {
  ponder?.cancel()
  ponder = null
}

function isCurrentSession(e?: any): boolean {
  if (!e) return true
  const sid = e.sessionId || e.session_id || e.id
  if (!sid || !currentSessionId) return true
  return String(sid) === currentSessionId
}

async function isMuted($: EngineInterface): Promise<boolean> {
  try {
    return (await $.store.get(MUTE_KEY)) === true
  } catch {
    return false
  }
}

async function isPaused($: EngineInterface): Promise<boolean> {
  try {
    return (await $.store.get(PAUSE_KEY)) === true
  } catch {
    return false
  }
}

async function isSessionActive($: EngineInterface, e?: any): Promise<boolean> {
  if (!isCurrentSession(e)) return false
  if (await isPaused($)) return false
  if (await isMuted($)) return false
  return true
}

async function fire($: EngineInterface, event: EventKey, bypassThrottle = false): Promise<void> {
  // Prevent parallel overlapping sounds from playing on top of each other
  const now = Date.now()
  if (!bypassThrottle && now - lastSoundTime < DEBOUNCE_MS) {
    return
  }
  lastSoundTime = now

  const file = pickClip(event)
  if (file) void $.audio.play({ asset: file, gain: gainFor(event) }).catch(() => {})
}

async function fireIfActive($: EngineInterface, e: any, event: EventKey): Promise<void> {
  if (await isSessionActive($, e)) await fire($, event)
}
