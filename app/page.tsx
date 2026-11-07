'use client'

import React from 'react'
import { InteractiveTerminal } from '../components/InteractiveTerminal'
import { SiteCommands } from '../components/SiteCommands'
import '../styles/terminal.css'

export default function Home() {
  const initialOutput = (
    <>
      <div className="welcome-message">
        <h1 className="welcome-title">WELCOME TO LIFE OF ABIODUN(AB)!</h1>
        <div className="welcome-subtitle">Explore my digital journey</div>
      </div>
      <br /><br />
      Type &apos;help&apos; for available commands:
      <br />
      $ help
      <br /><br />
      <SiteCommands />
    </>
  )

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <InteractiveTerminal initialOutput={initialOutput} />
    </main>
  )
}
