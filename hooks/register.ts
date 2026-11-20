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

let ponder: { cancel: () => void } | null = null

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'claudetones',
      description: 'Mute claudetones, test sounds, or check status (/claudetones test [event])',
    })
    await $.command.register({
      name: 'oops',
      description: 'Caught Claude being wrong — play the sad sound',
    })
    await fireIfOn($, 'session_start')
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (!(await muted($))) {
      await fire($, 'reasoning')
      schedulePonder($)
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    cancelPonder()
    await fireIfOn($, 'done')
    return next(e)
  })

  on('turn.abort', async ($, e, next) => {
    cancelPonder()
    return next(e)
  }).catch(($, e, next) => next(e)) // fail open: a sound must never block an interrupt

  on('session.end', async ($, e, next) => {
    cancelPonder()
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const off = await muted($)
    if (!off) void fire($, e.tool === 'Bash' ? 'terminal_command' : 'tool_call')
    const r = await next(e)
    if (!off && r.isError === true) void fire($, 'error')
    return r
  }).catch(($, e, next) => next(e)) // fail open: a sound must never break a tool call

  on('command.run', { command: 'claudetones' }, async ($, e) => {
    const action = parseClaudetones(e.args ?? '')
    switch (action.kind) {
      case 'toggle': {
        const wasMuted = await muted($)
        await $.store.set(MUTE_KEY, !wasMuted)
        return { text: wasMuted ? '🔊 claudetones on — ring the bells, captain!' : '🔇 claudetones muted' }
      }
      case 'test': {
        await fire($, action.event)
        return { text: `🎵 Playing sound for [${action.event}]` }
      }
      case 'status': {
        const isMuted = await muted($)
        return { text: isMuted ? '🔇 Status: Muted (run /claudetones to unmute)' : '🔊 Status: Active & playing sounds' }
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
    void fire($, 'oops')
    return { text: '😔 caught in 4k, captain' }
  })
}

function schedulePonder($: EngineInterface): void {
  cancelPonder()
  ponder = $.clock.after(LONG_REASONING_MS, () => {
    ponder = null
    void fireIfOn($, 'long_reasoning')
  })
}

function cancelPonder(): void {
  ponder?.cancel()
  ponder = null
}

async function muted($: EngineInterface): Promise<boolean> {
  try {
    return (await $.store.get(MUTE_KEY)) === true
  } catch {
    return false
  }
}

async function fire($: EngineInterface, event: EventKey): Promise<void> {
  const file = pickClip(event)
  if (file) void $.audio.play({ asset: file, gain: gainFor(event) }).catch(() => {})
}

async function fireIfOn($: EngineInterface, event: EventKey): Promise<void> {
  if (!(await muted($))) await fire($, event)
}
