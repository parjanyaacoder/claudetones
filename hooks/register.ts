import type { EngineInterface, Register } from 'claude-code'

import {
  MUTE_KEY,
  CLAUDETONES_USAGE,
  gainFor,
  parseClaudetones,
  pickClip,
  type EventKey,
} from './logic'

// claudetones for Claude Code: Expansive Acoustic Architecture
// Covers Core Lifecycle, MCP Protocol, Agent Skills, Plugins, Subagents, and Memory.

const LONG_REASONING_MS = 8000
const PAUSE_KEY = 'paused'
const DEBOUNCE_MS = 250

const EVENT_PRIORITY: Record<EventKey, number> = {
  oops: 100,
  error: 95,
  done: 90,
  permission_request: 85,
  plugin_install: 80,
  mcp_connect: 75,
  git_commit: 70,
  session_start: 65,
  subagent_spawn: 60,
  skill_invoke: 55,
  mcp_tool_call: 50,
  context_compact: 45,
  long_reasoning: 40,
  reasoning: 35,
  file_edit: 30,
  terminal_command: 25,
  file_read: 15,
  tool_call: 10,
}

let ponder: { cancel: () => void } | null = null
let currentSessionId: string | null = null
let lastSoundTime = 0
let lastEventPriority = 0

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

    // Detect if MCP servers are configured in the session
    const mcpServers = (e as any)?.mcpServers || (e as any)?.mcp_servers
    if (Array.isArray(mcpServers) && mcpServers.length > 0) {
      await fireIfActive($, e, 'mcp_connect')
    } else {
      await fireIfActive($, e, 'session_start')
    }

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
    if (active) {
      const toolName = String(e.tool || '')
      const inputStr = JSON.stringify((e as any).input || '')

      if (toolName === 'Bash') {
        if (inputStr.includes('git commit') || inputStr.includes('git push')) {
          void fire($, 'git_commit')
        } else {
          void fire($, 'terminal_command')
        }
      } else if (toolName.startsWith('mcp__') || toolName.includes('__')) {
        void fire($, 'mcp_tool_call')
      } else if (toolName === 'Skill' || toolName === 'invoke_skill' || toolName.toLowerCase().includes('skill')) {
        void fire($, 'skill_invoke')
      } else if (toolName === 'invoke_subagent' || toolName === 'Agent' || toolName === 'swarm') {
        void fire($, 'subagent_spawn')
      } else if (['Edit', 'MultiEdit', 'Write', 'NotebookEditCell'].includes(toolName)) {
        void fire($, 'file_edit')
      } else if (['View', 'Glob', 'Grep', 'Read'].includes(toolName)) {
        void fire($, 'file_read')
      } else {
        void fire($, 'tool_call')
      }
    }

    const r = await next(e)
    if (active && r.isError === true) void fire($, 'error')
    return r
  }).catch(($, e, next) => next(e)) // fail open: a sound must never break a tool call

  // Intercept permission requests or interactive user prompts
  try {
    (on as any)('permission.request', async ($: EngineInterface, e: any, next: any) => {
      await fireIfActive($, e, 'permission_request')
      return next ? next(e) : e
    })
  } catch {}

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
  const now = Date.now()
  const priority = EVENT_PRIORITY[event] ?? 10
  const elapsed = now - lastSoundTime

  // Parallel collision guard:
  // When multiple events fire simultaneously (e.g. 5 parallel tool calls in one turn):
  // 1. Equal or lower priority events within the 250ms window are dropped to prevent cacophony.
  // 2. Higher priority events (e.g. 'error', 'done', 'permission_request') supersede immediately.
  if (!bypassThrottle && elapsed < DEBOUNCE_MS) {
    if (priority <= lastEventPriority) {
      return
    }
  }

  lastSoundTime = now
  lastEventPriority = priority

  const file = pickClip(event)
  if (file) void $.audio.play({ asset: file, gain: gainFor(event) }).catch(() => {})
}

async function fireIfActive($: EngineInterface, e: any, event: EventKey): Promise<void> {
  if (await isSessionActive($, e)) await fire($, event)
}
