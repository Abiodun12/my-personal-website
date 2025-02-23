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
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      const response = await fetch('/api/smart-pet-plus', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

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
    } catch (err: unknown) {
      console.error('Error:', err)
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.')
        } else {
          setError(err.message)
        }
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalButton + ' ' + styles.close}></div>
          <div className={styles.terminalButton + ' ' + styles.minimize}></div>
          <div className={styles.terminalButton + ' ' + styles.maximize}></div>
        </div>
        
        <div className={styles.terminalContent}>
          <p>$ cat smart-pet-plus.txt</p>
          <div className={styles.header}>
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

          {loading && (
            <div className={styles.loading}>
              $ analyzing image...
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Error: {error}</p>
            </div>
          )}

          {subject && story && (
            <div className={styles.result}>
              <p>$ cat analysis_result.txt</p>
              <div className={styles.resultContent}>
                <p className={styles.subject}>Subject: {subject}</p>
                <div className={styles.storySection}>
                  {story.split('[Story]')[1].split('[Fun Fact:')[0].trim()}
                </div>
                <div className={styles.funFact}>
                  Fun Fact: {story.split('[Fun Fact:')[1].replace(']', '').trim()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 