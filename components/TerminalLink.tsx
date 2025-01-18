'use client'
import React from 'react'
import Link from 'next/link'

interface TerminalLinkProps {
  href: string
  children: React.ReactNode
}

export function TerminalLink({ href, children }: TerminalLinkProps) {
  return (
    <Link href={href} className="terminal-link">
      {children}
    </Link>
  )
} 