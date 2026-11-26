import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import type { EventKey } from './logic'

export type TelemetryAction =
  | 'PLAYED'
  | 'SKIPPED_COLLISION'
  | 'SKIPPED_MUTED'
  | 'SKIPPED_PAUSED'
  | 'SUPERSEDED_STOPPED'

export const LOG_FILE = join(homedir(), '.claude', 'claudetones_telemetry.log')

export function recordTelemetry(
  event: EventKey,
  action: TelemetryAction,
  sound: string,
  priority: number,
  elapsedMs: number,
  details: string = ''
): void {
  try {
    const time = new Date().toISOString().replace('T', ' ').slice(0, 23)
    const line = `[${time}] [${event.toUpperCase().padEnd(18)}] ${action.padEnd(18)} | sound: ${sound} (prio: ${priority}, elapsed: ${elapsedMs}ms) ${details}\n`
    appendFileSync(LOG_FILE, line)
  } catch {}
}

export function readTelemetryLogs(limit = 12): string {
  try {
    if (!existsSync(LOG_FILE)) return 'No claudetones telemetry logged yet.'
    const content = readFileSync(LOG_FILE, 'utf8')
    const lines = content.trim().split('\n').filter(Boolean)
    if (lines.length === 0) return 'No claudetones telemetry logged yet.'
    return lines.slice(-limit).join('\n')
  } catch (err: any) {
    return `Error reading telemetry log: ${err?.message || err}`
  }
}

export function clearTelemetryLogs(): boolean {
  try {
    writeFileSync(LOG_FILE, '')
    return true
  } catch {
    return false
  }
}
