'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav?.type === 'back_forward') return

    const scrollAll = () => {
      // Reset window scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      // Reset any internal scroll containers used by the terminal UI
      const containers = document.querySelectorAll<HTMLElement>('.terminal-content, .terminal-output')
      containers.forEach((el) => {
        el.scrollTop = 0
      })
    }

    // Run now and on next frame to catch post-hydration layout
    scrollAll()
    requestAnimationFrame(scrollAll)
  }, [pathname])

  return null
}

