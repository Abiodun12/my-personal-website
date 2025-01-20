'use client'

import React from 'react'
import { InteractiveTerminal } from '../components/InteractiveTerminal'

export default function HomePage() {
  return (
    <main>
      <InteractiveTerminal 
        initialOutput={
          <>
            Welcome to THE LIFE OF AB<br/><br/>
            Type 'help' for available commands<br/>
          </>
        }
      />
    </main>
  )
} 