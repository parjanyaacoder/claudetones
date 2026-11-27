// Comprehensive catalog of tones, frequencies, and sound synthesis for the Claudetones Studio Composer.
// Inspired by Google Stitch Studio Preview.

export type ToneCategory =
  | 'all'
  | 'synths'
  | 'keys'
  | 'chimes'
  | 'telemetry'
  | 'lofi'
  | 'organic'

export type StudioTone = {
  id: string
  name: string
  subtitle: string
  category: ToneCategory
  tag: string
  frequency: number // in Hz
  waveType: 'sine' | 'triangle' | 'square' | 'sawtooth' | 'fm' | 'noise'
  audioSrc?: string
  duration: number // in ms
}

export const STUDIO_TONES: StudioTone[] = [
  // 1. Warm Synths
  {
    id: 'tone-1',
    name: 'warm_sine_arp',
    subtitle: 'Warm Triad • 440Hz',
    category: 'synths',
    tag: 'SYNTH',
    frequency: 440,
    waveType: 'sine',
    audioSrc: '/sounds/pro-reasoning.mp3',
    duration: 650,
  },
  {
    id: 'tone-2',
    name: 'glass_marimba',
    subtitle: 'Polyphonic • 520Hz',
    category: 'synths',
    tag: 'SYNTH',
    frequency: 520,
    waveType: 'triangle',
    audioSrc: '/sounds/ring.wav',
    duration: 450,
  },
  {
    id: 'tone-3',
    name: 'analog_drift_chord',
    subtitle: 'Sawtooth Warmth • 330Hz',
    category: 'synths',
    tag: 'SYNTH',
    frequency: 330,
    waveType: 'sawtooth',
    audioSrc: '/sounds/launch.wav',
    duration: 800,
  },
  {
    id: 'tone-4',
    name: 'sub_bass_pulse',
    subtitle: 'Deep Sine • 90Hz',
    category: 'synths',
    tag: 'SYNTH',
    frequency: 90,
    waveType: 'sine',
    audioSrc: '/sounds/pro-session-start.mp3',
    duration: 500,
  },
  {
    id: 'tone-5',
    name: 'ambient_pad_bloom',
    subtitle: 'Fifth Harmonic • 660Hz',
    category: 'synths',
    tag: 'SYNTH',
    frequency: 660,
    waveType: 'sine',
    audioSrc: '/sounds/success-chime.mp3',
    duration: 900,
  },
  {
    id: 'tone-6',
    name: 'vapor_glide',
    subtitle: 'Glide Filter • 480Hz',
    category: 'synths',
    tag: 'SYNTH',
    frequency: 480,
    waveType: 'triangle',
    audioSrc: '/sounds/c418-stranger-think.mp3',
    duration: 750,
  },

  // 2. Mechanical Keys
  {
    id: 'tone-7',
    name: 'solenoid_click',
    subtitle: 'Spring Click • 1.8kHz',
    category: 'keys',
    tag: 'MECH',
    frequency: 1800,
    waveType: 'noise',
    audioSrc: '/sounds/keyboard-click.mp3',
    duration: 120,
  },
  {
    id: 'tone-8',
    name: 'cherry_blue',
    subtitle: 'Stem Buckle • 190Hz',
    category: 'keys',
    tag: 'MECH',
    frequency: 190,
    waveType: 'noise',
    audioSrc: '/sounds/switch-sound.mp3',
    duration: 160,
  },
  {
    id: 'tone-9',
    name: 'hydraulic_relay',
    subtitle: 'DOY Switch • 310Hz',
    category: 'keys',
    tag: 'MECH',
    frequency: 310,
    waveType: 'square',
    audioSrc: '/sounds/pro-tool-call.mp3',
    duration: 220,
  },
  {
    id: 'tone-10',
    name: 'keychron_thock',
    subtitle: 'PBT Low Stroke • 140Hz',
    category: 'keys',
    tag: 'MECH',
    frequency: 140,
    waveType: 'sine',
    audioSrc: '/sounds/mouse-click-sound-fx.mp3',
    duration: 140,
  },
  {
    id: 'tone-11',
    name: 'relay_shutter',
    subtitle: 'Magnetic Contact • 2.2kHz',
    category: 'keys',
    tag: 'MECH',
    frequency: 2200,
    waveType: 'triangle',
    audioSrc: '/sounds/pro-terminal-command.mp3',
    duration: 180,
  },
  {
    id: 'tone-12',
    name: 'reed_switch_pop',
    subtitle: 'Glass Reed • 950Hz',
    category: 'keys',
    tag: 'MECH',
    frequency: 950,
    waveType: 'sine',
    audioSrc: '/sounds/confetti-pop-sound-effect.mp3',
    duration: 190,
  },

  // 3. Ambient Chimes
  {
    id: 'tone-13',
    name: 'glass_ping_c6',
    subtitle: 'Crystal Bell • 1.05kHz',
    category: 'chimes',
    tag: 'CHIME',
    frequency: 1046,
    waveType: 'sine',
    audioSrc: '/sounds/ding-sound-effect-1.mp3',
    duration: 600,
  },
  {
    id: 'tone-14',
    name: 'crystal_kalimba',
    subtitle: 'Prismatic Key • 1.2kHz',
    category: 'chimes',
    tag: 'CHIME',
    frequency: 1200,
    waveType: 'triangle',
    audioSrc: '/sounds/fairy-sparkle.mp3',
    duration: 700,
  },
  {
    id: 'tone-15',
    name: 'celesta_harmonic',
    subtitle: 'Major Blossom • 580Hz',
    category: 'chimes',
    tag: 'BELL',
    frequency: 580,
    waveType: 'sine',
    audioSrc: '/sounds/magic-reveal-audio.mp3',
    duration: 850,
  },
  {
    id: 'tone-16',
    name: 'tibetan_singing_ting',
    subtitle: 'Bronze Resonator • 880Hz',
    category: 'chimes',
    tag: 'BELL',
    frequency: 880,
    waveType: 'sine',
    audioSrc: '/sounds/the-bluetooth-device-its-connected-succesfull.mp3',
    duration: 950,
  },
  {
    id: 'tone-17',
    name: 'shimmer_glockenspiel',
    subtitle: 'Steel Tine • 1.45kHz',
    category: 'chimes',
    tag: 'CHIME',
    frequency: 1450,
    waveType: 'sine',
    audioSrc: '/sounds/ding-sound-effect-1.mp3',
    duration: 620,
  },

  // 4. Sci-Fi Telemetry
  {
    id: 'tone-18',
    name: 'telemetry_blip',
    subtitle: 'Beacon Sync • 850Hz',
    category: 'telemetry',
    tag: 'TELEM',
    frequency: 850,
    waveType: 'square',
    audioSrc: '/sounds/dbz-teleport.mp3',
    duration: 250,
  },
  {
    id: 'tone-19',
    name: 'terminal_bell',
    subtitle: 'Ascending Crisp • 750Hz',
    category: 'telemetry',
    tag: 'TELEM',
    frequency: 750,
    waveType: 'sine',
    audioSrc: '/sounds/dialup.mp3',
    duration: 350,
  },
  {
    id: 'tone-20',
    name: 'cyber_hologram',
    subtitle: 'Resonator • 900Hz',
    category: 'telemetry',
    tag: 'TELEM',
    frequency: 900,
    waveType: 'triangle',
    audioSrc: '/sounds/levelup.mp3',
    duration: 400,
  },
  {
    id: 'tone-21',
    name: 'metal_gear_radar',
    subtitle: 'Surveillance Alert • 1.1kHz',
    category: 'telemetry',
    tag: 'ALERT',
    frequency: 1100,
    waveType: 'sawtooth',
    audioSrc: '/sounds/metal-gear-alert.mp3',
    duration: 550,
  },
  {
    id: 'tone-22',
    name: 'quantum_coupler',
    subtitle: 'Sub-harmonic • 640Hz',
    category: 'telemetry',
    tag: 'TELEM',
    frequency: 640,
    waveType: 'fm',
    audioSrc: '/sounds/timer.mp3',
    duration: 320,
  },

  // 5. Lo-Fi & 8-Bit
  {
    id: 'tone-23',
    name: 'retro_coin_up',
    subtitle: '8-Bit Jump • 1.2kHz',
    category: 'lofi',
    tag: 'RETRO',
    frequency: 1200,
    waveType: 'square',
    audioSrc: '/sounds/mario_coin_sound.mp3',
    duration: 380,
  },
  {
    id: 'tone-24',
    name: 'lofi_tape_stop',
    subtitle: 'Vinyl Stop • 200Hz',
    category: 'lofi',
    tag: 'FX',
    frequency: 200,
    waveType: 'sawtooth',
    audioSrc: '/sounds/pro-error.mp3',
    duration: 480,
  },
  {
    id: 'tone-25',
    name: 'counter_strike_go',
    subtitle: 'Tactical Radio • 800Hz',
    category: 'lofi',
    tag: 'RETRO',
    frequency: 800,
    waveType: 'triangle',
    audioSrc: '/sounds/counter-strike-ok-lets-go.mp3',
    duration: 720,
  },
  {
    id: 'tone-26',
    name: 'windows_boot_chime',
    subtitle: 'Classic Fanfare • 523Hz',
    category: 'lofi',
    tag: 'RETRO',
    frequency: 523,
    waveType: 'sine',
    audioSrc: '/sounds/windows-xp-startup.mp3',
    duration: 1100,
  },
  {
    id: 'tone-27',
    name: 'fahhh_error',
    subtitle: 'Sub-bass Drop • 130Hz',
    category: 'lofi',
    tag: 'ALERT',
    frequency: 130,
    waveType: 'sawtooth',
    audioSrc: '/sounds/fahhhhhhhhhhhhhh.mp3',
    duration: 850,
  },
  {
    id: 'tone-28',
    name: 'mission_complete_chord',
    subtitle: 'Level Victory • 440Hz',
    category: 'lofi',
    tag: 'RETRO',
    frequency: 440,
    waveType: 'square',
    audioSrc: '/sounds/gta-san-andreas-mission-complete.mp3',
    duration: 1200,
  },

  // 6. Organic Drops
  {
    id: 'tone-29',
    name: 'marimba_drop',
    subtitle: 'Rosewood Strike • 392Hz',
    category: 'organic',
    tag: 'ORGANIC',
    frequency: 392,
    waveType: 'triangle',
    audioSrc: '/sounds/pro-tool-call.mp3',
    duration: 340,
  },
  {
    id: 'tone-30',
    name: 'bamboo_water',
    subtitle: 'Zen Fountain • 620Hz',
    category: 'organic',
    tag: 'NATURE',
    frequency: 620,
    waveType: 'sine',
    audioSrc: '/sounds/ring.wav',
    duration: 410,
  },
  {
    id: 'tone-31',
    name: 'pebble_drop_echo',
    subtitle: 'Hydro-acoustic • 710Hz',
    category: 'organic',
    tag: 'ORGANIC',
    frequency: 710,
    waveType: 'sine',
    audioSrc: '/sounds/mouse-click-sound-fx.mp3',
    duration: 290,
  },
  {
    id: 'tone-32',
    name: 'doorbell_welcome',
    subtitle: 'Ding-Dong Chime • 587Hz',
    category: 'organic',
    tag: 'CHIME',
    frequency: 587,
    waveType: 'sine',
    audioSrc: '/sounds/door-bell-sound-effect.mp3',
    duration: 750,
  },
]

// The 26 Claude Code Agent Lifecycle Events that a soundpack maps to
export type AgentEvent = {
  id: string
  key: string
  name: string
  trigger: string
  category: 'core' | 'tools' | 'git' | 'agent' | 'guardrails'
  defaultToneId: string
}

export const AGENT_EVENTS: AgentEvent[] = [
  { id: 'ev-1', key: 'session.start', name: 'Session Boot', trigger: 'Claude Code CLI launches and connects', category: 'core', defaultToneId: 'tone-1' },
  { id: 'ev-2', key: 'turn.start', name: 'Reasoning & Planning', trigger: 'User prompt received, turn reasoning begins', category: 'core', defaultToneId: 'tone-2' },
  { id: 'ev-3', key: 'turn.ponder', name: 'Deep Architecture Ponder', trigger: 'Turn reasoning duration exceeds 8 seconds', category: 'core', defaultToneId: 'tone-3' },
  { id: 'ev-4', key: 'tool.bash', name: 'Bash Execution', trigger: 'Shell commands executed via Bash tool', category: 'tools', defaultToneId: 'tone-7' },
  { id: 'ev-5', key: 'tool.edit', name: 'File Mutation (Edit)', trigger: 'File edits, writes, and unified patch application', category: 'tools', defaultToneId: 'tone-9' },
  { id: 'ev-6', key: 'tool.read', name: 'File Inspection (Read)', trigger: 'File views, glob directory walks, grep scans', category: 'tools', defaultToneId: 'tone-10' },
  { id: 'ev-7', key: 'tool.search', name: 'Live Web Search', trigger: 'WebSearch or web fetch query initiated', category: 'tools', defaultToneId: 'tone-19' },
  { id: 'ev-8', key: 'turn.complete', name: 'Turn Complete (Success)', trigger: 'Agent finishes turn and presents verified response', category: 'core', defaultToneId: 'tone-13' },
  { id: 'ev-9', key: 'turn.error', name: 'Tool Execution Error', trigger: 'Tool execution fails or returns error exit code', category: 'core', defaultToneId: 'tone-27' },
  { id: 'ev-10', key: 'turn.abort', name: 'Turn Aborted', trigger: 'User cancels or interrupts turn (Esc key)', category: 'core', defaultToneId: 'tone-24' },
  { id: 'ev-11', key: 'git.commit', name: 'Git Commit Landed', trigger: 'git commit command executed successfully', category: 'git', defaultToneId: 'tone-12' },
  { id: 'ev-12', key: 'git.push', name: 'Git Push Remote', trigger: 'git push commits transmitted to remote repository', category: 'git', defaultToneId: 'tone-18' },
  { id: 'ev-13', key: 'package.install', name: 'Package Installation', trigger: 'npm install, pip install, or cargo add completed', category: 'tools', defaultToneId: 'tone-23' },
  { id: 'ev-14', key: 'test.pass', name: 'Test Suite Passed', trigger: 'Test runner exits code 0 with all assertions green', category: 'tools', defaultToneId: 'tone-28' },
  { id: 'ev-15', key: 'test.fail', name: 'Test Suite Failed', trigger: 'Unit or integration tests fail', category: 'tools', defaultToneId: 'tone-27' },
  { id: 'ev-16', key: 'dangerous_command', name: 'Destructive Command Guard', trigger: 'rm -rf, DROP TABLE, or force push detected', category: 'guardrails', defaultToneId: 'tone-21' },
  { id: 'ev-17', key: 'security_alert', name: 'Secret / Credential Alert', trigger: 'Touching .env files, API keys, or private certs', category: 'guardrails', defaultToneId: 'tone-21' },
  { id: 'ev-18', key: 'subagent.spawn', name: 'Subagent Spawned', trigger: 'Task delegation or swarm subagent fork', category: 'agent', defaultToneId: 'tone-18' },
  { id: 'ev-19', key: 'skill.invoke', name: 'Agent Skill Activated', trigger: 'Specialized SKILL.md capability executed', category: 'agent', defaultToneId: 'tone-14' },
  { id: 'ev-20', key: 'plugin.install', name: 'Plugin Installed', trigger: 'Marketplace plugin added or enabled', category: 'agent', defaultToneId: 'tone-20' },
  { id: 'ev-21', key: 'permission.request', name: 'Permission Prompt', trigger: 'Terminal asks user confirmation for command execution', category: 'guardrails', defaultToneId: 'tone-32' },
  { id: 'ev-22', key: 'context.compact', name: 'Context Memory Compacted', trigger: 'PreCompact hook or /compact command cleans memory', category: 'agent', defaultToneId: 'tone-23' },
  { id: 'ev-23', key: 'oops', name: 'Hallucination Catch', trigger: '/oops correction command executed', category: 'agent', defaultToneId: 'tone-24' },
  { id: 'ev-24', key: 'mcp.connect', name: 'MCP Server Connected', trigger: 'Model Context Protocol client initializes', category: 'tools', defaultToneId: 'tone-16' },
  { id: 'ev-25', key: 'mcp.tool_call', name: 'MCP Tool Run', trigger: 'External tool executed via MCP connection', category: 'tools', defaultToneId: 'tone-15' },
  { id: 'ev-26', key: 'system.idle', name: 'System Standing By', trigger: 'Waiting for next user instruction in interactive session', category: 'core', defaultToneId: 'tone-30' },
]

// Web Audio API Sound Synthesizer & Player
class StudioSynthEngine {
  private ctx: AudioContext | null = null
  private activeOscillator: OscillatorNode | null = null
  private activeGain: GainNode | null = null
  private activeAudio: HTMLAudioElement | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  playTone(tone: StudioTone, onEnd?: () => void) {
    this.stop()

    // 1. Try real audio clip first if available
    if (tone.audioSrc) {
      try {
        const audio = new Audio(tone.audioSrc)
        this.activeAudio = audio
        audio.volume = 0.85
        audio.onended = () => {
          this.activeAudio = null
          onEnd?.()
        }
        audio.play().catch(() => {
          // Fall back to Web Audio synthesis if audio file cannot play
          this.synthesizeTone(tone, onEnd)
        })
        return
      } catch {
        // Fall back to synth
      }
    }

    this.synthesizeTone(tone, onEnd)
  }

  synthesizeTone(tone: StudioTone, onEnd?: () => void) {
    const ctx = this.getContext()
    if (!ctx) {
      setTimeout(() => onEnd?.(), 300)
      return
    }

    try {
      const now = ctx.currentTime
      const durationSec = Math.max(0.1, tone.duration / 1000)

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      // Waveform configuration
      if (tone.waveType === 'fm' || tone.waveType === 'noise') {
        osc.type = 'triangle'
      } else {
        osc.type = tone.waveType
      }

      osc.frequency.setValueAtTime(tone.frequency, now)

      // Slight natural pitch decay for punchy clicks
      if (tone.category === 'keys' || tone.category === 'lofi') {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, tone.frequency * 0.4), now + durationSec)
      } else if (tone.category === 'chimes') {
        // Shimmer vibrato
        osc.frequency.setValueAtTime(tone.frequency, now)
        osc.frequency.linearRampToValueAtTime(tone.frequency * 1.01, now + durationSec * 0.5)
      }

      // Smooth attack-decay envelope
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + durationSec)

      this.activeOscillator = osc
      this.activeGain = gain

      osc.onended = () => {
        this.activeOscillator = null
        this.activeGain = null
        onEnd?.()
      }
    } catch (e) {
      console.warn('Web Audio synthesis error:', e)
      setTimeout(() => onEnd?.(), 300)
    }
  }

  stop() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause()
        this.activeAudio.currentTime = 0
      } catch {}
      this.activeAudio = null
    }

    if (this.activeOscillator) {
      try {
        this.activeOscillator.stop()
      } catch {}
      this.activeOscillator = null
    }
  }
}

export const studioSynth = new StudioSynthEngine()
