'use client'

import React, { useState } from 'react'
import { audioEngine, useAudioState, type SoundType } from '@/lib/audio'

type LifecycleEvent = {
  id: string
  trigger: string
  category: string
  title: string
  description: string
  fileName: string
  soundType: SoundType
  audioSrc: string
}

type PackId = 'minimal' | 'arcade' | 'nostalgia' | 'agent'

type PackDefinition = {
  id: PackId
  label: string
  badge: string
  description: string
  events: LifecycleEvent[]
  victory: {
    title: string
    description: string
    fileName: string
    audioSrc: string
  }
}

const PACKS: Record<PackId, PackDefinition> = {
  minimal: {
    id: 'minimal',
    label: 'Minimal Atelier',
    badge: 'Tactile Micro-tones',
    description: 'Soft-clipped micro-tones designed for cognitive comfort during long coding sessions.',
    events: [
      {
        id: 'boot',
        trigger: 'session.start',
        category: 'Ascending Chime',
        title: '1. Warm Boot Chime',
        description: 'Ascending welcome chime on session start.',
        fileName: 'launch.wav',
        soundType: 'boot',
        audioSrc: '/sounds/launch.wav',
      },
      {
        id: 'tick',
        trigger: 'turn.start',
        category: 'Synapse Blip',
        title: '2. Reasoning Start',
        description: 'High-frequency tick as prompt dispatches.',
        fileName: 'ring.wav',
        soundType: 'tick',
        audioSrc: '/sounds/ring.wav',
      },
      {
        id: 'ponder',
        trigger: 'turn.start > 8s',
        category: 'Subtle Metronome',
        title: '3. Deep Pondering',
        description: 'Subtle rhythmic pulse during extended reasoning.',
        fileName: 'timer.mp3',
        soundType: 'ponder',
        audioSrc: '/sounds/timer.mp3',
      },
      {
        id: 'click',
        trigger: 'tool.call: Bash',
        category: 'Mechanical Solenoid',
        title: '4. Shell Execution',
        description: 'Tactile switch click on bash commands.',
        fileName: 'keyboard-click.mp3',
        soundType: 'click',
        audioSrc: '/sounds/keyboard-click.mp3',
      },
      {
        id: 'pip',
        trigger: 'tool.call: Edit',
        category: 'Marimba Pluck',
        title: '5. File Modification',
        description: 'Crisp waterdrop pip on file write/patch.',
        fileName: 'pro-tool-call.mp3',
        soundType: 'pip',
        audioSrc: '/sounds/pro-tool-call.mp3',
      },
      {
        id: 'error',
        trigger: 'isError: true',
        category: 'Dissonant Sting',
        title: '6. Command Failed',
        description: 'Dissonant minor second alert on exit error.',
        fileName: 'error.wav',
        soundType: 'error',
        audioSrc: '/sounds/error.wav',
      },
    ],
    victory: {
      title: '7. Task Complete • Success Ding',
      description: 'Satisfying victory task chime on completion.',
      fileName: 'ding-sound-effect-1.mp3',
      audioSrc: '/sounds/ding-sound-effect-1.mp3',
    },
  },
  arcade: {
    id: 'arcade',
    label: 'Arcade Synthesizer',
    badge: 'Retro 16-Bit Wave',
    description: 'Chiptune chords, melodic arpeggios, and expressive electronic synthesizer feedback.',
    events: [
      {
        id: 'boot',
        trigger: 'session.start',
        category: 'Synth Power-Up',
        title: '1. Power-Up Chime',
        description: 'Polyphonic synthesizer swell on connection.',
        fileName: 'pro-session-start.mp3',
        soundType: 'boot',
        audioSrc: '/sounds/pro-session-start.mp3',
      },
      {
        id: 'tick',
        trigger: 'turn.start',
        category: 'Crystal Ambient',
        title: '2. Thinking Spark',
        description: 'Shimmering ambient bell as Claude ponders.',
        fileName: 'pro-reasoning.mp3',
        soundType: 'tick',
        audioSrc: '/sounds/pro-reasoning.mp3',
      },
      {
        id: 'ponder',
        trigger: 'turn.start > 8s',
        category: 'Fast Countdown',
        title: '3. Extended Clock',
        description: 'Electronic metronome ticker on heavy turns.',
        fileName: 'pro-long-reasoning.mp3',
        soundType: 'ponder',
        audioSrc: '/sounds/pro-long-reasoning.mp3',
      },
      {
        id: 'click',
        trigger: 'tool.call: Bash',
        category: 'Sci-Fi Ping',
        title: '4. Tactical Shell',
        description: 'Laser-guided confirm ping on terminal runs.',
        fileName: 'pro-terminal-command.mp3',
        soundType: 'click',
        audioSrc: '/sounds/pro-terminal-command.mp3',
      },
      {
        id: 'pip',
        trigger: 'tool.call: Edit',
        category: 'Alert Pulse',
        title: '5. Mutation Solenoid',
        description: 'Punchy feedback on code mutations and diffs.',
        fileName: 'ring.wav',
        soundType: 'pip',
        audioSrc: '/sounds/ring.wav',
      },
      {
        id: 'error',
        trigger: 'isError: true',
        category: 'Sad Trombone',
        title: '6. Womp Womp',
        description: 'Classic comedic fail trombone on error exit.',
        fileName: 'pro-error.mp3',
        soundType: 'error',
        audioSrc: '/sounds/pro-error.mp3',
      },
    ],
    victory: {
      title: '7. Level Complete • Victory Fanfare',
      description: 'Triumphant 16-bit arcade fanfare when all tests pass.',
      fileName: 'pro-done.mp3',
      audioSrc: '/sounds/pro-done.mp3',
    },
  },
  nostalgia: {
    id: 'nostalgia',
    label: 'Nostalgia & Memes',
    badge: 'Iconic Pop Culture',
    description: 'Legendary operating system and gaming sound cues that every developer instantly recognizes.',
    events: [
      {
        id: 'boot',
        trigger: 'session.start',
        category: 'Windows XP',
        title: '1. XP Boot Chime',
        description: 'The golden startup symphony of Windows XP.',
        fileName: 'windows-xp-startup.mp3',
        soundType: 'boot',
        audioSrc: '/sounds/windows-xp-startup.mp3',
      },
      {
        id: 'tick',
        trigger: 'turn.start',
        category: 'Minecraft C418',
        title: '2. C418 Think',
        description: 'Serene blocky contemplation from the Minecraft OST.',
        fileName: 'c418-stranger-think.mp3',
        soundType: 'tick',
        audioSrc: '/sounds/c418-stranger-think.mp3',
      },
      {
        id: 'ponder',
        trigger: 'turn.start > 8s',
        category: 'Jeopardy Theme',
        title: '3. Jeopardy Countdown',
        description: 'Tense game-show countdown during deep reasoning.',
        fileName: 'jeopardy-themelq.mp3',
        soundType: 'ponder',
        audioSrc: '/sounds/jeopardy-themelq.mp3',
      },
      {
        id: 'click',
        trigger: 'tool.call: Bash',
        category: 'Counter-Strike',
        title: "4. OK, Let's Go!",
        description: 'Classic voice radio cue when launching commands.',
        fileName: 'counter-strike-ok-lets-go.mp3',
        soundType: 'click',
        audioSrc: '/sounds/counter-strike-ok-lets-go.mp3',
      },
      {
        id: 'pip',
        trigger: 'tool.call: Edit',
        category: 'Metal Gear',
        title: '5. MGS Alert Ping',
        description: 'Iconic exclamation sound on code modification.',
        fileName: 'metal-gear-alert.mp3',
        soundType: 'pip',
        audioSrc: '/sounds/metal-gear-alert.mp3',
      },
      {
        id: 'error',
        trigger: 'isError: true',
        category: 'Dramatic Sting',
        title: '6. TF2 Nemesis',
        description: 'Team Fortress 2 nemesis brass on build failure.',
        fileName: 'tf_nemesis.mp3',
        soundType: 'error',
        audioSrc: '/sounds/tf_nemesis.mp3',
      },
    ],
    victory: {
      title: '7. GTA Mission Passed • Respect +',
      description: 'San Andreas mission passed melody on complete.',
      fileName: 'gta-san-andreas-mission-complete.mp3',
      audioSrc: '/sounds/gta-san-andreas-mission-complete.mp3',
    },
  },
  agent: {
    id: 'agent',
    label: 'Agent & MCP Matrix',
    badge: 'Modern Agentic Cues',
    description: 'Specialized tactile audio engineered for MCP servers, agent skills, subagent workers, and memory compaction.',
    events: [
      {
        id: 'mcp_connect',
        trigger: 'mcp.connect',
        category: 'MCP Protocol',
        title: '1. MCP Server Attached',
        description: 'Iconic Bluetooth device connected confirmation.',
        fileName: 'the-bluetooth-device-its-connected-succesfull.mp3',
        soundType: 'mcp_connect',
        audioSrc: '/sounds/the-bluetooth-device-its-connected-succesfull.mp3',
      },
      {
        id: 'mcp_tool',
        trigger: 'mcp.tool_call',
        category: 'External Tool',
        title: '2. MCP Tool Execution',
        description: 'Magic spell reveal tone when running an external MCP tool.',
        fileName: 'magic-reveal-audio.mp3',
        soundType: 'mcp_tool',
        audioSrc: '/sounds/magic-reveal-audio.mp3',
      },
      {
        id: 'skill',
        trigger: 'skill.invoke',
        category: 'Skill Engine',
        title: '3. Agent Skill Invoked',
        description: 'Fairy sparkle as specialized skill routines fire.',
        fileName: 'fairy-sparkle.mp3',
        soundType: 'skill',
        audioSrc: '/sounds/fairy-sparkle.mp3',
      },
      {
        id: 'plugin',
        trigger: 'plugin.install',
        category: 'Marketplace',
        title: '4. Plugin & Marketplace Add',
        description: 'Retro Level-Up sound on installing plugins and marketplaces.',
        fileName: 'levelup.mp3',
        soundType: 'plugin',
        audioSrc: '/sounds/levelup.mp3',
      },
      {
        id: 'permission',
        trigger: 'permission.request',
        category: 'User Attention',
        title: '5. Permission Required',
        description: 'Doorbell notification when Claude asks for confirmation.',
        fileName: 'door-bell-sound-effect.mp3',
        soundType: 'permission',
        audioSrc: '/sounds/door-bell-sound-effect.mp3',
      },
      {
        id: 'subagent',
        trigger: 'subagent.spawn',
        category: 'Swarm & Subagent',
        title: '6. Subagent Teleport',
        description: 'Instant transmission teleport when worker agent spawns.',
        fileName: 'dbz-teleport.mp3',
        soundType: 'subagent',
        audioSrc: '/sounds/dbz-teleport.mp3',
      },
      {
        id: 'web_search',
        trigger: 'tool.call: WebSearch',
        category: 'Live Internet Fetch',
        title: '7. Web Search & Query',
        description: 'Authentic 90s internet dialup handshake sound on live web search.',
        fileName: 'dialup.mp3',
        soundType: 'web_search',
        audioSrc: '/sounds/dialup.mp3',
      },
    ],
    victory: {
      title: '7. Git Milestone & Task Complete',
      description: 'Confetti pop celebration on git commit and verified task.',
      fileName: 'confetti-pop-sound-effect.mp3',
      audioSrc: '/sounds/confetti-pop-sound-effect.mp3',
    },
  },
}

export default function SoundboardMatrix() {
  const [selectedPack, setSelectedPack] = useState<PackId>('minimal')
  const { activeId, isPlaying, isPaused } = useAudioState()

  const pack = PACKS[selectedPack]

  const handleTogglePlay = (evt: LifecycleEvent) => {
    const playKey = `${selectedPack}-${evt.id}`
    audioEngine.toggle(playKey, evt.soundType, evt.audioSrc)
  }

  const handleToggleVictory = () => {
    const playKey = `${selectedPack}-victory`
    audioEngine.toggle(playKey, 'fanfare', pack.victory.audioSrc)
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-2 sm:pt-3 pb-12 sm:pb-14 scroll-mt-16"
      id="soundboard-matrix"
    >
      {/* Header and Pack Selector Pills */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-4 sm:mb-6 gap-4 sm:gap-6">
        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block mb-1">
            Micro-Acoustic Palette Library
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
            The 7 Lifecycle Sonic Events
          </h2>
          <p className="font-body-md text-sm sm:text-base text-tertiary mt-1 leading-relaxed max-w-xl">
            {pack.description}
          </p>
        </div>

        {/* Pack Selector Tabs with Smooth Horizontal Scroll on Mobile/Tablet */}
        <div className="shrink-0 max-w-full overflow-x-auto no-scrollbar py-1">
          <div className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-md gap-1 shrink-0">
            {(Object.keys(PACKS) as PackId[]).map((pid) => {
              const p = PACKS[pid]
              const isSelected = selectedPack === pid
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => setSelectedPack(pid)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-tertiary hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {pack.events.map((evt) => {
          const playKey = `${selectedPack}-${evt.id}`
          const isThisActive = activeId === playKey
          const isThisPlaying = isThisActive && isPlaying
          const isThisPaused = isThisActive && isPaused
          const isError = evt.id === 'error'

          return (
            <div
              key={evt.id}
              className={`p-4 sm:p-5 rounded-2xl flex flex-col justify-between transition-all group border shadow-sm ${
                isThisActive
                  ? 'bg-surface-container ring-1 ring-primary-container/40 border-primary-container/30'
                  : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-code ${
                      isError ? 'bg-error-container text-error' : 'bg-surface-container text-tertiary'
                    }`}
                  >
                    {evt.trigger}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">{evt.category}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed mb-1">{evt.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 sm:mb-4">{evt.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15">
                <div className="font-label-sm text-label-sm text-outline font-code flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary-container">music_note</span>
                  <span className="max-w-[150px] truncate">{evt.fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePlay(evt)}
                  className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-2 cursor-pointer font-medium ${
                    isThisPlaying
                      ? 'bg-primary-container text-on-primary-container shadow-md ring-2 ring-primary-container/50'
                      : isThisPaused
                      ? 'bg-surface-container-high text-primary-container border border-primary-container/40'
                      : isError
                      ? 'bg-surface-container-high hover:bg-error-container hover:text-error text-tertiary-fixed'
                      : 'bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-tertiary-fixed'
                  }`}
                >
                  {isThisPlaying ? (
                    <span className="inline-flex items-end gap-0.5 h-3.5 w-3.5" aria-hidden="true">
                      <span className="w-0.5 bg-current rounded-full animate-eq-1" />
                      <span className="w-0.5 bg-current rounded-full animate-eq-2" />
                      <span className="w-0.5 bg-current rounded-full animate-eq-3" />
                      <span className="w-0.5 bg-current rounded-full animate-eq-4" />
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  )}
                  <span>{isThisPlaying ? 'Pause' : isThisPaused ? 'Resume' : 'Play'}</span>
                </button>
              </div>
            </div>
          )
        })}

        {/* 7. turn.complete (Featured Full-width span on 3 cols) */}
        {(() => {
          const victoryKey = `${selectedPack}-victory`
          const isVictoryActive = activeId === victoryKey
          const isVictoryPlaying = isVictoryActive && isPlaying
          const isVictoryPaused = isVictoryActive && isPaused

          return (
            <div className="lg:col-span-3 bg-surface-container p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 border border-primary-container/30 shadow-md">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-container/20 text-primary-container font-code">
                    turn.complete
                  </span>
                  <span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase">
                    {pack.badge} • Victory Milestone
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">
                  {pack.victory.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {pack.victory.description}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleVictory}
                className={`px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all flex items-center gap-2.5 shrink-0 cursor-pointer shadow-md font-semibold ${
                  isVictoryPlaying
                    ? 'bg-primary text-on-primary ring-2 ring-primary/60'
                    : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                }`}
              >
                {isVictoryPlaying ? (
                  <span className="inline-flex items-end gap-0.5 h-4 w-4" aria-hidden="true">
                    <span className="w-0.5 bg-current rounded-full animate-eq-1" />
                    <span className="w-0.5 bg-current rounded-full animate-eq-2" />
                    <span className="w-0.5 bg-current rounded-full animate-eq-3" />
                    <span className="w-0.5 bg-current rounded-full animate-eq-4" />
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">celebration</span>
                )}
                <span>
                  {isVictoryPlaying ? 'Pause Fanfare' : isVictoryPaused ? 'Resume Fanfare' : 'Play Victory Fanfare'}
                </span>
              </button>
            </div>
          )
        })()}
      </div>
    </section>
  )
}
