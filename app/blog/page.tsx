'use client'

import React from 'react'
import { Terminal } from '../../components/Terminal'
import { TerminalLink } from '../../components/TerminalLink'
import { Cursor } from '../../components/Cursor'

export default function BlogPage() {
  return (
    <main>
      <Terminal>
        $ ls blog/
        <Cursor />
      </Terminal>
      <Terminal>
        <h1>Here's to New Beginnings</h1>
        <span style={{ color: '#666' }}>January 18, 2025</span>
        <br /><br />
        Life is a journey filled with opportunities to learn, grow, and create. Here's to embracing every moment with curiosity and optimism.
        <br /><br />
        Tech has always been a passion of mine—its endless possibilities and power to change the world inspire me daily. Through this blog, I hope to share my journey, insights, and love for the world of technology.
        <br /><br />
        Life is beautiful when we lean into our passions and open ourselves to growth. Here's to celebrating the little wins, the challenges that shape us, and the adventures that await.
        <br /><br />
        Welcome to my corner of the internet.
      </Terminal>
      <Terminal>
        $ <TerminalLink href="/">cd ..</TerminalLink>
      </Terminal>
    </main>
  )
} 