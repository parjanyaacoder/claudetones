'use client'

import React, { useState, useEffect, useRef } from 'react'
import { audioEngine, useAudioState, type SoundType } from '@/lib/audio'

type Stage = {
  id: number
  title: string
  subtitle: string
  soundCue: string
  soundType: SoundType
  dockText: string
  tokenDisplay: string
}

const STAGES: Stage[] = [
  {
    id: 0,
    title: '1. Prompt Dispatched',
    subtitle: 'session.start',
    soundCue: 'launch.wav',
    soundType: 'boot',
    dockText: 'session.start: prompt sent to Claude Code backend',
    tokenDisplay: 'Prompt input parsed • 0.08s',
  },
  {
    id: 1,
    title: '2. Reasoning & Planning',
    subtitle: 'turn.start',
    soundCue: 'ring.wav',
    soundType: 'tick',
    dockText: 'turn.start: AST synthesis & dependency analysis...',
    tokenDisplay: 'Generating plan • 1.2s',
  },
  {
    id: 2,
    title: '3. Deep Pondering',
    subtitle: 'turn.start > 8s',
    soundCue: 'timer.mp3',
    soundType: 'ponder',
    dockText: 'Extended architecture reasoning in progress...',
    tokenDisplay: '3,412 tokens • 14.2s (Deep thinking)',
  },
  {
    id: 3,
    title: '4. Tool Call (Bash)',
    subtitle: 'tool.call: Bash',
    soundCue: 'keyboard-click.mp3',
    soundType: 'click',
    dockText: 'tool.call: Bash running baseline tests...',
    tokenDisplay: 'Subprocess cargo test active',
  },
  {
    id: 4,
    title: '5. File Mutation (Edit)',
    subtitle: 'tool.call: Edit',
    soundCue: 'pro-tool-call.mp3',
    soundType: 'pip',
    dockText: 'tool.call: Edit wrote +18 lines into ProductCard.tsx',
    tokenDisplay: 'Disk patch atomic commit',
  },
  {
    id: 5,
    title: '6. Victory Fanfare',
    subtitle: 'turn.complete',
    soundCue: 'ding-sound-effect-1.mp3',
    soundType: 'fanfare',
    dockText: 'turn.complete: 5 tasks verified. Latency 0.12ms.',
    tokenDisplay: 'All targets verified (0.12ms)',
  },
]

export default function DesktopSimulation() {
  const { activeId, isPlaying, isPaused } = useAudioState()
  const [currentStage, setCurrentStage] = useState(0)
  const [isAutoLooping, setIsAutoLooping] = useState(true)
  const [view, setView] = useState<'desktop' | 'terminal'>('desktop')
  const autoLoopRef = useRef<NodeJS.Timeout | null>(null)

  const advanceStage = (sound = true) => {
    setCurrentStage((prev) => {
      const next = (prev + 1) % STAGES.length
      if (sound) {
        audioEngine.play(`sim-stage-${next}`, STAGES[next].soundType)
      }
      return next
    })
  }

  const jumpToStage = (idx: number) => {
    setCurrentStage(idx)
    audioEngine.play(`sim-stage-${idx}`, STAGES[idx].soundType)
  }

  const replayTurn = () => {
    setCurrentStage(0)
    audioEngine.play('sim-stage-0', 'boot')
  }

  const toggleAutoLoop = () => {
    setIsAutoLooping((prev) => !prev)
  }

  useEffect(() => {
    if (isAutoLooping) {
      autoLoopRef.current = setInterval(() => {
        advanceStage(true)
      }, 3400)
    } else {
      if (autoLoopRef.current) clearInterval(autoLoopRef.current)
    }
    return () => {
      if (autoLoopRef.current) clearInterval(autoLoopRef.current)
    }
  }, [isAutoLooping])

  const stage = STAGES[currentStage]

  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      id="claude-desktop-demo"
    >
      {/* Title & Compact Header */}
      <div className="flex flex-col items-center mb-6 text-center shrink-0">
        <div className="inline-flex items-center gap-2 text-primary-container font-label-sm text-[11px] uppercase tracking-widest mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
          <span>Living Desktop Environment Simulation</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Claude Code in Live Audio Flow</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl mt-1 leading-relaxed">
          Tactile audio feedback choreographed synchronously with every Claude Code agent event.
        </p>

        {/* Small & Sleek View Toggle */}
        <div className="mt-4 inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-md gap-1">
          <button
            type="button"
            onClick={() => setView('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 cursor-pointer ${
              view === 'desktop'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-tertiary hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
            <span>Desktop GUI</span>
          </button>
          <button
            type="button"
            onClick={() => setView('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 cursor-pointer ${
              view === 'terminal'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-tertiary hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>Terminal CLI</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Layout: Vertical Stages Stepper (Left) + Balanced Window (Right) */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center max-w-6xl mx-auto w-full">
        {/* ================= VERTICAL STAGES STEPPER ================= */}
        <div className="w-full lg:w-72 shrink-0 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 shadow-xl flex flex-col justify-between h-[660px]">
          <div>
            {/* Header with Auto-play & Replay Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-wider text-tertiary-fixed font-semibold">
                  Event Sequence
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleAutoLoop}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer font-medium ${
                    isAutoLooping
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container text-tertiary-fixed hover:bg-surface-bright'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isAutoLooping ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isAutoLooping ? 'Auto' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={replayTurn}
                  className="p-1 rounded-lg bg-surface-container text-tertiary-fixed hover:bg-surface-bright transition-colors cursor-pointer border border-outline-variant/20"
                  title="Replay Turn"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary-container">replay</span>
                </button>
              </div>
            </div>

            {/* Vertical Connected Step Cards */}
            <div className="space-y-2 mt-3.5">
              {STAGES.map((s, idx) => {
                const isActive = idx === currentStage
                const isPast = idx < currentStage

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => jumpToStage(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 border flex items-center justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-primary-container/15 border-primary-container/40 text-on-surface shadow-sm ring-1 ring-primary-container/30'
                        : isPast
                        ? 'bg-surface-container/50 border-transparent text-[#61C554] hover:bg-surface-container'
                        : 'bg-surface-container/20 border-transparent text-tertiary hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-primary-container ring-2 ring-primary-container/40 animate-pulse'
                            : isPast
                            ? 'bg-[#61C554]'
                            : 'bg-outline'
                        }`}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate leading-tight">
                          {s.title}
                        </div>
                        <div className="text-[10px] font-mono text-outline truncate mt-0.5">
                          {s.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono text-primary-container px-1.5 py-0.5 rounded bg-primary-container/10">
                        {s.soundCue}
                      </span>
                      {isActive && (
                        <span className="material-symbols-outlined text-[13px] text-primary-container animate-pulse">
                          graphic_eq
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Audio Cue Card at Bottom with Interactive Play/Pause & Stop Controls */}
          {(() => {
            const isStageActive = activeId === `sim-stage-${currentStage}`
            const isStagePlaying = isStageActive && isPlaying
            const isStagePaused = isStageActive && isPaused

            return (
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[15px] text-primary-container">headphones</span>
                  <span className="text-outline text-[11px] hidden sm:inline">Audio:</span>
                  <span className="text-primary-container font-semibold text-[11px] truncate">
                    {stage.soundCue}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.toggle(`sim-stage-${currentStage}`, stage.soundType)
                    }}
                    className={`p-1.5 rounded-lg text-[11px] transition-all flex items-center gap-1 cursor-pointer font-medium ${
                      isStagePlaying
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : isStagePaused
                        ? 'bg-surface-container-high text-primary-container border border-primary-container/40'
                        : 'bg-surface-container-high text-tertiary-fixed hover:bg-surface-bright'
                    }`}
                    title={isStagePlaying ? 'Pause Audio' : isStagePaused ? 'Resume Audio' : 'Play Stage Audio'}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isStagePlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.stopAll()
                    }}
                    className="p-1.5 rounded-lg bg-surface-container-high text-outline hover:text-error hover:bg-surface-bright transition-colors cursor-pointer"
                    title="Stop Audio"
                  >
                    <span className="material-symbols-outlined text-[14px]">stop</span>
                  </button>
                </div>
              </div>
            )
          })()}
        </div>

        {/* ================= CLAUDE CODE DESKTOP WINDOW (EXACT REPLICA) ================= */}
        <div className="w-full flex-1 min-w-0">
          {view === 'desktop' && (
            <div className="relative w-full rounded-2xl bg-[#131316] border border-[#27272a] shadow-2xl overflow-hidden transition-all duration-300 h-[660px] flex flex-col justify-between border-beam-glow">
              {/* Dynamic Acoustic Ripple Overlay on Sound Cue */}
              <div className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 flex items-center justify-center overflow-hidden audio-ripple-target opacity-0">
                <div className="w-64 h-64 rounded-full border-2 border-primary-container/60 bg-primary-container/10 blur-[2px] animate-ripple"></div>
              </div>

              {/* Titlebar Header - Replicating Image 1 */}
              <div className="h-10 bg-[#19191d] px-3.5 flex items-center justify-between border-b border-[#27272a] select-none z-20 relative shrink-0">
                <div className="flex items-center gap-3">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#EC6A5E] inline-block shadow-sm"></span>
                    <span className="w-3 h-3 rounded-full bg-[#F5BF4F] inline-block shadow-sm"></span>
                    <span className="w-3 h-3 rounded-full bg-[#61C554] inline-block shadow-sm"></span>
                  </div>

                  {/* Window Navigation Icons */}
                  <div className="flex items-center gap-1 text-[#8e8e93] text-xs">
                    <span className="p-1 hover:text-white cursor-pointer" title="Toggle Sidebar">
                      <span className="material-symbols-outlined text-[14px]">left_panel_close</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Back">
                      <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Forward">
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Search">
                      <span className="material-symbols-outlined text-[14px]">search</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Code">
                      <span className="material-symbols-outlined text-[14px]">code</span>
                    </span>
                  </div>
                </div>

                {/* Centered Active Task Selector Dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-[#f4f4f5] font-medium px-2.5 py-1 rounded-md hover:bg-[#27272a] cursor-pointer">
                  <span className="truncate max-w-[180px] sm:max-w-none">Fix product grid layout shift</span>
                  <span className="material-symbols-outlined text-[14px] text-[#8e8e93]">expand_more</span>
                </div>

                {/* Right Window Utilities & Live Audio Status */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 text-[#8e8e93]">
                    <span className="p-1 hover:text-white cursor-pointer" title="Right Panel">
                      <span className="material-symbols-outlined text-[14px]">right_panel_close</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Next">
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="New Session">
                      <span className="material-symbols-outlined text-[14px]">add_box</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Web Preview">
                      <span className="material-symbols-outlined text-[14px]">public</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="Folder">
                      <span className="material-symbols-outlined text-[14px]">folder</span>
                    </span>
                    <span className="p-1 hover:text-white cursor-pointer" title="More Options">
                      <span className="material-symbols-outlined text-[14px]">more_horiz</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#252529] px-2.5 py-0.5 rounded-full border border-primary-container/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#61C554] animate-pulse"></span>
                    <span className="text-[10px] font-mono text-tertiary-fixed font-medium">claudetones active</span>
                  </div>
                </div>
              </div>

              {/* Main Body: Authentic Claude Code Sidebar + Roomy Main View */}
              <div className="flex-1 flex overflow-hidden bg-[#131316]">
                {/* Left Sidebar - Replicating Image 1 */}
                <aside className="hidden md:flex w-56 shrink-0 bg-[#18181c] border-r border-[#26262b] flex-col justify-between p-3.5 select-none text-xs font-sans">
                  <div className="space-y-4 overflow-y-auto">
                    {/* Needs input */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-[#71717a] px-2 py-0.5">Needs input</div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#d4d4d8] hover:bg-[#252529] cursor-pointer group">
                        <span className="truncate">Rotate staging certificates</span>
                        <span className="material-symbols-outlined text-[14px] text-amber-500 shrink-0">warning</span>
                      </div>
                    </div>

                    {/* Working */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-[#71717a] px-2 py-0.5">Working</div>
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#27272a] text-[#ffffff] font-medium cursor-pointer shadow-sm">
                        <span className="truncate">Fix product grid layout shift</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-[#a1a1aa] hover:bg-[#252529] hover:text-[#d4d4d8] cursor-pointer truncate">
                        Label checkout form fields
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-[#a1a1aa] hover:bg-[#252529] hover:text-[#d4d4d8] cursor-pointer truncate">
                        Retry failed webhook delivery
                      </div>
                    </div>

                    {/* Completed */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-medium text-[#71717a] px-2 py-0.5">Completed</div>
                      <div className="flex items-center justify-between px-2.5 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                        <span className="truncate">Lazy-load product images</span>
                        <span className="material-symbols-outlined text-[13px] text-[#71717a]">laptop_mac</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                        <span className="truncate">Upgrade the Stripe SDK</span>
                        <span className="material-symbols-outlined text-[13px] text-[#71717a]">cloud</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                        <span className="truncate">Add dark mode color tokens</span>
                        <span className="material-symbols-outlined text-[13px] text-[#71717a]">laptop_mac</span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                        <span className="truncate">Fix flaky checkout tests</span>
                        <span className="material-symbols-outlined text-[13px] text-[#71717a]">cloud</span>
                      </div>
                      <div className="px-2.5 py-1 text-[11px] text-[#71717a] hover:text-[#a1a1aa] cursor-pointer">
                        Show more
                      </div>
                    </div>
                  </div>

                  {/* Profile & Notification Bar - Replicating Image 1 */}
                  <div className="pt-2.5 border-t border-[#26262b] flex items-center justify-between text-[#a1a1aa]">
                    <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                      <span className="w-5 h-5 rounded-full bg-[#3f3f46] inline-flex items-center justify-center text-[11px] text-white font-medium">
                        L
                      </span>
                      <span className="font-medium text-xs">Lydia · Max</span>
                      <span className="material-symbols-outlined text-[13px]">expand_more</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] hover:text-white cursor-pointer">search</span>
                      <span className="material-symbols-outlined text-[14px] hover:text-white cursor-pointer">notifications</span>
                    </div>
                  </div>
                </aside>

                {/* Right Chat & Task Flow (Spacious, exact to Image 1) */}
                <main className="flex-1 flex flex-col justify-between bg-[#131316] p-6 sm:p-7 overflow-hidden min-w-0">
                  <div className="space-y-4 overflow-y-auto pr-1">
                    {/* User Prompt Bubble (Deep Royal Blue pill in Image 1) */}
                    <div className="flex justify-end">
                      <div className="bg-[#1d4ed8] text-white px-5 py-3 rounded-2xl text-[13px] font-normal shadow-md max-w-[80%] leading-relaxed">
                        Fix the layout shift on the product grid
                      </div>
                    </div>

                    {/* Claude Explanation Card (Stage 1+) */}
                    {currentStage >= 1 && (
                      <div className="flex justify-start">
                        <div className="bg-[#1f1f23] border border-[#2b2b31] text-[#e4e4e7] p-4 rounded-2xl text-[13px] leading-relaxed max-w-[92%] shadow-sm transition-all duration-300">
                          The grid shifts because product images load without a width and height. I&apos;ll add dimensions in
                          ProductCard, then reserve space in the grid with an aspect-ratio fallback.
                        </div>
                      </div>
                    )}

                    {/* Task Checklist Card (Exact replicate of Image 1) */}
                    {currentStage >= 2 && (
                      <div className="rounded-2xl bg-[#19191d] border border-[#2d2d34] p-4 text-xs space-y-3 max-w-[92%] shadow-sm transition-all duration-300">
                        {/* Checklist items */}
                        <div className="space-y-2.5 font-sans">
                          {/* Item 1 */}
                          <div className="flex items-center gap-2.5 text-[#e4e4e7]">
                            <span className="material-symbols-outlined text-[16px] text-[#61C554]">
                              {currentStage >= 3 ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className={currentStage >= 3 ? 'text-[#8e8e93]' : 'font-medium'}>
                              Reproduce the shift, run baseline tests
                            </span>
                          </div>

                          {/* Item 2 */}
                          <div className="flex items-center gap-2.5 text-[#e4e4e7]">
                            <span className="material-symbols-outlined text-[16px] text-primary-container">
                              {currentStage >= 4 ? 'check_circle' : currentStage === 3 ? 'pending' : 'radio_button_unchecked'}
                            </span>
                            <span className={currentStage >= 4 ? 'text-[#8e8e93]' : ''}>
                              Add image dimensions to ProductCard
                            </span>
                          </div>

                          {/* Item 3 */}
                          <div className="flex items-center gap-2.5 text-[#a1a1aa]">
                            <span className="text-[14px] text-[#71717a] font-mono leading-none select-none">
                              {currentStage >= 5 ? '✔' : '◌'}
                            </span>
                            <span>Reserve space with an aspect-ratio fallback</span>
                          </div>

                          {/* Item 4 */}
                          <div className="flex items-center gap-2.5 text-[#a1a1aa]">
                            <span className="text-[14px] text-[#71717a] font-mono leading-none select-none">
                              {currentStage >= 5 ? '✔' : '◌'}
                            </span>
                            <span>Check the product grid in the preview</span>
                          </div>

                          {/* Item 5 */}
                          <div className="flex items-center gap-2.5 text-[#a1a1aa]">
                            <span className="text-[14px] text-[#71717a] font-mono leading-none select-none">
                              {currentStage >= 5 ? '✔' : '◌'}
                            </span>
                            <span>Add a layout shift test, final run</span>
                          </div>
                        </div>

                        {/* Status Progress Indicator Pill - Image 1 */}
                        <div className="pt-2.5 border-t border-[#2b2b31] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-primary-container font-mono text-[11px]">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
                            <span>
                              {currentStage === 2
                                ? 'Analyzing AST layout shift geometry 14.2s'
                                : currentStage === 3
                                ? 'Running baseline tests: cargo test --lib'
                                : currentStage === 4
                                ? 'Editing ProductCard.tsx 18s'
                                : 'All 5 tasks verified • Ready for commit'}
                            </span>
                            <span className="text-[12px]">▶</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-high text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">graphic_eq</span>
                            <span>
                              {currentStage === 2
                                ? 'timer.mp3'
                                : currentStage === 3
                                ? 'keyboard-click.mp3'
                                : currentStage === 4
                                ? 'pro-tool-call.mp3'
                                : 'ding-sound-effect-1.mp3'}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Input Composer and Status Bar - Replicating Image 1 */}
                  <div className="space-y-2 pt-3">
                    <div className="bg-[#1b1b1f] border border-[#2b2b31] rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-inner">
                      <div className="flex items-center gap-3 text-[#71717a]">
                        <button
                          type="button"
                          className="w-5 h-5 rounded-md bg-[#27272a] hover:bg-[#323238] text-[#d4d4d8] flex items-center justify-center transition-colors cursor-pointer"
                          title="Attach file"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                        <span className="text-[12px] text-[#71717a] font-normal select-none">
                          ↵ to send, ⌘↵ to queue for later
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[#71717a]">
                        <span
                          className="w-4 h-4 rounded-sm bg-white hover:bg-neutral-200 cursor-pointer inline-block"
                          title="Stop Generation"
                        />
                        <span
                          className="material-symbols-outlined text-[17px] hover:text-white cursor-pointer"
                          title="Voice Input"
                        >
                          mic
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#71717a] px-1 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="hover:text-white cursor-pointer">Auto</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hover:text-white cursor-pointer">Opus 5.5 · Fast Medium ⌵</span>
                        <span
                          className="material-symbols-outlined text-[14px] text-primary-container cursor-pointer"
                          title="Acoustic Engine Live"
                        >
                          volume_up
                        </span>
                        <span
                          className="material-symbols-outlined text-[14px] hover:text-white cursor-pointer"
                          title="Settings"
                        >
                          settings
                        </span>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          )}

          {/* ================= TERMINAL CLI VIEW ================= */}
          {view === 'terminal' && (
            <div className="relative w-full rounded-2xl bg-[#141210] border border-[#38332f] shadow-2xl overflow-hidden transition-all duration-300 h-[660px] flex flex-col justify-between border-beam-glow">
              {/* Dynamic Acoustic Ripple Overlay on Sound Cue */}
              <div className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 flex items-center justify-center overflow-hidden audio-ripple-target opacity-0">
                <div className="w-64 h-64 rounded-full border-2 border-primary-container/60 bg-primary-container/10 blur-[2px] animate-ripple"></div>
              </div>

              {/* Titlebar Header */}
              <div className="h-10 bg-[#181615] px-4 flex items-center justify-between border-b border-[#2d2825] select-none z-20 relative font-code text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EC6A5E] inline-block shadow-sm"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F] inline-block shadow-sm"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#61C554] inline-block shadow-sm"></span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-mono">
                    <span className="text-tertiary-fixed font-semibold">claude — claude-code — session_092</span>
                    <span className="text-outline font-normal hidden sm:inline">(~/projects/layout-shift)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#1f1a18] px-2.5 py-0.5 rounded-full border border-primary-container/30 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#61C554] animate-pulse"></span>
                  <span className="text-[10px] font-mono text-tertiary-fixed font-medium">claudetones active</span>
                  <span className="text-outline font-mono text-[9px]">• CoreAudio 0.12ms</span>
                </div>
              </div>

              {/* Terminal Viewport */}
              <div className="flex-1 p-5 bg-[#110f0e] font-code text-xs text-on-surface overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Session Info */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#26221f] text-tertiary">
                    <div className="flex items-center gap-2">
                      <span className="text-primary-container font-mono text-xs font-bold">[CLAUDE CODE]</span>
                      <span className="text-tertiary-fixed text-xs font-semibold">Desktop Research Preview</span>
                      <span className="text-outline text-xs hidden sm:inline">• Opus 5.5 Thinking Mode</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-medium border border-primary-container/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">volume_up</span>
                      <span>launch.wav</span>
                    </span>
                  </div>

                  {/* Developer Terminal Prompt Input */}
                  <div className="flex items-start gap-2 text-on-surface text-xs font-medium">
                    <span className="text-primary-container font-bold select-none">&gt;</span>
                    <span className="text-on-surface leading-snug">
                      Fix the layout shift on the product grid
                    </span>
                  </div>

                  {/* Stage 1: Reasoning Plan */}
                  {currentStage >= 1 && (
                    <div className="rounded-lg bg-[#181615] p-3 border border-outline-variant/20 transition-all duration-300">
                      <div className="flex items-center justify-between text-xs text-tertiary-fixed mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                          <span className="font-semibold">Reasoning &amp; Plan Synthesis:</span>
                        </div>
                        <span className="text-[10px] font-mono text-outline">turn.start • ring.wav</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        The grid shifts because product images load without explicit dimensions. Adding aspect-ratio fallbacks.
                      </p>
                    </div>
                  )}

                  {/* Stage 2: Deep Pondering */}
                  {currentStage >= 2 && (
                    <div className="rounded-lg bg-[#191512] p-3 border border-primary-container/30 transition-all duration-300">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 text-primary-container">
                          <span className="material-symbols-outlined text-[14px] animate-spin">hourglass_top</span>
                          <span className="font-semibold">Deep Architecture Reasoning (14.2s)</span>
                        </div>
                        <span className="text-[10px] font-mono text-primary-container">timer.mp3</span>
                      </div>
                      <div className="text-[11px] text-tertiary font-mono">
                        Computing CSS grid layout constraints &amp; cumulative layout shift index...
                      </div>
                    </div>
                  )}

                  {/* Stage 3: Bash Tool Call */}
                  {currentStage >= 3 && (
                    <div className="rounded-lg bg-[#0e0d0c] p-2.5 border border-outline-variant/30 space-y-1 transition-all duration-300">
                      <div className="flex items-center justify-between text-[11px] text-tertiary-fixed font-mono">
                        <span className="text-[#61C554]">$ cargo test --lib -- --nocapture</span>
                        <span className="text-outline text-[10px]">keyboard-click.mp3</span>
                      </div>
                      <div className="text-[10px] text-outline font-mono pl-2">
                        test tests::test_grid_shift ... ok (0.002s)
                      </div>
                    </div>
                  )}

                  {/* Stage 4: File Edit */}
                  {currentStage >= 4 && (
                    <div className="rounded-lg bg-[#151210] border border-outline-variant/30 overflow-hidden transition-all duration-300">
                      <div className="px-3 py-1.5 bg-[#1f1b18] border-b border-outline-variant/20 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#61C554]"></span>
                          <span className="text-tertiary-fixed text-xs font-semibold">● Edit Tool:</span>
                          <code className="text-tertiary-fixed font-mono text-xs">src/ProductCard.tsx</code>
                          <span className="text-[9px] text-[#61C554] bg-[#61C554]/10 px-1 rounded font-mono">+18 -4</span>
                        </div>
                        <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">water_drop</span>
                          <span>pro-tool-call.mp3</span>
                        </span>
                      </div>
                      <div className="p-2 bg-[#0e0d0c] font-mono text-[10px] leading-relaxed space-y-0.5">
                        <div className="text-error bg-error-container/10 px-1">- &lt;img src=&#123;url&#125; className=&quot;w-full&quot; /&gt;</div>
                        <div className="text-[#61C554] bg-[#61C554]/10 px-1">+ &lt;Image src=&#123;url&#125; width=&#123;400&#125; height=&#123;300&#125; className=&quot;aspect-[4/3]&quot; /&gt;</div>
                      </div>
                    </div>
                  )}

                  {/* Stage 5: Finished Summary */}
                  {currentStage === 5 && (
                    <div className="rounded-lg bg-[#1c1714] p-3 border border-primary-container/40 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary-container">check_circle</span>
                          <span className="text-tertiary-fixed font-semibold text-xs">Verification complete. Latency 0.12ms.</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-semibold border border-primary-container/40 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">celebration</span>
                          <span>ding-sound-effect-1.mp3</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Telemetry Dock */}
                <div className="pt-2 border-t border-[#26221f] flex flex-col gap-1.5 select-none shrink-0">
                  <div className="w-full bg-[#171412] rounded-lg p-2.5 border border-outline-variant/30 flex items-center justify-between gap-2 shadow-inner">
                    <div className="flex items-center gap-2 text-xs text-tertiary-fixed font-mono overflow-hidden w-full">
                      <span className="text-primary-container font-bold">?</span>
                      <span className="text-outline font-medium hidden sm:inline">claude-code ~/dsp</span>
                      <span className="text-primary-container font-bold">&gt;</span>
                      <span className="text-tertiary truncate text-xs">{stage.dockText}</span>
                      <span className="w-1.5 h-3 bg-primary-container cursor-blink inline-block shrink-0"></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => advanceStage(true)}
                      className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-code flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <span>Next</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-outline px-1">
                    <div className="flex items-center gap-2.5">
                      <span>Cost: <span className="text-tertiary-fixed font-medium">$0.04</span></span>
                      <span>Duration: <span className="text-tertiary-fixed font-medium">14.2s</span></span>
                      <span>Tokens: <span className="text-tertiary-fixed font-medium">3,412</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-primary-container">
                      <span className="material-symbols-outlined text-[11px]">graphic_eq</span>
                      <span>CoreAudio Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
