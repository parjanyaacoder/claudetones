import { test, expect } from 'claude-code/testing'

import {
  CLIPS,
  EVENTS,
  POPTUNES_USAGE,
  gainFor,
  isLicenseKeyFormat,
  normalizeLicenseKey,
  parsePoptunes,
  pickClip,
  type EventKey,
  type Mood,
} from './logic'

const MOODS: Mood[] = [
  'boot', 'shutdown', 'ring', 'hype', 'reward', 'sad', 'error', 'think', 'ponder',
  'alert', 'destructive', 'whoosh', 'type', 'connect', 'kaching', 'scratch', 'pop',
  'meme',
]

const EVENT_KEYS = Object.keys(EVENTS) as EventKey[]

test('every clip has a sounds/ path, known moods, and a valid tier', $ => {
  for (const c of CLIPS) {
    expect(c.file.startsWith('sounds/')).toBe(true)
    expect(c.moods.length).toBeGreaterThan(0)
    for (const m of c.moods) expect(MOODS.includes(m)).toBe(true)
    expect(c.tier === 'free' || c.tier === 'paid').toBe(true)
  }
})

test('every event accepts only known moods', $ => {
  for (const ev of EVENT_KEYS) {
    expect(EVENTS[ev].length).toBeGreaterThan(0)
    for (const m of EVENTS[ev]) expect(MOODS.includes(m)).toBe(true)
  }
})

test('every one of the 7 universal events has a free clip in the box', $ => {
  const universal: EventKey[] = [
    'session_start', 'reasoning', 'long_reasoning', 'terminal_command', 'tool_call', 'error', 'done',
  ]
  for (const ev of universal) expect(pickClip(ev)).not.toBe(null)
})

test('locked: every event resolves to a free clip', $ => {
  expect(pickClip('session_start')).toBe('sounds/launch.wav')
  expect(pickClip('reasoning')).toBe('sounds/ring.wav')
  expect(pickClip('long_reasoning')).toBe('sounds/timer.mp3')
  expect(pickClip('terminal_command')).toBe('sounds/keyboard-click.mp3')
  expect(pickClip('tool_call')).toBe('sounds/ring.wav') // falls through to the free sibling
  expect(pickClip('error')).toBe('sounds/error.wav')
  expect(pickClip('done')).toBe('sounds/ding-sound-effect-1.mp3')
  expect(pickClip('oops')).toBe('sounds/tf_nemesis.mp3')
})

test('unlocked: a paid clip replaces its free sibling', $ => {
  expect(pickClip('session_start', { unlocked: true })).toBe('sounds/windows-xp-startup.mp3')
  expect(pickClip('reasoning', { unlocked: true })).toBe('sounds/c418-stranger-think.mp3')
  expect(pickClip('long_reasoning', { unlocked: true })).toBe('sounds/jeopardy-themelq.mp3')
  expect(pickClip('terminal_command', { unlocked: true })).toBe('sounds/counter-strike-ok-lets-go.mp3')
  expect(pickClip('tool_call', { unlocked: true })).toBe('sounds/metal-gear-alert.mp3')
  expect(pickClip('error', { unlocked: true })).toBe('sounds/fahhhhhhhhhhhhhh.mp3')
  expect(pickClip('done', { unlocked: true })).toBe('sounds/gta-san-andreas-mission-complete.mp3')
  expect(pickClip('oops', { unlocked: true })).toBe('sounds/fahhhhhhhhhhhhhh.mp3')
})

test('a mood with no entitled clip falls through to the next accepted mood', $ => {
  // error accepts [error, sad]. With only a paid `error` clip, locked → skip to sad.
  const bare = [
    { file: 'sounds/e.mp3', moods: ['error'] as Mood[], tier: 'paid' as const },
    { file: 'sounds/s.mp3', moods: ['sad'] as Mood[], tier: 'free' as const },
  ]
  expect(pickClip('error', { clips: bare })).toBe('sounds/s.mp3')
  expect(pickClip('error', { clips: bare, unlocked: true })).toBe('sounds/e.mp3')
})

test('pickClip returns null when no clip matches any accepted mood', $ => {
  const empty = [{ file: 'sounds/x.mp3', moods: ['boot'] as Mood[], tier: 'free' as const }]
  expect(pickClip('done', { clips: empty })).toBe(null) // no reward clip here -> silent
})

test('pickClip picks at random across a multi-clip pool and stays in range', $ => {
  const pool = [
    { file: 'sounds/a.mp3', moods: ['reward'] as Mood[], tier: 'free' as const },
    { file: 'sounds/b.mp3', moods: ['reward'] as Mood[], tier: 'free' as const },
  ]
  expect(pickClip('done', { clips: pool, rand: () => 0 })).toBe('sounds/a.mp3')
  expect(pickClip('done', { clips: pool, rand: () => 0.999 })).toBe('sounds/b.mp3') // clamped
})

test('gain is in range and the constant calls are quieter than a one-off stab', $ => {
  for (const ev of EVENT_KEYS) {
    expect(gainFor(ev)).toBeGreaterThan(0)
    expect(gainFor(ev)).toBeLessThanOrEqual(4)
  }
  expect(gainFor('tool_call')).toBeLessThan(gainFor('done'))
})

test('parsePoptunes: empty toggles, unlock carries the key, the rest explains itself', $ => {
  expect(parsePoptunes('')).toEqual({ kind: 'toggle' })
  expect(parsePoptunes('   ')).toEqual({ kind: 'toggle' })
  expect(parsePoptunes('unlock POPTUNES-ABCD-1234')).toEqual({ kind: 'unlock', key: 'POPTUNES-ABCD-1234' })
  expect(parsePoptunes('UNLOCK poptunes-abcd-1234').kind).toBe('unlock')
  expect(parsePoptunes('unlock').kind).toBe('error')
  expect(parsePoptunes('frobnicate')).toEqual({ kind: 'error', message: POPTUNES_USAGE })
})

test('license keys are normalized to upper case and format-checked', $ => {
  expect(normalizeLicenseKey('  poptunes-abcd-1234 ')).toBe('POPTUNES-ABCD-1234')
  expect(isLicenseKeyFormat('POPTUNES-ABCD-1234')).toBe(true)
  expect(isLicenseKeyFormat('poptunes-abcd-1234')).toBe(true)
  expect(isLicenseKeyFormat('POPTUNES-ABC-1234')).toBe(false) // one group too short
  expect(isLicenseKeyFormat('POPTUNES-ABCD-123')).toBe(false)
  expect(isLicenseKeyFormat('nope')).toBe(false)
})
