import { NextResponse } from 'next/server'

import { SITE_URL } from '@/lib/catalog'
import { createCheckoutSession, staticPaymentLink } from '@/lib/dodo'

/**
 * Start a Pro Pack purchase. Returns { url } for the client to redirect to.
 * Order of preference: live Dodo checkout session → static payment link →
 * (dev only) the local /success page with a mintable test key.
 */
export async function POST(req: Request) {
  let email: string | undefined
  try {
    const body = (await req.json()) as { email?: string }
    email = typeof body?.email === 'string' ? body.email : undefined
  } catch {
    // no body is fine
  }

  const returnUrl = new URL('/success', SITE_URL).toString()

  try {
    const url = await createCheckoutSession({ returnUrl, email })
    if (url) return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }

  const link = staticPaymentLink()
  if (link) return NextResponse.json({ url: link })

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Checkout is not configured yet.' },
      { status: 503 },
    )
  }

  // Local dev with no Dodo creds: hand back a mintable success page.
  return NextResponse.json({ url: '/success?dev=1' })
}
