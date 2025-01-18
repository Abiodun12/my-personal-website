'use client'

import React from 'react'
import { Terminal } from '../components/Terminal'
import { Cursor } from '../components/Cursor'
import { TerminalLink } from '../components/TerminalLink'
import { siteConfig } from '../config'

export default function HomePage() {
  return (
    <main>
      <Terminal>
        Welcome to {siteConfig.title}
        <br /><br />
        Type 'help' for available commands:
        <br /><br />
        $ help
        <Cursor />
      </Terminal>

      <Terminal>
        Available commands:
        <br />
        - <TerminalLink href="/about">about</TerminalLink>: Learn more about me
        <br />
        - <TerminalLink href="/projects">projects</TerminalLink>: View my portfolio
        <br />
        - <TerminalLink href="/blog">blog</TerminalLink>: Read my thoughts
        <br />
        - <TerminalLink href="/coming-soon">coming-soon</TerminalLink>: See what's next
      </Terminal>

      <Terminal>
        $ echo "Connect with me:"
        <br />
        LinkedIn:{' '}
        <a 
          href="https://www.linkedin.com/in/abiodun-ab-soneye-1b7a80290/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="terminal-link"
        >
          linkedin.com/in/abiodun-ab-soneye
        </a>
        <br />
        GitHub:{' '}
        <a 
          href="https://github.com/Abiodun12" 
          target="_blank" 
          rel="noopener noreferrer"
          className="terminal-link"
        >
          github.com/Abiodun12
        </a>
        <br />
        Email:{' '}
        <a 
          href="mailto:Soneyebiodun@gmail.com"
          className="terminal-link"
        >
          Soneyebiodun@gmail.com
        </a>
      </Terminal>
    </main>
  )
} 