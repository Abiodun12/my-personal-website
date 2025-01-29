import './globals.css'
import '../styles/terminal.css'
import React from 'react'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

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
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
        />
      </head>
      <body suppressHydrationWarning>
        <div className="terminal-container">
          <div className="terminal">
            <div className="terminal-content">
              {children}
              <Analytics />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 