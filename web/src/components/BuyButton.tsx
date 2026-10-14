'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

export default function BuyButton({
  children = 'Get the Pro pack',
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buy() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error(data.error ?? 'Could not start checkout.')
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-xl bg-pop px-5 py-3 text-sm font-semibold text-ink transition hover:bg-pop/90 disabled:opacity-60 ${className}`}
      >
        {loading ? 'Opening checkout…' : children}
      </button>
      {error && <span className="text-xs text-pop">{error}</span>}
    </div>
  )
}
