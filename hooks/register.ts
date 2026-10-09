import type { EngineInterface, Register } from 'claude-code'

import { MUTE_KEY, gainFor, pickClip, type EventKey } from './logic'

// popUpi, but for Claude Code. Each engine event maps to a poptunes EVENT key; the
// pure selector (logic.ts) turns that into a random mood-matched clip, or nothing.
// /poptunes mutes across sessions; /oops is a manual button that plays even muted.
// Every play is best-effort: a sound glitch (or a non-macOS surface with no player)
// must never disturb the tool or the turn.

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'poptunes', description: 'Mute or unmute poptunes sound effects' })
    await $.command.register({ name: 'oops', description: 'Caught Claude being wrong — play the sad sound' })
    await fireIfOn($, 'boot')
    return next(e)
  })

  on('session.end', async ($, e, next) => {
    await fireIfOn($, 'shutdown')
    return next(e)
  })

  on('session.compact', async ($, e, next) => {
    await fireIfOn($, 'compact')
    return next(e)
  }).catch(($, e, next) => next(e)) // fail open: a sound must never block a compaction

  on('turn.start', async ($, e, next) => {
    await fireIfOn($, 'think')
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await fireIfOn($, 'done')
    return next(e)
  })

  on('turn.abort', async ($, e, next) => {
    await fireIfOn($, 'interrupt')
    return next(e)
  }).catch(($, e, next) => next(e)) // fail open: a sound must never block an interrupt

  on('tool.check', async ($, e, next) => {
    await fireIfOn($, 'permission')
    return next(e)
  }).catch(($, e, next) => next(e)) // fail open: a sound must never block a permission prompt

  on('tool.call', async ($, e, next) => {
    const off = await muted($)
    if (!off) fire($, 'tool') // ring as the call begins
    const r = await next(e) // let the tool actually run
    if (!off && r.isError === true) fire($, 'error') // "fahhh" on failure
    return r
  }).catch(($, e, next) => next(e)) // fail open: a sound must never break a tool call

  on('command.run', { command: 'poptunes' }, async $ => {
    const wasMuted = await muted($)
    await $.store.set(MUTE_KEY, !wasMuted)
    return { text: wasMuted ? '🔊 poptunes on — ring the bells, captain' : '🔇 poptunes muted' }
  })

  // /oops plays even while muted — pressing it is an explicit ask for the sound.
  on('command.run', { command: 'oops' }, async $ => {
    fire($, 'oops')
    return { text: '😔 caught in 4k, captain' }
  })
}

async function muted($: EngineInterface): Promise<boolean> {
  try {
    return (await $.store.get(MUTE_KEY)) === true
  } catch {
    return false // default: sound on; a storage glitch should not silence the gag
  }
}

function fire($: EngineInterface, event: EventKey): void {
  const file = pickClip(event)
  if (file) void $.audio.play({ asset: file, gain: gainFor(event) }).catch(() => {})
}

async function fireIfOn($: EngineInterface, event: EventKey): Promise<void> {
  if (!(await muted($))) fire($, event)
}
