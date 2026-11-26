'use client'

import React from 'react'
import { audioEngine, useAudioState, type SoundType } from '@/lib/audio'

type LifecycleEvent = {
  id: string
  trigger: string
  category: string
  title: string
  description: string
  spec: string
  fileName: string
  soundType: SoundType
  audioSrc: string
}

const EVENTS: LifecycleEvent[] = [
  {
    id: 'boot',
    trigger: 'session.start',
    category: 'Ascending Chime',
    title: '1. Warm Boot Chime',
    description: 'Ascending welcome chime on session start.',
    spec: 'sounds/launch.wav',
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
    spec: 'sounds/ring.wav',
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
    spec: 'sounds/timer.mp3',
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
    spec: 'sounds/keyboard-click.mp3',
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
    spec: 'sounds/pro-tool-call.mp3',
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
    spec: 'sounds/error.wav',
    fileName: 'error.wav',
    soundType: 'error',
    audioSrc: '/sounds/error.wav',
  },
]

export default function SoundboardMatrix() {
  const { activeId, isPlaying, isPaused } = useAudioState()

  const handleTogglePlay = (evt: LifecycleEvent) => {
    audioEngine.toggle(`matrix-${evt.id}`, evt.soundType, evt.audioSrc)
  }

  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-12 py-10"
      id="soundboard-matrix"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block mb-1.5">
            Micro-Acoustic Palette
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">The 7 Lifecycle Sonic Events</h2>
        </div>
        <p className="font-body-md text-body-md text-tertiary max-w-md mt-2 md:mt-0 leading-relaxed">
          Soft-clipped micro-tones designed for cognitive comfort during long coding sessions. Exclusive single playback.
        </p>
      </div>

      {/* Grid Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {EVENTS.map((evt) => {
          const isThisActive = activeId === `matrix-${evt.id}`
          const isThisPlaying = isThisActive && isPlaying
          const isThisPaused = isThisActive && isPaused
          const isError = evt.id === 'error'

          return (
            <div
              key={evt.id}
              className={`p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all group border shadow-sm ${
                isThisActive
                  ? 'bg-surface-container ring-1 ring-primary-container/40 border-primary-container/30'
                  : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-code ${
                      isError ? 'bg-error-container text-error' : 'bg-surface-container text-tertiary'
                    }`}
                  >
                    {evt.trigger}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">{evt.category}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed mb-1.5">{evt.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">{evt.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-outline-variant/15">
                <div className="font-label-sm text-label-sm text-outline font-code flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary-container">music_note</span>
                  <span>{evt.fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePlay(evt)}
                  className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                    isThisPlaying
                      ? 'bg-primary-container text-on-primary-container shadow-md ring-2 ring-primary-container/50'
                      : isThisPaused
                      ? 'bg-surface-container-high text-primary-container border border-primary-container/40'
                      : isError
                      ? 'bg-surface-container-high hover:bg-error-container hover:text-error text-tertiary-fixed'
                      : 'bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-tertiary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isThisPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isThisPlaying ? 'Pause' : isThisPaused ? 'Resume' : 'Play'}</span>
                </button>
              </div>
            </div>
          )
        })}

        {/* 7. turn.complete (Featured Full-width span on 3 cols) */}
        {(() => {
          const isFanfareActive = activeId === 'matrix-fanfare'
          const isFanfarePlaying = isFanfareActive && isPlaying
          const isFanfarePaused = isFanfareActive && isPaused

          return (
            <div className="lg:col-span-3 bg-surface-container p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 border border-primary-container/30 shadow-md">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-container/20 text-primary-container font-code">
                    turn.complete
                  </span>
                  <span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase">
                    Grand Victory Milestone
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">
                  7. Task Complete • ding-sound-effect-1.mp3
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Satisfying victory task chime on completion with interactive play/pause controls.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  audioEngine.toggle('matrix-fanfare', 'fanfare', '/sounds/ding-sound-effect-1.mp3')
                }}
                className={`px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md font-semibold ${
                  isFanfarePlaying
                    ? 'bg-primary text-on-primary ring-2 ring-primary/60'
                    : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFanfarePlaying ? 'pause_circle' : 'celebration'}
                </span>
                <span>
                  {isFanfarePlaying ? 'Pause Fanfare' : isFanfarePaused ? 'Resume Fanfare' : 'Play Victory Fanfare'}
                </span>
              </button>
            </div>
          )
        })()}
      </div>
    </section>
  )
}
