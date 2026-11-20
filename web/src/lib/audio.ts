// Project Sound Dispatcher for Claudetones
// Plays the authentic project sound files added in public/sounds/

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

const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {}

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

export function playAcousticCue(type: SoundType, customSrc?: string) {
  if (typeof window === 'undefined') return

  try {
    triggerVisualRipple()

    const src = customSrc || SOUND_FILE_MAP[type]
    if (!src) return

    let audio = audioCache[type]
    if (!audio || customSrc) {
      audio = new Audio(src)
      audio.preload = 'auto'
      if (!customSrc) audioCache[type] = audio
    } else {
      audio.currentTime = 0
    }

    audio.volume = 0.5
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio playback was prevented by browser policy or error:', err)
      })
    }
  } catch (err) {
    console.warn('Audio playback error:', err)
  }
}
