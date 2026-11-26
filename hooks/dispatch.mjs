#!/usr/bin/env node

/**
 * Claudetones Universal Native Dispatcher
 * Dispatches audio cues across Claude Code Desktop (GUI) and Terminal CLI.
 * Runs as a detached, zero-latency OS audio process via CoreAudio (afplay) / ALSA (aplay).
 */

import { spawn } from 'child_process'
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PLUGIN_ROOT = join(__dirname, '..')

// Declarative hooks pass a fixed event name, plus the hook payload as JSON on stdin.
// For tool hooks we refine the event from tool_name / tool_input so Desktop & CLI
// get the same rich events as the function-hook runtime (register.ts).
function readPayload() {
  try {
    if (process.stdin.isTTY) return {}
    const raw = readFileSync(0, 'utf8')
    return raw.trim() ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const SENSITIVE = /(\.env\b|credentials|id_rsa|\.pem\b|secrets?\.)/i
const DANGEROUS = /(rm\s+-rf|drop\s+table|git\s+push\s+(--force|-f)\b|kill\s+-9|mkfs|chmod\s+-R\s+777)/i
const PKG = /(npm\s+(install|i)\b|yarn\s+add|pnpm\s+add|pip3?\s+install|cargo\s+add|brew\s+install|bun\s+add)/i
const TESTS = /(npm\s+(run\s+)?test|pytest|vitest|jest|cargo\s+test|go\s+test|bun\s+test)/i

export function classify(base, payload) {
  if (base !== 'tool_call' && base !== 'error') return base
  const tool = String(payload.tool_name || '')
  const input = JSON.stringify(payload.tool_input || {})
  const cmd = String(payload.tool_input?.command || '')

  if (base === 'error') return tool === 'Bash' && TESTS.test(cmd) ? 'test_fail' : 'error'

  if (tool === 'Bash') {
    if (DANGEROUS.test(cmd)) return 'dangerous_command'
    if (PKG.test(cmd)) return 'package_install'
    if (TESTS.test(cmd)) return 'test_pass' // PostToolUse = it succeeded
    if (/git\s+push/.test(cmd)) return 'git_push'
    if (/git\s+commit/.test(cmd)) return 'git_commit'
    if (/claude\s+plugin\s+(install|marketplace\s+add)/.test(cmd)) return 'plugin_install'
    if (/claude\s+mcp\s+add/.test(cmd)) return 'mcp_connect'
    return 'terminal_command'
  }
  if (/^(WebSearch|WebFetch)$/.test(tool) || /search/i.test(tool)) return 'web_search'
  if (tool === 'Skill') return 'skill_invoke'
  if (tool === 'Task' || tool === 'Agent') return 'subagent_spawn'
  if (tool.startsWith('mcp__')) return 'mcp_tool_call'
  if (/^(Edit|MultiEdit|Write|NotebookEdit)$/.test(tool)) return SENSITIVE.test(input) ? 'security_alert' : 'file_edit'
  if (/^(Read|Glob|Grep|LS|View)$/.test(tool)) return SENSITIVE.test(input) ? 'security_alert' : 'file_read'
  return 'tool_call'
}

const baseEvent = process.argv[2] || 'done'
const event = classify(baseEvent, readPayload())

// Fast event to file mapping (100% Myinstants sounds)
const EVENT_SOUND_MAP = {
  session_start: 'sounds/launch.wav',
  reasoning: 'sounds/ring.wav',
  long_reasoning: 'sounds/timer.mp3',
  terminal_command: 'sounds/keyboard-click.mp3',
  file_edit: 'sounds/pro-tool-call.mp3',
  file_read: 'sounds/mouse-click-sound-fx.mp3',
  tool_call: 'sounds/ring.wav',
  web_search: 'sounds/dialup.mp3',
  mcp_connect: 'sounds/the-bluetooth-device-its-connected-succesfull.mp3',
  mcp_tool_call: 'sounds/magic-reveal-audio.mp3',
  skill_invoke: 'sounds/fairy-sparkle.mp3',
  plugin_install: 'sounds/levelup.mp3',
  permission_request: 'sounds/door-bell-sound-effect.mp3',
  subagent_spawn: 'sounds/dbz-teleport.mp3',
  context_compact: 'sounds/mario_coin_sound.mp3',
  git_commit: 'sounds/confetti-pop-sound-effect.mp3',
  git_push: 'sounds/punch-sound-effect-meme.mp3',
  package_install: 'sounds/subway-surfers-coin-collect.mp3',
  test_pass: 'sounds/roblox-old-winning-sound-effect.mp3',
  test_fail: 'sounds/the-price-is-right-losing-horn.mp3',
  dangerous_command: 'sounds/nuclear-alarm-siren.mp3',
  security_alert: 'sounds/metal-gear-alert.mp3',
  turn_abort: 'sounds/braking-car-sound-effect-drift-brake.mp3',
  error: 'sounds/error.wav',
  done: 'sounds/ding-sound-effect-1.mp3',
  oops: 'sounds/tf_nemesis.mp3',
}

// Priority Hierarchy for Concurrency Arbitration
const EVENT_PRIORITY = {
  oops: 100,
  dangerous_command: 97,
  error: 95,
  done: 90,
  security_alert: 88,
  permission_request: 85,
  turn_abort: 82,
  plugin_install: 80,
  mcp_connect: 75,
  test_fail: 74,
  test_pass: 72,
  git_commit: 70,
  git_push: 68,
  session_start: 65,
  package_install: 62,
  subagent_spawn: 60,
  skill_invoke: 55,
  web_search: 52,
  mcp_tool_call: 50,
  context_compact: 45,
  long_reasoning: 40,
  reasoning: 35,
  file_edit: 30,
  terminal_command: 25,
  file_read: 15,
  tool_call: 10,
}

// State & telemetry files
const STATE_FILE = join(homedir(), '.claude', '.claudetones_state.json')
const LOG_FILE = join(homedir(), '.claude', 'claudetones_telemetry.log')
const DEBOUNCE_MS = 250

function logTelemetry(evt, action, sound, priority, elapsedMs, details = '') {
  try {
    const time = new Date().toISOString().replace('T', ' ').slice(0, 23)
    const line = `[${time}] [${evt.toUpperCase().padEnd(18)}] ${action.padEnd(18)} | sound: ${sound} (prio: ${priority}, elapsed: ${elapsedMs}ms) ${details}\n`
    appendFileSync(LOG_FILE, line)
  } catch {}
}

function checkAndLock(evt) {
  const now = Date.now()
  const priority = EVENT_PRIORITY[evt] ?? 10
  let state = { lastTime: 0, lastPriority: 0, lastSound: '' }

  try {
    if (existsSync(STATE_FILE)) {
      state = JSON.parse(readFileSync(STATE_FILE, 'utf8'))
    }
  } catch {}

  const elapsed = now - (state.lastTime || 0)
  const relPath = EVENT_SOUND_MAP[evt] || 'sounds/ring.wav'

  if (elapsed < DEBOUNCE_MS) {
    if (priority <= (state.lastPriority || 0)) {
      logTelemetry(
        evt,
        'SKIPPED_COLLISION',
        relPath,
        priority,
        elapsed,
        `Parallel event within ${DEBOUNCE_MS}ms dropped (prio ${priority} <= ${state.lastPriority})`
      )
      return false
    } else {
      logTelemetry(
        evt,
        'SUPERSEDED_STOPPED',
        relPath,
        priority,
        elapsed,
        `Preempted previous [${state.lastSound || 'sound'}] (prio ${priority} > ${state.lastPriority})`
      )
    }
  } else {
    logTelemetry(evt, 'PLAYED', relPath, priority, elapsed, 'Dispatched to OS audio process')
  }

  try {
    writeFileSync(STATE_FILE, JSON.stringify({ lastTime: now, lastPriority: priority, lastSound: relPath }))
  } catch {}

  return true
}

function playSound() {
  if (event !== 'oops' && !checkAndLock(event)) {
    return
  }

  let relPath = EVENT_SOUND_MAP[event] || 'sounds/ring.wav'
  let fullPath = join(PLUGIN_ROOT, relPath)

  // Safe fallback if clip file was not shipped
  if (!existsSync(fullPath)) {
    fullPath = join(PLUGIN_ROOT, 'sounds/ring.wav')
    if (!existsSync(fullPath)) return
  }

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
