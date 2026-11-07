import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smart Pet Plus',
  description: 'Identify an image and get a short story about it.',
}

export default function SmartPetPlusLayout({ children }: { children: React.ReactNode }) {
  return children
}
