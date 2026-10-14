import { NextResponse } from 'next/server'

import { generateLicenseKey } from '@/lib/license'
import { createLicense } from '@/lib/store'

/**
 * Dev-only: mint a throwaway license key so the whole buy → unlock → verify loop
 * can be exercised locally without Dodo. Hard-disabled in production.
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 })
  }

  const license = await createLicense({
    key: generateLicenseKey(),
    email: 'dev@local',
    paymentId: `dev_${Date.now()}`,
  })

  return NextResponse.json({ key: license.key })
}
