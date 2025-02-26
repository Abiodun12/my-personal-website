'use client'

import './globals.css'
import '../styles/terminal.css'
import React, { useEffect } from 'react'
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
  // Keep alive ping for Render API
  useEffect(() => {
    const pingRender = () => {
      // Make a request to your health endpoint
      fetch('https://my-personal-website-t7tw.onrender.com/health', { 
        method: 'GET',
        // Use no-cors to avoid CORS issues with the OPTIONS preflight
        mode: 'no-cors'
      }).catch(err => console.log('Ping error (expected):', err.message));
    };

    // Ping immediately
    pingRender();
    
    // Set up interval for every 5 minutes
    const interval = setInterval(pingRender, 5 * 60 * 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
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