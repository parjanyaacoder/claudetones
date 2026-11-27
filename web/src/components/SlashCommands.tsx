'use client'

import React from 'react'
import { audioEngine, useAudioState } from '@/lib/audio'

type CommandRow = {
  command: string
  params: string
  description: string
  actionLabel: string
  soundType?: 'boot' | 'tick' | 'click' | 'pip' | 'error' | 'fanfare'
}

const COMMANDS: CommandRow[] = [
  {
    command: '/claudetones pause',
    params: '[none]',
    description: 'Pauses sound playback across all lifecycle events immediately.',
    actionLabel: 'Pause',
    soundType: 'pip',
  },
  {
    command: '/claudetones play',
    params: '[none]',
    description: 'Resumes acoustic cue playback for the active session.',
    actionLabel: 'Resume',
    soundType: 'boot',
  },
  {
    command: '/claudetones stop',
    params: '[none]',
    description: 'Immediately halts current sound and cancels any pending ponder tones.',
    actionLabel: 'Stop',
    soundType: 'error',
  },
  {
    command: '/claudetones status',
    params: '[none]',
    description: 'Displays current playback state (Active, Paused, Muted) and active session.',
    actionLabel: 'Status',
    soundType: 'tick',
  },
  {
    command: '/claudetones test',
    params: '[event]',
    description: 'Auditions an individual event cue (e.g. test done, test error, test web_search).',
    actionLabel: 'Test',
    soundType: 'click',
  },
  {
    command: '/claudetones log',
    params: '[none]',
    description: 'Displays real-time telemetry log: events, played sounds, dropped collisions, and preemptions.',
    actionLabel: 'Log',
    soundType: 'tick',
  },
  {
    command: '/claudetones clear-log',
    params: '[none]',
    description: 'Clears ~/.claude/claudetones_telemetry.log on disk.',
    actionLabel: 'Clear',
    soundType: 'pip',
  },
  {
    command: '/oops',
    params: '[none]',
    description: 'Plays the dramatic sad sound even when claudetones is muted.',
    actionLabel: 'Oops',
    soundType: 'error',
  },
]

export default function SlashCommands() {
  const { activeId, isPlaying } = useAudioState()

  const handleTest = (row: CommandRow, idx: number) => {
    if (row.soundType) {
      audioEngine.toggle(`cmd-${idx}`, row.soundType)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-20 scroll-mt-16" id="slash-commands">
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
                const isThisPlaying = activeId === `cmd-${idx}` && isPlaying
                return (
                  <tr key={cmd.command} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-4 px-6 font-code text-code text-primary-container font-medium">
                      {cmd.command}
                    </td>
                    <td className="py-4 px-6 font-code text-code text-outline">{cmd.params}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{cmd.description}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleTest(cmd, idx)}
                        className={`px-3 py-1 rounded-lg font-label-sm text-xs transition-all cursor-pointer font-medium ${
                          isThisPlaying
                            ? 'bg-primary-container text-on-primary-container shadow-sm ring-1 ring-primary-container'
                            : 'bg-surface-container text-tertiary-fixed hover:bg-surface-container-high'
                        }`}
                      >
                        {isThisPlaying ? 'Playing' : cmd.actionLabel}
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
