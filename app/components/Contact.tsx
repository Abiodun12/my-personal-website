'use client'

import styles from './Contact.module.css'
import { TerminalLink } from '@/components/TerminalLink'

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CONNECT WITH ME</h1>
      <div className={styles.links}>
        <TerminalLink 
          href="https://linkedin.com/in/abiodun-ab-soneye" 
        >
          LINKEDIN
        </TerminalLink>

        <TerminalLink 
          href="https://github.com/Abiodun12"
        >
          GITHUB
        </TerminalLink>

        <TerminalLink 
          href="https://docs.google.com/document/d/1kh85MMIonwwWGMQ3kyEpyTTHlMxjWuiW46uZf1jMBJs/edit?usp=sharing"
        >
          RESUME
        </TerminalLink>

        <TerminalLink 
          href="mailto:Soneyebiodun@gmail.com"
        >
          EMAIL
        </TerminalLink>
      </div>
    </div>
  )
} 