#!/usr/bin/env node

/**
 * Claudetones Universal Native Dispatcher
 * Dispatches audio cues across Claude Code Desktop (GUI) and Terminal CLI.
 * Runs as a detached, zero-latency OS audio process via CoreAudio (afplay) / ALSA (aplay).
 */

import { spawn } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PLUGIN_ROOT = join(__dirname, '..')

const event = process.argv[2] || 'done'

// Fast event to file mapping (100% Myinstants sounds)
const EVENT_SOUND_MAP = {
  session_start: 'sounds/launch.wav',
  reasoning: 'sounds/ring.wav',
  long_reasoning: 'sounds/timer.mp3',
  terminal_command: 'sounds/keyboard-click.mp3',
  file_edit: 'sounds/pro-tool-call.mp3',
  file_read: 'sounds/mouse-click-sound-fx.mp3',
  tool_call: 'sounds/ring.wav',
  mcp_connect: 'sounds/the-bluetooth-device-its-connected-succesfull.mp3',
  mcp_tool_call: 'sounds/magic-reveal-audio.mp3',
  skill_invoke: 'sounds/fairy-sparkle.mp3',
  plugin_install: 'sounds/levelup.mp3',
  permission_request: 'sounds/door-bell-sound-effect.mp3',
  subagent_spawn: 'sounds/dbz-teleport.mp3',
  context_compact: 'sounds/mario_coin_sound.mp3',
  git_commit: 'sounds/confetti-pop-sound-effect.mp3',
  error: 'sounds/error.wav',
  done: 'sounds/ding-sound-effect-1.mp3',
  oops: 'sounds/tf_nemesis.mp3',
}

// Priority Hierarchy for Concurrency Arbitration
const EVENT_PRIORITY = {
  oops: 100,
  error: 95,
  done: 90,
  permission_request: 85,
  plugin_install: 80,
  mcp_connect: 75,
  git_commit: 70,
  session_start: 65,
  subagent_spawn: 60,
  skill_invoke: 55,
  mcp_tool_call: 50,
  context_compact: 45,
  long_reasoning: 40,
  reasoning: 35,
  file_edit: 30,
  terminal_command: 25,
  file_read: 15,
  tool_call: 10,
}

// State file for cross-process anti-concurrency lock
const STATE_FILE = join(homedir(), '.claude', '.claudetones_state.json')
const DEBOUNCE_MS = 250

function checkAndLock(evt) {
  const now = Date.now()
  const priority = EVENT_PRIORITY[evt] ?? 10
  let state = { lastTime: 0, lastPriority: 0 }

  try {
    if (existsSync(STATE_FILE)) {
      state = JSON.parse(readFileSync(STATE_FILE, 'utf8'))
    }
  } catch {}

  const elapsed = now - (state.lastTime || 0)
  if (elapsed < DEBOUNCE_MS) {
    if (priority <= (state.lastPriority || 0)) {
      return false // Drop concurrent lower-priority sound
    }
  }

  try {
    writeFileSync(STATE_FILE, JSON.stringify({ lastTime: now, lastPriority: priority }))
  } catch {}

  return true
}

function playSound() {
  if (event !== 'oops' && !checkAndLock(event)) {
    return
  }

  const relPath = EVENT_SOUND_MAP[event] || 'sounds/ring.wav'
  const fullPath = join(PLUGIN_ROOT, relPath)

  if (!existsSync(fullPath)) return

  const isMac = process.platform === 'darwin'
  const binary = isMac ? 'afplay' : 'aplay'

  // Fire detached unblocking native OS audio process
  const child = spawn(binary, [fullPath], {
    detached: true,
    stdio: 'ignore',
  })
  child.unref()
}

playSound()
