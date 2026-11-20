'use client'

import { useCallback, useState } from 'react'

import { EVENTS, soundsFor } from '@/lib/catalog'
import type { Sound } from '@/lib/catalog'

let sharedAudio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!sharedAudio) {
    sharedAudio = new Audio()
    sharedAudio.preload = 'auto'
  }
  return sharedAudio
}

function Equalizer() {
  return (
    <span aria-hidden className="inline-flex h-3 items-end gap-0.5">
      <span className="h-1.5 w-0.5 animate-[eq_0.6s_ease-in-out_infinite] bg-current" />
      <span className="h-3 w-0.5 animate-[eq_0.6s_ease-in-out_infinite_0.15s] bg-current" />
      <span className="h-2 w-0.5 animate-[eq_0.6s_ease-in-out_infinite_0.3s] bg-current" />
    </span>
  )
}

function SoundButton({
  sound,
  id,
  playing,
  onPlay,
}: {
  sound: Sound
  id: string
  playing: string | null
  onPlay: (sound: Sound, id: string) => void
}) {
  const isPlaying = playing === id
  const isArcade = sound.theme === 'arcade'
  return (
    <button
      type="button"
      onClick={() => onPlay(sound, id)}
      aria-pressed={isPlaying}
      className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
        isPlaying
          ? 'border-pop bg-pop/15 text-white shadow-lg shadow-pop/10'
          : 'border-line bg-ink-card/60 text-white/90 hover:border-pop/60 hover:bg-ink-card'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isPlaying
            ? 'bg-pop text-ink'
            : isArcade
            ? 'bg-gold/15 text-gold group-hover:bg-gold/25'
            : 'bg-mint/15 text-mint group-hover:bg-mint/25'
        }`}
      >
        {isPlaying ? <Equalizer /> : '▶'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{sound.name}</span>
        <span className="block truncate text-xs text-muted">{sound.vibe}</span>
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          isArcade ? 'bg-gold/15 text-gold' : 'bg-mint/15 text-mint'
        }`}
      >
        {isArcade ? 'Arcade' : 'Minimal'}
      </span>
    </button>
  )
}

export default function Soundboard() {
  const [playing, setPlaying] = useState<string | null>(null)

  const play = useCallback(
    (sound: Sound, id: string) => {
      const audio = getAudio()
      if (!audio) return
      if (playing === id) {
        audio.pause()
        setPlaying(null)
        return
      }
      audio.src = sound.src
      audio.currentTime = 0
      audio.onended = () => setPlaying(current => (current === id ? null : current))
      audio
        .play()
        .then(() => setPlaying(id))
        .catch(() => setPlaying(null))
    },
    [playing],
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-line/60">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">
          7 Universal Audio Triggers
        </span>
        <span className="text-xs text-muted">Click any sound to listen</span>
      </div>

      <div className="grid gap-3">
        {EVENTS.map(event => {
          const { minimal, arcade } = soundsFor(event.key)
          return (
            <div
              key={event.key}
              className="rounded-2xl border border-line bg-ink-soft/70 p-3.5 transition hover:border-line/80 sm:p-4"
            >
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-lg" aria-hidden>
                  {event.emoji}
                </span>
                <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                <code className="rounded bg-ink px-1.5 py-0.5 font-mono text-[11px] text-muted">
                  {event.trigger}
                </code>
                <p className="w-full text-xs text-muted">{event.description}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <SoundButton
                  sound={minimal}
                  id={`${event.key}-minimal`}
                  playing={playing}
                  onPlay={play}
                />
                <SoundButton
                  sound={arcade}
                  id={`${event.key}-arcade`}
                  playing={playing}
                  onPlay={play}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
