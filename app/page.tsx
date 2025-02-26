'use client'

import React, { useEffect, useState } from 'react'
import { InteractiveTerminal } from '../components/InteractiveTerminal'
import { Terminal } from '../components/Terminal'
import { Cursor } from '../components/Cursor'
import '../styles/terminal.css'

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    const desktop = window.innerWidth >= 1024 || 
      navigator.userAgent.includes('Windows') || 
      navigator.userAgent.includes('Mac');
    setIsDesktop(desktop)
    
    if (desktop) {
      // Load minimal CSS instead
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/desktop-terminal.css' // Simplified CSS for desktop
      document.head.appendChild(link)
      
      // Disable existing animations
      document.documentElement.style.setProperty('--animation-state', 'paused')
      document.body.classList.add('ultra-performance')
    }
  }, [])
  
  const initialOutput = (
    <>
      <div className="welcome-message">
        <div className="welcome-title">WELCOME TO LIFE OF ABIODUN(AB)!</div>
        <div className="welcome-subtitle">Explore my digital journey</div>
      </div>
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
    <main className={isDesktop ? 'desktop-mode' : ''} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <InteractiveTerminal initialOutput={initialOutput} />
    </main>
  )
} 