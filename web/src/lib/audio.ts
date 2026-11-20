// Web Audio API Synthesizer & Audio Dispatcher for Claudetones
// 100% Client-side synthetic acoustics matching the Warm Intellectualism atelier

type SoundType = 'boot' | 'tick' | 'ponder' | 'click' | 'pip' | 'error' | 'fanfare'

let audioCtx: AudioContext | null = null

export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function triggerVisualRipple() {
  if (typeof document === 'undefined') return

  const bars = document.querySelectorAll('.live-wave-visualizer span')
  bars.forEach((bar) => {
    const el = bar as HTMLElement
    const h = Math.floor(Math.random() * 14) + 6
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

export function playAcousticCue(type: SoundType) {
  try {
    const ctx = initAudioContext()
    if (!ctx) return

    triggerVisualRipple()

    const volume = 0.24
    const now = ctx.currentTime
    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume, now)

    if (type === 'boot') {
      const freqs = [523.25, 659.25, 783.99, 1046.50]
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const noteGain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.05)
        noteGain.gain.setValueAtTime(0, now + idx * 0.05)
        noteGain.gain.linearRampToValueAtTime(volume * 0.75, now + idx * 0.05 + 0.02)
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3)
        osc.connect(noteGain)
        noteGain.connect(ctx.destination)
        osc.start(now + idx * 0.05)
        osc.stop(now + idx * 0.05 + 0.35)
      })
    } else if (type === 'tick') {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05)
      gainNode.gain.setValueAtTime(volume * 0.8, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.connect(gainNode)
      osc.start(now)
      osc.stop(now + 0.07)
    } else if (type === 'ponder') {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      gainNode.gain.setValueAtTime(volume * 0.45, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gainNode)
      osc.start(now)
      osc.stop(now + 0.13)
    } else if (type === 'click') {
      const bufferSize = Math.floor(ctx.sampleRate * 0.038)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22))
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1850
      filter.Q.value = 2.8
      noise.connect(filter)
      filter.connect(gainNode)
      noise.start(now)
    } else if (type === 'pip') {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1046.50, now)
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08)
      gainNode.gain.setValueAtTime(volume * 0.8, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gainNode)
      osc.start(now)
      osc.stop(now + 0.13)
    } else if (type === 'error') {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      osc1.type = 'sawtooth'
      osc2.type = 'sawtooth'
      osc1.frequency.setValueAtTime(311.13, now)
      osc2.frequency.setValueAtTime(329.63, now)
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 650
      gainNode.gain.setValueAtTime(volume * 0.6, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gainNode)
      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.36)
      osc2.stop(now + 0.36)
    } else if (type === 'fanfare') {
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const noteGain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.045)
        noteGain.gain.setValueAtTime(0, now + i * 0.045)
        noteGain.gain.linearRampToValueAtTime(volume * 0.8, now + i * 0.045 + 0.02)
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.55)
        osc.connect(noteGain)
        noteGain.connect(ctx.destination)
        osc.start(now + i * 0.045)
        osc.stop(now + i * 0.045 + 0.6)
      })
    }
  } catch (err) {
    console.warn('AudioContext error:', err)
  }
}
