// The clip catalog for the marketing soundboard. This is the website's mirror of
// the mod's hooks/logic.ts: same 7 universal events, same free/paid split, same
// files. Keep them in sync — if you add a clip to logic.ts, add a row here so the
// site can preview it.
//
// Audio lives in public/sounds/ and is served at /sounds/<file>. The Pro clips are
// public *previews* for the soundboard's sales pitch; the real, unlocked delivery
// moves to the private R2 bucket at launch (see the anti-piracy plan).

export type EventKey =
  | 'session_start'
  | 'reasoning'
  | 'long_reasoning'
  | 'terminal_command'
  | 'tool_call'
  | 'error'
  | 'done'

export type EventMeta = {
  key: EventKey
  index: number
  emoji: string
  title: string
  /** The engine hook that fires it. */
  trigger: string
  /** One line of what it feels like. */
  description: string
}

export const EVENTS: EventMeta[] = [
  {
    key: 'session_start',
    index: 1,
    emoji: '🚀',
    title: 'Session opens',
    trigger: 'session.start',
    description: 'A little chime every time you sit down to work.',
  },
  {
    key: 'reasoning',
    index: 2,
    emoji: '💭',
    title: 'Claude starts thinking',
    trigger: 'turn.start',
    description: 'A soft blip as a turn begins.',
  },
  {
    key: 'long_reasoning',
    index: 3,
    emoji: '⏳',
    title: 'Still thinking (>8s)',
    trigger: 'turn.start + 8s timer',
    description: 'A clock tick when a turn drags on.',
  },
  {
    key: 'terminal_command',
    index: 4,
    emoji: '⌨️',
    title: 'A shell command runs',
    trigger: 'tool.call · Bash',
    description: 'A keyboard click on every Bash call.',
  },
  {
    key: 'tool_call',
    index: 5,
    emoji: '🛠️',
    title: 'Any other tool runs',
    trigger: 'tool.call',
    description: 'A blip whenever a non-Bash tool fires.',
  },
  {
    key: 'error',
    index: 6,
    emoji: '💥',
    title: 'Something fails',
    trigger: 'tool.call → isError',
    description: 'A sting the instant a command errors out.',
  },
  {
    key: 'done',
    index: 7,
    emoji: '🎉',
    title: 'Claude finishes',
    trigger: 'turn.complete',
    description: 'A satisfying ding when the reply lands.',
  },
]

export type Sound = {
  event: EventKey
  tier: 'free' | 'pro'
  name: string
  /** Public URL served from public/sounds/. */
  src: string
  vibe: string
}

export const SOUNDS: Sound[] = [
  // session_start
  { event: 'session_start', tier: 'free', name: 'Launch', src: '/sounds/launch.wav', vibe: 'ascending chime' },
  { event: 'session_start', tier: 'pro', name: 'Windows XP Startup', src: '/sounds/windows-xp-startup.mp3', vibe: 'the classic boot' },
  // reasoning
  { event: 'reasoning', tier: 'free', name: 'Ring', src: '/sounds/ring.wav', vibe: 'soft blip' },
  { event: 'reasoning', tier: 'pro', name: 'C418 — Stranger Think', src: '/sounds/c418-stranger-think.mp3', vibe: 'contemplative' },
  // long_reasoning
  { event: 'long_reasoning', tier: 'free', name: 'Timer', src: '/sounds/timer.mp3', vibe: 'clock tick' },
  { event: 'long_reasoning', tier: 'pro', name: 'Jeopardy Think', src: '/sounds/jeopardy-themelq.mp3', vibe: 'thinking music' },
  // terminal_command
  { event: 'terminal_command', tier: 'free', name: 'Keyboard Click', src: '/sounds/keyboard-click.mp3', vibe: 'keystroke' },
  { event: 'terminal_command', tier: 'pro', name: 'CS — "OK Let\'s Go"', src: '/sounds/counter-strike-ok-lets-go.mp3', vibe: 'deploy' },
  // tool_call
  { event: 'tool_call', tier: 'free', name: 'Ring', src: '/sounds/ring.wav', vibe: 'soft blip' },
  { event: 'tool_call', tier: 'pro', name: 'Metal Gear Alert', src: '/sounds/metal-gear-alert.mp3', vibe: 'the "!" alert' },
  // error
  { event: 'error', tier: 'free', name: 'Error', src: '/sounds/error.wav', vibe: 'clean sting' },
  { event: 'error', tier: 'pro', name: 'Fahhhhh', src: '/sounds/fahhhhhhhhhhhhhh.mp3', vibe: 'shock meme' },
  // done
  { event: 'done', tier: 'free', name: 'Ding', src: '/sounds/ding-sound-effect-1.mp3', vibe: 'success' },
  { event: 'done', tier: 'pro', name: 'GTA Mission Complete', src: '/sounds/gta-san-andreas-mission-complete.mp3', vibe: 'victory' },
]

export function soundsFor(event: EventKey): { free: Sound; pro: Sound } {
  const forEvent = SOUNDS.filter(s => s.event === event)
  return {
    free: forEvent.find(s => s.tier === 'free')!,
    pro: forEvent.find(s => s.tier === 'pro')!,
  }
}

export const PRO_PRICE = process.env.NEXT_PUBLIC_PRO_PRICE ?? '$12'
export const GITHUB_URL = 'https://github.com/parjanyaacoder/poptunes'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://poptunes.dev'

/** Commands shown in the install CTA. */
export const INSTALL_COMMANDS = [
  'claude plugin marketplace add parjanyaacoder/poptunes',
  'claude plugin install poptunes@poptunes',
]
