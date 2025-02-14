// app/layout.tsx

import './globals.css'
import '../styles/terminal.css'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LIFE OF AB',
  description: 'Personal website of AB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-button close"></div>
            <div className="terminal-button minimize"></div>
            <div className="terminal-button maximize"></div>
          </div>
          <div className="terminal-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
