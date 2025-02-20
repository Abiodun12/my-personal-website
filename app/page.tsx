'use client'

import React from 'react'
import { InteractiveTerminal } from '../components/InteractiveTerminal'
import { Terminal } from '../components/Terminal'
import { Cursor } from '../components/Cursor'

export default function Home() {
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Terminal>
        Welcome to LIFE OF ABIODUN(AB)!
        <Cursor />
      </Terminal>
      <Terminal>Type 'help' for available commands:</Terminal>
      <Terminal>$ help</Terminal>
      <Terminal>
        Available commands:
        <br />
        - about: Learn more about me
        <br />
        - projects: View my portfolio
        <br />
        - blog: Read my thoughts
        <br />
        - contact: How to reach me
      </Terminal>
      <InteractiveTerminal />
    </main>
  )
} 