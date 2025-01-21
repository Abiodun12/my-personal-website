'use client'

import styles from './Contact.module.css'
import Link from 'next/link'

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CONNECT WITH ME</h1>
      <div className={styles.links}>
        <Link 
          href="https://linkedin.com/in/abiodun-ab-soneye" 
          target="_blank" 
          className={styles.link}
        >
          LINKEDIN
        </Link>

        <Link 
          href="https://github.com/Abiodun12" 
          target="_blank" 
          className={styles.link}
        >
          GITHUB
        </Link>

        <Link 
          href="https://bit.ly/abiodun-resume" 
          target="_blank" 
          className={styles.link}
        >
          RESUME
        </Link>

        <Link 
          href="mailto:Soneyebiodun@gmail.com" 
          className={styles.link}
        >
          EMAIL
        </Link>
      </div>
    </div>
  )
} 