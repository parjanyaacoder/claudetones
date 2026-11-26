// Pure config + selection for claudetones. No engine (`$`) or 'claude-code' import, so
// it is unit-testable and shared by register.ts and the test file.
//
// 100% Free & Open Source. Sourced exclusively from Myinstants (myinstants.com).
// Expansive acoustic matrix covering modern Claude Code agent workflows:
// core lifecycle, MCP connections & tools, skills, plugins, subagents, and memory.

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
  | 'magic'
  | 'level'
  | 'teleport'
  | 'bell'
  | 'switch'

// Full Spectrum of Developer & Agent Lifecycle Events
export type EventKey =
  | 'session_start'
  | 'reasoning'
  | 'long_reasoning'
  | 'terminal_command'
  | 'file_edit'
  | 'file_read'
  | 'tool_call'
  | 'mcp_connect'
  | 'mcp_tool_call'
  | 'skill_invoke'
  | 'plugin_install'
  | 'permission_request'
  | 'subagent_spawn'
  | 'context_compact'
  | 'git_commit'
  | 'error'
  | 'done'
  | 'oops'

export type ClipEntry = { file: string; moods: Mood[]; name?: string }

// The sound library — single source of truth, 100% Myinstants sourced.
export const CLIPS: ClipEntry[] = [
  // 1. session_start
  { file: 'sounds/launch.wav', moods: ['boot'], name: 'Launch Chime' },
  { file: 'sounds/pro-session-start.mp3', moods: ['boot'], name: 'Synth Power-Up' },
  { file: 'sounds/windows-xp-startup.mp3', moods: ['boot'], name: 'Windows XP Startup' },

  // 2. reasoning
  { file: 'sounds/ring.wav', moods: ['think', 'ring'], name: 'Soft Blip' },
  { file: 'sounds/pro-reasoning.mp3', moods: ['think'], name: 'Crystal Ambient' },
  { file: 'sounds/c418-stranger-think.mp3', moods: ['think'], name: 'C418 Contemplation' },

  // 3. long_reasoning (> 8s on one turn)
  { file: 'sounds/timer.mp3', moods: ['ponder'], name: 'Clock Tick' },
  { file: 'sounds/pro-long-reasoning.mp3', moods: ['ponder'], name: 'Fast Countdown' },
  { file: 'sounds/jeopardy-themelq.mp3', moods: ['ponder'], name: 'Jeopardy Metronome' },

  // 4. terminal_command (Bash)
  { file: 'sounds/keyboard-click.mp3', moods: ['type'], name: 'Keyboard Click' },
  { file: 'sounds/pro-terminal-command.mp3', moods: ['type'], name: 'Sci-Fi Confirm' },
  { file: 'sounds/counter-strike-ok-lets-go.mp3', moods: ['type'], name: "CS: OK Let's Go" },

  // 5. file_edit (Code mutation)
  { file: 'sounds/pro-tool-call.mp3', moods: ['switch', 'ring'], name: 'Alert Pulse' },
  { file: 'sounds/switch-sound.mp3', moods: ['switch'], name: 'Mechanical Switch' },

  // 6. file_read (Inspection / View / Glob)
  { file: 'sounds/mouse-click-sound-fx.mp3', moods: ['type', 'ring'], name: 'Subtle File Click' },

  // 7. tool_call (Any other standard tool)
  { file: 'sounds/ring.wav', moods: ['ring'], name: 'Soft Ring' },

  // 8. mcp_connect (New MCP Server attached)
  { file: 'sounds/the-bluetooth-device-its-connected-succesfull.mp3', moods: ['connect', 'meme'], name: 'Bluetooth Connected' },
  { file: 'sounds/success-chime.mp3', moods: ['connect'], name: 'Clean Connection Chime' },

  // 9. mcp_tool_call (External MCP Protocol Tool Call)
  { file: 'sounds/magic-reveal-audio.mp3', moods: ['magic'], name: 'MCP Spell Reveal' },
  { file: 'sounds/switch-sound.mp3', moods: ['magic'], name: 'MCP Switch Pulse' },

  // 10. skill_invoke (Agent Skill Activated)
  { file: 'sounds/fairy-sparkle.mp3', moods: ['magic', 'hype'], name: 'Skill Fairy Sparkle' },

  // 11. plugin_install (New Plugin / Marketplace Added)
  { file: 'sounds/levelup.mp3', moods: ['level', 'reward'], name: 'Plugin Level Up' },

  // 12. permission_request (Dangerous action confirmation prompt)
  { file: 'sounds/door-bell-sound-effect.mp3', moods: ['bell', 'alert'], name: 'Permission Doorbell' },
  { file: 'sounds/discord-notification.mp3', moods: ['bell', 'alert'], name: 'Prompt Ding' },

  // 13. subagent_spawn (Autonomous Subagent / Swarm Worker Started)
  { file: 'sounds/dbz-teleport.mp3', moods: ['teleport', 'whoosh'], name: 'Subagent Instant Transmission' },

  // 14. context_compact (/compact or token memory pruning)
  { file: 'sounds/mario_coin_sound.mp3', moods: ['kaching', 'pop'], name: 'Coin Token Sweep' },

  // 15. git_commit (Git commit or milestone push)
  { file: 'sounds/confetti-pop-sound-effect.mp3', moods: ['pop', 'reward'], name: 'Git Commit Confetti' },

  // 16. error
  { file: 'sounds/error.wav', moods: ['error'], name: 'Error Sting' },
  { file: 'sounds/pro-error.mp3', moods: ['error', 'sad'], name: 'Sad Trombone' },
  { file: 'sounds/metal-gear-alert.mp3', moods: ['error', 'sad'], name: 'Metal Gear Alert' },
  { file: 'sounds/fahhhhhhhhhhhhhh.mp3', moods: ['error', 'sad'], name: 'Fah Scream' },

  // 17. done (Victory Fanfare)
  { file: 'sounds/ding-sound-effect-1.mp3', moods: ['reward'], name: 'Success Ding' },
  { file: 'sounds/pro-done.mp3', moods: ['reward'], name: 'Level Complete' },
  { file: 'sounds/gta-san-andreas-mission-complete.mp3', moods: ['reward'], name: 'GTA Mission Passed' },

  // 18. manual /oops
  { file: 'sounds/tf_nemesis.mp3', moods: ['sad'], name: 'Dramatic Nemesis' },
]

export const EVENTS: Record<EventKey, Mood[]> = {
  session_start: ['boot'],
  reasoning: ['think'],
  long_reasoning: ['ponder'],
  terminal_command: ['type'],
  file_edit: ['switch', 'ring'],
  file_read: ['type', 'ring'],
  tool_call: ['ring'],
  mcp_connect: ['connect'],
  mcp_tool_call: ['magic', 'ring'],
  skill_invoke: ['magic', 'hype'],
  plugin_install: ['level', 'reward'],
  permission_request: ['bell', 'alert'],
  subagent_spawn: ['teleport', 'whoosh'],
  context_compact: ['kaching', 'pop'],
  git_commit: ['pop', 'reward'],
  error: ['error', 'sad'],
  done: ['reward'],
  oops: ['sad'],
}

// Linear gain per event (0–4, default 1).
export const GAIN: Partial<Record<EventKey, number>> = {
  terminal_command: 0.5,
  tool_call: 0.45,
  file_read: 0.4,
  file_edit: 0.55,
  mcp_tool_call: 0.6,
  skill_invoke: 0.65,
  permission_request: 0.8,
  done: 1.0,
  error: 0.9,
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
  '  /claudetones pause        pause sound playback\n' +
  '  /claudetones play         resume sound playback\n' +
  '  /claudetones stop         stop current sound playback\n' +
  '  /claudetones test [event] test an event sound (e.g. mcp_connect, skill_invoke, done)\n' +
  '  /claudetones status       show playback status\n' +
  '  /oops                     caught Claude being wrong'

export type ClaudetonesAction =
  | { kind: 'toggle' }
  | { kind: 'pause' }
  | { kind: 'resume' }
  | { kind: 'stop' }
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
  if (sub === 'pause') return { kind: 'pause' }
  if (sub === 'play' || sub === 'resume') return { kind: 'resume' }
  if (sub === 'stop') return { kind: 'stop' }
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
