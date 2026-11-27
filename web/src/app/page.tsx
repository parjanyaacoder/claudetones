'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import RotatingWord from '@/components/RotatingWord'
import DesktopSimulation from '@/components/DesktopSimulation'
import SoundboardMatrix from '@/components/SoundboardMatrix'
import SlashCommands from '@/components/SlashCommands'
import { GITHUB_URL } from '@/lib/catalog'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [bottomCopied, setBottomCopied] = useState(false)
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({ 0: true })

  const PLUGIN_ONE_LINER = 'claude plugin marketplace add parjanyaacoder/claudetones && claude plugin install claudetones'

  const copyCliCommand = () => {
    navigator.clipboard.writeText(PLUGIN_ONE_LINER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyBottomCommand = () => {
    navigator.clipboard.writeText(PLUGIN_ONE_LINER)
    setBottomCopied(true)
    setTimeout(() => setBottomCopied(false), 2000)
  }

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="relative min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-[#181615]/90 backdrop-blur-md border-b border-[#2E2B28]">
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
              <a
                href="#claude-desktop-demo"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Interactive App
              </a>
              <a
                href="#soundboard-matrix"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Soundboard
              </a>
              <Link
                href="/studio"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm flex items-center gap-1.5"
              >
                <span>Pack Studio</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary-container/20 text-primary-container font-semibold">New</span>
              </Link>
              <a
                href="#slash-commands"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Slash Commands
              </a>
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

            <a
              href="#claude-desktop-demo"
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-md font-medium"
            >
              Live Demo
            </a>
          </div>
        </div>
      </header>

      {/* AMBIENT GLOW & GRID BACKGROUND (Inspired by Magic UI / Aceternity) */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Architectural Grid Pattern with Radial Gradient Mask */}
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_80%_60%_at_50%_15%,#000_30%,transparent_80%)] opacity-70 pointer-events-none"></div>

        {/* Ambient Warm Spotlights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary-container/15 blur-[150px] pointer-events-none rounded-full"></div>
        <div className="absolute top-[35rem] -left-32 w-[440px] h-[440px] bg-outline-variant/10 blur-[130px] pointer-events-none rounded-full"></div>
        <div className="absolute top-[65rem] -right-32 w-[500px] h-[500px] bg-primary/10 blur-[140px] pointer-events-none rounded-full"></div>

        {/* ================= SCREEN 1: CLEAN LANDING SCREEN ================= */}
        <section className="relative h-[calc(100dvh-4rem)] min-h-[540px] max-h-[820px] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-4 overflow-hidden">
          {/* Release Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-tertiary-fixed text-xs font-mono mb-3.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#61C554] animate-pulse"></span>
            <span>v1.0 Plugin Release</span>
            <span className="text-outline">•</span>
            <span className="text-primary-container font-semibold">100% Free &amp; Open Source</span>
          </div>

          {/* Headline with Zero-Jitter Single-Line Typewriter (Aceternity UI style) */}
          <h1 className="font-headline-lg text-[1.35rem] xs:text-[1.6rem] sm:text-[2rem] md:text-[2.4rem] lg:text-[2.8rem] xl:text-[3.1rem] text-on-surface tracking-tight leading-tight mb-3.5 whitespace-nowrap w-full text-center">
            Give your Claude Code sounds on every <RotatingWord />
          </h1>

          {/* Subtitle */}
          <p className="font-body-md text-body-md text-tertiary max-w-2xl text-center leading-relaxed mb-4">
            Acoustic feedback for Claude Code. Know when it thinks, edits, runs bash, or finishes — without watching your
            screen.
          </p>

          {/* Terminal Command Snippet Box */}
          <div className="relative group w-full max-w-2xl mb-5">
            <div className="absolute -inset-0.5 bg-primary-container/20 rounded-xl blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative bg-[#141210] rounded-xl p-3 pl-4 flex items-center justify-between border border-[#2E2B28] group-hover:border-primary-container/40 shadow-xl transition-all duration-200 gap-3">
              <div className="flex items-center gap-3 font-code text-xs sm:text-sm text-on-surface overflow-hidden min-w-0">
                <span className="text-primary-container select-none font-bold shrink-0">$</span>
                <span className="truncate font-medium text-tertiary-fixed">{PLUGIN_ONE_LINER}</span>
              </div>
              <button
                type="button"
                onClick={copyCliCommand}
                className="shrink-0 px-3.5 py-2 rounded-lg bg-surface-container-high text-tertiary-fixed hover:bg-surface-bright font-label-sm text-xs font-mono transition-all duration-150 flex items-center gap-1.5 cursor-pointer border border-outline-variant/20 hover:border-primary-container/40"
              >
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#claude-desktop-demo"
              className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-lg hover:shadow-primary-container/25 flex items-center gap-2 select-none font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Audition Live Demo</span>
            </a>
            <a
              href="#soundboard-matrix"
              className="px-5 py-3 rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-tertiary hover:text-on-surface font-label-md text-label-md transition-all flex items-center gap-2 border border-outline-variant/30 hover:border-outline-variant/60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-primary-container">library_music</span>
              <span>View Sound Library</span>
            </a>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-tertiary/60 hover:text-primary-container transition-colors">
            <a href="#claude-desktop-demo" aria-label="Scroll to live demo" className="flex flex-col items-center gap-1">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-outline">Interactive Demo</span>
              <span className="material-symbols-outlined text-[18px] animate-bounce">expand_more</span>
            </a>
          </div>
        </section>

        {/* Marquee removed per design adjustment */}

        {/* ================= SCREEN 2: HEADING & INTERACTIVE SIMULATION ================= */}
        <DesktopSimulation />

        {/* ================= SCREEN 3: DEDICATED SOUNDBOARD MATRIX ================= */}
        <SoundboardMatrix />

        {/* Studio moved to dedicated /studio page */}

        {/* QUICK METRICS STRIP */}
        <section className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/15">
            <div className="flex flex-col items-center text-center">
              <span className="font-label-md text-label-md text-primary-container font-semibold">&lt; 0.2ms</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">DSP Dispatch Latency</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">100% Offline</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Zero Cloud Telemetry</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">Native Audio</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">CoreAudio &amp; ALSA Fork</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">7 Soundpacks</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Customizable WAVs</span>
            </div>
          </div>
        </section>

        {/* SYSTEMS ENGINEERING: ZERO TERMINAL LAG */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block mb-2">
              Systems Engineering
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Engineered for Zero Terminal Lag</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-3">
              Audio should never degrade command-line performance. Claudetones uses native OS audio forks without bundling a
              heavy runtime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 rounded-2xl space-y-4 border border-outline-variant/15">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[28px]">speed</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">0ms Fire-and-Forget</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Async unblocked subprocess fork. Audio never holds or blocks token streams or command execution.
              </p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-2xl space-y-4 border border-outline-variant/15">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[28px]">memory</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">Native OS Audio Driver</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Direct CoreAudio &amp; ALSA playback. Zero Electron, Python, or WebAudio bloated process dependencies.
              </p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-2xl space-y-4 border border-outline-variant/15">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[28px]">shield</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">100% Offline &amp; Private</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Zero outbound sockets, zero external telemetry. All sound assets run entirely locally on your hardware.
              </p>
            </div>
          </div>
        </section>

        {/* SLASH COMMANDS REFERENCE */}
        <SlashCommands />

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <div className="text-center mb-12">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Acoustic Architecture Inquiries</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <h4
                onClick={() => toggleFaq(0)}
                className="font-headline-sm text-headline-sm text-tertiary-fixed mb-2 flex items-center justify-between cursor-pointer"
              >
                <span>Does claudetones add latency to Claude Code responses?</span>
                <span className="material-symbols-outlined text-[18px] text-primary-container">
                  {faqOpen[0] ? 'expand_less' : 'expand_more'}
                </span>
              </h4>
              {faqOpen[0] && (
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Zero milliseconds. Audio cues are dispatched asynchronously as detached subprocesses with zero blocking
                  on Claude’s token generation, tool calling, or bash subprocesses.
                </p>
              )}
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <h4
                onClick={() => toggleFaq(1)}
                className="font-headline-sm text-headline-sm text-tertiary-fixed mb-2 flex items-center justify-between cursor-pointer"
              >
                <span>Can I use this inside VS Code, Cursor, or headless Linux servers?</span>
                <span className="material-symbols-outlined text-[18px] text-primary-container">
                  {faqOpen[1] ? 'expand_less' : 'expand_more'}
                </span>
              </h4>
              {faqOpen[1] && (
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Yes. Plays cleanly via system audio binaries (`afplay` on macOS, `aplay`/`paplay` on Linux). Remote
                  headless SSH environments gracefully and silently suppress playback without throwing exceptions.
                </p>
              )}
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <h4
                onClick={() => toggleFaq(2)}
                className="font-headline-sm text-headline-sm text-tertiary-fixed mb-2 flex items-center justify-between cursor-pointer"
              >
                <span>How do I create and distribute my own custom soundpack?</span>
                <span className="material-symbols-outlined text-[18px] text-primary-container">
                  {faqOpen[2] ? 'expand_less' : 'expand_more'}
                </span>
              </h4>
              {faqOpen[2] && (
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Use the Pack Studio above to upload your WAV files and export a zip, or place 7 WAV files inside{' '}
                  <code className="text-tertiary-fixed">~/.claude/plugins/claudetones/packs/&lt;name&gt;/</code> with a
                  manifest json.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-24">
          <div className="bg-surface-container rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-outline-variant/20">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-container font-label-sm text-label-sm uppercase tracking-wide">
                <span className="material-symbols-outlined text-[16px]">headphones</span>
                <span>Transform Your Terminal Experience</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                Elevate your flow state with Claude.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
                Install in seconds. Instant acoustic awareness for every Claude task.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 max-w-full">
              <div className="px-4 py-3 rounded-xl bg-surface-container-lowest font-code text-xs sm:text-sm text-tertiary-fixed flex items-center gap-3 border border-outline-variant/25 overflow-hidden max-w-md">
                <span className="text-primary-container shrink-0 font-bold">$</span>
                <span className="truncate">claude plugin marketplace add parjanyaacoder/claudetones && claude plugin install claudetones</span>
              </div>
              <button
                type="button"
                onClick={copyBottomCommand}
                className="px-5 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all cursor-pointer font-medium shrink-0"
              >
                {bottomCopied ? 'Copied!' : 'Copy Command'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-[#181615] border-t border-[#2E2B28] mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
              </div>
              <div>
                <span className="font-serif text-lg font-medium text-on-surface block leading-tight">claudetones</span>
                <span className="text-xs text-on-surface-variant font-mono">100% Free & Open-Source Claude Code Audio Mod</span>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-on-surface-variant">
              <a href="#claude-desktop-demo" className="hover:text-on-surface transition-colors">
                Interactive App
              </a>
              <a href="#soundboard-matrix" className="hover:text-on-surface transition-colors">
                Soundboard
              </a>
              <a href="/studio" className="hover:text-on-surface transition-colors">
                Pack Studio
              </a>
              <a href="#slash-commands" className="hover:text-on-surface transition-colors">
                Slash Commands
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-on-surface transition-colors text-primary-container flex items-center gap-1 font-semibold"
              >
                <span>GitHub</span>
                <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
              </a>
            </nav>
          </div>

          <div className="pt-6 mt-6 border-t border-[#2E2B28]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-outline">
            <span>© 2025 Claudetones • Open-source Claude Code plugin</span>
            <span>MIT Licensed • Zero Cloud Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
