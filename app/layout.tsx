// This is a Server Component (no 'use client' directive)
import './globals.css'
import '../styles/terminal.css'
import React from 'react'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import KeepAliveClient from './KeepAliveClient'
import { PerformanceManager } from '../components/PerformanceManager'
import { UserPreferencesProvider } from '../components/UserPreferencesProvider'

const inter = Inter({ subsets: ['latin'] })

// Metadata can only be exported from a Server Component
export const metadata = {
  title: 'LIFE OF ABIODUN(AB)',
  description: 'Welcome to my personal website where I share my journey in tech and life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <UserPreferencesProvider>
          <PerformanceManager />
          <div className="terminal-container">
            <div className="terminal">
              <div className="terminal-content">
                {children}
                <Analytics />
                <KeepAliveClient />
              </div>
            </div>
          </div>
        </UserPreferencesProvider>
      </body>
    </html>
  )
} 