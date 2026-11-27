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

    // Typing speed: 75ms forward, 35ms backspacing
    const typingSpeed = isDeleting ? 35 : 75

    if (!isDeleting && displayText === fullText) {
      // Pause at full word before backspacing
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true)
      }, 1800)
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
  }, [displayText, isDeleting, currentWord])

  return (
    <span className={`inline font-serif italic ${currentWord.color} transition-colors duration-200`}>
      <span>{displayText}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[2px] h-[0.82em] ml-1 bg-current align-baseline animate-pulse font-normal not-italic opacity-80"
      />
    </span>
  )
}
