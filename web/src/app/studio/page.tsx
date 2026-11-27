'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import JSZip from 'jszip'
import { GITHUB_URL } from '@/lib/catalog'

type GlowColor = {
  name: string
  border: string
  glow: string
  bg: string
  text: string
}

const GLOW_PALETTE: GlowColor[] = [
  { name: 'cyan', border: '#06b6d4', glow: 'rgba(6, 182, 212, 0.75)', bg: 'rgba(6, 182, 212, 0.16)', text: '#67e8f9' },
  { name: 'violet', border: '#a855f7', glow: 'rgba(168, 85, 247, 0.75)', bg: 'rgba(168, 85, 247, 0.16)', text: '#c084fc' },
  { name: 'pink', border: '#ec4899', glow: 'rgba(236, 72, 153, 0.75)', bg: 'rgba(236, 72, 153, 0.16)', text: '#f472b6' },
  { name: 'emerald', border: '#10b981', glow: 'rgba(16, 185, 129, 0.75)', bg: 'rgba(16, 185, 129, 0.16)', text: '#34d399' },
  { name: 'orange', border: '#f97316', glow: 'rgba(249, 115, 22, 0.75)', bg: 'rgba(249, 115, 22, 0.16)', text: '#fb923c' },
  { name: 'amber', border: '#eab308', glow: 'rgba(234, 179, 8, 0.75)', bg: 'rgba(234, 179, 8, 0.16)', text: '#facc15' },
  { name: 'blue', border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.75)', bg: 'rgba(59, 130, 246, 0.16)', text: '#60a5fa' },
  { name: 'rose', border: '#f43f5e', glow: 'rgba(244, 63, 94, 0.75)', bg: 'rgba(244, 63, 94, 0.16)', text: '#fb7185' },
]

type SoundBubble = {
  id: string
  name: string
  tag: string
  audioSrc: string
  // Position as percentage on canvas
  x: number
  y: number
  size: number // diameter in px (delicate, refined)
  floatDelay: string // animation delay
  isCustom?: boolean
}

// Delicate, airy glass bubbles spaced gently around the canvas periphery
const INITIAL_BUBBLES: SoundBubble[] = [
  // Top peripheral tier
  { id: 'b1', name: 'launch.wav', tag: 'Boot', audioSrc: '/sounds/launch.wav', x: 6, y: 12, size: 66, floatDelay: '0s' },
  { id: 'b2', name: 'dialup.mp3', tag: 'Search', audioSrc: '/sounds/dialup.mp3', x: 21, y: 9, size: 60, floatDelay: '1.2s' },
  { id: 'b3', name: 'bluetooth.mp3', tag: 'MCP', audioSrc: '/sounds/the-bluetooth-device-its-connected-succesfull.mp3', x: 37, y: 11, size: 68, floatDelay: '2.4s' },
  { id: 'b4', name: 'levelup.mp3', tag: 'Plugin', audioSrc: '/sounds/levelup.mp3', x: 53, y: 8, size: 62, floatDelay: '0.8s' },
  { id: 'b5', name: 'dbz-teleport.mp3', tag: 'Agent', audioSrc: '/sounds/dbz-teleport.mp3', x: 69, y: 10, size: 66, floatDelay: '1.9s' },
  { id: 'b6', name: 'ring.wav', tag: 'Thinking', audioSrc: '/sounds/ring.wav', x: 84, y: 8, size: 58, floatDelay: '0.4s' },
  { id: 'b7', name: 'fahhh.mp3', tag: 'Shock', audioSrc: '/sounds/fahhhhhhhhhhhhhh.mp3', x: 94, y: 13, size: 64, floatDelay: '1.7s' },

  // Far left periphery
  { id: 'b8', name: 'confetti.mp3', tag: 'Commit', audioSrc: '/sounds/confetti-pop-sound-effect.mp3', x: 4, y: 35, size: 64, floatDelay: '2.8s' },
  { id: 'b9', name: 'keyboard.mp3', tag: 'Bash', audioSrc: '/sounds/keyboard-click.mp3', x: 12, y: 48, size: 68, floatDelay: '2.5s' },
  { id: 'b10', name: 'mario-coin.mp3', tag: 'Compact', audioSrc: '/sounds/mario_coin_sound.mp3', x: 5, y: 64, size: 60, floatDelay: '0.9s' },
  { id: 'b11', name: 'fahhh.mp3', tag: 'Error', audioSrc: '/sounds/fahhhhhhhhhhhhhh.mp3', x: 13, y: 76, size: 64, floatDelay: '1.4s' },

  // Far right periphery
  { id: 'b12', name: 'magic-spell.mp3', tag: 'Tool', audioSrc: '/sounds/magic-reveal-audio.mp3', x: 95, y: 34, size: 64, floatDelay: '0.6s' },
  { id: 'b13', name: 'fairy-sparkle.mp3', tag: 'Skill', audioSrc: '/sounds/fairy-sparkle.mp3', x: 87, y: 48, size: 68, floatDelay: '2.1s' },
  { id: 'b14', name: 'metal-gear.mp3', tag: 'Alert', audioSrc: '/sounds/metal-gear-alert.mp3', x: 95, y: 63, size: 60, floatDelay: '1.4s' },
  { id: 'b15', name: 'doorbell.mp3', tag: 'Prompt', audioSrc: '/sounds/door-bell-sound-effect.mp3', x: 88, y: 75, size: 66, floatDelay: '0.3s' },

  // Bottom peripheral tier
  { id: 'b16', name: 'victory-ding.mp3', tag: 'Complete', audioSrc: '/sounds/ding-sound-effect-1.mp3', x: 6, y: 90, size: 66, floatDelay: '1.8s' },
  { id: 'b17', name: 'gta-passed.mp3', tag: 'Reward', audioSrc: '/sounds/gta-san-andreas-mission-complete.mp3', x: 22, y: 92, size: 60, floatDelay: '0.7s' },
  { id: 'b18', name: 'timer.mp3', tag: 'Ponder', audioSrc: '/sounds/timer.mp3', x: 38, y: 93, size: 68, floatDelay: '2.3s' },
  { id: 'b19', name: 'windows-xp.mp3', tag: 'Classic', audioSrc: '/sounds/windows-xp-startup.mp3', x: 54, y: 93, size: 62, floatDelay: '1.1s' },
  { id: 'b20', name: 'cs-go.mp3', tag: 'Hype', audioSrc: '/sounds/counter-strike-ok-lets-go.mp3', x: 70, y: 92, size: 66, floatDelay: '2.6s' },
  { id: 'b21', name: 'pro-tool.mp3', tag: 'Mutate', audioSrc: '/sounds/pro-tool-call.mp3', x: 86, y: 90, size: 60, floatDelay: '1.5s' },
]

export default function StudioPage() {
  const [bubbles, setBubbles] = useState<SoundBubble[]>(INITIAL_BUBBLES)
  const [activeBubbleId, setActiveBubbleId] = useState<string | null>(null)
  const [activeColor, setActiveColor] = useState<GlowColor | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [packName, setPackName] = useState('custom-claudetones')
  const [isPackDrawerOpen, setIsPackDrawerOpen] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Handle bubble play / pause / glow
  const handleBubbleClick = (bubble: SoundBubble) => {
    if (activeBubbleId === bubble.id) {
      // Toggle off / pause
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setActiveBubbleId(null)
      setActiveColor(null)
      return
    }

    // Pick a random vibrant neon glow color
    const randomColor = GLOW_PALETTE[Math.floor(Math.random() * GLOW_PALETTE.length)]
    setActiveColor(randomColor)
    setActiveBubbleId(bubble.id)

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const sound = new Audio(bubble.audioSrc)
    audioRef.current = sound
    sound.volume = 0.85

    sound.play().catch((err) => {
      console.warn('Audio playback failed:', err)
      setActiveBubbleId(null)
      setActiveColor(null)
    })

    sound.onended = () => {
      setActiveBubbleId(null)
      setActiveColor(null)
    }
  }

  // Handle drag and drop files to spawn new bubbles
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('audio/'))
    if (!files.length) return

    spawnBubblesFromFiles(files, e.clientX, e.clientY)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('audio/'))
    if (!files.length) return
    spawnBubblesFromFiles(files)
  }

  const spawnBubblesFromFiles = (files: File[], clickX?: number, clickY?: number) => {
    const newBubbles: SoundBubble[] = files.map((file, idx) => {
      const url = URL.createObjectURL(file)
      // Delicate size around 60-70px
      const size = Math.floor(Math.random() * 12) + 60

      let x: number
      let y: number

      if (clickX && clickY) {
        x = Math.max(8, Math.min(92, Math.round((clickX / window.innerWidth) * 100) + (idx * 5 - 10)))
        y = Math.max(12, Math.min(88, Math.round((clickY / window.innerHeight) * 100) + (idx * 5 - 10)))
      } else {
        // Spawn randomly along the safe peripheral zone
        x = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 6 : Math.floor(Math.random() * 20) + 74
        y = Math.floor(Math.random() * 70) + 15
      }

      return {
        id: `custom-${Date.now()}-${idx}`,
        name: file.name,
        tag: 'Custom',
        audioSrc: url,
        x,
        y,
        size,
        floatDelay: `${(idx * 0.4).toFixed(1)}s`,
        isCustom: true,
      }
    })

    setBubbles((prev) => [...prev, ...newBubbles])
  }

  // Export custom soundpack zip
  const handleExportZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      const soundsFolder = zip.folder('sounds')

      const manifestEvents: Record<string, string> = {}

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i]
        const cleanName = b.name.replace(/[^a-zA-Z0-9._-]/g, '_')

        try {
          const res = await fetch(b.audioSrc)
          const blob = await res.blob()
          soundsFolder?.file(cleanName, blob)
          manifestEvents[`event_${i + 1}_${b.tag.toLowerCase()}`] = cleanName
        } catch {
          // If remote fetch fails, skip
        }
      }

      // Add pack manifest
      const manifest = {
        name: packName || 'custom-pack',
        version: '1.0.0',
        author: 'claudetones-community',
        description: 'Custom sound pack created in Claudetones Studio',
        events: manifestEvents,
      }

      zip.file('pack.json', JSON.stringify(manifest, null, 2))

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${packName || 'custom-pack'}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to package sound pack. Please try again.')
    } finally {
      setIsExporting(false)
      setIsPackDrawerOpen(false)
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative min-h-screen bg-[#0e0d0c] text-on-surface flex flex-col font-sans overflow-hidden selection:bg-primary-container selection:text-on-primary-container"
    >
      {/* Architectural Background Grid & Ambient Studio Lighting */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-container/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-outline-variant/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />

      {/* ================= HEADER NAVIGATION ================= */}
      <header className="sticky top-0 z-50 w-full bg-[#141210]/90 backdrop-blur-md border-b border-[#2E2B28]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[19px]">graphic_eq</span>
              </div>
              <span className="font-serif text-xl tracking-tight font-medium text-on-surface">
                claudetones
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-primary-container/20 text-primary-container font-semibold border border-primary-container/30">
                Studio
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Home
              </Link>
              <Link
                href="/#claude-desktop-demo"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Interactive App
              </Link>
              <Link
                href="/#soundboard-matrix"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Soundboard
              </Link>
              <Link
                href="/#slash-commands"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Slash Commands
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-mono transition-colors border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-primary-container">upload</span>
              <span>Upload Sounds</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPackDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-xs hover:bg-primary transition-all duration-200 shadow-md font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Export Soundpack</span>
            </button>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed transition-colors border border-outline-variant/30"
              title="GitHub Repository"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Hidden File Input for Bring Your Audio */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ================= CANVAS WITH CENTER HEADLINE & SCATTERED GLASS BUBBLES ================= */}
      <main className="relative flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* CENTER STAGE: SINGLE PROMINENT HEADLINE */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 pointer-events-auto">
          {/* Subtle Studio Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high/60 border border-outline-variant/30 text-tertiary-fixed text-xs font-mono mb-5 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span>Interactive Soundpack Laboratory</span>
            <span className="text-outline">•</span>
            <span className="text-primary-container font-semibold">1,802 Sourced Clips</span>
          </div>

          {/* Exact User Requested Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.18] mb-5">
            Bring your audio and develop sound packs in the{' '}
            <span className="italic text-primary-container font-serif">Claudetones Studio</span>.
          </h1>

          <p className="font-body-md text-body-md sm:text-body-lg text-tertiary max-w-xl mx-auto leading-relaxed mb-8">
            Click any floating glass bubble to audition, pause, and light up in radiant color.
            Drag &amp; drop your own files anywhere to spawn custom bubbles.
          </p>

          {/* Interactive Actions Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3.5 p-2 rounded-2xl bg-[#181615]/80 backdrop-blur-xl border border-outline-variant/25 shadow-2xl">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-sm font-medium hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Custom Audio (+ Spawn Bubble)</span>
            </button>

            {activeBubbleId && (
              <button
                type="button"
                onClick={() => {
                  audioRef.current?.pause()
                  setActiveBubbleId(null)
                  setActiveColor(null)
                }}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-tertiary-fixed hover:bg-surface-bright font-label-md text-sm font-mono border border-outline-variant/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#EC6A5E]">stop_circle</span>
                <span>Stop Playing</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= SCATTERED GLASS EFFECT TRANSPARENT BUBBLES ================= */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {bubbles.map((b) => {
            const isPlaying = activeBubbleId === b.id

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleBubbleClick(b)}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: b.floatDelay,
                  borderColor: isPlaying && activeColor ? activeColor.border : undefined,
                  boxShadow: isPlaying && activeColor
                    ? `0 0 35px ${activeColor.glow}, inset 0 0 15px ${activeColor.glow}`
                    : undefined,
                  backgroundColor: isPlaying && activeColor
                    ? activeColor.bg
                    : undefined,
                }}
                className={`pointer-events-auto absolute rounded-full backdrop-blur-lg border transition-all duration-300 flex flex-col items-center justify-center p-1.5 select-none cursor-pointer group hover:scale-110 active:scale-95 ${
                  isPlaying
                    ? 'scale-115 z-30 ring-2 ring-white/20'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.08] shadow-lg z-10'
                }`}
                title={`Audition ${b.name} (${b.tag})`}
              >
                {/* Active Pulsing Ring */}
                {isPlaying && activeColor && (
                  <span
                    aria-hidden="true"
                    style={{ borderColor: activeColor.border }}
                    className="absolute -inset-1.5 rounded-full border-2 animate-ping opacity-60 pointer-events-none"
                  />
                )}

                {/* Animated Equalizer or Play Icon */}
                <div className="text-on-surface flex items-center justify-center">
                  {isPlaying ? (
                    <span className="inline-flex items-end gap-0.5 h-3 w-3" aria-hidden="true">
                      <span className="w-0.5 bg-current rounded-full animate-eq-1" />
                      <span className="w-0.5 bg-current rounded-full animate-eq-2" />
                      <span className="w-0.5 bg-current rounded-full animate-eq-3" />
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px] text-primary-container group-hover:scale-110 transition-transform">
                      play_circle
                    </span>
                  )}
                </div>

                {/* Sound Name (Compact & delicate) */}
                <div
                  style={{ color: isPlaying && activeColor ? activeColor.text : undefined }}
                  className="font-code text-[9px] font-medium text-tertiary-fixed text-center leading-none truncate max-w-[90%] px-0.5 mt-0.5"
                >
                  {b.name}
                </div>

                {/* Event Category Micro-Tag */}
                <span className="text-[7.5px] font-mono uppercase tracking-wider text-outline group-hover:text-on-surface transition-colors leading-none mt-0.5 scale-90">
                  {b.tag}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      {/* ================= EXPORT SOUNDPACK MODAL / DRAWER ================= */}
      {isPackDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141210] border border-[#2E2B28] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2B28]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">package_2</span>
                <h3 className="font-serif text-lg font-medium text-on-surface">Export Custom Soundpack</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPackDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-tertiary hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-tertiary mb-1.5">Pack Name</label>
                <input
                  type="text"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm font-code focus:outline-none focus:border-primary-container"
                  placeholder="my-custom-pack"
                />
              </div>

              <p className="text-xs text-tertiary leading-relaxed">
                Bundles all active sounds into an offline Claude Code plugin soundpack zip with audio files and manifest ready for immediate installation.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2E2B28]">
              <button
                type="button"
                onClick={() => setIsPackDrawerOpen(false)}
                className="px-4 py-2 rounded-xl text-tertiary hover:text-on-surface text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExportZip}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary font-medium text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>{isExporting ? 'Packaging...' : 'Download .zip'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
