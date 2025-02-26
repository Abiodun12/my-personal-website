'use client'

import React from 'react'
import { InteractiveTerminal } from '../components/InteractiveTerminal'
import { Terminal } from '../components/Terminal'
import { Cursor } from '../components/Cursor'

export default function Home() {
  const initialOutput = (
    <>
      Welcome to LIFE OF ABIODUN(AB)!
      <br /><br />
      Type 'help' for available commands:
      <br />
      $ help
      <br /><br />
      <div className="terminal-help">
        Available Commands:<br/>
        {'>'}  <span className="command-link">ABOUT</span>    : Learn more about me<br/>
        {'>'}  <span className="command-link">PROJECTS</span> : View my portfolio<br/>
        {'>'}  <span className="command-link">BLOG</span>     : Read my thoughts<br/>
        {'>'}  <span className="command-link">CONTACT</span>  : How to reach me
      </div>
    </>
  );
  
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <InteractiveTerminal initialOutput={initialOutput} />
    </main>
  )
} 