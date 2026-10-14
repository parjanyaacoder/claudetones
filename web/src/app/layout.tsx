import type { Metadata } from 'next'

import { SITE_URL } from '@/lib/catalog'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'poptunes — sound effects for your Claude Code sessions',
  description:
    'A Claude Code plugin that plays sound effects as you work: a chime on launch, a tick while Claude thinks, a ding when it finishes. Free pack included, meme Pro pack a key away.',
  keywords: ['Claude Code', 'plugin', 'sound effects', 'developer tools', 'poptunes'],
  openGraph: {
    title: 'poptunes — sound effects for Claude Code',
    description:
      'Chimes, dings, and meme stings for your Claude Code sessions. Free pack included.',
    url: SITE_URL,
    siteName: 'poptunes',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'poptunes' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
