import Link from 'next/link'

import BuyButton from '@/components/BuyButton'
import CopyButton from '@/components/CopyButton'
import Soundboard from '@/components/Soundboard'
import { GITHUB_URL, INSTALL_COMMANDS, PRO_PRICE, SOUNDS } from '@/lib/catalog'

const installSnippet = INSTALL_COMMANDS.join('\n')

function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-6 w-6 items-end justify-center gap-0.5 rounded-md bg-pop/15 p-1">
        <span className="h-2 w-0.5 rounded-full bg-pop" />
        <span className="h-3.5 w-0.5 rounded-full bg-pop" />
        <span className="h-1.5 w-0.5 rounded-full bg-pop" />
      </span>
      <span className="font-semibold tracking-tight text-white">poptunes</span>
    </span>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="poptunes home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <a className="hover:text-white" href="#sounds">
            Sounds
          </a>
          <a className="hover:text-white" href="#how">
            How it works
          </a>
          <a className="hover:text-white" href="#pricing">
            Pricing
          </a>
          <a className="hover:text-white" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <a
          href="#pricing"
          className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Get Pro
        </a>
      </nav>
    </header>
  )
}

function InstallBlock() {
  return (
    <div className="rounded-2xl border border-line bg-ink-soft/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">
          Install in Claude Code
        </span>
        <CopyButton value={installSnippet} label="Copy" />
      </div>
      <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-mint">
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
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-ink-soft px-3 py-1 font-mono text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-mint" />A Claude Code plugin
      </p>
      <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
        Give your Claude Code sessions a{' '}
        <span className="bg-gradient-to-r from-pop to-pop-2 bg-clip-text text-transparent">
          soundtrack
        </span>
        .
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        poptunes plays a sound at every beat of a session — a chime when it opens, a tick
        while Claude thinks, a ding when it&apos;s done, and a sting the moment something
        breaks. Seven events, zero config.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <InstallBlock />
          <div className="flex flex-wrap items-center gap-4">
            <BuyButton>{`Get the Pro pack — ${PRO_PRICE} once`}</BuyButton>
            <a
              href="#sounds"
              className="text-sm font-medium text-muted underline-offset-4 hover:text-white hover:underline"
            >
              Hear the sounds ↓
            </a>
          </div>
          <p className="text-xs text-muted">
            Free pack included. {SOUNDS.length} sounds, works wherever Claude Code runs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { n: '7', label: 'events covered' },
            { n: String(SOUNDS.length), label: 'sounds' },
            { n: '0', label: 'lines of config' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-ink-card/60 px-4 py-5 text-center"
            >
              <div className="text-3xl font-bold text-white">{stat.n}</div>
              <div className="mt-1 text-xs text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Sounds() {
  return (
    <section id="sounds" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14">
      <h2 className="text-3xl font-bold tracking-tight text-white">Hear it first.</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Every event ships with a free sound and a Pro alternative. Tap any button to play
        it — green is the free pack, gold is Pro.
      </p>
      <div className="mt-8">
        <Soundboard />
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Install the plugin',
      body: 'Two commands add the marketplace and install poptunes. No accounts, no config files.',
    },
    {
      n: '2',
      title: 'It scores itself',
      body: 'poptunes hooks the session lifecycle and plays the right sound for each event automatically — free sounds by default.',
    },
    {
      n: '3',
      title: 'Go Pro for the meme pack',
      body: 'One key swaps every free sound for its Pro sibling: Jeopardy, Metal Gear, GTA, and friends.',
    },
  ]
  return (
    <section id="how" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14">
      <h2 className="text-3xl font-bold tracking-tight text-white">How it works</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map(step => (
          <div key={step.n} className="rounded-2xl border border-line bg-ink-soft/70 p-5">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-pop/15 font-mono text-sm font-semibold text-pop">
              {step.n}
            </div>
            <h3 className="font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14">
      <h2 className="text-3xl font-bold tracking-tight text-white">Simple pricing</h2>
      <p className="mt-3 text-muted">Pay once. It&apos;s a file, not a subscription.</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-ink-soft/70 p-6">
          <h3 className="text-lg font-semibold text-white">Free</h3>
          <div className="mt-2 text-4xl font-extrabold text-white">$0</div>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {[
              'All 7 events covered',
              'One free sound per event',
              'Session lifecycle + tool calls + errors',
              '/poptunes mute built in',
            ].map(item => (
              <li key={item} className="flex gap-2">
                <span className="text-mint">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <InstallBlock />
          </div>
        </div>

        <div className="relative rounded-2xl border border-pop/50 bg-gradient-to-b from-pop/10 to-ink-soft/70 p-6">
          <span className="absolute right-5 top-5 rounded-full bg-pop px-2.5 py-0.5 text-[11px] font-semibold text-ink">
            Pro
          </span>
          <h3 className="text-lg font-semibold text-white">Pro Pack</h3>
          <div className="mt-2 text-4xl font-extrabold text-white">
            {PRO_PRICE}
            <span className="ml-1 text-sm font-normal text-muted">once</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {[
              'All 7 Pro sounds unlocked',
              'Each replaces its free sibling',
              'Activates on 2 devices',
              'Lifetime updates to the Pro pack',
              'Unlock with one key — no account',
            ].map(item => (
              <li key={item} className="flex gap-2">
                <span className="text-gold">★</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <BuyButton>Buy Pro — {PRO_PRICE}</BuyButton>
            <p className="mt-3 text-xs text-muted">
              Secure checkout by Dodo Payments. Your key appears instantly after payment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const items = [
    {
      q: 'Is this an MCP server?',
      a: 'No. poptunes is a pure Claude Code plugin — it hooks the session lifecycle and plays audio locally. Nothing runs in the cloud.',
    },
    {
      q: 'Will it slow Claude down?',
      a: 'No. Sounds are fire-and-forget: the hook kicks off the clip and returns immediately, so nothing blocks the model.',
    },
    {
      q: 'What do I get for Pro?',
      a: 'The meme pack: one alternate sound for each of the seven events (Jeopardy while it thinks, Metal Gear on tool calls, GTA on done…). Unlock it with a single key.',
    },
    {
      q: 'How many machines can I use?',
      a: 'Two devices per key. The key activates on first use and remembers the machines it has seen.',
    },
    {
      q: 'Can I use my own sounds?',
      a: 'Not yet — custom sound packs and per-event config are on the roadmap. Pro buyers get lifetime updates.',
    },
    {
      q: 'Refunds?',
      a: 'Dodo Payments is the merchant of record and handles receipts and refunds. Email support and we’ll make it right.',
    },
  ]
  return (
    <section id="faq" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-14">
      <h2 className="text-3xl font-bold tracking-tight text-white">Questions</h2>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-ink-soft/70">
        {items.map(item => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
              {item.q}
              <span className="text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-line/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex flex-wrap gap-5">
          <a className="hover:text-white" href="#sounds">
            Sounds
          </a>
          <a className="hover:text-white" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-white" href="mailto:support@poptunes.dev">
            Support
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-10">
        <p className="text-xs leading-relaxed text-muted/80">
          poptunes is an independent project and is not affiliated with, endorsed by, or
          sponsored by any game studio, film, or music rights holder. Clip names are used
          descriptively. Pro purchasers license the software and the service of sourcing
          and organizing the clips.
        </p>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Sounds />
        <HowItWorks />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
