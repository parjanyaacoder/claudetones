// Pure config + selection for poptunes. No engine (`$`) or 'claude-code' import, so
// it is unit-testable and shared by register.ts and the test file.
//
// HOW IT WORKS: an event asks for one or more MOODS (priority order). Each CLIP is
// tagged with moods. pickClip() gathers the clips matching the first mood that has
// any, and returns one at random (or null — then nothing plays). Add a clip by
// dropping the file in sounds/ and adding one row to CLIPS below with its mood(s);
// it instantly serves every event that accepts that mood. Keep EVENTS.md and
// CLIPS.md (the human-readable spec) in sync with this file.

export type Mood =
  | 'boot'
  | 'shutdown'
  | 'ring'
  | 'hype'
  | 'reward'
  | 'sad'
  | 'error'
  | 'think'
  | 'alert'
  | 'destructive'
  | 'whoosh'
  | 'type'
  | 'connect'
  | 'kaching'
  | 'scratch'
  | 'pop'
  | 'meme'

export type EventKey =
  | 'boot'
  | 'shutdown'
  | 'compact'
  | 'submit'
  | 'mention'
  | 'think'
  | 'done'
  | 'interrupt'
  | 'permission'
  | 'tool'
  | 'error'
  | 'edit'
  | 'search'
  | 'commit'
  | 'push'
  | 'tests-pass'
  | 'tests-fail'
  | 'danger'
  | 'spawn'
  | 'oops'
  | 'soundboard'

export type ClipEntry = { file: string; moods: Mood[] }

// The sound library — single source of truth, mirror of CLIPS.md "in the box".
// `file` is relative to the mod dir, as $.audio.play({ asset }) wants it.
export const CLIPS: ClipEntry[] = [
  { file: 'sounds/launch.wav', moods: ['boot'] },
  { file: 'sounds/ring.wav', moods: ['ring'] },
  { file: 'sounds/fahhhhhhhhhhhhhh.mp3', moods: ['error', 'sad'] },
  { file: 'sounds/tf_nemesis.mp3', moods: ['sad'] },
]

// Each event's accepted moods, in priority order — mirror of EVENTS.md. An event
// with no clip for any of its moods simply stays silent until one is added.
export const EVENTS: Record<EventKey, Mood[]> = {
  boot: ['boot'],
  shutdown: ['shutdown', 'boot'],
  compact: ['whoosh'],
  submit: ['hype'],
  mention: ['pop'],
  think: ['think'],
  done: ['reward'],
  interrupt: ['scratch', 'sad'],
  permission: ['alert'],
  tool: ['ring'],
  error: ['error', 'sad'],
  edit: ['type'],
  search: ['connect'],
  commit: ['kaching', 'reward'],
  push: ['whoosh', 'hype'],
  'tests-pass': ['reward'],
  'tests-fail': ['sad'],
  danger: ['alert', 'destructive'],
  spawn: ['hype'],
  oops: ['sad'],
  soundboard: ['meme'],
}

// Linear gain per event (0–4, default 1). The per-tool ring fires constantly, so
// it is quieter than the rare one-off stabs. Anything unlisted plays at 1.
export const GAIN: Partial<Record<EventKey, number>> = {
  tool: 0.55,
}

export const MUTE_KEY = 'muted'

export function gainFor(event: EventKey): number {
  return GAIN[event] ?? 1
}

// Pick a clip for an event: walk its accepted moods in priority order, and for the
// first mood with any clips, return one at random. null when nothing matches — then
// nothing plays. `rand` is injectable so tests are deterministic.
export function pickClip(
  event: EventKey,
  clips: ClipEntry[] = CLIPS,
  rand: () => number = Math.random,
): string | null {
  for (const mood of EVENTS[event]) {
    const pool = clips.filter(c => c.moods.includes(mood))
    if (pool.length > 0) {
      const i = Math.min(pool.length - 1, Math.floor(rand() * pool.length))
      return pool[i]!.file
    }
  }
  return null
}
