// The clip catalog for the marketing soundboard.
// 100% Free & Open Source for Claude Code.

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
  trigger: string
  description: string
}

export const EVENTS: EventMeta[] = [
  {
    key: 'session_start',
    index: 1,
    emoji: '🚀',
    title: 'Session opens',
    trigger: 'session.start',
    description: 'A cheerful chime every time you start coding.',
  },
  {
    key: 'reasoning',
    index: 2,
    emoji: '💭',
    title: 'Claude thinking',
    trigger: 'turn.start',
    description: 'A soft blip as Claude starts generating thoughts.',
  },
  {
    key: 'long_reasoning',
    index: 3,
    emoji: '⏳',
    title: 'Deep ponder (>8s)',
    trigger: 'turn.start + 8s timer',
    description: 'A clock tick when Claude tackles a complex turn.',
  },
  {
    key: 'terminal_command',
    index: 4,
    emoji: '⌨️',
    title: 'Shell command',
    trigger: 'tool.call · Bash',
    description: 'Crisp mechanical feedback on every Bash execution.',
  },
  {
    key: 'tool_call',
    index: 5,
    emoji: '🛠️',
    title: 'Tool execution',
    trigger: 'tool.call · Read/Edit/Grep',
    description: 'A subtle blip whenever a file or tool is accessed.',
  },
  {
    key: 'error',
    index: 6,
    emoji: '💥',
    title: 'Command failed',
    trigger: 'tool.call → isError',
    description: 'Instant audible sting the moment a test or command fails.',
  },
  {
    key: 'done',
    index: 7,
    emoji: '🎉',
    title: 'Task finished',
    trigger: 'turn.complete',
    description: 'A satisfying victory ding when your response is ready.',
  },
]

export type Sound = {
  event: EventKey
  theme: 'minimal' | 'arcade'
  name: string
  src: string
  vibe: string
}

export const SOUNDS: Sound[] = [
  // session_start
  { event: 'session_start', theme: 'minimal', name: 'Launch Chime', src: '/sounds/launch.wav', vibe: 'ascending chime' },
  { event: 'session_start', theme: 'arcade', name: 'Synth Power-Up', src: '/sounds/pro-session-start.mp3', vibe: 'electronic boot chord' },
  // reasoning
  { event: 'reasoning', theme: 'minimal', name: 'Soft Blip', src: '/sounds/ring.wav', vibe: 'subtle blip' },
  { event: 'reasoning', theme: 'arcade', name: 'Crystal Ambient', src: '/sounds/pro-reasoning.mp3', vibe: 'contemplative chime' },
  // long_reasoning
  { event: 'long_reasoning', theme: 'minimal', name: 'Clock Tick', src: '/sounds/timer.mp3', vibe: 'steady ticker' },
  { event: 'long_reasoning', theme: 'arcade', name: 'Fast Countdown', src: '/sounds/pro-long-reasoning.mp3', vibe: 'rapid timer countdown' },
  // terminal_command
  { event: 'terminal_command', theme: 'minimal', name: 'Keyboard Click', src: '/sounds/keyboard-click.mp3', vibe: 'mechanical keystroke' },
  { event: 'terminal_command', theme: 'arcade', name: 'Sci-Fi Confirm', src: '/sounds/pro-terminal-command.mp3', vibe: 'tactical execution ping' },
  // tool_call
  { event: 'tool_call', theme: 'minimal', name: 'Soft Ring', src: '/sounds/ring.wav', vibe: 'clean notification' },
  { event: 'tool_call', theme: 'arcade', name: 'Alert Pulse', src: '/sounds/pro-tool-call.mp3', vibe: 'sharp attention alert' },
  // error
  { event: 'error', theme: 'minimal', name: 'Error Sting', src: '/sounds/error.wav', vibe: 'clean failure sting' },
  { event: 'error', theme: 'arcade', name: 'Sad Trombone', src: '/sounds/pro-error.mp3', vibe: 'classic comedy fail horn' },
  // done
  { event: 'done', theme: 'minimal', name: 'Success Ding', src: '/sounds/ding-sound-effect-1.mp3', vibe: 'clean task ding' },
  { event: 'done', theme: 'arcade', name: 'Level Complete', src: '/sounds/pro-done.mp3', vibe: 'triumphant victory fanfare' },
]

export function soundsFor(event: EventKey): { minimal: Sound; arcade: Sound } {
  const forEvent = SOUNDS.filter(s => s.event === event)
  return {
    minimal: forEvent.find(s => s.theme === 'minimal')!,
    arcade: forEvent.find(s => s.theme === 'arcade')!,
  }
}

export const GITHUB_URL = 'https://github.com/parjanyaacoder/claudetones'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://claudetones.vercel.app'

/** Commands shown in the install CTA. */
export const INSTALL_COMMANDS = [
  'claude plugin marketplace add parjanyaacoder/claudetones',
  'claude plugin install claudetones@claudetones',
]
