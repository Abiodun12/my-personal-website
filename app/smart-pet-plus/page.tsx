'use client'

import React, { useState } from 'react'
import { Terminal } from '../../components/Terminal'
import { Cursor } from '../../components/Cursor'
import styles from './SmartPetPlus.module.css'

export default function SmartPetPlus() {
  const [image, setImage] = useState<string | null>(null)
  const [story, setStory] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('image', formData.get('uploaded-file') as File)
    
    try {
      const response = await fetch('/api/smart-pet-plus', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      console.log('Response:', data) // Debug log
      
      if (!response.ok) {
        throw new Error(data.error || 'Server error')
      }
      
      if (data.error) {
        setError(data.error)
      } else {
        setImage(data.image)
        setStory(data.story)
      }
    } catch (err) {
      console.error('Error:', err) // Debug log
      setError(err instanceof Error ? err.message : 'Error processing image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <Terminal>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>SmartPet+ by Cougar AI</h1>
          </header>

          <div className={styles.content}>
            <h2>Upload a Picture of Your Pet (or Any Animal)</h2>
            <p>We'll identify what it is, then tell you a heartwarming story!</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="file"
                name="uploaded-file"
                accept=".jpg,.jpeg,.png,.gif"
                required
                className={styles.fileInput}
              />
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </form>

            {loading && (
              <div className={styles.loading}>
                Processing your image... <Cursor />
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {image && story && (
              <div className={styles.story}>
                <img src={image} alt="Uploaded Pet" />
                <p>{story}</p>
              </div>
            )}
          </div>
        </div>
      </Terminal>
    </main>
  )
} 