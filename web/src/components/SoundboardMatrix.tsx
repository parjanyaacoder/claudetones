'use client'

import React, { useState } from 'react'
import { playAcousticCue } from '@/lib/audio'

type LifecycleEvent = {
  id: string
  trigger: string
  category: string
  title: string
  description: string
  spec: string
  soundType: 'boot' | 'tick' | 'ponder' | 'click' | 'pip' | 'error' | 'fanfare'
  audioSrc?: string
}

const EVENTS: LifecycleEvent[] = [
  {
    id: 'boot',
    trigger: 'session.start',
    category: 'Ascending Chime',
    title: '1. Warm Boot Chime',
    description: 'Ascending welcome chime on session start.',
    spec: '523 Hz • 240ms',
    soundType: 'boot',
    audioSrc: '/sounds/launch.wav',
  },
  {
    id: 'tick',
    trigger: 'turn.start',
    category: 'Synapse Blip',
    title: '2. Reasoning Start',
    description: 'High-frequency tick as prompt dispatches.',
    spec: '880 Hz • 60ms',
    soundType: 'tick',
    audioSrc: '/sounds/ring.wav',
  },
  {
    id: 'ponder',
    trigger: 'turn.start > 8s',
    category: 'Subtle Metronome',
    title: '3. Deep Pondering',
    description: 'Subtle rhythmic pulse during extended reasoning.',
    spec: '440 Hz • 80bpm',
    soundType: 'ponder',
    audioSrc: '/sounds/timer.mp3',
  },
  {
    id: 'click',
    trigger: 'tool.call: Bash',
    category: 'Mechanical Solenoid',
    title: '4. Shell Execution',
    description: 'Tactile switch click on bash commands.',
    spec: 'Cherry MX • 45ms',
    soundType: 'click',
    audioSrc: '/sounds/keyboard-click.mp3',
  },
  {
    id: 'pip',
    trigger: 'tool.call: Edit',
    category: 'Marimba Pluck',
    title: '5. File Modification',
    description: 'Crisp waterdrop pip on file write/patch.',
    spec: '1046 Hz • 75ms',
    soundType: 'pip',
    audioSrc: '/sounds/pro-tool-call.mp3',
  },
  {
    id: 'error',
    trigger: 'isError: true',
    category: 'Dissonant Sting',
    title: '6. Command Failed',
    description: 'Dissonant minor second alert on exit error.',
    spec: '311 Hz • 320ms',
    soundType: 'error',
    audioSrc: '/sounds/error.wav',
  },
]

export default function SoundboardMatrix() {
  const [playingId, setPlayingId] = useState<string | null>(null)

  const handleAudition = (evt: LifecycleEvent) => {
    setPlayingId(evt.id)
    playAcousticCue(evt.soundType)
    setTimeout(() => {
      setPlayingId((curr) => (curr === evt.id ? null : curr))
    }, 800)
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16" id="soundboard-matrix">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block mb-2">
            Micro-Acoustic Palette
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">The 7 Lifecycle Sonic Events</h2>
        </div>
        <p className="font-body-md text-body-md text-tertiary max-w-md mt-4 md:mt-0">
          Soft-clipped micro-tones designed for cognitive comfort during long coding sessions.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map((evt) => {
          const isPlaying = playingId === evt.id
          const isError = evt.id === 'error'

          return (
            <div
              key={evt.id}
              className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between hover:bg-surface-container transition-all group border border-outline-variant/15"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-code ${
                      isError ? 'bg-error-container text-error' : 'bg-surface-container text-tertiary'
                    }`}
                  >
                    {evt.trigger}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">{evt.category}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed mb-2">{evt.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{evt.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/15">
                <div className="font-label-sm text-label-sm text-outline font-code">{evt.spec}</div>
                <button
                  type="button"
                  onClick={() => handleAudition(evt)}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                    isError
                      ? 'bg-surface-container-high group-hover:bg-error-container group-hover:text-error text-tertiary-fixed'
                      : 'bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container text-tertiary-fixed'
                  } ${isPlaying ? 'ring-2 ring-primary-container scale-105' : ''}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isPlaying ? 'volume_up' : 'play_arrow'}
                  </span>
                  <span>{isPlaying ? 'Playing' : 'Audition'}</span>
                </button>
              </div>
            </div>
          )
        })}

        {/* 7. turn.complete (Featured Full-width span on 3 cols) */}
        <div className="lg:col-span-3 bg-surface-container p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-primary-container/30">
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
              7. Task Complete • C-Major Arpeggio
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Satisfying C-Major arpeggio on task completion.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPlayingId('fanfare')
              playAcousticCue('fanfare')
              setTimeout(() => setPlayingId(null), 1000)
            }}
            className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">celebration</span>
            <span>Audition Victory Fanfare</span>
          </button>
        </div>
      </div>
    </section>
  )
}
