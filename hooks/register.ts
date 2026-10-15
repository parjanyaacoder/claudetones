import type { EngineInterface, Register } from 'claude-code'

import {
  LICENSE_KEY,
  MUTE_KEY,
  gainFor,
  isLicenseKeyFormat,
  normalizeLicenseKey,
  parseClaudetones,
  pickClip,
  type EventKey,
} from './logic'

// popUpi, but for Claude Code. Each engine event maps to a claudetones EVENT key; the
// pure selector (logic.ts) turns that into a random mood-matched clip, or nothing.
// Seven universal events cover a whole session; /claudetones mutes (and unlocks Pro);
// /oops is a manual button that plays even muted. Every play is best-effort: a sound
// glitch (or a surface with no player) must never disturb the tool or the turn.

// A turn that runs this long earns the "still thinking" sting: a clock tick on Free,
// thinking music on Pro. Cancelled the moment the turn completes or is interrupted.
const LONG_REASONING_MS = 8000

// Step 2 stands up the real backend (Next.js /api/verify). Until it exists this lets
// a well-formed key unlock locally so the flow is demoable end-to-end — remove it.
const OFFLINE_UNLOCK = true
const VERIFY_URL = 'https://claudetones.dev/api/verify'

// The live "still thinking" timer for the current turn. Reset on every reload; the
// engine tears the old timer down with the old module.
let ponder: { cancel: () => void } | null = null

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'claudetones', description: 'Mute claudetones, or unlock the Pro pack (/claudetones unlock <key>)' })
    await $.command.register({ name: 'oops', description: 'Caught Claude being wrong — play the sad sound' })
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
    cancelPonder() // you hit Esc — no clock tick should land after the fact
    return next(e)
  }).catch(($, e, next) => next(e)) // fail open: a sound must never block an interrupt

  on('session.end', async ($, e, next) => {
    cancelPonder()
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const off = await muted($)
    if (!off) void fire($, e.tool === 'Bash' ? 'terminal_command' : 'tool_call') // click as the call begins
    const r = await next(e) // let the tool actually run
    if (!off && r.isError === true) void fire($, 'error') // "fahhh" on failure
    return r
  }).catch(($, e, next) => next(e)) // fail open: a sound must never break a tool call

  on('command.run', { command: 'claudetones' }, async ($, e) => {
    const action = parseClaudetones(e.args ?? '')
    switch (action.kind) {
      case 'toggle': {
        const wasMuted = await muted($)
        await $.store.set(MUTE_KEY, !wasMuted)
        return { text: wasMuted ? '🔊 claudetones on — ring the bells, captain' : '🔇 claudetones muted' }
      }
      case 'unlock': {
        if (!isLicenseKeyFormat(action.key)) {
          return { text: '❌ That does not look like a key. They look like CLAUDETONES-XXXX-YYYY.' }
        }
        const key = normalizeLicenseKey(action.key)
        if (!(await verifyLicense($, key))) {
          return { text: '❌ Invalid license key. Grab one at https://claudetones.dev' }
        }
        await $.store.set(LICENSE_KEY, key)
        return { text: '🎉 Claudetones Pro unlocked! Enjoy the good stuff.' }
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
    void fireIfOn($, 'long_reasoning') // re-check muted: the captain may have silenced us mid-turn
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
    return false // default: sound on; a storage glitch should not silence the gag
  }
}

async function unlocked($: EngineInterface): Promise<boolean> {
  try {
    return typeof (await $.store.get(LICENSE_KEY)) === 'string'
  } catch {
    return false // a storage glitch just keeps Pro off
  }
}

// Ask the backend whether this key is good. Until Step 2 ships that endpoint, a
// well-formed key is accepted offline (see OFFLINE_UNLOCK).
async function verifyLicense($: EngineInterface, key: string): Promise<boolean> {
  try {
    const res = await $.http.fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key }),
    })
    if (res.ok) {
      const data = (await res.json()) as { valid?: boolean }
      return data.valid === true
    }
  } catch {
    // offline, the backend is not live yet, or plugins are barred from the network
  }
  return OFFLINE_UNLOCK
}

async function fire($: EngineInterface, event: EventKey): Promise<void> {
  const file = pickClip(event, { unlocked: await unlocked($) })
  if (file) void $.audio.play({ asset: file, gain: gainFor(event) }).catch(() => {})
}

async function fireIfOn($: EngineInterface, event: EventKey): Promise<void> {
  if (!(await muted($))) await fire($, event)
}
