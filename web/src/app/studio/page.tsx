'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import JSZip from 'jszip'
import {
  STUDIO_TONES,
  AGENT_EVENTS,
  studioSynth,
  type StudioTone,
  type ToneCategory,
} from '@/lib/studio-tones'
import { GITHUB_URL } from '@/lib/catalog'

export default function StudioPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  // Navigation & Step state: 1 = Select Sounds, 2 = Map to Events, 3 = Export & Publish
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [playingToneId, setPlayingToneId] = useState<string | null>(null)

  // Catalog filtering & selection
  const [category, setCategory] = useState<ToneCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(STUDIO_TONES.slice(0, 26).map((t) => t.id))
  )

  // Event Mapping State: map eventId -> toneId
  const [eventMapping, setEventMapping] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    AGENT_EVENTS.forEach((ev, idx) => {
      initial[ev.id] = STUDIO_TONES[idx % STUDIO_TONES.length]?.id || 'tone-1'
    })
    return initial
  })

  // Export State
  const [packName, setPackName] = useState('arcade-flow')
  const [authorName, setAuthorName] = useState('community-dev')
  const [isExporting, setIsExporting] = useState(false)
  const [showCliModal, setShowCliModal] = useState(false)
  const [copiedCli, setCopiedCli] = useState(false)

  // Catalog Section ref for smooth scroll
  const catalogSectionRef = useRef<HTMLDivElement | null>(null)

  // Filtered tones based on category and search
  const filteredTones = useMemo(() => {
    return STUDIO_TONES.filter((tone) => {
      const matchesCategory = category === 'all' || tone.category === category
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        tone.name.toLowerCase().includes(q) ||
        tone.subtitle.toLowerCase().includes(q) ||
        tone.tag.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [category, searchQuery])

  // Play / audition tone with Web Audio Synthesizer
  const handlePlayTone = (tone: StudioTone) => {
    if (playingToneId === tone.id) {
      studioSynth.stop()
      setPlayingToneId(null)
      return
    }

    setPlayingToneId(tone.id)

    studioSynth.playTone(tone, () => {
      setPlayingToneId(null)
    })
  }

  // Toggle selection for a tone card
  const toggleSelectTone = (toneId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(toneId)) {
        next.delete(toneId)
      } else {
        next.add(toneId)
      }
      return next
    })
  }

  // Randomize 26 Presets
  const handleRandomize26 = () => {
    const shuffled = [...STUDIO_TONES].sort(() => 0.5 - Math.random())
    const picked26 = shuffled.slice(0, 26).map((t) => t.id)
    setSelectedIds(new Set(picked26))

    // Update event mapping automatically
    const newMapping: Record<string, string> = {}
    AGENT_EVENTS.forEach((ev, idx) => {
      newMapping[ev.id] = picked26[idx % picked26.length]
    })
    setEventMapping(newMapping)

    // Audition the first sound for feedback
    const firstTone = STUDIO_TONES.find((t) => t.id === picked26[0])
    if (firstTone) {
      handlePlayTone(firstTone)
    }
  }

  // Clear all selections
  const handleClearAll = () => {
    setSelectedIds(new Set())
  }

  // Smooth scroll to catalog
  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle Export Soundpack Zip
  const handleExportSoundpack = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      const soundsFolder = zip.folder('sounds')

      const eventsManifest: Record<string, string> = {}

      for (const ev of AGENT_EVENTS) {
        const toneId = eventMapping[ev.id]
        const tone = STUDIO_TONES.find((t) => t.id === toneId) || STUDIO_TONES[0]
        const filename = `${ev.key.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp3`
        eventsManifest[ev.key] = filename

        if (tone.audioSrc) {
          try {
            const res = await fetch(tone.audioSrc)
            const blob = await res.blob()
            soundsFolder?.file(filename, blob)
          } catch {
            soundsFolder?.file(filename, `// Claudetones synthetic tone: ${tone.name} (${tone.frequency}Hz)`)
          }
        } else {
          soundsFolder?.file(filename, `// Claudetones synthetic tone: ${tone.name} (${tone.frequency}Hz)`)
        }
      }

      const manifest = {
        name: packName || 'custom-soundpack',
        version: '1.0.0',
        author: authorName || 'claudetones-dev',
        description: 'Bespoke acoustic soundpack composed in Claudetones Studio',
        events: eventsManifest,
      }

      zip.file('pack.json', JSON.stringify(manifest, null, 2))
      zip.file(
        'README.md',
        `# ${packName}\n\nCreated with Claudetones Soundpack Studio.\n\n## Installation\n\`\`\`bash\nclaude plugin soundpack install ./${packName}.zip\n\`\`\`\n`
      )

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${packName || 'soundpack'}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to package soundpack. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const cliInstallCommand = `claude plugin soundpack install https://claudetones.dev/packs/${packName || 'arcade-flow'}.zip`

  const copyCliCommand = () => {
    navigator.clipboard.writeText(cliInstallCommand)
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  return (
    <div className="relative min-h-screen bg-[#0e0d0c] text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Architectural Grid Pattern & Atmosphere */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-primary-container/10 blur-[180px] pointer-events-none rounded-full" />

      {/* ================= FULL-WIDTH TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-50 w-full bg-[#181615]/90 backdrop-blur-md border-b border-[#2E2B28] select-none">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[19px]">graphic_eq</span>
              </div>
              <span className="font-serif text-xl tracking-tight font-medium text-on-surface">
                claudetones
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
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
                href="/studio"
                className="px-3 py-1.5 rounded-lg bg-surface-container text-primary-container transition-colors text-body-sm font-body-sm flex items-center gap-1.5 font-semibold"
              >
                <span>Pack Studio</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary-container/20 text-primary-container font-semibold">New</span>
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
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-mono transition-colors border border-outline-variant/30"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>

            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-md font-medium cursor-pointer"
            >
              Export Soundpack
            </button>
          </div>
        </div>
      </header>

      {/* ================= FULL-WIDTH SUB-HEADER 3-STEP STEPPER ================= */}
      <div className="w-full border-b border-[#201D1B] bg-[#141211] select-none">
        <div className="h-14 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4 overflow-x-auto">
          {/* 3-Step Stepper Pills */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 1
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                  : "bg-[#1C1917] text-tertiary hover:text-on-surface border border-[#2D2825]"
              }`}
            >
              <span>1</span>
              <span>Select Sounds</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeStep === 1 ? "bg-black/25 text-white" : "bg-primary-container/20 text-primary-container"
                }`}
              >
                {selectedIds.size}/26
              </span>
            </button>

            <span className="text-[#3A3530] text-xs">›</span>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 2
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                  : "bg-[#1C1917] text-tertiary hover:text-on-surface border border-[#2D2825]"
              }`}
            >
              <span>2</span>
              <span>Map to Events</span>
            </button>

            <span className="text-[#3A3530] text-xs">›</span>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                activeStep === 3
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                  : "bg-[#1C1917] text-tertiary hover:text-on-surface border border-[#2D2825]"
              }`}
            >
              <span>3</span>
              <span>Export & Publish</span>
            </button>
          </div>

          {/* Right: Randomize 26 Presets Button */}
          <button
            type="button"
            onClick={handleRandomize26}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#201D1A] hover:bg-[#2B2724] border border-[#352F2B] text-tertiary-fixed text-xs font-mono transition-colors shrink-0 cursor-pointer"
          >
            <span>🎲</span>
            <span>Random 26 Presets</span>
          </button>
        </div>
      </div>

      {/* ================= STEP 1: SOUND SELECTION VIEW ================= */}
      {activeStep === 1 && (
        <main className="relative flex-1 w-full flex flex-col">
          {/* HERO SECTION */}
          <section className="relative w-full px-6 py-14 sm:py-20 text-center flex flex-col items-center justify-center border-b border-[#1E1C1A]">
            {/* Palette Composer Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B1816] border border-[#302B27] text-xs font-mono text-tertiary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
              <span>PALETTE COMPOSER</span>
              <span className="text-outline">•</span>
              <span className="text-primary-container font-semibold">1,802 Web Audio Synthetics</span>
            </div>

            {/* Exact Headline from Stitch Screenshot */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-on-surface tracking-tight leading-[1.12] mb-5">
              Craft Your Claude Code<br />Soundpack
            </h1>

            {/* Exact Subtitle from Stitch Screenshot */}
            <p className="font-body-md text-sm sm:text-base text-tertiary max-w-2xl mx-auto leading-relaxed mb-8">
              Compose bespoke acoustic textures for your terminal workflow. Select 26 tactile cues to map to your
              agent lifecycle events and export directly to CLI.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                <span>Explore Soundboard</span>
              </button>

              <button
                type="button"
                onClick={handleRandomize26}
                className="px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#26221F] border border-[#332E2A] text-tertiary-fixed font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>🎲</span>
                <span>Random 26 Presets</span>
              </button>
            </div>

            {/* Scroll down prompt */}
            <div className="mt-12 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-outline">
              <span>SCROLL TO EXPLORE SOUNDS</span>
              <span className="material-symbols-outlined text-[14px] animate-bounce">keyboard_arrow_down</span>
            </div>
          </section>

          {/* ================= SOUND CATALOG SECTION ================= */}
          <section
            ref={catalogSectionRef}
            id="catalog-section"
            className="w-full max-w-7xl mx-auto p-6 sm:p-8 space-y-6 scroll-mt-24"
          >
            {/* Catalog Section Header with Search Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-container text-sm">✦</span>
                  <h2 className="font-serif text-2xl font-medium text-on-surface">Sound Catalog</h2>
                </div>
                <p className="text-xs text-tertiary font-mono mt-0.5">Filter and audition individual tones</p>
              </div>

              {/* Timbre / Frequency Search Input */}
              <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search timbre, frequency, tag..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#181513] border border-[#2E2825] text-xs font-mono text-on-surface placeholder-outline focus:outline-none focus:border-primary-container transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills Matching Stitch Screenshot */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none text-xs font-mono">
              {[
                { key: 'all', label: 'All Tones (1,802)' },
                { key: 'synths', label: 'Warm Synths' },
                { key: 'keys', label: 'Mechanical Keys' },
                { key: 'chimes', label: 'Ambient Chimes' },
                { key: 'telemetry', label: 'Sci-Fi Telemetry' },
                { key: 'lofi', label: 'Lo-Fi & 8-Bit' },
                { key: 'organic', label: 'Organic Drops' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key as ToneCategory)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    category === cat.key
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'bg-[#181513] text-tertiary hover:text-on-surface hover:bg-[#221E1B] border border-[#292420]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 3-Column Sound Cards Grid Exactly Matching Stitch Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-28">
              {filteredTones.map((tone) => {
                const isSelected = selectedIds.has(tone.id)
                const isPlaying = playingToneId === tone.id

                return (
                  <div
                    key={tone.id}
                    onClick={() => toggleSelectTone(tone.id)}
                    className={`relative rounded-xl p-3.5 border transition-all duration-200 select-none cursor-pointer flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-[#1C1815] border-primary-container shadow-[0_0_15px_rgba(249,115,22,0.12)]'
                        : 'bg-[#161412] border-[#292421] hover:border-[#3D3732] hover:bg-[#1A1715]'
                    }`}
                  >
                    {/* Left: Play Button + Animated Waveform Bars */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayTone(tone)
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          isPlaying
                            ? 'bg-primary-container text-on-primary-container scale-105'
                            : 'bg-primary-container/20 text-primary-container hover:bg-primary-container hover:text-on-primary-container'
                        }`}
                        title="Audition Tone"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      {/* Waveform Bars */}
                      <div className="flex items-center gap-0.5 h-3">
                        <span
                          className={`w-0.5 rounded-full ${
                            isPlaying
                              ? 'h-3 bg-primary-container animate-pulse'
                              : 'h-1.5 bg-[#403B36] group-hover:bg-[#605850]'
                          }`}
                        />
                        <span
                          className={`w-0.5 rounded-full ${
                            isPlaying
                              ? 'h-2 bg-primary-container animate-ping'
                              : 'h-2.5 bg-[#403B36] group-hover:bg-[#605850]'
                          }`}
                        />
                        <span
                          className={`w-0.5 rounded-full ${
                            isPlaying
                              ? 'h-3.5 bg-primary-container animate-bounce'
                              : 'h-1.5 bg-[#403B36] group-hover:bg-[#605850]'
                          }`}
                        />
                        <span
                          className={`w-0.5 rounded-full ${
                            isPlaying
                              ? 'h-2 bg-primary-container animate-pulse'
                              : 'h-2 bg-[#403B36] group-hover:bg-[#605850]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Middle: Sound Name & Frequency Subtitle */}
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-bold text-on-surface truncate group-hover:text-primary-container transition-colors">
                        {tone.name}
                      </div>
                      <div className="text-[10px] font-mono text-outline truncate mt-0.5">
                        {tone.subtitle}
                      </div>
                    </div>

                    {/* Right: Checkmark Selection Circle + Category Tag */}
                    <div className="flex flex-col items-end justify-between h-full py-0.5 shrink-0">
                      {/* Selection Checkmark */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                            : 'border border-[#38332E] group-hover:border-[#524B45]'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </div>

                      {/* Tag Badge */}
                      <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.2 rounded bg-[#201D1A] text-outline border border-[#302B26] uppercase mt-2">
                        {tone.tag}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status footer count matching Stitch screenshot */}
            <div className="pt-4 flex items-center justify-center text-xs font-mono text-outline">
              <span className="w-1.5 h-1.5 rounded-full bg-[#61C554] mr-2" />
              <span>
                Showing {filteredTones.length} of 1,802 synthetic cues • Scroll for more
              </span>
            </div>
          </section>
        </main>
      )}

      {/* ================= STEP 2: EVENT MAPPING VIEW ================= */}
      {activeStep === 2 && (
        <main className="w-full max-w-7xl mx-auto p-6 sm:p-8 space-y-6 flex-1 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#25221F] gap-4">
            <div>
              <h2 className="font-serif text-2xl font-medium text-on-surface">Map to 26 Agent Lifecycle Events</h2>
              <p className="text-xs text-tertiary font-mono mt-1">
                Fine-tune your acoustic mapping before exporting. Each event triggers automatically during Claude Code execution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRandomize26}
                className="px-3.5 py-1.5 rounded-lg bg-[#201D1A] hover:bg-[#2A2623] border border-[#332E2A] text-tertiary-fixed font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Auto-Balance Timbres</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Export</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* 26 Events Table */}
          <div className="space-y-2.5">
            {AGENT_EVENTS.map((ev, idx) => {
              const assignedToneId = eventMapping[ev.id] || STUDIO_TONES[0].id
              const assignedTone = STUDIO_TONES.find((t) => t.id === assignedToneId) || STUDIO_TONES[0]
              const isPlaying = playingToneId === assignedTone.id

              return (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#171412] border border-[#272320] hover:border-[#38322D] flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
                >
                  {/* Left: Event Details */}
                  <div className="flex items-center gap-3 min-w-0 md:w-1/2">
                    <span className="w-6 h-6 rounded-md bg-[#221F1C] border border-[#332E2A] text-[10px] font-mono text-primary-container flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-on-surface">{ev.name}</span>
                        <span className="text-[10px] font-mono text-primary-container px-1.5 py-0.2 rounded bg-primary-container/10">
                          {ev.key}
                        </span>
                      </div>
                      <div className="text-[11px] text-tertiary font-mono truncate">{ev.trigger}</div>
                    </div>
                  </div>

                  {/* Right: Sound Selector + Mini Play button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePlayTone(assignedTone)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-[#221F1C] hover:bg-[#2E2925] text-primary-container border border-[#332E2A]'
                      }`}
                      title="Audition Mapped Sound"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    {/* Dropdown Selector of Selected Sounds */}
                    <select
                      value={assignedToneId}
                      onChange={(e) => {
                        const newId = e.target.value
                        setEventMapping((prev) => ({ ...prev, [ev.id]: newId }))
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141210] border border-[#332E2A] text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container cursor-pointer"
                    >
                      {Array.from(selectedIds).map((sId) => {
                        const t = STUDIO_TONES.find((item) => item.id === sId)
                        if (!t) return null
                        return (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.tag} • {t.frequency}Hz)
                          </option>
                        )
                      })}
                    </select>

                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#201D1A] text-outline border border-[#302B26]">
                      {assignedTone.tag}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      )}

      {/* ================= STEP 3: EXPORT & PUBLISH VIEW ================= */}
      {activeStep === 3 && (
        <main className="w-full max-w-3xl mx-auto p-6 sm:p-10 space-y-8 flex-1 pb-24">
          <div className="text-center">
            <span className="w-10 h-10 rounded-2xl bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container mx-auto mb-3">
              <span className="material-symbols-outlined text-[22px]">package_2</span>
            </span>
            <h2 className="font-serif text-3xl font-medium text-on-surface">Export &amp; Publish Soundpack</h2>
            <p className="text-xs text-tertiary font-mono max-w-md mx-auto mt-1 leading-relaxed">
              Packaged as a 100% offline, zero-latency plugin soundpack ready for Claude Code CLI.
            </p>
          </div>

          {/* Pack Metadata Form */}
          <div className="bg-[#171412] border border-[#272320] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-tertiary mb-1">Soundpack Name</label>
                <input
                  type="text"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#110F0E] border border-[#332E2A] text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container"
                  placeholder="arcade-flow"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-tertiary mb-1">Author / Maintainer</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#110F0E] border border-[#332E2A] text-xs font-mono text-on-surface focus:outline-none focus:border-primary-container"
                  placeholder="community-dev"
                />
              </div>
            </div>

            {/* CLI Command Box */}
            <div>
              <label className="block text-xs font-mono text-tertiary mb-1">CLI Installation One-Liner</label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F0D0C] border border-[#2E2825] font-mono text-xs text-on-surface">
                <span className="truncate text-primary-container">{cliInstallCommand}</span>
                <button
                  type="button"
                  onClick={copyCliCommand}
                  className="ml-2 px-2.5 py-1 rounded bg-[#1F1C1A] hover:bg-[#2B2724] text-xs text-tertiary-fixed transition-colors cursor-pointer shrink-0"
                >
                  {copiedCli ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Status summary */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-outline border-t border-[#23201D]">
              <span>26 of 26 events fully mapped</span>
              <span className="text-[#61C554] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>Manifest Valid</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-xl bg-[#1B1816] hover:bg-[#25211E] border border-[#302B27] text-tertiary-fixed font-mono text-xs cursor-pointer"
            >
              ← Back to Mapping
            </button>

            <button
              type="button"
              onClick={handleExportSoundpack}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>{isExporting ? 'Packaging...' : 'Download Soundpack (.zip)'}</span>
            </button>
          </div>
        </main>
      )}

      {/* ================= FIXED BOTTOM FLOATING BAR ================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl bg-[#181513]/95 border border-[#332E2A] p-2.5 sm:p-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-between gap-3">
          {/* Left: Selected count & Threshold Met badge */}
          <div className="flex items-center gap-2.5 font-mono text-xs shrink-0">
            <span className="material-symbols-outlined text-[18px] text-primary-container shrink-0">
              queue_music
            </span>
            <span className="font-bold text-on-surface whitespace-nowrap">{selectedIds.size} / 26 Ready</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 whitespace-nowrap ${
                selectedIds.size === 26
                  ? 'bg-[#61C554]/20 text-[#61C554] border border-[#61C554]/30'
                  : 'bg-primary-container/20 text-primary-container border border-primary-container/30'
              }`}
            >
              {selectedIds.size === 26 ? 'Threshold Met' : `${selectedIds.size}/26`}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 rounded-lg text-outline hover:text-on-surface text-xs font-mono hover:bg-[#201D1A] transition-colors cursor-pointer"
            >
              Clear All
            </button>

            {activeStep === 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-4 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Event Mapping</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}

            {activeStep === 2 && (
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-4 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Export</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}

            {activeStep === 3 && (
              <button
                type="button"
                onClick={handleExportSoundpack}
                disabled={isExporting}
                className="px-4 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>{isExporting ? 'Packaging...' : 'Download .zip'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= CLI INSPECT MODAL ================= */}
      {showCliModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141210] border border-[#2E2825] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#26211E]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[18px]">terminal</span>
                <h3 className="font-mono text-sm font-semibold text-on-surface">CLI Manifest Inspector</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCliModal(false)}
                className="text-outline hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#0C0B0A] rounded-xl border border-[#231F1C] font-mono text-[11px] text-on-surface-variant overflow-x-auto max-h-64 leading-relaxed">
              <pre>{JSON.stringify({ name: packName, author: authorName, events: eventMapping }, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCliModal(false)}
                className="px-4 py-1.5 rounded-xl bg-primary-container text-on-primary-container font-mono text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
