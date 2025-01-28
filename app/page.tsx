'use client'

import React from 'react'
import { InteractiveTerminal } from '../components/InteractiveTerminal'
import { Terminal } from '../components/Terminal'

export default function Home() {
  return (
    <main>
      <Terminal>
        Welcome to LIFE OF ABIODUN(AB)!<br/><br/>
        Type 'help' for available commands.
      </Terminal>
      <InteractiveTerminal />
    </main>
  )
} 