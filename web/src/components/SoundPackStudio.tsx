'use client'

import React, { useState, useRef } from 'react'
import JSZip from 'jszip'
import { audioEngine, useAudioState, type SoundType } from '@/lib/audio'

type EventItem = {
  key: string
  num: number
  title: string
  trigger: string
  description: string
  defaultFileName: string
  defaultAudioSrc: string
  soundType: SoundType
}

const ALL_7_EVENTS: EventItem[] = [
  {
    key: 'session_start',
    num: 1,
    title: 'Session Start',
    trigger: 'session.start',
    description: 'Welcome chime when Claude Code launches and connects.',
    defaultFileName: 'launch.wav',
    defaultAudioSrc: '/sounds/launch.wav',
    soundType: 'boot',
  },
  {
    key: 'reasoning',
    num: 2,
    title: 'Reasoning Start',
    trigger: 'turn.start',
    description: 'Subtle notification the moment Claude starts planning its response.',
    defaultFileName: 'ring.wav',
    defaultAudioSrc: '/sounds/ring.wav',
    soundType: 'tick',
  },
  {
    key: 'long_reasoning',
    num: 3,
    title: 'Deep Pondering',
    trigger: 'turn.start > 8s',
    description: 'Chrono metronome during complex reasoning turns longer than 8 seconds.',
    defaultFileName: 'timer.mp3',
    defaultAudioSrc: '/sounds/timer.mp3',
    soundType: 'ponder',
  },
  {
    key: 'terminal_command',
    num: 4,
    title: 'Bash Execution',
    trigger: 'tool.call: Bash',
    description: 'Mechanical feedback whenever a shell command or test runs.',
    defaultFileName: 'keyboard-click.mp3',
    defaultAudioSrc: '/sounds/keyboard-click.mp3',
    soundType: 'click',
  },
  {
    key: 'tool_call',
    num: 5,
    title: 'File Mutation / Edit',
    trigger: 'tool.call: Edit',
    description: 'Waterdrop click whenever Claude writes, edits, or patches files.',
    defaultFileName: 'pro-tool-call.mp3',
    defaultAudioSrc: '/sounds/pro-tool-call.mp3',
    soundType: 'pip',
  },
  {
    key: 'error',
    num: 6,
    title: 'Command Failed',
    trigger: 'isError: true',
    description: 'Warning alert whenever a tool call, test, or terminal command fails.',
    defaultFileName: 'error.wav',
    defaultAudioSrc: '/sounds/error.wav',
    soundType: 'error',
  },
  {
    key: 'done',
    num: 7,
    title: 'Turn Complete',
    trigger: 'turn.complete',
    description: 'Triumphant victory fanfare when Claude finishes all tasks and tests pass.',
    defaultFileName: 'ding-sound-effect-1.mp3',
    defaultAudioSrc: '/sounds/ding-sound-effect-1.mp3',
    soundType: 'fanfare',
  },
]

const PRESET_PACKS = {
  minimal: {
    name: 'minimal-atelier',
    sounds: {
      session_start: { name: 'launch.wav', src: '/sounds/launch.wav' },
      reasoning: { name: 'ring.wav', src: '/sounds/ring.wav' },
      long_reasoning: { name: 'timer.mp3', src: '/sounds/timer.mp3' },
      terminal_command: { name: 'keyboard-click.mp3', src: '/sounds/keyboard-click.mp3' },
      tool_call: { name: 'pro-tool-call.mp3', src: '/sounds/pro-tool-call.mp3' },
      error: { name: 'error.wav', src: '/sounds/error.wav' },
      done: { name: 'ding-sound-effect-1.mp3', src: '/sounds/ding-sound-effect-1.mp3' },
    },
  },
  arcade: {
    name: 'arcade-synth',
    sounds: {
      session_start: { name: 'pro-session-start.mp3', src: '/sounds/pro-session-start.mp3' },
      reasoning: { name: 'pro-reasoning.mp3', src: '/sounds/pro-reasoning.mp3' },
      long_reasoning: { name: 'pro-long-reasoning.mp3', src: '/sounds/pro-long-reasoning.mp3' },
      terminal_command: { name: 'pro-terminal-command.mp3', src: '/sounds/pro-terminal-command.mp3' },
      tool_call: { name: 'ring.wav', src: '/sounds/ring.wav' },
      error: { name: 'pro-error.mp3', src: '/sounds/pro-error.mp3' },
      done: { name: 'pro-done.mp3', src: '/sounds/pro-done.mp3' },
    },
  },
  nostalgia: {
    name: 'nostalgia-vault',
    sounds: {
      session_start: { name: 'windows-xp-startup.mp3', src: '/sounds/windows-xp-startup.mp3' },
      reasoning: { name: 'c418-stranger-think.mp3', src: '/sounds/c418-stranger-think.mp3' },
      long_reasoning: { name: 'jeopardy-themelq.mp3', src: '/sounds/jeopardy-themelq.mp3' },
      terminal_command: { name: 'counter-strike-ok-lets-go.mp3', src: '/sounds/counter-strike-ok-lets-go.mp3' },
      tool_call: { name: 'metal-gear-alert.mp3', src: '/sounds/metal-gear-alert.mp3' },
      error: { name: 'tf_nemesis.mp3', src: '/sounds/tf_nemesis.mp3' },
      done: { name: 'gta-san-andreas-mission-complete.mp3', src: '/sounds/gta-san-andreas-mission-complete.mp3' },
    },
  },
}

type EventCustomState = {
  enabled: boolean
  file: File | null
  previewUrl: string | null
  fileName: string
}

export default function SoundPackStudio() {
  const { activeId, isPlaying, isPaused } = useAudioState()
  const [packName, setPackName] = useState('arcade-flow')
  const [authorName, setAuthorName] = useState('community-dev')
  const [eventStates, setEventStates] = useState<Record<string, EventCustomState>>(() => {
    const initial: Record<string, EventCustomState> = {}
    ALL_7_EVENTS.forEach((evt) => {
      initial[evt.key] = {
        enabled: true,
        file: null,
        previewUrl: null,
        fileName: evt.defaultFileName,
      }
    })
    return initial
  })

  const [isExporting, setIsExporting] = useState(false)
  const [copiedCli, setCopiedCli] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Toggle event on/off
  const toggleEvent = (key: string) => {
    setEventStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }))
  }

  // Handle custom audio file upload
  const handleFileUpload = (key: string, file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setEventStates((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: true, // Auto-enable when file uploaded
        file,
        previewUrl,
        fileName: file.name,
      },
    }))
  }

  // Reset custom file back to default
  const handleResetToDefault = (key: string, defaultName: string) => {
    setEventStates((prev) => {
      if (prev[key].previewUrl) {
        URL.revokeObjectURL(prev[key].previewUrl!)
      }
      return {
        ...prev,
        [key]: {
          ...prev[key],
          file: null,
          previewUrl: null,
          fileName: defaultName,
        },
      }
    })
  }

  // Load full preset template (Minimal, Arcade, or Nostalgia)
  const loadPresetPack = (presetKey: 'minimal' | 'arcade' | 'nostalgia') => {
    const preset = PRESET_PACKS[presetKey]
    setPackName(preset.name)
    setEventStates((prev) => {
      const updated = { ...prev }
      ALL_7_EVENTS.forEach((evt) => {
        const sound = preset.sounds[evt.key as keyof typeof preset.sounds]
        updated[evt.key] = {
          enabled: true,
          file: null,
          previewUrl: sound.src,
          fileName: sound.name,
        }
      })
      return updated
    })
  }

  // Play or pause sound with exclusive playback
  const handleToggleSound = (evt: EventItem) => {
    const state = eventStates[evt.key]
    if (!state.enabled) return
    const src = state.previewUrl || evt.defaultAudioSrc
    audioEngine.toggle(`pack-${evt.key}`, evt.soundType, src)
  }

  // Bulk enable / disable
  const setAllEnabled = (enabled: boolean) => {
    setEventStates((prev) => {
      const updated = { ...prev }
      ALL_7_EVENTS.forEach((e) => {
        updated[e.key] = { ...updated[e.key], enabled }
      })
      return updated
    })
  }

  const enabledCount = Object.values(eventStates).filter((s) => s.enabled).length

  // Export Sound Pack .zip
  const handleExportZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      const slug = packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'custom-pack'
      const packFolder = zip.folder(slug) || zip
      const soundsFolder = packFolder.folder('sounds') || packFolder

      const manifestEvents: Record<string, string> = {}

      for (const evt of ALL_7_EVENTS) {
        const state = eventStates[evt.key]
        if (!state.enabled) continue

        const cleanFileName = state.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
        if (state.file) {
          const buffer = await state.file.arrayBuffer()
          soundsFolder.file(cleanFileName, buffer)
        } else {
          try {
            const resp = await fetch(evt.defaultAudioSrc)
            const blob = await resp.blob()
            soundsFolder.file(cleanFileName, blob)
          } catch (e) {
            console.warn('Could not bundle default sound:', evt.defaultAudioSrc, e)
          }
        }
        manifestEvents[evt.key] = `sounds/${cleanFileName}`
      }

      const manifest = {
        name: slug,
        author: authorName,
        description: `Custom soundpack with ${enabledCount} events`,
        version: '1.0.0',
        events: manifestEvents,
      }

      packFolder.file('manifest.json', JSON.stringify(manifest, null, 2))
      packFolder.file(
        'README.md',
        `# ${packName}\n\nCreated with Claudetones Sound Pack Studio.\n\nAuthor: ${authorName}\nActive Events: ${enabledCount} of 7\n\n## Installation\n\nExtract this folder into:\n\`~/.claude/plugins/claudetones/packs/${slug}/\`\n\nActivate in Claude Code:\n\`/claudetones pack ${slug}\`\n`
      )

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slug}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export pack zip:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyCli = () => {
    const slug = packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'custom-pack'
    navigator.clipboard.writeText(`/claudetones pack ${slug}`)
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16" id="byos-section">
      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-10 border border-outline-variant/20 shadow-2xl space-y-8">
        {/* Studio Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-outline-variant/15 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-container font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-[17px]">tune</span>
              <span>Sound Pack Studio &amp; Creator</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Build Your Custom Sound Pack
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
              Every sound pack supports <strong>all 7 lifecycle events</strong>. Customize your audio by uploading custom
              files (WAV, MP3) for any event, and toggle individual events on or off to tailor your workflow.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2 cursor-pointer shadow-md font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExporting ? 'hourglass_top' : 'download'}
              </span>
              <span>{isExporting ? 'Packaging...' : 'Export Pack (.zip)'}</span>
            </button>
            <button
              onClick={() => setPublishSuccess(true)}
              className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed font-label-md text-label-md transition-all flex items-center gap-2 cursor-pointer border border-outline-variant/30 font-medium"
            >
              <span className="material-symbols-outlined text-[18px] text-[#61C554]">share</span>
              <span>Publish Pack</span>
            </button>
          </div>
        </div>

        {/* Unified Pack Identity Bar */}
        <div className="bg-surface-container p-4 sm:p-5 rounded-2xl border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-outline uppercase tracking-wider">Pack Name:</span>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="bg-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-mono text-primary-container font-semibold border border-outline-variant/30 focus:outline-none focus:border-primary-container min-w-[160px]"
                placeholder="my-sound-pack"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-outline uppercase tracking-wider">Author:</span>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-mono text-tertiary-fixed border border-outline-variant/30 focus:outline-none focus:border-primary-container min-w-[140px]"
                placeholder="@developer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-outline-variant/25">
              <span className={`w-2 h-2 rounded-full ${enabledCount > 0 ? 'bg-[#61C554]' : 'bg-outline'}`}></span>
              <span className="text-xs font-mono text-tertiary-fixed font-medium">
                {enabledCount} of 7 Events Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAllEnabled(true)}
                className="text-[11px] font-mono text-outline hover:text-on-surface underline cursor-pointer"
              >
                Enable All
              </button>
              <span className="text-outline text-xs">•</span>
              <button
                type="button"
                onClick={() => setAllEnabled(false)}
                className="text-[11px] font-mono text-outline hover:text-on-surface underline cursor-pointer"
              >
                Mute All
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-primary-container">auto_awesome</span>
            <span className="text-xs font-mono text-tertiary-fixed font-semibold">Starter Presets:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadPresetPack('minimal')}
              className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-tertiary-fixed border border-outline-variant/25 transition-all cursor-pointer hover:border-primary-container/40"
            >
              Minimal Atelier
            </button>
            <button
              type="button"
              onClick={() => loadPresetPack('arcade')}
              className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-tertiary-fixed border border-outline-variant/25 transition-all cursor-pointer hover:border-primary-container/40"
            >
              Arcade Synthesizer
            </button>
            <button
              type="button"
              onClick={() => loadPresetPack('nostalgia')}
              className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-tertiary-fixed border border-outline-variant/25 transition-all cursor-pointer hover:border-primary-container/40"
            >
              Nostalgia Vault
            </button>
          </div>
        </div>

        {/* Cohesive 7 Events List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-mono text-outline uppercase tracking-wider">
            <span>Supported Sonic Events (All 7 Available in this Pack)</span>
            <span>Audio Source &amp; Controls</span>
          </div>

          <div className="divide-y divide-outline-variant/15 rounded-2xl bg-surface-container border border-outline-variant/20 overflow-hidden">
            {ALL_7_EVENTS.map((evt) => {
              const state = eventStates[evt.key]
              const isCustom = Boolean(state.file)

              return (
                <div
                  key={evt.key}
                  className={`p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors ${
                    state.enabled ? 'hover:bg-surface-container-high/40' : 'opacity-50 bg-[#161413]/60'
                  }`}
                >
                  {/* Left: Toggle + Event Name + Trigger */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleEvent(evt.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        state.enabled ? 'bg-primary-container' : 'bg-surface-container-highest'
                      }`}
                      role="switch"
                      aria-checked={state.enabled}
                      title={state.enabled ? 'Click to disable event in pack' : 'Click to enable event in pack'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          state.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-sm font-semibold text-tertiary-fixed">
                          {evt.num}. {evt.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-container-lowest text-primary-container border border-outline-variant/25">
                          {evt.trigger}
                        </span>
                        {isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#61C554]/15 text-[#61C554] border border-[#61C554]/30 font-medium">
                            Custom Audio
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Sound Slot + Upload Button + Play Button */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end pt-2 lg:pt-0">
                    {/* Audio File Name Display */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/25 text-xs font-mono text-tertiary-fixed">
                      <span className="material-symbols-outlined text-[15px] text-primary-container">
                        {isCustom ? 'music_note' : 'audiotrack'}
                      </span>
                      <span className="max-w-[160px] truncate">{state.fileName}</span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleResetToDefault(evt.key, evt.defaultFileName)}
                          className="ml-1 text-outline hover:text-error text-xs cursor-pointer"
                          title="Reset to default sound"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      accept="audio/*"
                      ref={(el) => {
                        fileInputRefs.current[evt.key] = el
                      }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(evt.key, file)
                      }}
                    />

                    {/* Upload Custom Audio Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[evt.key]?.click()}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-mono transition-colors border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer"
                      title="Upload custom WAV/MP3 file for this event"
                    >
                      <span className="material-symbols-outlined text-[15px] text-primary-container">
                        cloud_upload
                      </span>
                      <span>Upload Sound</span>
                    </button>

                    {/* Play / Pause / Resume Sound Button */}
                    {(() => {
                      const isThisActive = activeId === `pack-${evt.key}`
                      const isThisPlaying = isThisActive && isPlaying
                      const isThisPaused = isThisActive && isPaused

                      return (
                        <button
                          type="button"
                          disabled={!state.enabled}
                          onClick={() => handleToggleSound(evt)}
                          className={`px-3 py-1.5 rounded-lg font-label-sm text-xs transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                            !state.enabled
                              ? 'opacity-40 cursor-not-allowed bg-surface-container-highest text-outline'
                              : isThisPlaying
                              ? 'bg-primary-container text-on-primary-container shadow-md ring-2 ring-primary-container/40'
                              : isThisPaused
                              ? 'bg-surface-container-high text-primary-container border border-primary-container/40'
                              : 'bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container text-tertiary-fixed'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isThisPlaying ? 'pause' : 'play_arrow'}
                          </span>
                          <span>{isThisPlaying ? 'Pause' : isThisPaused ? 'Resume' : 'Play'}</span>
                        </button>
                      )
                    })()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Publish & CLI Command Drawer */}
        {publishSuccess && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1c1714] border border-primary-container/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#61C554]">check_circle</span>
                <span className="text-sm font-semibold text-tertiary-fixed">
                  Sound pack &quot;{packName}&quot; ready with {enabledCount} of 7 events!
                </span>
              </div>
              <button
                onClick={() => setPublishSuccess(false)}
                className="text-xs text-outline hover:text-on-surface cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Export the pack zip, extract it into your Claude Code soundpack library, and run the command below inside
              your Claude Code session to switch packs:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/25">
              <code className="font-mono text-xs text-primary-container">
                /claudetones pack {packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'custom-pack'}
              </code>
              <button
                onClick={handleCopyCli}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-mono transition-colors cursor-pointer shrink-0 border border-outline-variant/30"
              >
                {copiedCli ? 'Copied Command!' : 'Copy /pack Command'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
