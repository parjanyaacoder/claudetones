'use client'

import { useState } from 'react'

export default function CopyButton({
  value,
  label = 'Copy',
  className = '',
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard can be blocked (insecure context / permissions) — fail quiet
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`rounded-lg border border-line bg-ink-soft px-3 py-1.5 font-mono text-xs text-muted transition hover:border-pop hover:text-white ${className}`}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}
