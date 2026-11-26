// Project Sound Dispatcher for Claudetones
// Controls exclusive audio playback with full play/pause/stop lifecycle and zero overlapping cacophony.

'use client'

import { useState, useEffect } from 'react'

export type SoundType = 'boot' | 'tick' | 'ponder' | 'click' | 'pip' | 'error' | 'fanfare'

export const SOUND_FILE_MAP: Record<SoundType, string> = {
  boot: '/sounds/launch.wav',
  tick: '/sounds/ring.wav',
  ponder: '/sounds/timer.mp3',
  click: '/sounds/keyboard-click.mp3',
  pip: '/sounds/pro-tool-call.mp3',
  error: '/sounds/error.wav',
  fanfare: '/sounds/ding-sound-effect-1.mp3',
}

export type PlaybackState = {
  activeId: string | null
  activeType: SoundType | null
  isPlaying: boolean
  isPaused: boolean
}

type AudioSubscriber = (state: PlaybackState) => void

// Centralized Singleton Audio Controller
class AudioEngine {
  private currentAudio: HTMLAudioElement | null = null
  private activeId: string | null = null
  private activeType: SoundType | null = null
  private isPaused: boolean = false
  private subscribers: Set<AudioSubscriber> = new Set()
  private audioCache: Map<string, HTMLAudioElement> = new Map()

  public subscribe(fn: AudioSubscriber): () => void {
    this.subscribers.add(fn)
    fn(this.getState())
    return () => {
      this.subscribers.delete(fn)
    }
  }

  public getState(): PlaybackState {
    return {
      activeId: this.activeId,
      activeType: this.activeType,
      isPlaying: this.currentAudio !== null && !this.currentAudio.paused && !this.currentAudio.ended,
      isPaused: this.isPaused,
    }
  }

  private notify() {
    const state = this.getState()
    this.subscribers.forEach((fn) => {
      try {
        fn(state)
      } catch (e) {
        console.error('Audio subscriber error:', e)
      }
    })
  }

  // Stop any currently playing audio immediately
  public stopAll() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      } catch {}
      this.currentAudio = null
    }
    this.activeId = null
    this.activeType = null
    this.isPaused = false
    this.notify()
  }

  // Pause the current audio
  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      try {
        this.currentAudio.pause()
      } catch {}
      this.isPaused = true
      this.notify()
    }
  }

  // Resume paused audio
  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      try {
        this.currentAudio.play().catch(() => {})
      } catch {}
      this.isPaused = false
      this.notify()
    }
  }

  // Play a sound with exclusive session handling (stops any previous audio first)
  public play(id: string, type: SoundType, src?: string) {
    if (typeof window === 'undefined') return

    const targetSrc = src || SOUND_FILE_MAP[type]
    if (!targetSrc) return

    // Stop and reset any currently playing sound immediately
    if (this.currentAudio) {
      try {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      } catch {}
    }

    triggerVisualRipple()

    let audio = this.audioCache.get(targetSrc)
    if (!audio) {
      audio = new Audio(targetSrc)
      audio.preload = 'auto'
      this.audioCache.set(targetSrc, audio)
    } else {
      audio.currentTime = 0
    }

    audio.volume = 0.55
    this.currentAudio = audio
    this.activeId = id
    this.activeType = type
    this.isPaused = false

    audio.onended = () => {
      if (this.currentAudio === audio) {
        this.currentAudio = null
        this.activeId = null
        this.activeType = null
        this.isPaused = false
        this.notify()
      }
    }

    audio.onerror = () => {
      if (this.currentAudio === audio) {
        this.currentAudio = null
        this.activeId = null
        this.activeType = null
        this.isPaused = false
        this.notify()
      }
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.notify()
        })
        .catch((err) => {
          console.warn('Playback prevented:', err)
          this.notify()
        })
    }
    this.notify()
  }

  // Toggle play/pause for a given sound
  public toggle(id: string, type: SoundType, src?: string) {
    if (this.activeId === id && this.currentAudio) {
      if (!this.currentAudio.paused) {
        this.pause()
      } else {
        this.resume()
      }
    } else {
      this.play(id, type, src)
    }
  }
}

export const audioEngine = new AudioEngine()

// Backward-compatible exports that delegate to singleton audioEngine
export function playAcousticCue(type: SoundType, customSrc?: string, id?: string) {
  audioEngine.play(id || type, type, customSrc)
}

export function pauseAcousticCue() {
  audioEngine.pause()
}

export function resumeAcousticCue() {
  audioEngine.resume()
}

export function stopAllAcousticCues() {
  audioEngine.stopAll()
}

export function toggleAcousticCue(type: SoundType, customSrc?: string, id?: string) {
  audioEngine.toggle(id || type, type, customSrc)
}

// React Hook to subscribe to global audio playback state
export function useAudioState(): PlaybackState {
  const [state, setState] = useState<PlaybackState>(() => audioEngine.getState())

  useEffect(() => {
    return audioEngine.subscribe(setState)
  }, [])

  return state
}

export function triggerVisualRipple() {
  if (typeof document === 'undefined') return

  const bars = document.querySelectorAll('.live-wave-visualizer span')
  bars.forEach((bar) => {
    const el = bar as HTMLElement
    const h = Math.floor(Math.random() * 12) + 6
    el.style.height = `${h}px`
    el.style.backgroundColor = '#d97757'
  })

  const ripples = document.querySelectorAll('.audio-ripple-target')
  ripples.forEach((el) => {
    el.classList.remove('opacity-0')
    el.classList.add('opacity-100')
  })

  setTimeout(() => {
    ripples.forEach((el) => {
      el.classList.remove('opacity-100')
      el.classList.add('opacity-0')
    })
  }, 700)

  setTimeout(() => {
    bars.forEach((bar) => {
      const el = bar as HTMLElement
      el.style.height = ''
      el.style.backgroundColor = ''
    })
  }, 450)
}
