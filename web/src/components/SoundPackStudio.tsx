'use client'

import React, { useState, useRef } from 'react'
import JSZip from 'jszip'
import { playAcousticCue, type SoundType } from '@/lib/audio'

type EventSlot = {
  key: string
  label: string
  trigger: string
  defaultFile: string
  defaultSrc: string
  soundType: SoundType
  description: string
}

const EVENT_SLOTS: EventSlot[] = [
  {
    key: 'session_start',
    label: '1. Session Start',
    trigger: 'session.start',
    defaultFile: 'launch.wav',
    defaultSrc: '/sounds/launch.wav',
    soundType: 'boot',
    description: 'Chime on session initialization',
  },
  {
    key: 'reasoning',
    label: '2. Reasoning Start',
    trigger: 'turn.start',
    defaultFile: 'ring.wav',
    defaultSrc: '/sounds/ring.wav',
    soundType: 'tick',
    description: 'Subtle tick as Claude starts thinking',
  },
  {
    key: 'long_reasoning',
    label: '3. Deep Pondering',
    trigger: 'turn.start > 8s',
    defaultFile: 'timer.mp3',
    defaultSrc: '/sounds/timer.mp3',
    soundType: 'ponder',
    description: 'Rhythmic pulse during extended reasoning',
  },
  {
    key: 'terminal_command',
    label: '4. Bash Execution',
    trigger: 'tool.call: Bash',
    defaultFile: 'keyboard-click.mp3',
    defaultSrc: '/sounds/keyboard-click.mp3',
    soundType: 'click',
    description: 'Crisp feedback on shell commands',
  },
  {
    key: 'tool_call',
    label: '5. File Mutation / Edit',
    trigger: 'tool.call: Edit',
    defaultFile: 'pro-tool-call.mp3',
    defaultSrc: '/sounds/pro-tool-call.mp3',
    soundType: 'pip',
    description: 'Waterdrop click on file modification',
  },
  {
    key: 'error',
    label: '6. Command Failed',
    trigger: 'isError: true',
    defaultFile: 'error.wav',
    defaultSrc: '/sounds/error.wav',
    soundType: 'error',
    description: 'Alert sting on exit error',
  },
  {
    key: 'done',
    label: '7. Turn Complete',
    trigger: 'turn.complete',
    defaultFile: 'ding-sound-effect-1.mp3',
    defaultSrc: '/sounds/ding-sound-effect-1.mp3',
    soundType: 'fanfare',
    description: 'Satisfying task completion fanfare',
  },
]

type UploadedSlot = {
  file: File | null
  previewUrl: string | null
  fileName: string
}

export default function SoundPackStudio() {
  const [packName, setPackName] = useState('custom-atelier')
  const [authorName, setAuthorName] = useState('community-dev')
  const [vibe, setVibe] = useState('Tactile mechanical audio palette')
  const [slots, setSlots] = useState<Record<string, UploadedSlot>>({})
  const [activePlayKey, setActivePlayKey] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [published, setPublished] = useState(false)
  const [copiedCli, setCopiedCli] = useState(false)

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFileUpload = (key: string, file: File) => {
    const url = URL.createObjectURL(file)
    setSlots((prev) => ({
      ...prev,
      [key]: {
        file,
        previewUrl: url,
        fileName: file.name,
      },
    }))
  }

  const handlePlaySound = (slot: EventSlot) => {
    const custom = slots[slot.key]
    setActivePlayKey(slot.key)

    if (custom?.previewUrl) {
      const audio = new Audio(custom.previewUrl)
      audio.volume = 0.6
      audio.play().catch(() => {})
    } else {
      playAcousticCue(slot.soundType, slot.defaultSrc)
    }

    setTimeout(() => {
      setActivePlayKey((curr) => (curr === slot.key ? null : curr))
    }, 1200)
  }

  const handleDownloadZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()
      const folderName = packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'custom-pack'
      const packFolder = zip.folder(folderName) || zip
      const soundsFolder = packFolder.folder('sounds') || packFolder

      const manifestEvents: Record<string, string> = {}

      for (const slot of EVENT_SLOTS) {
        const uploaded = slots[slot.key]
        let fileName = slot.defaultFile
        if (uploaded?.file) {
          fileName = uploaded.file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const arrayBuffer = await uploaded.file.arrayBuffer()
          soundsFolder.file(fileName, arrayBuffer)
        } else {
          // Fetch default sound
          try {
            const resp = await fetch(slot.defaultSrc)
            const blob = await resp.blob()
            soundsFolder.file(fileName, blob)
          } catch (e) {
            console.warn('Could not bundle default sound:', slot.defaultSrc, e)
          }
        }
        manifestEvents[slot.key] = `sounds/${fileName}`
      }

      const manifest = {
        name: folderName,
        author: authorName,
        description: vibe,
        version: '1.0.0',
        events: manifestEvents,
      }

      packFolder.file('manifest.json', JSON.stringify(manifest, null, 2))
      packFolder.file(
        'README.md',
        `# ${packName}\n\nCreated with Claudetones Pack Studio.\n\nAuthor: ${authorName}\nDescription: ${vibe}\n\n## Installation\n\nCopy this folder into:\n\`~/.claude/plugins/claudetones/packs/${folderName}/\`\n\nThen in Claude Code:\n\`/claudetones pack ${folderName}\`\n`
      )

      const content = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${folderName}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePublish = () => {
    setPublished(true)
  }

  const copyInstallCli = () => {
    const slug = packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'custom-pack'
    navigator.clipboard.writeText(`/claudetones pack ${slug}`)
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16" id="byos-section">
      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-10 border border-outline-variant/20 shadow-xl space-y-8">
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/15 pb-6">
          <div>
            <div className="flex items-center gap-2 text-primary-container font-label-sm text-label-sm uppercase tracking-wider mb-1.5">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Acoustic Pack Studio &amp; Creator</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Bring Your Own Sounds (BYOS)</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
              Drop any audio files (WAV, MP3) for the 7 lifecycle events to build your custom soundpack. Download a
              ready-to-use pack or publish it for the community.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2 cursor-pointer shadow-md font-medium"
            >
              <span className="material-symbols-outlined text-[17px]">
                {isExporting ? 'hourglass_top' : 'download'}
              </span>
              <span>{isExporting ? 'Packaging...' : 'Export Pack (.zip)'}</span>
            </button>
            <button
              onClick={handlePublish}
              className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed font-label-md text-label-md transition-all flex items-center gap-2 cursor-pointer border border-outline-variant/30 font-medium"
            >
              <span className="material-symbols-outlined text-[17px] text-[#61C554]">share</span>
              <span>Publish Pack</span>
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/20 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-outline block">Pack Identifier</label>
            <input
              type="text"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className="w-full bg-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-mono text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
              placeholder="e.g. 8bit-retro"
            />
          </div>
          <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/20 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-outline block">Author / Handle</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-mono text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
              placeholder="e.g. @developer"
            />
          </div>
          <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/20 space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-outline block">Vibe &amp; Mood</label>
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full bg-surface-container-lowest px-3 py-1.5 rounded-lg text-xs font-sans text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
              placeholder="e.g. Nostalgic arcade feedback"
            />
          </div>
        </div>

        {/* The 7 Event Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENT_SLOTS.map((slot) => {
            const uploaded = slots[slot.key]
            const isPlaying = activePlayKey === slot.key

            return (
              <div
                key={slot.key}
                className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col justify-between space-y-3 hover:border-primary-container/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-primary-container font-semibold">{slot.trigger}</span>
                    <span className="text-[10px] font-mono text-outline">{slot.label}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{slot.description}</p>
                </div>

                {/* File Drop / Status */}
                <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                  <div className="truncate text-xs font-mono text-tertiary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-outline">
                      {uploaded ? 'upload_file' : 'audio_file'}
                    </span>
                    <span className="truncate max-w-[140px] text-tertiary-fixed">
                      {uploaded ? uploaded.fileName : slot.defaultFile}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="file"
                      accept="audio/*"
                      ref={(el) => {
                        fileInputRefs.current[slot.key] = el
                      }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(slot.key, file)
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[slot.key]?.click()}
                      className="px-2 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-outline hover:text-on-surface text-[11px] font-mono transition-colors cursor-pointer"
                      title="Upload custom WAV/MP3"
                    >
                      Browse
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlaySound(slot)}
                      className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-all flex items-center gap-1 cursor-pointer ${
                        isPlaying
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container text-tertiary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isPlaying ? 'volume_up' : 'play_arrow'}
                      </span>
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Publish Modal / Community Banner */}
        {published && (
          <div className="p-5 rounded-2xl bg-[#1c1714] border border-primary-container/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#61C554]">check_circle</span>
                <span className="text-sm font-semibold text-tertiary-fixed">
                  Soundpack &quot;{packName}&quot; packaged &amp; ready!
                </span>
              </div>
              <button
                onClick={() => setPublished(false)}
                className="text-xs text-outline hover:text-on-surface cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To activate this pack locally, export the zip, extract it into your Claude Code config directory, and hot-swap
              using the slash command below:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/25">
              <code className="font-mono text-xs text-primary-container">
                ~/.claude/plugins/claudetones/packs/{packName.toLowerCase().replace(/[^a-z0-9_-]/g, '-') || 'custom-pack'}/
              </code>
              <button
                onClick={copyInstallCli}
                className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-tertiary-fixed text-xs font-mono transition-colors cursor-pointer shrink-0"
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
