'use client'

import React from 'react'
import { audioEngine, useAudioState, type SoundType } from '@/lib/audio'

type MarqueeSound = {
  id: string
  name: string
  event: string
  src: string
  type: SoundType
  tag: string
}

const MARQUEE_SOUNDS: MarqueeSound[] = [
  {
    id: 'mq-winxp',
    name: 'Windows XP Startup',
    event: 'session.start',
    src: '/sounds/windows-xp-startup.mp3',
    type: 'boot',
    tag: 'Meme Vault',
  },
  {
    id: 'mq-csgo',
    name: "CS:GO Ok Let's Go",
    event: 'turn.start',
    src: '/sounds/counter-strike-ok-lets-go.mp3',
    type: 'tick',
    tag: 'Gaming',
  },
  {
    id: 'mq-c418',
    name: 'Minecraft C418 Ponder',
    event: 'turn.ponder',
    src: '/sounds/c418-stranger-think.mp3',
    type: 'ponder',
    tag: 'Lo-Fi',
  },
  {
    id: 'mq-keyclick',
    name: 'Mechanical Bash Click',
    event: 'tool.bash',
    src: '/sounds/keyboard-click.mp3',
    type: 'click',
    tag: 'Tactile',
  },
  {
    id: 'mq-waterdrop',
    name: 'File Edit Water Drop',
    event: 'tool.edit',
    src: '/sounds/pro-tool-call.mp3',
    type: 'pip',
    tag: 'Haptic',
  },
  {
    id: 'mq-mgs',
    name: 'Metal Gear Alert (!)',
    event: 'error.alert',
    src: '/sounds/metal-gear-alert.mp3',
    type: 'error',
    tag: 'Iconic',
  },
  {
    id: 'mq-gta',
    name: 'GTA San Andreas Respect+',
    event: 'turn.complete',
    src: '/sounds/gta-san-andreas-mission-complete.mp3',
    type: 'fanfare',
    tag: 'Victory',
  },
  {
    id: 'mq-ding',
    name: 'Minimal Clean Ding',
    event: 'turn.complete',
    src: '/sounds/ding-sound-effect-1.mp3',
    type: 'fanfare',
    tag: 'Atelier',
  },
  {
    id: 'mq-jeopardy',
    name: 'Jeopardy Think Theme',
    event: 'turn.ponder',
    src: '/sounds/jeopardy-themelq.mp3',
    type: 'ponder',
    tag: 'Classic',
  },
  {
    id: 'mq-ring',
    name: 'Soft Chime Ambient Ring',
    event: 'turn.start',
    src: '/sounds/ring.wav',
    type: 'tick',
    tag: 'Minimal',
  },
  {
    id: 'mq-bluetooth',
    name: 'Bluetooth Connected',
    event: 'mcp.connect',
    src: '/sounds/the-bluetooth-device-its-connected-succesfull.mp3',
    type: 'mcp_connect',
    tag: 'MCP',
  },
  {
    id: 'mq-sparkle',
    name: 'Skill Fairy Sparkle',
    event: 'skill.invoke',
    src: '/sounds/fairy-sparkle.mp3',
    type: 'skill',
    tag: 'Skills',
  },
  {
    id: 'mq-levelup',
    name: 'Plugin Level Up',
    event: 'plugin.install',
    src: '/sounds/levelup.mp3',
    type: 'plugin',
    tag: 'Plugins',
  },
  {
    id: 'mq-teleport',
    name: 'Subagent Teleport',
    event: 'subagent.spawn',
    src: '/sounds/dbz-teleport.mp3',
    type: 'subagent',
    tag: 'Agents',
  },
  {
    id: 'mq-doorbell',
    name: 'Permission Doorbell',
    event: 'permission.request',
    src: '/sounds/door-bell-sound-effect.mp3',
    type: 'permission',
    tag: 'Prompts',
  },
]

export default function SoundMarquee() {
  const { activeId, isPlaying } = useAudioState()

  // Double the list for seamless infinite loop
  const soundList = [...MARQUEE_SOUNDS, ...MARQUEE_SOUNDS]

  return (
    <section className="relative w-full overflow-hidden py-4 border-y border-outline-variant/20 bg-surface-container-lowest/60 backdrop-blur-md select-none">
      {/* Edge gradient masks for smooth fade-in/fade-out */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="shrink-0 pl-6 sm:pl-10 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-outline border-r border-outline-variant/30 pr-5 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-semibold text-tertiary-fixed">Myinstants Ticker</span>
        </div>

        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee flex items-center gap-3">
            {soundList.map((item, idx) => {
              const uniqueKey = `marquee-${item.id}-${idx}`
              const isThisPlaying = activeId === uniqueKey && isPlaying

              return (
                <button
                  key={uniqueKey}
                  type="button"
                  onClick={() => audioEngine.toggle(uniqueKey, item.type, item.src)}
                  className={`group shrink-0 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isThisPlaying
                      ? 'bg-primary-container/20 border-primary-container text-on-surface shadow-md ring-1 ring-primary-container/40'
                      : 'bg-surface-container-low/80 hover:bg-surface-container-high border-outline-variant/25 hover:border-outline-variant/60 text-tertiary hover:text-on-surface'
                  }`}
                >
                  {/* Origin UI Equalizer or Play Icon */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isThisPlaying
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container text-tertiary-fixed'
                    }`}
                  >
                    {isThisPlaying ? (
                      <span className="inline-flex items-end gap-0.5 h-3 w-3" aria-hidden="true">
                        <span className="w-0.5 bg-current rounded-full animate-eq-1" />
                        <span className="w-0.5 bg-current rounded-full animate-eq-2" />
                        <span className="w-0.5 bg-current rounded-full animate-eq-3" />
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                    )}
                  </span>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-medium text-tertiary-fixed group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-outline border border-outline-variant/20">
                      {item.event}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
