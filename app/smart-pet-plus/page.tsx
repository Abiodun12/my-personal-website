'use client'

import { useState } from 'react'
import styles from './SmartPetPlus.module.css'
import React from 'react'

export default function SmartPetPlus() {
  const [image, setImage] = useState<string | null>(null)
  const [subject, setSubject] = useState<string | null>(null)
  const [story, setStory] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // Reset previous results
    setImage(null)
    setSubject(null)
    setStory(null)
    
    const formData = new FormData(e.currentTarget)
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      setError('Please select a file')
      setLoading(false)
      return
    }
    
    try {
      console.log('Submitting image...') // Debug log
      const response = await fetch('/api/smart-pet-plus', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      console.log('Response data:', data) // Debug log
      
      if (!response.ok) {
        throw new Error(data.error || 'Server error')
      }
      
      if (data.error) {
        console.error('Error from server:', data.error)
        setError(data.error)
      } else if (!data.success) {
        console.error('Request not successful:', data)
        setError('Failed to process image')
      } else if (!data.result) {
        console.error('No result in response:', data)
        setError('No analysis result received')
      } else {
        console.log('Setting results:', data.result)
        const imageUrl = URL.createObjectURL(file)
        setImage(imageUrl)
        setSubject(data.result.subject)
        setStory(data.result.story)
        
        // Verify states were set
        console.log('States after setting:', {
          imageUrl,
          subject: data.result.subject,
          story: data.result.story
        })
      }
    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? err.message : 'Error processing image')
    } finally {
      setLoading(false)
    }
  }

  // Add render condition logging
  console.log('Render conditions:', {
    image: !!image,
    subject: !!subject,
    story: !!story,
    error: !!error,
    loading
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>SmartPet+ by Cougar AI</h1>
        <p>Upload a Picture of Your Pet (or Any Animal)</p>
        <p>We'll identify what it is, then tell you a heartwarming story!</p>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="file"
            name="uploaded-file"
            accept="image/*"
            className={styles.fileInput}
          />
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {loading && (
          <div className={styles.loading}>
            Analyzing your image...
          </div>
        )}

        {/* Debug output */}
        <div className={styles.debug}>
          <p>Current State:</p>
          <p>Image: {image ? '✓' : '✗'}</p>
          <p>Subject: {subject || 'Not set'}</p>
          <p>Story: {story || 'Not set'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Loading: {loading.toString()}</p>
        </div>

        {/* Story section */}
        {image && subject && story && (
          <div className={styles.story}>
            <img src={image} alt={`Uploaded ${subject}`} />
            <div className={styles.storyContent}>
              <div>
                <h3>Analysis Result:</h3>
                <p>Identified: {subject}</p>
              </div>
              <div>
                <h3>Your Pet's Story:</h3>
                <p>{story.split('[Fun Fact:').map((part, index) => {
                  if (index === 0) {
                    return part.replace('[Story]', '').trim()
                  } else {
                    return (
                      <React.Fragment key={index}>
                        <br /><br />
                        <strong>Fun Fact:</strong>{part.replace(']', '').trim()}
                      </React.Fragment>
                    )
                  }
                })}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 