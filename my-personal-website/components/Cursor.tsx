'use client'

import React, { useEffect, useState } from 'react'

export function Cursor() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setVisible((v) => !v)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <span 
      className="cursor" 
      style={{ 
        opacity: visible ? 1 : 0,
        display: 'inline-block',
        width: '0.5em',
        height: '1em',
        backgroundColor: 'var(--text-color)',
        verticalAlign: 'middle',
        marginLeft: '2px'
      }}
    />
  )
}
