'use client'
import React from 'react'

interface TerminalProps {
  children: React.ReactNode;
}

export function Terminal({ children }: TerminalProps) {
  return <div className="terminal-output">{children}</div>
} 