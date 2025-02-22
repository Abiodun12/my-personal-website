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
      const response = await fetch('/api/smart-pet-plus', {
        method: 'POST',
        body: formData,
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to process image')
      }

      if (!data.result || !data.result.subject || !data.result.story) {
        throw new Error('Invalid response data from server')
      }

      setImage(URL.createObjectURL(file))
      setSubject(data.result.subject)
      setStory(data.result.story)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Smart Pet Plus</h1>
        <p>Upload a Picture of Your Pet (or Any Animal)</p>
        <p>We'll identify what it is, then tell you a heartwarming story!</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
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
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          <h3>Error Details:</h3>
          <p>{error}</p>
          {error.includes('Unexpected token') && (
            <p className={styles.errorHint}>
              If you see "Unexpected token", this means the API returned invalid data.
              Please check the server logs for more details.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          Processing your image...
        </div>
      )}

      {subject && story && (
        <div className={styles.result}>
          <h2>Analysis Result:</h2>
          {image && <img src={image} alt={subject} className={styles.previewImage} />}
          <p><strong>Subject:</strong> {subject}</p>
          <p><strong>Story:</strong> {story}</p>
        </div>
      )}

      <div className={styles.debug}>
        <h3>Current State:</h3>
        <p>Image: {image ? '✓' : '✗'}</p>
        <p>Subject: {subject || 'Not set'}</p>
        <p>Story: {story ? '✓' : 'Not set'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Loading: {loading.toString()}</p>
      </div>
    </div>
  )
} 