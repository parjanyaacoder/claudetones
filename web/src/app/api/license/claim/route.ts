import { NextResponse } from 'next/server'

import { findLicenseByPaymentId } from '@/lib/store'

/**
 * Reveal the license key for a completed purchase on the /success page.
 *
 * Request:  { paymentId: string, email?: string }
 * Response: 200 { key }            — found (and email matches, if provided)
 *           202 { pending: true }  — webhook hasn't landed yet; client retries
 *           403 { error }          — email doesn't match the order
 *           404 { error }          — unknown order
 */
export async function POST(req: Request) {
  let body: { paymentId?: unknown; email?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const paymentId = typeof body.paymentId === 'string' ? body.paymentId : ''
  if (!paymentId) {
    return NextResponse.json({ error: 'Missing paymentId.' }, { status: 400 })
  }

  const license = await findLicenseByPaymentId(paymentId)
  if (!license) {
    return NextResponse.json({ pending: true }, { status: 202 })
  }

  const email = typeof body.email === 'string' ? body.email.toLowerCase() : ''
  if (license.email && email && license.email.toLowerCase() !== email) {
    return NextResponse.json({ error: 'Email does not match this order.' }, { status: 403 })
  }

  return NextResponse.json({ key: license.key })
}
