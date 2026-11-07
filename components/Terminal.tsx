'use client'

import React, { useEffect, useRef } from 'react'

interface TerminalProps {
  children: React.ReactNode
  autoScroll?: boolean
  maxHeight?: string
}

export function Terminal({
  children,
  autoScroll = true,
  maxHeight = '70vh',
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [children, autoScroll])

  return (
    <div
      className="terminal-output"
      ref={terminalRef}
      style={{
        padding: 'clamp(0.5rem, 2vw, 1rem)',
        ['--terminal-max-height' as string]: maxHeight,
      }}
    >
      {children}
    </div>
  )
}
