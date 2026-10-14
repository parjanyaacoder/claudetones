'use client'

import { useEffect, useState } from 'react'

import CopyButton from './CopyButton'

type Status = 'loading' | 'ready' | 'pending' | 'error'

export default function ClaimLicense({
  paymentId,
  email,
  dev = false,
}: {
  paymentId?: string
  email?: string
  dev?: boolean
}) {
  const [status, setStatus] = useState<Status>('loading')
  const [key, setKey] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    async function claim(attempt: number): Promise<void> {
      try {
        if (dev) {
          const res = await fetch('/api/dev/mint', { method: 'POST' })
          if (!res.ok) throw new Error('Dev minting is unavailable in production.')
          const data = (await res.json()) as { key: string }
          if (!cancelled) {
            setKey(data.key)
            setStatus('ready')
          }
          return
        }

        if (!paymentId) {
          if (!cancelled) {
            setStatus('error')
            setMessage(
              'No order reference in the link. Reply to your receipt or email support and we’ll sort it out.',
            )
          }
          return
        }

        const res = await fetch('/api/license/claim', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ paymentId, email }),
        })
        if (res.status === 202) {
          // The webhook hasn't landed yet — retry a few times.
          if (attempt < 10) {
            timer = setTimeout(() => void claim(attempt + 1), 2000)
            if (!cancelled) setStatus('pending')
          } else if (!cancelled) {
            setStatus('pending')
          }
          return
        }
        const data = (await res.json()) as { key?: string; error?: string }
        if (!res.ok) throw new Error(data.error ?? 'We could not find your order.')
        if (!cancelled) {
          setKey(data.key ?? null)
          setStatus('ready')
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setMessage((err as Error).message)
        }
      }
    }

    void claim(0)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [dev, paymentId, email])

  if (status === 'loading') {
    return <p className="text-muted">Looking up your license…</p>
  }

  if (status === 'pending') {
    return (
      <p className="text-muted">
        Payment received — generating your key… this usually takes a few seconds.
      </p>
    )
  }

  if (status === 'error') {
    return (
      <div className="space-y-2">
        <p className="text-pop">{message}</p>
        <p className="text-sm text-muted">
          If you were charged, email{' '}
          <a className="underline" href="mailto:support@poptunes.dev">
            support@poptunes.dev
          </a>{' '}
          with your receipt and we’ll send your key.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-muted">
        Here’s your key{dev ? ' (dev mode — not a real purchase)' : ''}. Keep it safe; it
        activates up to 2 devices.
      </p>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-ink-soft px-4 py-3">
        <code className="font-mono text-base text-white">{key}</code>
        <CopyButton value={key ?? ''} label="Copy key" />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted">Unlock it inside Claude Code:</p>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-ink px-4 py-3">
          <code className="font-mono text-sm text-mint">
            /poptunes unlock {key}
          </code>
          <CopyButton value={`/poptunes unlock ${key}`} label="Copy command" />
        </div>
      </div>
    </div>
  )
}
