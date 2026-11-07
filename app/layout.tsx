import './globals.css'
import '../styles/terminal.css'
import type { Metadata, Viewport } from 'next'
import { UserPreferencesProvider } from '../components/UserPreferencesProvider'
import ScrollToTop from '../components/ScrollToTop'
import { Analytics } from '@vercel/analytics/react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: {
    default: 'LIFE OF ABIODUN(AB)',
    template: '%s · Life of AB',
  },
  description: 'Welcome to my personal website where I share my journey in tech and life.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">Skip to content</a>
        <UserPreferencesProvider>
          <ScrollToTop />
          <div className="terminal-container">
            <div className="terminal">
              <div className="terminal-content">
                <div id="main" tabIndex={-1}>
                  {children}
                </div>
                <Analytics />
              </div>
            </div>
          </div>
        </UserPreferencesProvider>
      </body>
    </html>
  )
}
