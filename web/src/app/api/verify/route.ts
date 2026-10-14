import { NextResponse } from 'next/server'

import { MAX_DEVICES, isLicenseKeyFormat, normalizeLicenseKey } from '@/lib/license'
import { bindDevice, findLicenseByKey } from '@/lib/store'

// The mod calls this from the user's machine (server-side fetch), so CORS isn't
// strictly required — but keeping it open lets the mod run in browser-like hosts.
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

/**
 * Validate a license key (and optionally bind the calling device).
 *
 * Request:  { key: string, deviceId?: string }
 * Response: { valid: true, tier, devices, maxDevices }
 *         | { valid: false, reason: 'bad_format' | 'unknown_key' | 'device_limit' }
 *
 * The shipped mod only sends { key }; deviceId is optional and used to enforce
 * the per-key machine limit when the client provides a stable id.
 */
export async function POST(req: Request) {
  let body: { key?: unknown; deviceId?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return json({ valid: false, reason: 'bad_format' }, 400)
  }

  const key = typeof body.key === 'string' ? normalizeLicenseKey(body.key) : ''
  if (!isLicenseKeyFormat(key)) {
    return json({ valid: false, reason: 'bad_format' })
  }

  const license = await findLicenseByKey(key)
  if (!license) {
    return json({ valid: false, reason: 'unknown_key' })
  }

  const deviceId = typeof body.deviceId === 'string' ? body.deviceId : ''
  const bound = await bindDevice(license, deviceId)
  if (!bound.ok) {
    return json({ valid: false, reason: 'device_limit' })
  }

  return json({
    valid: true,
    tier: bound.license.tier,
    devices: bound.license.devices.length,
    maxDevices: MAX_DEVICES,
  })
}
