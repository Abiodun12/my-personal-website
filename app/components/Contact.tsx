'use client'

import styles from './Contact.module.css'
import { TerminalLink } from '@/components/TerminalLink'
import { SOCIAL_LINKS } from '@/config/shared-content'

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CONNECT WITH ME</h1>
      <div className={styles.links}>
        <TerminalLink 
          href={SOCIAL_LINKS.LINKEDIN} 
        >
          LINKEDIN
        </TerminalLink>

        <TerminalLink 
          href={SOCIAL_LINKS.GITHUB}
        >
          GITHUB
        </TerminalLink>

        <TerminalLink 
          href={SOCIAL_LINKS.RESUME}
        >
          RESUME
        </TerminalLink>

        <TerminalLink 
          href={SOCIAL_LINKS.EMAIL}
        >
          EMAIL
        </TerminalLink>
      </div>
    </div>
  )
} 