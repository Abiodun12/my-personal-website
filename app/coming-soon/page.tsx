'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'

export default function ComingSoonPage() {
  return (
    <main>
      <Terminal>
        $ cat coming-soon.txt
        <Cursor />
      </Terminal>
      <Terminal>
        🚧 Under Construction 🚧
        <br /><br />
        Exciting features in development:
        <br />
        - Blog posts about tech and personal growth
        <br />
        - Project showcases and demos
        <br />
        - Interactive terminal features
        <br />
        - And much more!
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 