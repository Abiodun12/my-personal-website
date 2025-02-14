'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'

export default function ComingSoonPage() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>$ cat coming-soon.txt</Terminal>
      <Terminal>
        🚧 Under Construction 🚧
        <br /><br />
        Exciting features are in development! Check back soon for:
        <br />
        - Project showcases
        <br />
        - Technical tutorials
        <br />
        - More blog posts
        <br />
        - And much more!
        <Cursor />
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
}
