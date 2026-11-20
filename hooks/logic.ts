// Pure config + selection for claudetones. No engine (`$`) or 'claude-code' import, so
// it is unit-testable and shared by register.ts and the test file.
//
// 100% Free & Open Source. Every engine event maps to a claudetones EVENT key; the
// pure selector turns that into a random mood-matched clip.

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
// `oops` button.
export type EventKey =
  | 'session_start'
  | 'reasoning'
  | 'long_reasoning'
  | 'terminal_command'
  | 'tool_call'
  | 'error'
  | 'done'
  | 'oops'

export type ClipEntry = { file: string; moods: Mood[]; name?: string }

// The sound library — single source of truth, mirror of CLIPS.md "in the box".
export const CLIPS: ClipEntry[] = [
  // session_start
  { file: 'sounds/launch.wav', moods: ['boot'], name: 'Launch Chime' },
  { file: 'sounds/pro-session-start.mp3', moods: ['boot'], name: 'Synth Power-Up' },
  // reasoning
  { file: 'sounds/ring.wav', moods: ['think', 'ring'], name: 'Soft Blip' },
  { file: 'sounds/pro-reasoning.mp3', moods: ['think'], name: 'Crystal Ambient' },
  // long_reasoning (> 8s on one turn)
  { file: 'sounds/timer.mp3', moods: ['ponder'], name: 'Clock Tick' },
  { file: 'sounds/pro-long-reasoning.mp3', moods: ['ponder'], name: 'Fast Countdown' },
  // terminal_command (a Bash tool call)
  { file: 'sounds/keyboard-click.mp3', moods: ['type'], name: 'Keyboard Click' },
  { file: 'sounds/pro-terminal-command.mp3', moods: ['type'], name: 'Sci-Fi Confirm' },
  // tool_call (any other tool)
  { file: 'sounds/ring.wav', moods: ['ring'], name: 'Soft Ring' },
  { file: 'sounds/pro-tool-call.mp3', moods: ['ring'], name: 'Alert Pulse' },
  // error
  { file: 'sounds/error.wav', moods: ['error'], name: 'Error Sting' },
  { file: 'sounds/pro-error.mp3', moods: ['error', 'sad'], name: 'Sad Trombone' },
  // done
  { file: 'sounds/ding-sound-effect-1.mp3', moods: ['reward'], name: 'Success Ding' },
  { file: 'sounds/pro-done.mp3', moods: ['reward'], name: 'Level Complete' },
  // manual /oops (fires even while muted)
  { file: 'sounds/tf_nemesis.mp3', moods: ['sad'], name: 'Dramatic Nemesis' },
]

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

export function gainFor(event: EventKey): number {
  return GAIN[event] ?? 1
}

export type PickOptions = {
  clips?: ClipEntry[]
  rand?: () => number
}

// Pick a clip for an event. Walk its accepted moods in priority order; for the first
// mood with any matching clip, return one at random.
export function pickClip(event: EventKey, options: PickOptions = {}): string | null {
  const { clips = CLIPS, rand = Math.random } = options
  for (const mood of EVENTS[event]) {
    const matching = clips.filter(c => c.moods.includes(mood))
    if (matching.length === 0) continue
    return matching[Math.min(matching.length - 1, Math.floor(rand() * matching.length))]!.file
  }
  return null
}

// ---- /claudetones command ----------------------------------------------------------

export const CLAUDETONES_USAGE =
  'claudetones commands:\n' +
  '  /claudetones              toggle mute\n' +
  '  /claudetones test [event] test an event sound (e.g. done, error)\n' +
  '  /claudetones status       show mute status\n' +
  '  /oops                     caught Claude being wrong'

export type ClaudetonesAction =
  | { kind: 'toggle' }
  | { kind: 'test'; event: EventKey }
  | { kind: 'status' }
  | { kind: 'help' }
  | { kind: 'error'; message: string }

// Parse the text after `/claudetones`.
export function parseClaudetones(args: string): ClaudetonesAction {
  const trimmed = args.trim()
  if (trimmed === '') return { kind: 'toggle' }

  const [head = '', ...rest] = trimmed.split(/\s+/)
  const sub = head.toLowerCase()
  if (sub === 'test') {
    const ev = (rest[0] || 'done').toLowerCase() as EventKey
    if (ev in EVENTS) {
      return { kind: 'test', event: ev }
    }
    return {
      kind: 'error',
      message: `Unknown event: ${ev}. Choose from: ${Object.keys(EVENTS).join(', ')}`,
    }
  }
  if (sub === 'status') return { kind: 'status' }
  if (sub === 'help') return { kind: 'help' }

  return { kind: 'error', message: CLAUDETONES_USAGE }
}
