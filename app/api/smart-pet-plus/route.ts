import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Make sure this matches your Render URL exactly
const RENDER_API_URL = 'https://my-personal-website-t7tw.onrender.com/api/analyze'

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous'
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'),
  })
  const { success } = await ratelimit.limit(identifier)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    
    console.log('Sending request to:', RENDER_API_URL) // Debug log
    
    const response = await fetch(RENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        image: base64Image,
        filename: file.name 
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText) // Debug log
      throw new Error(`API returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('API Response:', data) // Debug log
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 