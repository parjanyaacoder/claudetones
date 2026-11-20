import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/catalog'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Claudetones — Acoustic Feedback for Claude Code',
  description:
    'Tactile sound effects and acoustic cues for every Claude Code event. Know when Claude thinks, edits, runs bash, or finishes — without watching your screen.',
  keywords: ['Claude Code', 'plugin', 'sound effects', 'developer tools', 'claudetones', 'acoustic UI'],
  openGraph: {
    title: 'Claudetones — Sound Effects for Claude Code',
    description:
      'Chimes, thinking tickers, keystrokes, and victory fanfares for your Claude Code sessions. 100% Free & Open Source.',
    url: SITE_URL,
    siteName: 'Claudetones',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Claudetones' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#151311] text-[#e7e1de] antialiased selection:bg-[#d97757] selection:text-[#151311] min-h-screen">
        {children}
      </body>
    </html>
  )
}
