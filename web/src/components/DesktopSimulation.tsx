'use client'

import React, { useState, useEffect, useRef } from 'react'
import { playAcousticCue, type SoundType } from '@/lib/audio'

type Stage = {
  id: number
  title: string
  soundCue: string
  soundType: SoundType
  dockText: string
  tokenDisplay: string
}

const STAGES: Stage[] = [
  {
    id: 0,
    title: 'Stage 1: Prompt Dispatched',
    soundCue: 'Launch Chime (launch.wav)',
    soundType: 'boot',
    dockText: 'session.start: prompt sent to Claude Code backend',
    tokenDisplay: 'Prompt input parsed • 0.08s',
  },
  {
    id: 1,
    title: 'Stage 2: Reasoning & Planning',
    soundCue: 'Soft Blip (ring.wav)',
    soundType: 'tick',
    dockText: 'turn.start: AST synthesis & dependency analysis...',
    tokenDisplay: 'Generating plan • 1.2s',
  },
  {
    id: 2,
    title: 'Stage 3: Deep Pondering (> 12s)',
    soundCue: 'Clock Tick (timer.mp3)',
    soundType: 'ponder',
    dockText: 'Extended architecture reasoning in progress...',
    tokenDisplay: '3,412 tokens • 14.2s (Deep thinking)',
  },
  {
    id: 3,
    title: 'Stage 4: Tool Execution (Bash)',
    soundCue: 'Keyboard Click (keyboard-click.mp3)',
    soundType: 'click',
    dockText: 'tool.call: Bash running cargo benchmark suite...',
    tokenDisplay: 'Subprocess 49210 active',
  },
  {
    id: 4,
    title: 'Stage 5: File Mutation (Edit)',
    soundCue: 'Alert Pulse (pro-tool-call.mp3)',
    soundType: 'pip',
    dockText: 'tool.call: Edit wrote +18 lines into ProductCard.tsx',
    tokenDisplay: 'Disk patch atomic commit',
  },
  {
    id: 5,
    title: 'Stage 6: Verification & Complete',
    soundCue: 'Success Ding (ding-sound-effect-1.mp3)',
    soundType: 'fanfare',
    dockText: 'turn.complete: 5 tasks verified. Latency 0.12ms.',
    tokenDisplay: 'All targets verified (0.12ms)',
  },
]

export default function DesktopSimulation() {
  const [currentStage, setCurrentStage] = useState(0)
  const [isAutoLooping, setIsAutoLooping] = useState(true)
  const [view, setView] = useState<'desktop' | 'terminal'>('desktop')
  const autoLoopRef = useRef<NodeJS.Timeout | null>(null)

  const advanceStage = (sound = true) => {
    setCurrentStage((prev) => {
      const next = (prev + 1) % STAGES.length
      if (sound) {
        playAcousticCue(STAGES[next].soundType)
      }
      return next
    })
  }

  const jumpToStage = (idx: number) => {
    setCurrentStage(idx)
    playAcousticCue(STAGES[idx].soundType)
  }

  const replayTurn = () => {
    setCurrentStage(0)
    playAcousticCue('boot')
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
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6"
      id="claude-desktop-demo"
    >
      {/* Title & Headline (Compact) */}
      <div className="flex flex-col items-center mb-3 text-center shrink-0">
        <div className="inline-flex items-center gap-2 text-primary-container font-label-sm text-label-sm uppercase tracking-widest mb-1">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
          <span>Living Desktop Environment Simulation</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Claude Code in Live Audio Flow</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
          Tactile audio feedback choreographed synchronously with every Claude Code agent event.
        </p>

        {/* Segmented View Toggle with generous spacing */}
        <div className="mt-2.5 inline-flex p-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-md gap-2">
          <button
            onClick={() => setView('desktop')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-body-md font-medium transition-all duration-200 cursor-pointer ${
              view === 'desktop'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-tertiary hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
            <span>Claude Code Desktop</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-surface-container-high text-primary-container font-mono">
              GUI
            </span>
          </button>
          <button
            onClick={() => setView('terminal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
              view === 'terminal'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-tertiary hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">terminal</span>
            <span>Claude Code Terminal</span>
            {view === 'terminal' && <span className="w-1.5 h-1.5 rounded-full bg-on-primary-container/80 ml-0.5"></span>}
          </button>
        </div>
      </div>

      {/* Scrubber Navigation (Compact) */}
      <div className="w-full bg-surface-container-low rounded-xl p-2 sm:p-2.5 mb-2.5 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-2.5 shadow-md shrink-0">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={toggleAutoLoop}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer font-medium shadow-sm shrink-0 ${
              isAutoLooping
                ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                : 'bg-surface-container text-tertiary-fixed hover:bg-surface-bright'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAutoLooping ? 'pause' : 'play_arrow'}
            </span>
            <span>{isAutoLooping ? 'Auto-Play Loop' : 'Resume Auto-Play'}</span>
          </button>
          <button
            onClick={replayTurn}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container text-tertiary-fixed hover:bg-surface-bright font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer shrink-0 border border-outline-variant/25"
          >
            <span className="material-symbols-outlined text-[15px] text-primary-container">replay</span>
            <span>Replay</span>
          </button>
        </div>

        {/* 6 Step Progress Scrubber Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none justify-start md:justify-end">
          {STAGES.map((s, idx) => {
            const isActive = idx === currentStage
            const isPast = idx < currentStage
            return (
              <button
                key={s.id}
                onClick={() => jumpToStage(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-code transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'border border-primary-container/40 bg-primary-container/20 text-primary-container shadow-sm font-semibold'
                    : isPast
                    ? 'border border-transparent bg-surface-container text-[#61C554]'
                    : 'border border-transparent bg-surface-container text-tertiary hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-primary-container' : isPast ? 'bg-[#61C554]' : 'bg-outline'
                  }`}
                />
                <span>
                  {idx + 1}. {['Prompt', 'Reasoning', 'Deep Ponder', 'Tool Call', 'File Edit', 'Victory'][idx]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ================= 1. AUTHENTIC CLAUDE CODE DESKTOP APP VIEW ================= */}
      {view === 'desktop' && (
        <div className="relative w-full rounded-2xl bg-[#111113] border border-[#27272a] shadow-2xl overflow-hidden transition-all duration-300">
          {/* Dynamic Acoustic Ripple Overlay on Sound Cue */}
          <div className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 flex items-center justify-center overflow-hidden audio-ripple-target opacity-0">
            <div className="w-64 h-64 rounded-full border-2 border-primary-container/60 bg-primary-container/10 blur-[2px] animate-ripple"></div>
          </div>

          {/* Desktop Chrome Titlebar matching real Claude Code Desktop */}
          <div className="h-10 bg-[#18181b] px-3.5 flex items-center justify-between border-b border-[#27272a] select-none z-20 relative shrink-0">
            <div className="flex items-center gap-3">
              {/* Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EC6A5E] inline-block shadow-sm"></span>
                <span className="w-3 h-3 rounded-full bg-[#F5BF4F] inline-block shadow-sm"></span>
                <span className="w-3 h-3 rounded-full bg-[#61C554] inline-block shadow-sm"></span>
              </div>

              {/* Navigation and Window Icons */}
              <div className="flex items-center gap-1.5 text-[#a1a1aa] text-xs">
                <button className="p-1 hover:text-white rounded hover:bg-[#27272a] transition-colors">
                  <span className="material-symbols-outlined text-[15px]">left_panel_close</span>
                </button>
                <button className="p-1 hover:text-white rounded hover:bg-[#27272a] transition-colors">
                  <span className="material-symbols-outlined text-[15px]">chevron_left</span>
                </button>
                <button className="p-1 hover:text-white rounded hover:bg-[#27272a] transition-colors">
                  <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                </button>
                <button className="p-1 hover:text-white rounded hover:bg-[#27272a] transition-colors">
                  <span className="material-symbols-outlined text-[15px]">search</span>
                </button>
                <button className="p-1 hover:text-white rounded hover:bg-[#27272a] transition-colors">
                  <span className="material-symbols-outlined text-[15px]">code</span>
                </button>
              </div>

              {/* Active Task Selector Dropdown in Titlebar */}
              <div className="flex items-center gap-1 text-xs text-[#f4f4f5] font-medium px-2 py-0.5 rounded hover:bg-[#27272a] cursor-pointer">
                <span>Fix product grid layout shift</span>
                <span className="material-symbols-outlined text-[14px] text-[#71717a]">expand_more</span>
              </div>
            </div>

            {/* Right Window Controls & Telemetry */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-[#71717a] text-xs hidden sm:flex">
                <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">splitscreen</span>
                <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">chevron_right</span>
                <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">add_box</span>
                <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">language</span>
                <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">folder</span>
                <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">more_horiz</span>
              </div>

              {/* Claudetones Live Audio Badge */}
              <div className="flex items-center gap-1.5 bg-[#27272a] px-2 py-0.5 rounded-full border border-primary-container/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#61C554] animate-pulse"></span>
                <span className="text-[10px] font-mono text-tertiary-fixed font-medium">claudetones active</span>
                <span className="text-[9px] font-mono text-outline">• 0.12ms</span>
              </div>
            </div>
          </div>

          {/* Claude Desktop Main Body: Sidebar + Conversation Pane */}
          <div className="h-[460px] grid grid-cols-1 md:grid-cols-12 bg-[#111113] overflow-hidden">
            {/* Left Sidebar (Col 4) matching Claude Code Desktop */}
            <aside className="hidden md:flex md:col-span-4 lg:col-span-3.5 bg-[#18181b] border-r border-[#27272a] flex-col justify-between p-3 select-none text-xs font-sans">
              <div className="space-y-4 overflow-y-auto">
                {/* Needs input section */}
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-[#71717a]">Needs input</div>
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-[#d4d4d8] hover:bg-[#27272a] cursor-pointer">
                    <span className="truncate">Rotate staging certificates</span>
                    <span className="material-symbols-outlined text-[14px] text-amber-500">warning</span>
                  </div>
                </div>

                {/* Working section */}
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-[#71717a]">Working</div>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#27272a] text-[#ffffff] font-medium cursor-pointer shadow-sm">
                    <span className="truncate">Fix product grid layout shift</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-[#a1a1aa] hover:bg-[#27272a] cursor-pointer truncate">
                    Label checkout form fields
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-[#a1a1aa] hover:bg-[#27272a] cursor-pointer truncate">
                    Retry failed webhook delivery
                  </div>
                </div>

                {/* Completed section */}
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-[#71717a]">Completed</div>
                  <div className="flex items-center justify-between px-2 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                    <span className="truncate">Lazy-load product images</span>
                    <span className="material-symbols-outlined text-[13px] text-[#71717a]">laptop_mac</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                    <span className="truncate">Upgrade the Stripe SDK</span>
                    <span className="material-symbols-outlined text-[13px] text-[#71717a]">cloud</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                    <span className="truncate">Add dark mode color tokens</span>
                    <span className="material-symbols-outlined text-[13px] text-[#71717a]">laptop_mac</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 text-[#a1a1aa] hover:text-[#f4f4f5] cursor-pointer">
                    <span className="truncate">Fix flaky checkout tests</span>
                    <span className="material-symbols-outlined text-[13px] text-[#71717a]">cloud</span>
                  </div>
                  <div className="px-2 py-1 text-[11px] text-[#71717a] hover:text-[#a1a1aa] cursor-pointer">
                    Show more
                  </div>
                </div>
              </div>

              {/* Sidebar Footer: Profile dropdown */}
              <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[#a1a1aa]">
                <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-[#3f3f46] inline-flex items-center justify-center text-[10px] text-white">L</span>
                  <span className="font-medium text-xs">Lydia · Max</span>
                  <span className="material-symbols-outlined text-[13px]">expand_more</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">search</span>
                  <span className="material-symbols-outlined text-[15px] hover:text-white cursor-pointer">notifications</span>
                </div>
              </div>
            </aside>

            {/* Right Chat & Task Flow (Col 8) */}
            <main className="col-span-1 md:col-span-8 lg:col-span-8.5 flex flex-col justify-between bg-[#111113] p-4 sm:p-5 overflow-hidden">
              <div className="space-y-3.5">
                {/* 1. User Prompt Bubble (Royal Blue pill, top-right) */}
                <div className="flex justify-end">
                  <div className="bg-[#1d4ed8] text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium shadow-sm max-w-[85%] leading-relaxed">
                    Fix the layout shift on the product grid
                  </div>
                </div>

                {/* 2. Claude Explanation Card (Visible on Stage 1+) */}
                {currentStage >= 1 && (
                  <div className="flex justify-start">
                    <div className="bg-[#18181b] border border-[#27272a] text-[#e4e4e7] p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] shadow-sm transition-all duration-300">
                      The grid shifts because product images load without a width and height. I&apos;ll add dimensions in
                      ProductCard, then reserve space in the grid with an aspect-ratio fallback.
                    </div>
                  </div>
                )}

                {/* 3. Task Checklist Card (Progressive reveal on Stage 2+) */}
                {currentStage >= 2 && (
                  <div className="rounded-2xl bg-[#18181b] border border-[#27272a] p-3.5 text-xs space-y-2 max-w-[90%] shadow-sm transition-all duration-300">
                    {/* Checklist items */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[#e4e4e7]">
                        <span className="material-symbols-outlined text-[16px] text-[#61C554]">
                          {currentStage >= 3 ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span className={currentStage >= 3 ? 'line-through text-[#71717a]' : ''}>
                          Reproduce the shift, run baseline tests
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#e4e4e7]">
                        <span className="material-symbols-outlined text-[16px] text-primary-container">
                          {currentStage >= 4 ? 'check_circle' : currentStage === 3 ? 'pending' : 'radio_button_unchecked'}
                        </span>
                        <span className={currentStage >= 4 ? 'line-through text-[#71717a]' : ''}>
                          Add image dimensions to ProductCard
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#a1a1aa]">
                        <span className="material-symbols-outlined text-[16px] text-[#71717a]">
                          {currentStage >= 5 ? 'check_circle' : 'circle'}
                        </span>
                        <span>Reserve space with an aspect-ratio fallback</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#a1a1aa]">
                        <span className="material-symbols-outlined text-[16px] text-[#71717a]">
                          {currentStage >= 5 ? 'check_circle' : 'circle'}
                        </span>
                        <span>Check the product grid in the preview</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#a1a1aa]">
                        <span className="material-symbols-outlined text-[16px] text-[#71717a]">
                          {currentStage >= 5 ? 'check_circle' : 'circle'}
                        </span>
                        <span>Add a layout shift test, final run</span>
                      </div>
                    </div>

                    {/* Progress indicator matching screenshot */}
                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-primary-container font-mono text-[11px]">
                        <span>···</span>
                        <span>
                          {currentStage === 2
                            ? 'Analyzing circular buffer dependencies 14.2s'
                            : currentStage === 3
                            ? 'Running baseline tests: cargo test --lib'
                            : currentStage === 4
                            ? 'Editing ProductCard.tsx 18s'
                            : 'All 5 tasks verified • Ready for review'}
                        </span>
                        <span className="text-[12px]">▸</span>
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

              {/* Bottom Composer and Status Bar */}
              <div className="space-y-2 pt-2">
                {/* Input Pill Bar matching screenshot */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-2.5 flex items-center justify-between text-xs shadow-inner">
                  <div className="flex items-center gap-2 text-[#71717a]">
                    <span className="material-symbols-outlined text-[16px] text-[#a1a1aa] hover:text-white cursor-pointer">add</span>
                    <span>↵ to send, ⌘↵ to queue for later</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#71717a]">
                    <span className="material-symbols-outlined text-[16px] hover:text-white cursor-pointer">stop</span>
                    <span className="material-symbols-outlined text-[16px] hover:text-white cursor-pointer">mic</span>
                  </div>
                </div>

                {/* Very bottom status footer matching screenshot */}
                <div className="flex items-center justify-between text-[11px] text-[#71717a] px-1 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="hover:text-white cursor-pointer">Auto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hover:text-white cursor-pointer">Opus 5.5 · Fast · Medium ˅</span>
                    <span className="material-symbols-outlined text-[13px] text-primary-container">volume_up</span>
                    <span className="material-symbols-outlined text-[13px] hover:text-white cursor-pointer">settings</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* ================= 2. CLAUDE CODE TERMINAL VIEW ================= */}
      {view === 'terminal' && (
        <div className="relative w-full rounded-2xl bg-[#141210] border border-[#38332f] shadow-2xl overflow-hidden transition-all duration-300">
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
                <span className="text-outline font-normal hidden sm:inline">(~/projects/audio-dsp)</span>
              </div>
            </div>

            {/* Live Audio Engine Status Badge */}
            <div className="flex items-center gap-2 bg-[#1f1a18] px-2.5 py-0.5 rounded-full border border-primary-container/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#61C554] animate-pulse"></span>
              <div className="flex items-end gap-0.5 h-3 w-6 justify-center live-wave-visualizer">
                <span className="w-1 bg-primary-container rounded-full h-1.5 transition-all duration-100"></span>
                <span className="w-1 bg-primary rounded-full h-2.5 transition-all duration-100"></span>
                <span className="w-1 bg-tertiary-fixed rounded-full h-1.5 transition-all duration-100"></span>
                <span className="w-1 bg-primary-container rounded-full h-2.5 transition-all duration-100"></span>
              </div>
              <span className="text-[10px] font-mono text-tertiary-fixed font-medium hidden sm:inline">
                claudetones active
              </span>
              <span className="text-outline font-mono text-[9px] hidden sm:inline">• CoreAudio 0.12ms</span>
            </div>
          </div>

          {/* Terminal Viewport */}
          <div className="h-[460px] p-4 bg-[#110f0e] font-code text-xs text-on-surface overflow-hidden flex flex-col justify-between">
            <div className="space-y-2.5">
              {/* Session Info */}
              <div className="flex items-center justify-between pb-2 border-b border-[#26221f] text-tertiary">
                <div className="flex items-center gap-2">
                  <span className="text-primary-container font-mono text-xs font-bold">[CLAUDE CODE]</span>
                  <span className="text-tertiary-fixed text-xs font-semibold">Research Preview</span>
                  <span className="text-outline text-xs hidden sm:inline">• Sonnet 3.7 Thinking Mode</span>
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
                  optimize audio buffer latency and run benchmark suite
                </span>
              </div>

              {/* Stage 1+: Thinking Disclosure Block */}
              {currentStage >= 1 && (
                <div className="rounded-lg bg-[#171412] p-2.5 border border-[#332e2a] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary-container animate-spin" style={{ animationDuration: '4s' }}>
                        psychology
                      </span>
                      <span className="text-tertiary-fixed font-medium text-xs">
                        Thinking Process ({currentStage >= 2 ? '14.2s • Deep Ponder' : '3.2s'})
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary-fixed flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] text-primary">graphic_eq</span>
                      <span>{currentStage >= 2 ? 'timer.mp3' : 'ring.wav'}</span>
                    </span>
                  </div>
                  <div className="mt-1.5 pt-1 text-xs text-outline font-mono border-t border-outline-variant/15 flex items-center justify-between">
                    <span>Analyzing ring buffer lock overhead in <code className="text-tertiary-fixed">core/dsp.rs</code></span>
                    <span className="text-[#61C554] text-[11px]">✓ Lock-free atomics</span>
                  </div>
                </div>
              )}

              {/* Stage 3+: Tool Call: Bash Execution */}
              {currentStage >= 3 && (
                <div className="rounded-lg bg-[#171412] border border-[#332e2a] overflow-hidden transition-all duration-300">
                  <div className="px-2.5 py-1.5 bg-[#1e1a17] border-b border-[#2d2825] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5BF4F]"></span>
                      <span className="text-tertiary-fixed text-xs font-semibold">● Bash Tool:</span>
                      <code className="text-primary-container font-mono text-xs">cargo test --lib</code>
                    </div>
                    <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">keyboard</span>
                      <span>keyboard-click.mp3</span>
                    </span>
                  </div>
                  <div className="p-2 bg-[#0e0d0c] font-mono text-[11px] flex items-center justify-between">
                    <span className="text-[#61C554] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      test tests::dsp_zero_latency ... ok (0.12ms)
                    </span>
                    <span className="text-tertiary-fixed text-[10px]">3 passed (0.16s)</span>
                  </div>
                </div>
              )}

              {/* Stage 4+: Tool Call: File Edit */}
              {currentStage >= 4 && (
                <div className="rounded-lg bg-[#171412] border border-[#332e2a] overflow-hidden transition-all duration-300">
                  <div className="px-2.5 py-1.5 bg-[#1e1a17] border-b border-[#2d2825] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#61C554]"></span>
                      <span className="text-tertiary-fixed text-xs font-semibold">● Edit Tool:</span>
                      <code className="text-tertiary-fixed font-mono text-xs">src/ring_buffer.rs</code>
                      <span className="text-[9px] text-[#61C554] bg-[#61C554]/10 px-1 rounded font-mono">+18 -4</span>
                    </div>
                    <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">water_drop</span>
                      <span>pro-tool-call.mp3</span>
                    </span>
                  </div>
                  <div className="p-1.5 bg-[#0e0d0c] font-mono text-[9px] leading-tight space-y-0.5">
                    <div className="text-error bg-error-container/10 px-1">- mutex: Arc&lt;Mutex&lt;VecDeque&lt;f32&gt;&gt;&gt;</div>
                    <div className="text-[#61C554] bg-[#61C554]/10 px-1">+ head: AtomicUsize, tail: AtomicUsize</div>
                  </div>
                </div>
              )}

              {/* Stage 5: Finished Summary */}
              {currentStage === 5 && (
                <div className="rounded-lg bg-[#1c1714] p-2.5 border border-primary-container/40 transition-all duration-300">
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
              <div className="w-full bg-[#171412] rounded-lg p-2 border border-outline-variant/30 flex items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-2 text-xs text-tertiary-fixed font-mono overflow-hidden w-full">
                  <span className="text-primary-container font-bold">?</span>
                  <span className="text-outline font-medium hidden sm:inline">claude-code ~/dsp</span>
                  <span className="text-primary-container font-bold">&gt;</span>
                  <span className="text-tertiary truncate text-xs">{stage.dockText}</span>
                  <span className="w-1.5 h-3 bg-primary-container cursor-blink inline-block shrink-0"></span>
                </div>
                <button
                  onClick={() => advanceStage(true)}
                  className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-code flex items-center gap-1 transition-colors cursor-pointer shrink-0"
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
    </section>
  )
}
