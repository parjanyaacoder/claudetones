import { NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'

import { sendLicenseEmail } from '@/lib/email'
import { generateLicenseKey } from '@/lib/license'
import { createLicense, findLicenseByPaymentId } from '@/lib/store'

type DodoEvent = {
  type?: string
  data?: {
    payment_id?: string
    id?: string
    email?: string
    customer_email?: string
    customer?: { email?: string }
  }
}

/**
 * Dodo Payments webhook. On a successful payment we mint a CLAUDETONES-XXXX-YYYY key,
 * store it, and email it if an email provider is configured. The buyer can also
 * retrieve it from /success (which reads the payment_id Dodo appends to return_url).
 *
 * Signature: Standard Webhooks (webhook-id / webhook-timestamp / webhook-signature).
 * Set DODO_PAYMENTS_WEBHOOK_KEY to the endpoint's signing secret.
 */
export async function POST(req: Request) {
  const raw = await req.text()
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY

  if (secret) {
    try {
      const wh = new Webhook(secret)
      wh.verify(raw, {
        'webhook-id': req.headers.get('webhook-id') ?? '',
        'webhook-timestamp': req.headers.get('webhook-timestamp') ?? '',
        'webhook-signature': req.headers.get('webhook-signature') ?? '',
      })
    } catch {
      return new NextResponse('Invalid signature', { status: 400 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    // Refuse to trust unverified payment webhooks in production.
    return new NextResponse('Webhook secret not configured', { status: 500 })
  }

  let event: DodoEvent
  try {
    event = JSON.parse(raw) as DodoEvent
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 })
  }

  if (event.type === 'payment.succeeded') {
    const data = event.data ?? {}
    const paymentId = data.payment_id ?? data.id ?? null
    const email =
      data.customer?.email ?? data.email ?? data.customer_email ?? null

    if (paymentId && !(await findLicenseByPaymentId(paymentId))) {
      const license = await createLicense({
        key: generateLicenseKey(),
        email,
        paymentId,
      })
      if (email) {
        await sendLicenseEmail(email, license.key).catch(() => {
          // delivery is best-effort; /success can still reveal the key
        })
      }
    }
  }

  return new NextResponse(null, { status: 200 })
}
