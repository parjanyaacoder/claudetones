'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import DesktopSimulation from '@/components/DesktopSimulation'
import SoundboardMatrix from '@/components/SoundboardMatrix'
import SlashCommands from '@/components/SlashCommands'
import { GITHUB_URL } from '@/lib/catalog'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [bottomCopied, setBottomCopied] = useState(false)
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({ 0: true })

  const copyCliCommand = () => {
    navigator.clipboard.writeText('claude plugin install claudetones')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyBottomCommand = () => {
    navigator.clipboard.writeText('claude plugin install claudetones')
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
              <a
                href="#byos-section"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm font-body-sm"
              >
                Custom Audio
              </a>
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

      {/* AMBIENT GLOW BACKGROUND DECORATIONS */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[480px] bg-primary-container/10 blur-[140px] pointer-events-none rounded-full"></div>
        <div className="absolute top-[30rem] -left-32 w-[420px] h-[420px] bg-outline-variant/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-[60rem] -right-32 w-[480px] h-[480px] bg-primary/5 blur-[130px] pointer-events-none rounded-full"></div>

        {/* HERO SECTION */}
        <section className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-12 pb-12 md:pt-20 md:pb-16 flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight max-w-4xl leading-tight mb-6">
            Give your Claude Code sounds on every{' '}
            <span className="text-primary-container inline-flex relative h-[1.15em] overflow-hidden align-baseline">
              <span className="rotating-events-track italic">
                <span className="h-[1.15em] flex items-center">tool call.</span>
                <span className="h-[1.15em] flex items-center text-[#ffb4ab]">error.</span>
                <span className="h-[1.15em] flex items-center text-[#61C554]">success.</span>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-body-lg text-tertiary max-w-2xl text-center leading-relaxed mb-8">
            Acoustic feedback for Claude Code. Know when it thinks, edits, runs bash, or finishes — without watching your
            screen.
          </p>

          {/* Terminal Command Snippet Box */}
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl p-2 pl-4 flex items-center justify-between border border-outline-variant/30 shadow-xl mb-8">
            <div className="flex items-center gap-3 font-code text-code text-on-surface overflow-hidden">
              <span className="text-primary-container select-none">$</span>
              <span className="truncate font-medium text-tertiary-fixed">claude plugin install claudetones</span>
            </div>
            <button
              onClick={copyCliCommand}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container-high text-tertiary-fixed hover:bg-surface-bright font-label-sm text-label-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#claude-desktop-demo"
              className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-md flex items-center gap-2 select-none"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Audition Live Demo</span>
            </a>
            <a
              href="#soundboard-matrix"
              className="px-4 py-3 rounded-lg bg-transparent text-tertiary hover:text-tertiary-fixed font-label-md text-label-md transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">library_music</span>
              <span>View Sound Library</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-8 w-full max-w-3xl border-t border-outline-variant/20">
            <div className="flex flex-col items-center">
              <span className="font-label-md text-label-md text-primary-container font-semibold">&lt; 0.2ms</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">DSP Dispatch Latency</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">100% Offline</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Zero Cloud Telemetry</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">Native Audio</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">CoreAudio &amp; ALSA Fork</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">7 Soundpacks</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Fully Customizable WAVs</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DESKTOP & TERMINAL SIMULATION */}
        <DesktopSimulation />

        {/* INTERACTIVE SOUNDBOARD MATRIX */}
        <SoundboardMatrix />

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

        {/* BRING YOUR OWN SOUNDS (BYOS) */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16" id="byos-section">
          <div className="bg-surface-container-low rounded-3xl p-8 lg:p-12 overflow-hidden relative border border-outline-variant/20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block">
                  Extensible Acoustic Engine
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                  Bring Your Own Sounds (BYOS)
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Drop any 44.1kHz or 48kHz WAV cues into your config directory. Swap packs instantly via CLI.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="text-xl">🕹️</span>
                    <div>
                      <div className="font-body-sm text-body-sm font-medium text-tertiary-fixed">Retro 8-Bit</div>
                      <div className="font-label-sm text-label-sm text-outline">NES / GameBoy cues</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="text-xl">⌨️</span>
                    <div>
                      <div className="font-body-sm text-body-sm font-medium text-tertiary-fixed">Sublime Keeb</div>
                      <div className="font-label-sm text-label-sm text-outline">Holy Panda switches</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="text-xl">💾</span>
                    <div>
                      <div className="font-body-sm text-body-sm font-medium text-tertiary-fixed">Windows 95</div>
                      <div className="font-label-sm text-label-sm text-outline">Brian Eno chords</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="text-xl">🔬</span>
                    <div>
                      <div className="font-body-sm text-body-sm font-medium text-tertiary-fixed">Portal GLaDOS</div>
                      <div className="font-label-sm text-label-sm text-outline">Aperture Science chime</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directory Tree Preview Mockup */}
              <div className="lg:col-span-6">
                <div className="bg-surface-container-lowest rounded-xl p-5 font-code text-code text-on-surface-variant shadow-xl border border-outline-variant/20">
                  <div className="flex items-center justify-between pb-3 mb-3 text-outline border-b border-outline-variant/15">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary-container">folder_open</span>
                      <span className="text-tertiary-fixed">~/.claude/plugins/claudetones/</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline">config.json</span>
                  </div>
                  <div className="space-y-1.5 pl-2">
                    <div className="text-tertiary">
                      <span className="text-outline">└──</span>{' '}
                      <span className="text-primary-container font-semibold">sounds/</span>
                    </div>
                    <div className="pl-4 text-on-surface">
                      <span className="text-outline">│&nbsp;&nbsp;└──</span> session_start.wav
                    </div>
                    <div className="pl-4 text-on-surface">
                      <span className="text-outline">│&nbsp;&nbsp;└──</span> turn_start.wav
                    </div>
                    <div className="pl-4 text-on-surface">
                      <span className="text-outline">│&nbsp;&nbsp;└──</span> bash_exec.wav
                    </div>
                    <div className="pl-4 text-on-surface">
                      <span className="text-outline">│&nbsp;&nbsp;└──</span> file_edit.wav
                    </div>
                    <div className="pl-4 text-on-surface">
                      <span className="text-outline">│&nbsp;&nbsp;└──</span> error_sting.wav
                    </div>
                    <div className="pl-4 text-on-surface">
                      <span className="text-outline">│&nbsp;&nbsp;└──</span> turn_complete.wav
                    </div>
                    <div className="text-tertiary">
                      <span className="text-outline">└──</span>{' '}
                      <span className="text-tertiary-fixed font-semibold">claudetones.config.json</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 text-outline font-label-sm text-label-sm flex items-center justify-between border-t border-outline-variant/15">
                    <span>Format: 16-bit PCM WAV, 44.1kHz</span>
                    <span className="text-primary-container font-semibold">Drag &amp; Drop Ready</span>
                  </div>
                </div>
              </div>
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
                  Simply place 7 WAV files inside <code className="text-tertiary-fixed">~/.claude/plugins/claudetones/packs/&lt;name&gt;/</code> with a manifest json. You can share your pack folder or publish it to the community catalog.
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
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-xl bg-surface-container-lowest font-code text-code text-tertiary-fixed flex items-center gap-3 border border-outline-variant/25">
                <span className="text-primary-container">$</span>
                <span>claude plugin install claudetones</span>
              </div>
              <button
                onClick={copyBottomCommand}
                className="px-5 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all cursor-pointer font-medium"
              >
                {bottomCopied ? 'Copied!' : 'Copy Command'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-[#181615] border-t border-[#2E2B28] mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                </div>
                <span className="font-serif text-lg font-medium text-on-surface">claudetones</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
                An acoustic companion and audio design atelier engineered for reflective thinking and rhythmic
                human-machine dialogue.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="space-y-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block">
                  Experience
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm">
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                      href="#claude-desktop-demo"
                    >
                      Interactive App
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                      href="#soundboard-matrix"
                    >
                      Soundboard
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                      href="#byos-section"
                    >
                      Acoustic Presets
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block">
                  Documentation
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm">
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Specifications
                    </a>
                  </li>
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Web Audio API
                    </a>
                  </li>
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Keyboard Cues
                    </a>
                  </li>
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Release Notes
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block">
                  Ecosystem
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm">
                  <li>
                    <a
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub Repo
                    </a>
                  </li>
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Claude Desktop Mod
                    </a>
                  </li>
                  <li>
                    <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">
                      Anthropic Style Kit
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#2E2B28]/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-secondary">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span>© 2025 Claudetones Atelier.</span>
              <span>Crafted for reflective computation.</span>
            </div>
            <div className="flex items-center gap-6 text-on-surface-variant">
              <a className="hover:text-on-surface transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-on-surface transition-colors" href="#">
                Acoustic Ethics
              </a>
              <a
                className="hover:text-on-surface transition-colors"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
