'use client'

import React, { useState, useEffect } from 'react'

const WORDS = [
  { text: 'tool call.', color: 'text-primary-container' },
  { text: 'error.', color: 'text-[#ffb4ab]' },
  { text: 'success.', color: 'text-[#61C554]' },
]

export default function RotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="inline-block relative overflow-hidden align-bottom h-[1.25em] min-w-[7ch] sm:min-w-[7.5ch] text-left">
      {WORDS.map((w, i) => {
        const isActive = i === index
        const isPrev = i === (index - 1 + WORDS.length) % WORDS.length

        return (
          <span
            key={w.text}
            aria-hidden={!isActive}
            className={`absolute left-0 top-0 italic whitespace-nowrap transition-all duration-500 ease-in-out transform ${
              w.color
            } ${
              isActive
                ? 'opacity-100 translate-y-0 visible'
                : isPrev
                ? 'opacity-0 -translate-y-full pointer-events-none'
                : 'opacity-0 translate-y-full pointer-events-none'
            }`}
          >
            {w.text}
          </span>
        )
      })}
    </span>
  )
}

