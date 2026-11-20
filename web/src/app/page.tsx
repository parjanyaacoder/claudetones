import Link from 'next/link'

import CopyButton from '@/components/CopyButton'
import Soundboard from '@/components/Soundboard'
import { GITHUB_URL, INSTALL_COMMANDS, SOUNDS } from '@/lib/catalog'

const installSnippet = INSTALL_COMMANDS.join('\n')

function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-end justify-center gap-0.5 rounded-lg bg-pop/15 p-1.5 shadow-inner">
        <span className="h-2 w-1 rounded-full bg-pop" />
        <span className="h-4 w-1 rounded-full bg-pop animate-pulse" />
        <span className="h-2.5 w-1 rounded-full bg-pop" />
      </span>
      <span className="font-bold tracking-tight text-white text-base">claudetones</span>
    </span>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <Link href="/" aria-label="claudetones home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-muted sm:flex">
          <a className="transition hover:text-white" href="#sounds">
            Soundboard
          </a>
          <a className="transition hover:text-white" href="#how">
            How it works
          </a>
          <a className="transition hover:text-white" href="#custom">
            Custom Sounds
          </a>
          <a className="transition hover:text-white" href="#commands">
            Commands
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-ink-card/80 px-3.5 py-1.5 text-sm font-medium text-white transition hover:border-pop/60 hover:bg-ink-soft"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Star on GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

function InstallBlock() {
  return (
    <div className="rounded-2xl border border-line bg-ink-soft/90 p-4 shadow-xl">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
          ⚡ 1-Click Install in Claude Code
        </span>
        <CopyButton value={installSnippet} label="Copy Commands" />
      </div>
      <pre className="overflow-x-auto rounded-xl bg-ink p-3 font-mono text-sm leading-relaxed text-mint">
        {INSTALL_COMMANDS.map(cmd => (
          <div key={cmd}>
            <span className="select-none text-muted">$ </span>
            {cmd}
          </div>
        ))}
      </pre>
    </div>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 sm:pt-24">
      <div className="flex flex-wrap items-center gap-2.5 mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-xs font-semibold text-mint">
          <span className="h-2 w-2 rounded-full bg-mint animate-ping" />
          100% Free & Open Source
        </span>
        <span className="rounded-full border border-line bg-ink-soft px-3 py-1 font-mono text-xs text-muted">
          Official Claude Code Mod
        </span>
      </div>

      <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-6xl">
        Give your Claude Code sessions a{' '}
        <span className="bg-gradient-to-r from-pop via-pop-2 to-mint bg-clip-text text-transparent">
          soundtrack
        </span>
        .
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
        claudetones plays crisp audio cues at every beat of your workflow — a chime when you open the terminal, a tick while Claude thinks, a click on every Bash command, and a victory fanfare when your task lands.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <InstallBlock />
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#sounds"
              className="inline-flex items-center gap-2 rounded-xl bg-pop px-5 py-3 text-sm font-semibold text-ink transition hover:bg-pop/90 shadow-lg shadow-pop/20"
            >
              <span>Play Interactive Soundboard</span>
              <span>↓</span>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-ink-card px-5 py-3 text-sm font-medium text-white transition hover:border-pop/60"
            >
              <span>View Source</span>
            </a>
          </div>
          <p className="text-xs text-muted">
            Zero setup required • Runs completely offline • Built-in volume leveling
          </p>
        </div>

        {/* Mock Terminal Card */}
        <div className="rounded-2xl border border-line bg-ink-card/80 p-5 font-mono text-xs shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[11px] text-muted font-sans">terminal — zsh</span>
          </div>
          <div className="space-y-3 leading-relaxed">
            <div>
              <span className="text-muted">$ </span>
              <span className="text-white font-semibold">claude</span>
              <div className="text-mint pl-4">🎵 session.start → Launch Chime</div>
            </div>
            <div>
              <span className="text-muted">&gt; </span>
              <span className="text-white">refactor auth & run test suite</span>
              <div className="text-gold pl-4">💭 turn.start → Deep Reasoning Ticker</div>
            </div>
            <div>
              <span className="text-muted">⚡ </span>
              <span className="text-white">Bash: npm test</span>
              <div className="text-pop pl-4">⌨️ tool.call → Sci-Fi Confirm Click</div>
            </div>
            <div>
              <span className="text-mint font-bold">✔ 14 tests passing</span>
              <div className="text-mint pl-4">🎉 turn.complete → Level Complete Fanfare</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Sounds() {
  return (
    <section id="sounds" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Interactive Soundboard</h2>
        <p className="mt-2 text-muted">
          Click any button below to audition the built-in sound themes. Every event includes both a clean <strong>Minimal</strong> chime and a retro <strong>Arcade</strong> synth.
        </p>
      </div>
      <Soundboard />
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'One-Click Install',
      body: 'Add the plugin from the marketplace. It immediately activates in your next Claude Code session without touching config files.',
    },
    {
      n: '2',
      title: 'Pure Hook Lifecycle',
      body: 'Hooks directly into the engine lifecycle (session.start, turn.start, tool.call, error, complete) with non-blocking audio dispatch.',
    },
    {
      n: '3',
      title: '100% Offline & Lightweight',
      body: 'Zero network calls, no cloud telemetry, and no DRM. Native audio playback using your macOS system audio player.',
    },
  ]
  return (
    <section id="how" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 border-t border-line/60">
      <h2 className="text-3xl font-bold tracking-tight text-white">How it works</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {steps.map(step => (
          <div key={step.n} className="rounded-2xl border border-line bg-ink-soft/70 p-6">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-pop/15 font-mono text-sm font-bold text-pop">
              {step.n}
            </div>
            <h3 className="font-semibold text-white text-base">{step.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CustomSoundsGuide() {
  return (
    <section id="custom" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 border-t border-line/60">
      <div className="rounded-3xl border border-line bg-gradient-to-br from-ink-soft via-ink-card to-ink p-8 sm:p-10 shadow-2xl">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-pop font-semibold">
            BYOS • Bring Your Own Sounds
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Use your favorite meme sounds locally
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Want Windows XP startup, Vine booms, or GTA victory fanfares? Drop any personal <code className="rounded bg-ink px-1.5 py-0.5 text-xs text-white">.mp3</code> or <code className="rounded bg-ink px-1.5 py-0.5 text-xs text-white">.wav</code> into your local sounds directory.
          </p>

          <div className="mt-6 space-y-3 font-mono text-xs text-mint">
            <div className="rounded-xl border border-line/80 bg-ink p-3.5">
              <span className="text-muted"># 1. Drop your custom audio into the sounds directory:</span>
              <div className="text-white mt-1">~/.claude/plugins/claudetones/sounds/my-custom-sound.mp3</div>
            </div>
            <div className="rounded-xl border border-line/80 bg-ink p-3.5">
              <span className="text-muted"># 2. Test it instantly inside Claude Code:</span>
              <div className="text-white mt-1">/claudetones test done</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Commands() {
  const cmds = [
    { cmd: '/claudetones', desc: 'Toggle mute on or off across your sessions' },
    { cmd: '/claudetones test [event]', desc: 'Audition a sound immediately (e.g. /claudetones test error)' },
    { cmd: '/claudetones status', desc: 'Check whether audio is currently muted or active' },
    { cmd: '/oops', desc: 'Caught Claude hallucinating? Plays the sad sound even when muted' },
  ]
  return (
    <section id="commands" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 border-t border-line/60">
      <h2 className="text-3xl font-bold tracking-tight text-white">Slash Commands</h2>
      <p className="mt-2 text-muted">Control your audio environment directly inside your terminal.</p>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-ink-soft/70 overflow-hidden">
        {cmds.map(c => (
          <div key={c.cmd} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
            <code className="font-mono text-sm text-pop font-semibold">{c.cmd}</code>
            <span className="text-sm text-muted">{c.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const items = [
    {
      q: 'Is claudetones completely free?',
      a: 'Yes, 100% free and open-source under the MIT license. No paywalls, no subscriptions, and no accounts required.',
    },
    {
      q: 'Will it slow down Claude Code or block tools?',
      a: 'Never. Sounds are dispatched asynchronously (fire-and-forget). The hook notifies the audio player and immediately lets Claude continue its turn without delay.',
    },
    {
      q: 'How does it play audio without external apps?',
      a: 'It uses Claude Code’s native $.audio.play engine API, which interacts with your operating system’s audio layer with zero latency.',
    },
    {
      q: 'Can I mute it during meetings or calls?',
      a: 'Yes! Just type /claudetones to toggle mute instantly. Your mute preference is remembered across sessions.',
    },
  ]
  return (
    <section id="faq" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 border-t border-line/60">
      <h2 className="text-3xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-ink-soft/70">
        {items.map(item => (
          <details key={item.q} className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
              {item.q}
              <span className="text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line/80 bg-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex flex-wrap items-center gap-6">
          <a className="hover:text-white transition" href="#sounds">
            Soundboard
          </a>
          <a className="hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="text-xs text-muted/60">Released under MIT License</span>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-ink text-white selection:bg-pop/30">
      <Nav />
      <main>
        <Hero />
        <Sounds />
        <HowItWorks />
        <CustomSoundsGuide />
        <Commands />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
