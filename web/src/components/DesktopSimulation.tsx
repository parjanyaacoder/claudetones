'use client'

import React, { useState, useEffect, useRef } from 'react'
import { playAcousticCue } from '@/lib/audio'

type Stage = {
  id: number
  title: string
  soundCue: string
  soundType: 'boot' | 'tick' | 'ponder' | 'click' | 'pip' | 'fanfare' | 'error'
  dockText: string
  tokenDisplay: string
}

const STAGES: Stage[] = [
  {
    id: 0,
    title: 'Stage 1: Prompt Dispatched',
    soundCue: 'Warm Synapse Blip (523Hz)',
    soundType: 'boot',
    dockText: 'session.start: prompt sent to Claude Code backend',
    tokenDisplay: 'Prompt input parsed • 0.08s',
  },
  {
    id: 1,
    title: 'Stage 2: Reasoning & Planning',
    soundCue: 'Thinking Tick (880Hz)',
    soundType: 'tick',
    dockText: 'turn.start: AST synthesis & dependency analysis...',
    tokenDisplay: 'Generating plan • 1.2s',
  },
  {
    id: 2,
    title: 'Stage 3: Deep Pondering (> 12s)',
    soundCue: 'Pondering Chrono (440Hz)',
    soundType: 'ponder',
    dockText: 'Extended architecture reasoning in progress...',
    tokenDisplay: '3,412 tokens • 14.2s (Deep thinking)',
  },
  {
    id: 3,
    title: 'Stage 4: Tool Execution (Bash)',
    soundCue: 'Keystroke Solenoid (Cherry MX)',
    soundType: 'click',
    dockText: 'tool.call: Bash running cargo benchmark suite...',
    tokenDisplay: 'Subprocess 49210 active',
  },
  {
    id: 4,
    title: 'Stage 5: File Mutation (Edit)',
    soundCue: 'Marimba Drop Pip (1046Hz)',
    soundType: 'pip',
    dockText: 'tool.call: Edit wrote +18 lines into ring_buffer.rs',
    tokenDisplay: 'Disk patch atomic commit',
  },
  {
    id: 5,
    title: 'Stage 6: Verification & Complete',
    soundCue: 'Victory Fanfare (C-Major)',
    soundType: 'fanfare',
    dockText: 'turn.complete: 3 tests passing. Latency 0.12ms.',
    tokenDisplay: 'All targets verified (0.12ms)',
  },
]

export default function DesktopSimulation() {
  const [currentStage, setCurrentStage] = useState(0)
  const [isAutoLooping, setIsAutoLooping] = useState(true)
  const [view, setView] = useState<'terminal' | 'desktop'>('terminal')
  const [thoughtExpanded, setThoughtExpanded] = useState(true)
  const autoLoopRef = useRef<NodeJS.Timeout | null>(null)
  const terminalScrollRef = useRef<HTMLDivElement | null>(null)
  const desktopScrollRef = useRef<HTMLDivElement | null>(null)

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

  // Auto-scroll active block into view smoothly inside terminal
  useEffect(() => {
    if (view === 'terminal' && terminalScrollRef.current) {
      const activeEl = terminalScrollRef.current.querySelector(`#terminal-stage-${currentStage}`)
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } else if (view === 'desktop' && desktopScrollRef.current) {
      const activeEl = desktopScrollRef.current.querySelector(`#desktop-stage-${currentStage}`)
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [currentStage, view])

  const stage = STAGES[currentStage]

  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      id="claude-desktop-demo"
    >
      {/* Title & Headline (Compact for single-screen fit) */}
      <div className="flex flex-col items-center mb-3 text-center shrink-0">
        <div className="inline-flex items-center gap-2 text-primary-container font-label-sm text-label-sm uppercase tracking-widest mb-1">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
          <span>Living Desktop Environment Simulation</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Claude Code in Live Audio Flow</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-0.5 leading-relaxed">
          Tactile audio feedback choreographed synchronously with every Claude Code agent event.
        </p>

        {/* Segmented View Toggle */}
        <div className="mt-3 inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-md">
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
        </div>
      </div>

      {/* Scrubber & Interactive Stage Timeline Navigation (Compact) */}
      <div className="w-full bg-surface-container-low rounded-xl p-2 sm:p-2.5 mb-3 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-2.5 shadow-md shrink-0">
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

      {/* ================= 1. CLAUDE CODE TERMINAL VIEW CONTAINER ================= */}
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

          {/* Claude Code CLI Terminal Viewport Body (Fixed Height for One-Screen Fit) */}
          <div
            ref={terminalScrollRef}
            className="h-[430px] sm:h-[460px] p-4 sm:p-5 bg-[#110f0e] font-code text-xs sm:text-sm text-on-surface overflow-y-auto space-y-3.5 scroll-smooth"
          >
            {/* 1. Claude Code ASCII Banner */}
            <div
              id="terminal-stage-0"
              className={`space-y-2 pb-3 border-b border-[#26221f] text-tertiary transition-all duration-300 ${
                currentStage === 0
                  ? 'opacity-100 ring-1 ring-primary-container/40 p-2.5 rounded-xl bg-[#1f1a18]'
                  : 'opacity-85'
              }`}
            >
              <pre className="text-primary-container font-mono text-[10px] sm:text-[11px] leading-none select-none overflow-x-auto">
{` ____ _                 _         ____          _
/ ___| | __ _ _   _  __| | ___   / ___|___   __| | ___
| |   | |/ _\` | | | |/ _\` |/ _ \\ | |   / _ \\ / _\` |/ _ \\
| |___| | (_| | |_| | (_| |  __/ | |__| (_) | (_| |  __/
 \\____|_|\\__,_|\\__,_|\\__,_|\\___|  \\____\\___/ \\__,_|\\___|`}
              </pre>
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
                <div>
                  <span className="text-tertiary-fixed font-semibold text-xs">Claude Code Research Preview</span>
                  <span className="text-outline text-xs"> • Claude 3.7 Sonnet (Thinking Mode enabled)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-medium border border-primary-container/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">volume_up</span>
                  <span>[session.start] ♪ Warm Boot Chime (523Hz)</span>
                </span>
              </div>
            </div>

            {/* 2. Developer Terminal Prompt Input */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-outline">
                <span className="material-symbols-outlined text-[13px] text-primary-container">terminal</span>
                <span className="text-tertiary-fixed font-medium">Prompt 1/1</span>
              </div>
              <div className="flex items-start gap-2 text-on-surface text-xs sm:text-sm font-medium">
                <span className="text-primary-container font-bold select-none">&gt;</span>
                <span className="text-on-surface leading-snug">
                  optimize audio buffer latency and run benchmark suite
                </span>
              </div>
            </div>

            {/* 3. Real-time Thinking Disclosure Block */}
            <div
              id="terminal-stage-1"
              className={`rounded-xl bg-[#171412] p-3 border border-[#332e2a] transition-all duration-300 ${
                currentStage === 1
                  ? 'opacity-100 ring-1 ring-primary-container/40 bg-[#1f1a18]'
                  : currentStage > 1
                  ? 'opacity-90'
                  : 'opacity-40'
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setThoughtExpanded(!thoughtExpanded)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[15px] text-primary-container animate-spin"
                    style={{ animationDuration: '4s' }}
                  >
                    psychology
                  </span>
                  <span className="text-tertiary-fixed font-medium text-xs">Thinking Process (3.2s)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary-fixed flex items-center gap-1">
                    <span className="material-symbols-outlined text-[11px] text-primary">graphic_eq</span>
                    <span>[turn.start] 880Hz Tick</span>
                  </span>
                  <span className="material-symbols-outlined text-[15px] text-outline">
                    {thoughtExpanded ? 'expand_more' : 'chevron_right'}
                  </span>
                </div>
              </div>
              {thoughtExpanded && (
                <div className="mt-2 pt-1.5 text-xs text-outline space-y-1 font-mono border-t border-outline-variant/15">
                  <div>
                    Analyzing circular ring buffer dispatch overhead in <code className="text-tertiary-fixed">core/dsp.rs</code>... [880Hz Synapse Tick]
                  </div>
                  <div className="text-[#61C554]">
                    ✓ Low-latency lock-free atomics selected with zero memory allocation.
                  </div>
                </div>
              )}
            </div>

            {/* 4. Claude Code Tool Call: Bash Execution */}
            <div
              id="terminal-stage-3"
              className={`rounded-xl bg-[#171412] border border-[#332e2a] overflow-hidden transition-all duration-300 ${
                currentStage === 3
                  ? 'opacity-100 ring-1 ring-primary-container/40 bg-[#1f1a18]'
                  : currentStage > 3
                  ? 'opacity-90'
                  : 'opacity-40'
              }`}
            >
              <div className="px-3 py-2 bg-[#1e1a17] border-b border-[#2d2825] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F5BF4F]"></span>
                  <span className="text-tertiary-fixed font-semibold text-xs">● Running Bash tool:</span>
                  <code className="text-primary-container font-mono text-xs">cargo test --lib -- --nocapture</code>
                </div>
                <span className="text-[10px] font-mono text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]">keyboard</span>
                  <span>♪ Keystroke Solenoid [45ms]</span>
                </span>
              </div>
              <div className="p-2.5 bg-[#0e0d0c] font-mono text-xs space-y-1">
                <div className="text-tertiary">running 3 tests</div>
                <div className="text-[#61C554] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>test tests::dsp_zero_latency ... ok (0.12ms)</span>
                </div>
                <div className="text-tertiary-fixed pt-0.5">
                  test result: <span className="text-[#61C554] font-bold">ok</span>. 3 passed; 0 failed; finished in 0.16s
                </div>
              </div>
            </div>

            {/* 5. Claude Code Tool Call: File Edit */}
            <div
              id="terminal-stage-4"
              className={`rounded-xl bg-[#171412] border border-[#332e2a] overflow-hidden transition-all duration-300 ${
                currentStage === 4
                  ? 'opacity-100 ring-1 ring-primary-container/40 bg-[#1f1a18]'
                  : currentStage > 4
                  ? 'opacity-90'
                  : 'opacity-40'
              }`}
            >
              <div className="px-3 py-2 bg-[#1e1a17] border-b border-[#2d2825] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#61C554]"></span>
                  <span className="text-tertiary-fixed font-semibold text-xs">● Running Edit tool:</span>
                  <code className="text-tertiary-fixed font-mono text-xs">src/ring_buffer.rs</code>
                  <span className="text-[9px] text-[#61C554] bg-[#61C554]/10 px-1.5 py-0.2 rounded font-mono font-medium">
                    +18 -4
                  </span>
                </div>
                <span className="text-[10px] font-mono text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]">water_drop</span>
                  <span>♪ Marimba Waterdrop Pip [75ms]</span>
                </span>
              </div>
              <div className="p-2.5 bg-[#0e0d0c] font-mono text-[11px] space-y-0.5 leading-relaxed border-t border-[#26221f]">
                <div className="text-error bg-error-container/10 px-1">- mutex: Arc&lt;Mutex&lt;VecDeque&lt;f32&gt;&gt;&gt;</div>
                <div className="text-[#61C554] bg-[#61C554]/10 px-1">+ head: AtomicUsize, tail: AtomicUsize</div>
                <div className="text-[#61C554] bg-[#61C554]/10 px-1">+ buffer: Box&lt;[UnsafeCell&lt;f32&gt;; BUFFER_SIZE]&gt;</div>
              </div>
            </div>

            {/* 6. Finished Summary & Turn Complete Banner */}
            <div
              id="terminal-stage-5"
              className={`rounded-xl bg-[#1c1714] p-3 border border-primary-container/40 transition-all duration-300 shadow-md ${
                currentStage === 5 ? 'opacity-100 ring-1 ring-primary-container/40' : 'opacity-40'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary-container">check_circle</span>
                  <div>
                    <div className="text-tertiary-fixed font-semibold text-xs">All optimizations compiled.</div>
                    <div className="text-on-surface-variant text-[11px]">
                      Audio dispatch latency reduced to 0.12ms with zero token streaming delay.
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-semibold border border-primary-container/40 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">celebration</span>
                  <span>★ Victory Fanfare (C-Major)</span>
                </span>
              </div>
            </div>

            {/* 7. Bottom Prompt Dock */}
            <div className="pt-2 border-t border-[#26221f] flex flex-col gap-2 select-none shrink-0">
              <div className="w-full bg-[#171412] rounded-xl p-2.5 border border-outline-variant/30 flex items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-2 text-xs text-tertiary-fixed font-mono overflow-hidden w-full">
                  <span className="text-primary-container font-bold">?</span>
                  <span className="text-outline font-medium hidden sm:inline">claude-code ~/dsp</span>
                  <span className="text-primary-container font-bold">&gt;</span>
                  <span className="text-tertiary truncate">{stage.dockText}</span>
                  <span className="w-1.5 h-3.5 bg-primary-container cursor-blink inline-block shrink-0"></span>
                </div>
                <button
                  onClick={() => advanceStage(true)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-code flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-outline px-1">
                <div className="flex items-center gap-2.5">
                  <span>Cost: <span className="text-tertiary-fixed font-medium">$0.04</span></span>
                  <span>Duration: <span className="text-tertiary-fixed font-medium">14.2s</span></span>
                  <span>Tokens: <span className="text-tertiary-fixed font-medium">3,412</span></span>
                </div>
                <div className="flex items-center gap-1 text-primary-container">
                  <span className="material-symbols-outlined text-[12px]">graphic_eq</span>
                  <span>CoreAudio active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. CLAUDE CODE DESKTOP APP GUI VIEW CONTAINER ================= */}
      {view === 'desktop' && (
        <div className="relative w-full rounded-2xl bg-[#141210] border border-[#38332f] shadow-2xl overflow-hidden transition-all duration-300">
          {/* Dynamic Acoustic Ripple Overlay on Sound Cue */}
          <div className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 flex items-center justify-center overflow-hidden audio-ripple-target opacity-0">
            <div className="w-64 h-64 rounded-full border-2 border-primary-container/60 bg-primary-container/10 blur-[2px] animate-ripple"></div>
          </div>

          {/* Desktop Window Chrome Titlebar */}
          <div className="h-10 bg-[#181615] px-4 flex items-center justify-between border-b border-[#2d2825] select-none z-20 relative shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC6A5E] inline-block shadow-sm"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5BF4F] inline-block shadow-sm"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#61C554] inline-block shadow-sm"></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                <span className="px-2 py-0.5 rounded bg-surface-container text-tertiary-fixed font-medium">Claude Desktop</span>
                <span className="text-outline">/</span>
                <span className="text-primary-container font-semibold">audio-dsp-engine</span>
              </div>
            </div>

            {/* Audio Daemon & Connection Telemetry HUD */}
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

          {/* Desktop GUI Layout: Fixed Height for One-Screen Fit */}
          <div className="h-[430px] sm:h-[460px] grid grid-cols-1 lg:grid-cols-12 bg-[#110f0e]">
            {/* Left Sidebar (Col 3) */}
            <aside className="hidden lg:flex lg:col-span-3 bg-[#151312] border-r border-[#26221f] flex-col justify-between p-3 select-none font-sans text-xs overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-1.5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/40 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded-lg bg-primary-container/20 border border-primary-container/30 flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[15px]">equalizer</span>
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-tertiary-fixed truncate text-xs">audio-dsp-engine</div>
                      <div className="text-[9px] text-outline font-mono truncate">v0.9.4 • main</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="px-2 py-0.5 text-[9px] font-mono text-outline uppercase tracking-wider">Workspace</div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-surface-container text-tertiary-fixed font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-primary-container">chat_bubble</span>
                      <span>Active Agent Session</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#61C554]"></span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-outline">folder</span>
                      <span>Workspace Files</span>
                    </div>
                    <span className="text-[10px] font-mono text-outline">18 items</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-outline">commit</span>
                      <span>Git Diffs</span>
                    </div>
                    <span className="px-1 py-0.2 rounded text-[9px] bg-primary-container/20 text-primary-container font-mono">+1</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1.5 border-t border-[#221f1c]">
                  <div className="px-2 py-0.5 text-[9px] font-mono text-outline uppercase tracking-wider">Recent Turns</div>
                  <div className="px-2 py-1 rounded-lg bg-surface-container-low text-tertiary-fixed font-mono text-[10px] truncate cursor-pointer hover:bg-surface-container">
                    #092 optimize buffer latency
                  </div>
                  <div className="px-2 py-1 rounded-lg text-outline hover:text-on-surface-variant font-mono text-[10px] truncate cursor-pointer">
                    #091 fix CoreAudio wrap
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#221f1c]">
                <div className="p-2 rounded-xl bg-[#1a1715] border border-outline-variant/20 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-outline">Model</span>
                    <span className="text-tertiary-fixed font-semibold">Claude 3.7 Sonnet</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-outline">Acoustic Driver</span>
                    <span className="text-[#61C554] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#61C554]"></span> afplay 0.12ms
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Center Main Pane (Col 6) */}
            <main
              ref={desktopScrollRef}
              className="lg:col-span-6 flex flex-col justify-between border-r border-[#26221f] bg-[#110f0e] p-3 sm:p-3.5 overflow-y-auto space-y-3"
            >
              <div className="space-y-3">
                {/* Developer Prompt Bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-tertiary-fixed text-[11px] shrink-0 font-medium font-mono">
                    dev
                  </div>
                  <div className="flex-1 bg-[#1a1715] border border-[#2d2825] rounded-xl rounded-tl-sm p-2.5 shadow-sm">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-tertiary-fixed">Developer Request</span>
                      <span className="text-[9px] font-mono text-outline">Just now</span>
                    </div>
                    <p className="text-xs text-on-surface leading-relaxed">
                      optimize audio buffer latency and run benchmark suite
                    </p>
                  </div>
                </div>

                {/* Agent Event 1: Deep Thinking */}
                <div
                  id="desktop-stage-1"
                  className={`transition-all duration-300 rounded-xl bg-[#171412] p-2.5 border border-[#332e2a] ${
                    currentStage === 1
                      ? 'ring-1 ring-primary-container/40 bg-[#1f1a18]'
                      : currentStage > 1
                      ? 'opacity-90'
                      : 'opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined text-[14px] text-primary-container animate-spin"
                        style={{ animationDuration: '4s' }}
                      >
                        psychology
                      </span>
                      <span className="text-xs font-medium text-tertiary-fixed">Reasoning &amp; Latency Profiling</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-primary flex items-center gap-1 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[11px]">graphic_eq</span>
                      <span>[turn.start] 880Hz Tick</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono mt-1.5 leading-relaxed">
                    Examined <code className="text-tertiary-fixed">src/ring_buffer.rs</code> mutex locks. Lock-free ring buffer selected.
                  </p>
                </div>

                {/* Agent Event 2: Subprocess Execution */}
                <div
                  id="desktop-stage-3"
                  className={`transition-all duration-300 rounded-xl bg-[#171412] border border-[#332e2a] overflow-hidden ${
                    currentStage === 3
                      ? 'ring-1 ring-primary-container/40 bg-[#1f1a18]'
                      : currentStage > 3
                      ? 'opacity-90'
                      : 'opacity-40'
                  }`}
                >
                  <div className="px-2.5 py-1.5 bg-[#1b1715] border-b border-[#2d2825] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5BF4F]"></span>
                      <span className="text-outline text-[11px]">Subprocess:</span>
                      <span className="text-primary-container text-[11px]">cargo test --lib</span>
                    </div>
                    <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">keyboard</span>
                      <span>Keystroke Solenoid</span>
                    </span>
                  </div>
                  <div className="p-2 bg-[#0d0c0b] font-mono text-[10px] space-y-0.5">
                    <div className="text-[#61C554] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      <span>dsp_zero_latency: latency 0.12ms (&lt; 0.20ms target)</span>
                    </div>
                  </div>
                </div>

                {/* Agent Event 3: File Diff Modification */}
                <div
                  id="desktop-stage-4"
                  className={`transition-all duration-300 rounded-xl bg-[#171412] border border-[#332e2a] overflow-hidden ${
                    currentStage === 4
                      ? 'ring-1 ring-primary-container/40 bg-[#1f1a18]'
                      : currentStage > 4
                      ? 'opacity-90'
                      : 'opacity-40'
                  }`}
                >
                  <div className="px-2.5 py-1.5 bg-[#1b1715] border-b border-[#2d2825] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#61C554]"></span>
                      <span className="text-outline text-[11px]">Edit:</span>
                      <span className="text-tertiary-fixed text-[11px]">src/ring_buffer.rs</span>
                      <span className="text-[9px] text-[#61C554] bg-[#61C554]/10 px-1 rounded font-mono">+18 -4</span>
                    </div>
                    <span className="text-[9px] font-mono text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">water_drop</span>
                      <span>Waterdrop Pip</span>
                    </span>
                  </div>
                  <div className="p-2 bg-[#0d0c0b] font-mono text-[10px] space-y-0.5">
                    <div className="text-error bg-error-container/10 px-1">- mutex: Arc&lt;Mutex&lt;VecDeque&lt;f32&gt;&gt;&gt;</div>
                    <div className="text-[#61C554] bg-[#61C554]/10 px-1">+ head: AtomicUsize, tail: AtomicUsize</div>
                  </div>
                </div>

                {/* Agent Event 4: Task Complete Banner */}
                <div
                  id="desktop-stage-5"
                  className={`transition-all duration-300 rounded-xl bg-[#1c1714] p-2.5 border border-primary-container/40 shadow-sm ${
                    currentStage === 5 ? 'ring-1 ring-primary-container/40' : 'opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#61C554]">verified</span>
                      <span className="text-xs font-semibold text-tertiary-fixed">Verification Complete</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-semibold border border-primary-container/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">celebration</span>
                      <span>★ Victory Fanfare</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Bottom Composer Bar */}
              <div className="pt-2 border-t border-[#26221f] space-y-1.5 shrink-0">
                <div className="w-full bg-[#171412] rounded-xl p-2 border border-outline-variant/30 flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-1.5 flex-1 text-xs text-on-surface font-sans">
                    <span className="text-outline truncate text-xs">{stage.dockText}</span>
                  </div>
                  <button
                    onClick={() => advanceStage(true)}
                    className="w-6 h-6 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </main>

            {/* Right Inspect Drawer (Col 3) */}
            <aside className="hidden lg:flex lg:col-span-3 bg-[#151312] flex-col justify-between p-3 font-sans text-xs select-none overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#221f1c]">
                  <div className="flex items-center gap-1 font-medium text-tertiary-fixed text-xs">
                    <span className="material-symbols-outlined text-[15px] text-primary-container">difference</span>
                    <span>Inspection</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#61C554] bg-[#61C554]/10 px-1.5 py-0.2 rounded">
                    PR Ready
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono text-outline uppercase tracking-wider">Touched Files</div>
                  <div className="p-2 rounded-xl bg-surface-container-low border border-primary-container/30 space-y-1 cursor-pointer">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-tertiary-fixed font-medium truncate">ring_buffer.rs</span>
                      <span className="text-[9px] text-[#61C554] font-semibold">+18 -4</span>
                    </div>
                    <div className="text-[9px] text-outline font-mono">src/core/ring_buffer.rs</div>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low/50 border border-outline-variant/15 space-y-1 cursor-pointer">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-outline truncate">dsp_telemetry.rs</span>
                      <span className="text-[9px] text-[#61C554] font-semibold">+6 -1</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-[#221f1c] space-y-1 font-mono text-[10px]">
                  <div className="text-[9px] text-outline uppercase tracking-wider">Acoustic Diagnostics</div>
                  <div className="p-2 rounded-xl bg-[#181513] border border-outline-variant/20 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-outline">Latency:</span>
                      <span className="text-tertiary-fixed font-semibold">0.12ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-outline">Backend:</span>
                      <span className="text-tertiary-fixed font-semibold">CoreAudio</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#221f1c]">
                <button
                  onClick={() => advanceStage(true)}
                  className="w-full py-1.5 rounded-xl bg-primary-container text-on-primary-container font-medium font-sans text-xs hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Commit Turn</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </section>
  )
}
