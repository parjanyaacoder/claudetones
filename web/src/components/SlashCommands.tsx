'use client'

import React, { useState } from 'react'
import { playAcousticCue } from '@/lib/audio'

type CommandRow = {
  command: string
  params: string
  description: string
  actionLabel: string
  soundType?: 'boot' | 'tick' | 'click' | 'pip'
}

const COMMANDS: CommandRow[] = [
  {
    command: '/claudetones',
    params: '[status]',
    description: 'Displays active soundpack, audio driver, master volume, and latency status in terminal.',
    actionLabel: 'Run',
    soundType: 'tick',
  },
  {
    command: '/claudetones test',
    params: '[event-name]',
    description: 'Auditions an individual event cue (e.g. test bash, test complete).',
    actionLabel: 'Run',
    soundType: 'click',
  },
  {
    command: '/claudetones volume',
    params: '[0 - 100]',
    description: 'Adjusts output gain without modifying your host system master audio volume.',
    actionLabel: 'Run',
    soundType: 'pip',
  },
  {
    command: '/claudetones mute',
    params: '[none]',
    description: 'Temporarily silences all acoustic cues for distraction-free silent mode. Toggle with /unmute.',
    actionLabel: 'Mute',
  },
  {
    command: '/claudetones pack',
    params: '[pack-name]',
    description: 'Hot-swaps active pack (e.g. pack retro-8bit, pack mechanical) on the fly.',
    actionLabel: 'Run',
    soundType: 'boot',
  },
]

export default function SlashCommands() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const handleTest = (row: CommandRow, idx: number) => {
    setActiveIdx(idx)
    if (row.soundType) {
      playAcousticCue(row.soundType)
    }
    setTimeout(() => {
      setActiveIdx((curr) => (curr === idx ? null : curr))
    }, 500)
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16" id="slash-commands">
      <div className="mb-10">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container block mb-2">
          CLI Command Palette
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Integrated Slash Commands</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-2">
          Control volume, swap packs, or instantly mute the audio engine without leaving your Claude Code conversational
          terminal session.
        </p>
      </div>

      <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border border-outline-variant/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-surface-container text-tertiary font-label-sm text-label-sm uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Command</th>
                <th className="py-3 px-6">Parameters</th>
                <th className="py-3 px-6">Behavior Description</th>
                <th className="py-3 px-6 text-right">Quick Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {COMMANDS.map((cmd, idx) => {
                const isActive = activeIdx === idx
                return (
                  <tr key={cmd.command} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-4 px-6 font-code text-code text-primary-container font-medium">
                      {cmd.command}
                    </td>
                    <td className="py-4 px-6 font-code text-code text-outline">{cmd.params}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{cmd.description}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleTest(cmd, idx)}
                        className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container text-tertiary-fixed hover:bg-surface-container-high'
                        }`}
                      >
                        {cmd.actionLabel}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
