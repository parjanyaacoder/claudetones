// Pure config + selection for poptunes. No engine (`$`) or 'claude-code' import, so
// it is unit-testable and shared by register.ts and the test file.
//
// HOW IT WORKS: an event asks for one or more MOODS (priority order). Each CLIP is
// tagged with moods and a TIER. pickClip() walks the moods, keeps the clips the user
// is entitled to (free, or free+paid once Pro is unlocked), and returns one at
// random — or null, and then nothing plays. Add a clip by dropping the file in
// sounds/ and adding one row to CLIPS below; it instantly serves every event that
// accepts its mood. Keep EVENTS.md and CLIPS.md (the human-readable spec) in sync.

export type Mood =
  | 'boot'
  | 'shutdown'
  | 'ring'
  | 'hype'
  | 'reward'
  | 'sad'
  | 'error'
  | 'think'
  | 'ponder'
  | 'alert'
  | 'destructive'
  | 'whoosh'
  | 'type'
  | 'connect'
  | 'kaching'
  | 'scratch'
  | 'pop'
  | 'meme'

// The 7 universal events every developer hits, in engine order, plus the manual
// `oops` button. One free + one paid clip each (see CLIPS) — the MVP catalog.
export type EventKey =
  | 'session_start'
  | 'reasoning'
  | 'long_reasoning'
  | 'terminal_command'
  | 'tool_call'
  | 'error'
  | 'done'
  | 'oops'

export type Tier = 'free' | 'paid'

export type ClipEntry = { file: string; moods: Mood[]; tier: Tier }

// The sound library — single source of truth, mirror of CLIPS.md "in the box".
// `file` is relative to the mod dir, as $.audio.play({ asset }) wants it. Free clips
// ship with the mod; paid clips activate once /poptunes unlock succeeds.
export const CLIPS: ClipEntry[] = [
  // session_start
  { file: 'sounds/launch.wav', moods: ['boot'], tier: 'free' },
  { file: 'sounds/windows-xp-startup.mp3', moods: ['boot'], tier: 'paid' },
  // reasoning
  { file: 'sounds/ring.wav', moods: ['think', 'ring'], tier: 'free' },
  { file: 'sounds/c418-stranger-think.mp3', moods: ['think'], tier: 'paid' },
  // long_reasoning (> 8s on one turn)
  { file: 'sounds/timer.mp3', moods: ['ponder'], tier: 'free' },
  { file: 'sounds/jeopardy-themelq.mp3', moods: ['ponder'], tier: 'paid' },
  // terminal_command (a Bash tool call)
  { file: 'sounds/keyboard-click.mp3', moods: ['type'], tier: 'free' },
  { file: 'sounds/counter-strike-ok-lets-go.mp3', moods: ['type'], tier: 'paid' },
  // tool_call (any other tool)
  { file: 'sounds/metal-gear-alert.mp3', moods: ['ring'], tier: 'paid' },
  // error
  { file: 'sounds/error.wav', moods: ['error'], tier: 'free' },
  { file: 'sounds/fahhhhhhhhhhhhhh.mp3', moods: ['error', 'sad'], tier: 'paid' },
  // done
  { file: 'sounds/ding-sound-effect-1.mp3', moods: ['reward'], tier: 'free' },
  { file: 'sounds/gta-san-andreas-mission-complete.mp3', moods: ['reward'], tier: 'paid' },
  // manual /oops (fires even while muted)
  { file: 'sounds/tf_nemesis.mp3', moods: ['sad'], tier: 'free' },
]

// Each event's accepted moods, in priority order — mirror of EVENTS.md. An event
// with no entitled clip for any of its moods simply stays silent until one is added.
export const EVENTS: Record<EventKey, Mood[]> = {
  session_start: ['boot'],
  reasoning: ['think'],
  long_reasoning: ['ponder'],
  terminal_command: ['type'],
  tool_call: ['ring'],
  error: ['error', 'sad'],
  done: ['reward'],
  oops: ['sad'],
}

// Linear gain per event (0–4, default 1). The per-call rings fire constantly, so
// they are quieter than the rare one-off stabs. Anything unlisted plays at 1.
export const GAIN: Partial<Record<EventKey, number>> = {
  terminal_command: 0.5,
  tool_call: 0.55,
}

export const MUTE_KEY = 'muted'
export const LICENSE_KEY = 'poptunes_license'

export function gainFor(event: EventKey): number {
  return GAIN[event] ?? 1
}

export type PickOptions = {
  clips?: ClipEntry[]
  /** Pro is active: paid clips become eligible and win over a free sibling. */
  unlocked?: boolean
  /** Injectable RNG so tests are deterministic. */
  rand?: () => number
}

// Pick a clip for an event. Walk its accepted moods in priority order; for the first
// mood with any entitled clip, return one at random. When Pro is unlocked a paid
// clip replaces its free sibling; when locked, only free clips play. null when
// nothing matches — then nothing plays.
export function pickClip(event: EventKey, options: PickOptions = {}): string | null {
  const { clips = CLIPS, unlocked = false, rand = Math.random } = options
  for (const mood of EVENTS[event]) {
    const matching = clips.filter(c => c.moods.includes(mood))
    if (matching.length === 0) continue
    const paid = matching.filter(c => c.tier === 'paid')
    const pool = unlocked && paid.length > 0 ? paid : matching.filter(c => c.tier === 'free')
    if (pool.length === 0) continue
    return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))]!.file
  }
  return null
}

// ---- /poptunes command ----------------------------------------------------------

export const POPTUNES_USAGE =
  'poptunes commands:\n' +
  '  /poptunes                     toggle mute\n' +
  '  /poptunes unlock <key>        activate the Pro pack'

export const LICENSE_PATTERN = /^POPTUNES-[A-Z0-9]{4}-[A-Z0-9]{4}$/

export function normalizeLicenseKey(key: string): string {
  return key.trim().toUpperCase()
}

export function isLicenseKeyFormat(key: string): boolean {
  return LICENSE_PATTERN.test(normalizeLicenseKey(key))
}

export type PoptunesAction =
  | { kind: 'toggle' }
  | { kind: 'unlock'; key: string }
  | { kind: 'error'; message: string }

// Parse the text after `/poptunes`. Pure, so the command surface is testable without
// the engine: `''` toggles, `unlock <key>` unlocks, anything else explains itself.
export function parsePoptunes(args: string): PoptunesAction {
  const trimmed = args.trim()
  if (trimmed === '') return { kind: 'toggle' }

  const [head = '', ...rest] = trimmed.split(/\s+/)
  if (head.toLowerCase() === 'unlock') {
    const key = rest.join(' ').trim()
    return key ? { kind: 'unlock', key } : { kind: 'error', message: 'Give me a key: /poptunes unlock POPTUNES-XXXX-YYYY' }
  }
  return { kind: 'error', message: POPTUNES_USAGE }
}
