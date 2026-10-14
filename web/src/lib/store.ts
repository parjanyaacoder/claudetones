import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { MAX_DEVICES } from './license'

// License storage with two backends:
//   • Supabase (PostgREST) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
//     — required in production (a serverless FS is ephemeral).
//   • A local JSON file in dev, so `npm run dev` works with zero setup.
//
// Schema for Supabase lives in web/supabase/schema.sql.

export type License = {
  key: string
  email: string | null
  paymentId: string | null
  tier: 'pro'
  createdAt: string
  devices: string[]
}

type Row = {
  key: string
  email: string | null
  payment_id: string | null
  tier: 'pro'
  created_at: string
  devices: string[] | null
}

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '')
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const configured = Boolean(SUPABASE_URL && SUPABASE_KEY)
const DEV_FILE = join(process.cwd(), '.data', 'licenses.json')

function assertBackend(): void {
  if (configured) return
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'License storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in production.',
    )
  }
}

async function sb(pathAndQuery: string, init: RequestInit = {}): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY!}`,
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${await res.text()}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

function fromRow(row: Row): License {
  return {
    key: row.key,
    email: row.email,
    paymentId: row.payment_id,
    tier: row.tier,
    createdAt: row.created_at,
    devices: row.devices ?? [],
  }
}

// ---- dev JSON backend ----------------------------------------------------------

async function readDev(): Promise<Record<string, License>> {
  try {
    return JSON.parse(await readFile(DEV_FILE, 'utf8')) as Record<string, License>
  } catch {
    return {}
  }
}

async function writeDev(data: Record<string, License>): Promise<void> {
  await mkdir(dirname(DEV_FILE), { recursive: true })
  await writeFile(DEV_FILE, JSON.stringify(data, null, 2))
}

// ---- public API ----------------------------------------------------------------

export async function findLicenseByKey(key: string): Promise<License | null> {
  assertBackend()
  if (configured) {
    const rows = (await sb(`licenses?key=eq.${encodeURIComponent(key)}&select=*`)) as Row[]
    return rows[0] ? fromRow(rows[0]) : null
  }
  return (await readDev())[key] ?? null
}

export async function findLicenseByPaymentId(paymentId: string): Promise<License | null> {
  assertBackend()
  if (configured) {
    const rows = (await sb(
      `licenses?payment_id=eq.${encodeURIComponent(paymentId)}&select=*`,
    )) as Row[]
    return rows[0] ? fromRow(rows[0]) : null
  }
  const data = await readDev()
  return Object.values(data).find(l => l.paymentId === paymentId) ?? null
}

export async function createLicense(input: {
  key: string
  email?: string | null
  paymentId?: string | null
}): Promise<License> {
  assertBackend()
  const license: License = {
    key: input.key,
    email: input.email ?? null,
    paymentId: input.paymentId ?? null,
    tier: 'pro',
    createdAt: new Date().toISOString(),
    devices: [],
  }
  if (configured) {
    const rows = (await sb('licenses', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        key: license.key,
        email: license.email,
        payment_id: license.paymentId,
        tier: license.tier,
        devices: license.devices,
      }),
    })) as Row[]
    return rows[0] ? fromRow(rows[0]) : license
  }
  const data = await readDev()
  data[license.key] = license
  await writeDev(data)
  return license
}

export type BindResult =
  | { ok: true; license: License; alreadyBound: boolean }
  | { ok: false; reason: 'device_limit' }

/** Bind a machine to a license if there's room (idempotent for a known device). */
export async function bindDevice(license: License, deviceId: string): Promise<BindResult> {
  if (!deviceId || license.devices.includes(deviceId)) {
    return { ok: true, license, alreadyBound: true }
  }
  if (license.devices.length >= MAX_DEVICES) {
    return { ok: false, reason: 'device_limit' }
  }
  const devices = [...license.devices, deviceId]
  if (configured) {
    const rows = (await sb(`licenses?key=eq.${encodeURIComponent(license.key)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ devices }),
    })) as Row[]
    const updated = rows[0] ? fromRow(rows[0]) : { ...license, devices }
    return { ok: true, license: updated, alreadyBound: false }
  }
  const data = await readDev()
  const updated = { ...license, devices }
  data[license.key] = updated
  await writeDev(data)
  return { ok: true, license: updated, alreadyBound: false }
}
