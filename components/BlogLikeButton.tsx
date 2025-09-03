'use client'

import { useState, useEffect } from 'react'

interface BlogLikeButtonProps {
  postSlug: string
}

export function BlogLikeButton({ postSlug }: BlogLikeButtonProps) {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch initial like data
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/blog/likes?slug=${postSlug}`)
        const data = await response.json()
        setLikes(data.totalLikes)
        setIsLiked(data.userLiked)
      } catch (error) {
        console.error('Error fetching likes:', error)
      }
    }
    
    fetchLikes()
  }, [postSlug])

  const handleLike = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/blog/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug })
      })
      
      const data = await response.json()
      setLikes(data.totalLikes)
      setIsLiked(data.liked)
      
      // Show terminal-style message
      if (data.message) {
        setMessage(`$ ${data.message}`)
        setTimeout(() => setMessage(''), 3000) // Clear after 3 seconds
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      setMessage('$ Error: Failed to toggle like')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '5px',
      fontFamily: 'monospace',
      color: '#00ff00'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleLike}
          disabled={isLoading}
          style={{
            background: 'transparent',
            border: '1px solid #00ff00',
            color: isLiked ? '#ff6b6b' : '#00ff00',
            padding: '5px 10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace',
            fontSize: '14px',
            borderRadius: '3px'
          }}
        >
          {isLoading ? '...' : isLiked ? '♥ liked' : '♡ like'}
        </button>
        <span>$ likes: {likes}</span>
      </div>
      {message && (
        <div style={{ 
          fontSize: '12px', 
          color: '#888',
          fontStyle: 'italic'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}
