'use client'
import React from 'react'
import Link from 'next/link'

export interface TerminalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: () => void
}

export function TerminalLink({ 
  href, 
  children, 
  className = '', 
  target,
  rel,
  onClick 
}: TerminalLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Link 
      href={href}
      className={`terminal-link ${className}`}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
} 