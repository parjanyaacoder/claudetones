'use client'

import React, { useState, useEffect } from 'react'

type WordItem = {
  text: string
  color: string
}

const WORDS: WordItem[] = [
  { text: 'tool call.', color: 'text-primary-container' },
  { text: 'error.', color: 'text-[#ffb4ab]' },
  { text: 'web search.', color: 'text-[#7cd5f7]' },
  { text: 'bash command.', color: 'text-[#facc15]' },
  { text: 'git commit.', color: 'text-[#c084fc]' },
  { text: 'test pass.', color: 'text-[#61C554]' },
  { text: 'mcp connect.', color: 'text-[#818cf8]' },
  { text: 'subagent spawn.', color: 'text-[#f472b6]' },
  { text: 'task complete.', color: 'text-[#34d399]' },
]

export default function RotatingWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const currentWord = WORDS[wordIndex]

  useEffect(() => {
    const fullText = currentWord.text

    // Typing speed: 70ms forward, 35ms backspacing
    const typingSpeed = isDeleting ? 35 : 70

    if (!isDeleting && displayText === fullText) {
      // Pause at full word before backspacing
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true)
      }, 1900)
      return () => clearTimeout(pauseTimer)
    }

    if (isDeleting && displayText === '') {
      // Pause before typing next word
      const nextWordTimer = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % WORDS.length)
      }, 200)
      return () => clearTimeout(nextWordTimer)
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentWord])

  return (
    // Fixed-width left-aligned slot (Aceternity UI style):
    // 1. Surrounding headline text stays 100% frozen in place (zero horizontal shift/jitter)
    // 2. whitespace-nowrap prevents words and cursor from ever breaking onto a second line
    <span className="inline-block text-left align-baseline whitespace-nowrap min-w-[7.6em] sm:min-w-[8.2em] md:min-w-[8.6em]">
      <span className={`inline font-serif italic ${currentWord.color} transition-colors duration-200`}>
        {displayText}
      </span>
      <span
        aria-hidden="true"
        className="inline-block w-[2.5px] h-[0.82em] ml-0.5 bg-primary-container align-baseline animate-pulse font-normal not-italic rounded-full"
      />
    </span>
  )
}
