import { test, expect } from 'claude-code/testing'

import {
  CLIPS,
  EVENTS,
  CLAUDETONES_USAGE,
  gainFor,
  parseClaudetones,
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

test('every clip has a sounds/ path and known moods', $ => {
  for (const c of CLIPS) {
    expect(c.file.startsWith('sounds/')).toBe(true)
    expect(c.moods.length).toBeGreaterThan(0)
    for (const m of c.moods) expect(MOODS.includes(m)).toBe(true)
  }
})

test('every event accepts only known moods', $ => {
  for (const ev of EVENT_KEYS) {
    expect(EVENTS[ev].length).toBeGreaterThan(0)
    for (const m of EVENTS[ev]) expect(MOODS.includes(m)).toBe(true)
  }
})

test('every one of the 7 universal events resolves to an audio clip', $ => {
  const universal: EventKey[] = [
    'session_start', 'reasoning', 'long_reasoning', 'terminal_command', 'tool_call', 'error', 'done',
  ]
  for (const ev of universal) expect(pickClip(ev)).not.toBe(null)
})

test('pickClip returns null when no clip matches any accepted mood', $ => {
  const empty = [{ file: 'sounds/x.mp3', moods: ['boot'] as Mood[] }]
  expect(pickClip('done', { clips: empty })).toBe(null)
})

test('pickClip picks at random across a multi-clip pool and stays in range', $ => {
  const pool = [
    { file: 'sounds/a.mp3', moods: ['reward'] as Mood[] },
    { file: 'sounds/b.mp3', moods: ['reward'] as Mood[] },
  ]
  expect(pickClip('done', { clips: pool, rand: () => 0 })).toBe('sounds/a.mp3')
  expect(pickClip('done', { clips: pool, rand: () => 0.999 })).toBe('sounds/b.mp3')
})

test('gain is in range and constant tool calls are quieter than one-off stabs', $ => {
  for (const ev of EVENT_KEYS) {
    expect(gainFor(ev)).toBeGreaterThan(0)
    expect(gainFor(ev)).toBeLessThanOrEqual(4)
  }
  expect(gainFor('tool_call')).toBeLessThan(gainFor('done'))
})

test('parseClaudetones: handles toggle, test, status, and help commands', $ => {
  expect(parseClaudetones('')).toEqual({ kind: 'toggle' })
  expect(parseClaudetones('   ')).toEqual({ kind: 'toggle' })
  expect(parseClaudetones('test done')).toEqual({ kind: 'test', event: 'done' })
  expect(parseClaudetones('test error')).toEqual({ kind: 'test', event: 'error' })
  expect(parseClaudetones('test unknown').kind).toBe('error')
  expect(parseClaudetones('status')).toEqual({ kind: 'status' })
  expect(parseClaudetones('help')).toEqual({ kind: 'help' })
  expect(parseClaudetones('frobnicate')).toEqual({ kind: 'error', message: CLAUDETONES_USAGE })
})
