import { test, expect } from 'claude-code/testing'

import { CLIPS, EVENTS, gainFor, pickClip, type EventKey, type Mood } from './logic'

const MOODS: Mood[] = [
  'boot', 'shutdown', 'ring', 'hype', 'reward', 'sad', 'error', 'think', 'alert',
  'destructive', 'whoosh', 'type', 'connect', 'kaching', 'scratch', 'pop', 'meme',
]

test('every clip has a sounds/ path and only known moods', $ => {
  for (const c of CLIPS) {
    expect(c.file.startsWith('sounds/')).toBe(true)
    expect(c.moods.length).toBeGreaterThan(0)
    for (const m of c.moods) expect(MOODS.includes(m)).toBe(true)
  }
})

test('every event accepts only known moods', $ => {
  for (const ev of Object.keys(EVENTS) as EventKey[]) {
    expect(EVENTS[ev].length).toBeGreaterThan(0)
    for (const m of EVENTS[ev]) expect(MOODS.includes(m)).toBe(true)
  }
})

test('pickClip returns the matching clip for a mood that has one', $ => {
  expect(pickClip('tool')).toBe('sounds/ring.wav') // tool -> ring
  expect(pickClip('boot')).toBe('sounds/launch.wav') // boot -> boot
})

test('pickClip falls through priority moods to the first non-empty one', $ => {
  // interrupt accepts [scratch, sad]; no scratch clip yet, so it falls to sad.
  const got = pickClip('interrupt')
  const sadFiles = CLIPS.filter(c => c.moods.includes('sad')).map(c => c.file)
  expect(got !== null).toBe(true)
  expect(sadFiles.includes(got!)).toBe(true)
})

test('pickClip returns null when no clip matches any accepted mood', $ => {
  expect(pickClip('think')).toBe(null) // no think clip yet -> silent
})

test('pickClip picks at random across a multi-clip pool', $ => {
  const pool = [
    { file: 'sounds/a.mp3', moods: ['sad'] as Mood[] },
    { file: 'sounds/b.mp3', moods: ['sad'] as Mood[] },
  ]
  expect(pickClip('oops', pool, () => 0)).toBe('sounds/a.mp3')
  expect(pickClip('oops', pool, () => 0.999)).toBe('sounds/b.mp3') // clamped, never out of range
})

test('gain is in range and the constant ring is quieter than a one-off stab', $ => {
  for (const ev of Object.keys(EVENTS) as EventKey[]) {
    expect(gainFor(ev)).toBeGreaterThan(0)
    expect(gainFor(ev)).toBeLessThanOrEqual(4)
  }
  expect(gainFor('tool')).toBeLessThan(gainFor('done'))
})
