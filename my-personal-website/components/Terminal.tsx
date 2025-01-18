'use client'

import React, { useEffect, useRef } from 'react'

interface TerminalProps {
  children: React.ReactNode
  autoScroll?: boolean
}

export function Terminal({ children, autoScroll = true }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [children, autoScroll])

  // Use useEffect to ensure client-side only rendering for dynamic content
  const [mounted, setMounted] = React.useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Return null on server-side
  }

  return (
    <div className="terminal-output" ref={terminalRef}>
      {children}
    </div>
  )
}
