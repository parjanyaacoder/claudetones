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
    }, 2600)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="inline-grid relative align-baseline text-left overflow-hidden min-w-[4.8ch] sm:min-w-[5.2ch] h-[1.25em] pl-1">
      {WORDS.map((w, i) => {
        const isActive = i === index
        const isPrev = i === (index - 1 + WORDS.length) % WORDS.length

        return (
          <span
            key={w.text}
            className={`col-start-1 row-start-1 inline-flex items-center italic transition-all duration-500 ease-out transform ${
              w.color
            } ${
              isActive
                ? 'opacity-100 translate-y-0 scale-100'
                : isPrev
                ? 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            {w.text}
          </span>
        )
      })}
    </span>
  )
}
