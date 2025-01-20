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
        Welcome to THE LIFE OF AB
        <br /><br />
        Type 'help' for available commands:
        <br /><br />
        $ help
        <Cursor />
      </Terminal>

      <Terminal>
        Available Commands:
        <br />
        - <TerminalLink href="/about">ABOUT</TerminalLink>: Learn More About Me
        <br />
        - <TerminalLink href="/projects">PROJECTS</TerminalLink>: View My Portfolio
        <br />
        - <TerminalLink href="/blog">BLOG</TerminalLink>: Read My Thoughts
        <br />
        - <TerminalLink href="/coming-soon">COMING SOON</TerminalLink>: See What's Next
      </Terminal>

      <Terminal>
        $ echo "Connect With Me:"
        <br />
        LinkedIn:{' '}
        <a 
          href="https://www.linkedin.com/in/abiodun-ab-soneye-1b7a80290/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="terminal-link"
        >
          LinkedIn/Abiodun-AB-Soneye
        </a>
        <br />
        GitHub:{' '}
        <a 
          href="https://github.com/Abiodun12" 
          target="_blank" 
          rel="noopener noreferrer"
          className="terminal-link"
        >
          GitHub/Abiodun12
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