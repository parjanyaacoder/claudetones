// Optional license-key delivery email (Resend). If RESEND_API_KEY isn't set this
// is a no-op, and buyers still get their key from the /success page.
//
// Env:
//   RESEND_API_KEY  — https://resend.com API key
//   EMAIL_FROM      — verified sender, e.g. 'claudetones <license@yourdomain.com>'

export async function sendLicenseEmail(to: string, key: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !to) return

  const from = process.env.EMAIL_FROM ?? 'claudetones <onboarding@resend.dev>'
  const body = [
    'Thanks for buying the claudetones Pro pack!',
    '',
    'Your license key:',
    key,
    '',
    'Unlock it inside Claude Code:',
    `/claudetones unlock ${key}`,
    '',
    'This key activates up to 2 devices.',
  ].join('\n')

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Your claudetones Pro license key',
      text: body,
    }),
    cache: 'no-store',
  })
}
