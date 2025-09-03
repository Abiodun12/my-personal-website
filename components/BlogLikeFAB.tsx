'use client'
import ClientPortal from './ClientPortal'
import { BlogLikeButton } from './BlogLikeButton'

interface BlogLikeFABProps {
  postSlug: string
}

export default function BlogLikeFAB({ postSlug }: BlogLikeFABProps) {
  return (
    <ClientPortal>
      <div
        className="fixed md:hidden right-4 z-[10000] pointer-events-none"
        style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        <div className="pointer-events-auto">
          <div 
            style={{
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BlogLikeButton postSlug={postSlug} />
          </div>
        </div>
      </div>
    </ClientPortal>
  )
}
