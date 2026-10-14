import Link from 'next/link'
import { Suspense } from 'react'

import ClaimLicense from '@/components/ClaimLicense'

export const metadata = {
  title: 'poptunes — your Pro pack',
}

type SearchParams = { [key: string]: string | string[] | undefined }

export default function SuccessPage(props: { searchParams: Promise<SearchParams> }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 font-mono text-sm text-muted hover:text-white">
        ← poptunes
      </Link>
      <h1 className="mb-3 text-3xl font-bold text-white">You’re in. 🎉</h1>
      <p className="mb-8 text-muted">
        The Pro pack swaps your free sounds for the meme stings — Jeopardy while it
        thinks, the Metal Gear alert on every tool call, GTA on done.
      </p>
      <Suspense fallback={<p className="text-muted">Looking up your license…</p>}>
        <Claim searchParams={props.searchParams} />
      </Suspense>
      <p className="mt-10 text-xs text-muted">
        Trouble? Email{' '}
        <a className="underline" href="mailto:support@poptunes.dev">
          support@poptunes.dev
        </a>
        .
      </p>
    </main>
  )
}

async function Claim({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const pick = (name: string): string | undefined => {
    const value = sp[name]
    return Array.isArray(value) ? value[0] : value
  }

  return (
    <ClaimLicense
      paymentId={pick('payment_id') ?? pick('paymentId') ?? pick('order_id')}
      email={pick('email')}
      dev={pick('dev') === '1'}
    />
  )
}
