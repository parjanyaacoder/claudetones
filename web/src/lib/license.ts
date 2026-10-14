// License key generation + format. The canonical format is shared with the mod's
// hooks/logic.ts (LICENSE_PATTERN): POPTUNES-XXXX-YYYY. Keys are generated at
// fulfillment time (the Dodo webhook) and stored server-side.
import { randomInt } from 'node:crypto'

export const LICENSE_PATTERN = /^POPTUNES-[A-Z0-9]{4}-[A-Z0-9]{4}$/

/** No I, O, 0, or 1 — avoids the classic "is that a one or an ell?" support ticket. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function normalizeLicenseKey(key: string): string {
  return key.trim().toUpperCase()
}

export function isLicenseKeyFormat(key: string): boolean {
  return LICENSE_PATTERN.test(normalizeLicenseKey(key))
}

export function generateLicenseKey(): string {
  const segment = () =>
    Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return `POPTUNES-${segment()}-${segment()}`
}

/** How many distinct machines a single key may activate. */
export const MAX_DEVICES = Number(process.env.POPTUNES_MAX_DEVICES ?? 2)
