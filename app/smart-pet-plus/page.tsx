'use client'

import { useState } from 'react'
import styles from './SmartPetPlus.module.css'

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
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Server error')
      }
      
      if (data.error) {
        setError(data.error)
      } else if (!data.success) {
        setError('Failed to process image')
      } else {
        setImage(URL.createObjectURL(file))
        setSubject(data.result?.subject || '')
        setStory(data.result?.story || '')
      }
    } catch (err) {
      console.error('Error details:', err)
      setError(err instanceof Error ? err.message : 'Error processing image')
    } finally {
      setLoading(false)
    }
  }

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

        {image && subject && story && (
          <div className={styles.story}>
            <img src={image} alt="Uploaded pet" />
            <div className={styles.storyContent}>
              <div>
                <h3>Analysis Result:</h3>
                <p>Identified: {subject}</p>
              </div>
              <div>
                <h3>Your Pet's Story:</h3>
                <p>{story}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 