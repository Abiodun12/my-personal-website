'use client'

import React from 'react'
import { Terminal } from '../components/Terminal'
import { Cursor } from '../components/Cursor'
import { TerminalLink } from '../components/TerminalLink'
import { siteConfig } from '../config'

export default function HomePage() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>
        Welcome to {siteConfig.title}
        <Cursor />
      </Terminal>
      <Terminal>Type 'help' for available commands:</Terminal>
      <Terminal>$ help</Terminal>
      <Terminal>
        Available commands:
        <br />
        - <TerminalLink href="/about">about</TerminalLink>: Learn more about me
        <br />
        - <TerminalLink href="/blog">blog</TerminalLink>: Read my thoughts and articles
        <br />
        - <TerminalLink href="/coming-soon">coming-soon</TerminalLink>: See what's coming up
      </Terminal>
      <Terminal>
        $ echo "Connect with me:"
        <br />
        LinkedIn:{' '}
        <a
          href={siteConfig.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          {siteConfig.socialLinks.linkedin}
        </a>
        <br />
        GitHub:{' '}
        <a
          href={siteConfig.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          {siteConfig.socialLinks.github}
        </a>
        <br />
        Email: {siteConfig.email}
      </Terminal>
    </main>
  )
}
