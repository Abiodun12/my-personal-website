'use client'

import React, { useState, useRef } from 'react'
import styles from './SmartPetPlus.module.css'

export default function SmartPetPlus() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [story, setStory] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select an image to upload')
      return
    }
    
    const file = fileInputRef.current.files[0]
    
    // Image preview for user feedback
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    setLoading(true)
    setError(null)
    
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('uploaded-file', file)
      
      // Send to API
      const response = await fetch('/api/smart-pet-plus', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze image')
      }
      
      setSubject(data.result.subject)
      setStory(data.result.story)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Smart Pet Plus - Universal Image Analyzer</h1>
        <p>Upload any image - we'll identify what it is and tell you a creative story about it!</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          ref={fileInputRef}
          name="uploaded-file"
          accept="image/*"
          className={styles.fileInput}
          onChange={() => setError(null)}
        />
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Analyze Image'}
        </button>
      </form>

      {loading && (
        <div className={styles.loading}>
          Processing your image...
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}

      {subject && story && (
        <div className={styles.result}>
          <div className={styles.resultContent}>
            {image && (
              <div className={styles.imageContainer}>
                <img src={image} alt={subject} className={styles.previewImage} />
              </div>
            )}
            <p className={styles.subject}>
              {subject.includes('dog') || subject.includes('cat') || subject.includes('bird') ? 
                `Pet Identified: ${subject}` : 
                `Identified as: ${subject}`}
            </p>
            <div className={styles.storySection}>
              {story.includes('[Story]') 
                ? story.split('[Story]')[1].split('[Fun Fact:')[0].trim()
                : story.split('[Fun Fact:')[0].trim()}
            </div>
            <div className={styles.funFact}>
              {story.includes('[Fun Fact:') 
                ? `Fun Fact: ${story.split('[Fun Fact:')[1].replace(']', '').trim()}`
                : 'Fun Fact: This is a fascinating subject!'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 