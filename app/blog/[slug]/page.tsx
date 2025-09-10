import React from 'react'
import { Terminal } from '../../../components/Terminal'
import { TerminalLink } from '../../../components/TerminalLink'
import { notFound } from 'next/navigation'
import { blogPosts } from '../../../config/blog'
import { BlogLikeButton } from '../../../components/BlogLikeButton'
import BlogLikeFAB from '../../../components/BlogLikeFAB'
import type { Metadata } from 'next'

interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  content: string
}

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  return {
    title: post ? `${post.title} - Life of AB` : 'Blog - Life of AB',
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Compact header command */}
        <Terminal autoScroll={false} maxHeight="none">$ cat {post.title}.md</Terminal>
        <Terminal autoScroll={false} maxHeight="none">
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} 
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
          $ <TerminalLink href="/blog">cd ..</TerminalLink>
        </Terminal>
      </main>
    </>
  )
}

function formatContent(content: string) {
  return content
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^- (.*$)/gm, '• $1<br>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => 
      `<pre><code class="${lang}">${code}</code></pre>`
    )
} 
