'use client'

import { usePathname, useRouter } from 'next/navigation'

function getBackTarget(pathname: string) {
  if (pathname.startsWith('/blog/')) {
    return { href: '/blog', label: 'cd ../blog' }
  }

  if (pathname !== '/') {
    return { href: '/', label: 'cd ..' }
  }

  return null
}

export default function MobileTerminalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const backTarget = getBackTarget(pathname)

  if (!backTarget) return null

  const goTo = (href: string) => {
    router.push(href)
  }

  return (
    <nav className="mobile-terminal-nav" aria-label="Mobile terminal navigation">
      <span className="mobile-terminal-nav-prompt">$</span>
      <button type="button" onClick={() => goTo(backTarget.href)}>
        {backTarget.label}
      </button>
      {pathname !== '/' && (
        <button type="button" onClick={() => goTo('/')}>
          home
        </button>
      )}
      {!pathname.startsWith('/blog') && (
        <button type="button" onClick={() => goTo('/blog')}>
          blog
        </button>
      )}
    </nav>
  )
}
