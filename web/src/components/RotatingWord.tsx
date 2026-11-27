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
  const fullText = currentWord.text

  useEffect(() => {
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
      }, 250)
      return () => clearTimeout(nextWordTimer)
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, fullText])

  // Characters remaining to complete the current word (rendered invisibly to hold layout space)
  const remainingText = fullText.slice(displayText.length)

  return (
    // Natural word-fit container:
    // 1. Reserves the exact width of the active word using invisible placeholder characters
    // 2. Zero horizontal jitter during typing or backspacing (width is strictly constant for the word)
    // 3. Zero extra dead-space padding on the right when word finishes typing
    // 4. Guarantees the entire headline is mathematically centered on screen at all times!
    <span className="inline-block relative text-left align-baseline whitespace-nowrap">
      <span className={`inline font-serif italic ${currentWord.color} transition-colors duration-200`}>
        {displayText}
      </span>
      {/* Blinking typewriter cursor positioned directly after the typed letters */}
      <span
        aria-hidden="true"
        className="inline-block w-[2.5px] h-[0.82em] ml-0.5 mr-0.5 bg-primary-container align-baseline animate-pulse font-normal not-italic rounded-full"
      />
      {/* Invisible layout placeholder for the rest of this word */}
      <span
        aria-hidden="true"
        className="opacity-0 select-none pointer-events-none font-serif italic"
      >
        {remainingText}
      </span>
    </span>
  )
}
