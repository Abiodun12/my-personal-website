import React from 'react'
import { Terminal } from '../../../components/Terminal'
import { TerminalLink } from '../../../components/TerminalLink'
import { notFound } from 'next/navigation'
import { blogPosts } from '../../../config/blog'
import { BlogLikeButton } from '../../../components/BlogLikeButton'
import BlogLikeFAB from '../../../components/BlogLikeFAB'
import { formatBlogContent } from '../../../lib/formatBlog'
import type { Metadata } from 'next'

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  return {
    title: post ? { absolute: `${post.title} · Life of AB` } : 'Blog',
    description: post?.description || 'Read my latest thoughts and experiences',
  }
}

export const revalidate = 3600; // Revalidate every hour

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <main className="blog-post" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Terminal autoScroll={false} maxHeight="none">cat {post.title}.md</Terminal>
        <Terminal autoScroll={false} maxHeight="none">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content) }}
          />
        </Terminal>
        
        {/* Desktop/tablet inline like button */}
        <div className="hidden md:block">
          <Terminal autoScroll={false}>
            <BlogLikeButton postSlug={params.slug} />
          </Terminal>
        </div>

        {/* Mobile floating action button */}
        <BlogLikeFAB postSlug={params.slug} />
        
        {/* Compact footer nav */}
        <Terminal autoScroll={false} maxHeight="none">
          <TerminalLink href="/blog">cd ..</TerminalLink>
        </Terminal>
      </main>
    </>
  )
}

