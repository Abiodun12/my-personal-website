import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes from Abiodun (AB) Soneye on tech and life.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
