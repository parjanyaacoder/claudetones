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
  size: number // diameter in px
  floatDelay: string // animation delay
  isCustom?: boolean
}

const INITIAL_BUBBLES: SoundBubble[] = [
  // Top quadrant
  { id: 'b1', name: 'launch.wav', tag: 'Boot', audioSrc: '/sounds/launch.wav', x: 8, y: 15, size: 120, floatDelay: '0s' },
  { id: 'b2', name: 'dialup.mp3', tag: 'Search', audioSrc: '/sounds/dialup.mp3', x: 23, y: 12, size: 128, floatDelay: '1.2s' },
  { id: 'b3', name: 'bluetooth.mp3', tag: 'MCP', audioSrc: '/sounds/the-bluetooth-device-its-connected-succesfull.mp3', x: 42, y: 14, size: 135, floatDelay: '2.4s' },
  { id: 'b4', name: 'levelup.mp3', tag: 'Plugin', audioSrc: '/sounds/levelup.mp3', x: 61, y: 12, size: 125, floatDelay: '0.8s' },
  { id: 'b5', name: 'dbz-teleport.mp3', tag: 'Subagent', audioSrc: '/sounds/dbz-teleport.mp3', x: 78, y: 15, size: 130, floatDelay: '1.9s' },
  { id: 'b6', name: 'ring.wav', tag: 'Thinking', audioSrc: '/sounds/ring.wav', x: 91, y: 22, size: 115, floatDelay: '0.4s' },

  // Middle sides
  { id: 'b7', name: 'fahhh.mp3', tag: 'Shock', audioSrc: '/sounds/fahhhhhhhhhhhhhh.mp3', x: 6, y: 38, size: 125, floatDelay: '1.7s' },
  { id: 'b8', name: 'confetti.mp3', tag: 'Commit', audioSrc: '/sounds/confetti-pop-sound-effect.mp3', x: 18, y: 46, size: 120, floatDelay: '2.8s' },
  { id: 'b9', name: 'magic-spell.mp3', tag: 'MCP Tool', audioSrc: '/sounds/magic-reveal-audio.mp3', x: 82, y: 44, size: 130, floatDelay: '0.6s' },
  { id: 'b10', name: 'fairy-sparkle.mp3', tag: 'Skill', audioSrc: '/sounds/fairy-sparkle.mp3', x: 93, y: 50, size: 125, floatDelay: '2.1s' },

  // Lower-middle sides
  { id: 'b11', name: 'mario-coin.mp3', tag: 'Compact', audioSrc: '/sounds/mario_coin_sound.mp3', x: 7, y: 62, size: 125, floatDelay: '0.9s' },
  { id: 'b12', name: 'keyboard.mp3', tag: 'Bash', audioSrc: '/sounds/keyboard-click.mp3', x: 20, y: 72, size: 120, floatDelay: '2.5s' },
  { id: 'b13', name: 'metal-gear.mp3', tag: 'Alert', audioSrc: '/sounds/metal-gear-alert.mp3', x: 80, y: 68, size: 130, floatDelay: '1.4s' },
  { id: 'b14', name: 'doorbell.mp3', tag: 'Permission', audioSrc: '/sounds/door-bell-sound-effect.mp3', x: 92, y: 72, size: 125, floatDelay: '0.3s' },

  // Bottom quadrant
  { id: 'b15', name: 'victory-ding.mp3', tag: 'Complete', audioSrc: '/sounds/ding-sound-effect-1.mp3', x: 12, y: 84, size: 135, floatDelay: '1.8s' },
  { id: 'b16', name: 'gta-passed.mp3', tag: 'Reward', audioSrc: '/sounds/gta-san-andreas-mission-complete.mp3', x: 29, y: 85, size: 130, floatDelay: '0.7s' },
  { id: 'b17', name: 'timer.mp3', tag: 'Ponder', audioSrc: '/sounds/timer.mp3', x: 47, y: 86, size: 115, floatDelay: '2.3s' },
  { id: 'b18', name: 'windows-xp.mp3', tag: 'Nostalgia', audioSrc: '/sounds/windows-xp-startup.mp3', x: 65, y: 85, size: 130, floatDelay: '1.1s' },
  { id: 'b19', name: 'cs-go.mp3', tag: 'Hype', audioSrc: '/sounds/counter-strike-ok-lets-go.mp3', x: 83, y: 86, size: 125, floatDelay: '2.6s' },
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

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleBubbleClick = (bubble: SoundBubble) => {
    // If currently playing this bubble, pause it
    if (activeBubbleId === bubble.id && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setActiveBubbleId(null)
      setActiveColor(null)
      return
    }

    // Stop existing audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // Pick a random vibrant color from palette
    const randomColor = GLOW_PALETTE[Math.floor(Math.random() * GLOW_PALETTE.length)]
    setActiveColor(randomColor)
    setActiveBubbleId(bubble.id)

    const audio = new Audio(bubble.audioSrc)
    audio.volume = 0.7
    audioRef.current = audio

    audio.onended = () => {
      setActiveBubbleId(null)
      setActiveColor(null)
    }

    audio.onerror = () => {
      setActiveBubbleId(null)
      setActiveColor(null)
    }

    audio.play().catch(() => {
      setActiveBubbleId(null)
      setActiveColor(null)
    })
  }

  // Handle bringing your own audio (File upload / drag-and-drop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file)
      const randomColor = GLOW_PALETTE[Math.floor(Math.random() * GLOW_PALETTE.length)]

      // Generate pleasant random scatter coordinates
      const angle = Math.random() * Math.PI * 2
      const distance = 30 + Math.random() * 25 // 30% to 55% from center
      const posX = Math.max(8, Math.min(88, 50 + Math.cos(angle) * distance))
      const posY = Math.max(12, Math.min(88, 50 + Math.sin(angle) * distance))

      const newBubble: SoundBubble = {
        id: `custom-${Date.now()}-${index}`,
        name: file.name,
        tag: 'Uploaded',
        audioSrc: url,
        x: Math.round(posX),
        y: Math.round(posY),
        size: 135,
        floatDelay: `${(Math.random() * 2).toFixed(1)}s`,
        isCustom: true,
      }

      setBubbles((prev) => [newBubble, ...prev])
    })

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Export custom sound pack (.zip)
  const handleExportZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      const soundsFolder = zip.folder('sounds')

      // Include all sound clips currently active in bubbles
      const manifest: Record<string, string> = {}
      for (const b of bubbles.slice(0, 10)) {
        try {
          const resp = await fetch(b.audioSrc)
          const blob = await resp.blob()
          const fileName = b.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          soundsFolder?.file(fileName, blob)
          manifest[b.tag.toLowerCase()] = `sounds/${fileName}`
        } catch {}
      }

      zip.file(
        'package.json',
        JSON.stringify(
          {
            name: packName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            description: 'Custom acoustic soundpack built in Claudetones Studio',
            events: manifest,
          },
          null,
          2
        )
      )

      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `${packName.toLowerCase().replace(/\s+/g, '-')}.zip`
      link.click()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0d0c0a] text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      {/* Subtle Architectural Grid Pattern & Ambient Studio Lights */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_20%,transparent_85%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-primary-container/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-500/5 blur-[160px] pointer-events-none rounded-full" />

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="relative z-40 w-full bg-[#141210]/80 backdrop-blur-md border-b border-[#2E2B28]/60">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[19px]">graphic_eq</span>
              </div>
              <span className="font-serif text-xl tracking-tight font-medium text-on-surface">
                claudetones <span className="font-sans text-xs px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-mono ml-1">Studio</span>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed font-label-md text-xs font-mono border border-outline-variant/30 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-container">upload</span>
              <span>Upload Sounds</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPackDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-xs font-medium transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Soundpack</span>
            </button>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-surface-container text-tertiary hover:text-on-surface transition-colors"
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
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.15] mb-5">
            Bring your audio and develop sound packs in the{' '}
            <span className="italic text-primary-container font-serif">Claudetones Studio</span>.
          </h1>

          <p className="font-body-md text-body-md sm:text-body-lg text-tertiary max-w-xl mx-auto leading-relaxed mb-8">
            Click any floating glass bubble below to audition, pause, and light up in radiant color.
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
                    ? `0 0 50px ${activeColor.glow}, inset 0 0 25px ${activeColor.glow}`
                    : undefined,
                  backgroundColor: isPlaying && activeColor
                    ? activeColor.bg
                    : undefined,
                }}
                className={`pointer-events-auto absolute rounded-full backdrop-blur-xl border transition-all duration-300 flex flex-col items-center justify-center p-3 select-none cursor-pointer group hover:scale-105 active:scale-95 ${
                  isPlaying
                    ? 'scale-110 z-30 ring-4 ring-white/10'
                    : 'bg-white/[0.04] border-white/10 hover:border-white/30 hover:bg-white/[0.08] shadow-2xl z-10'
                }`}
              >
                {/* Active Pulsing Ripple Ring when lit up */}
                {isPlaying && activeColor && (
                  <span
                    aria-hidden="true"
                    style={{ borderColor: activeColor.border }}
                    className="absolute -inset-2 rounded-full border-2 animate-ping opacity-60 pointer-events-none"
                  />
                )}

                {/* Animated Equalizer or Play Icon */}
                <div className="mb-1 text-on-surface">
                  {isPlaying ? (
                    <span className="inline-flex items-end gap-1 h-4 w-4" aria-hidden="true">
                      <span className="w-1 bg-current rounded-full animate-eq-1" />
                      <span className="w-1 bg-current rounded-full animate-eq-2" />
                      <span className="w-1 bg-current rounded-full animate-eq-3" />
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px] text-primary-container group-hover:scale-110 transition-transform">
                      play_circle
                    </span>
                  )}
                </div>

                {/* Sound Name */}
                <div
                  style={{ color: isPlaying && activeColor ? activeColor.text : undefined }}
                  className="font-code text-[11px] font-medium text-tertiary-fixed text-center leading-tight truncate max-w-[90%] px-1"
                >
                  {b.name}
                </div>

                {/* Event Category Tag */}
                <div className="mt-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-outline group-hover:text-on-surface transition-colors">
                    {b.tag}
                  </span>
                </div>
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
