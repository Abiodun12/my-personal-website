import { NextResponse } from 'next/server'

// Make sure this matches your Render URL exactly
const RENDER_API_URL = 'https://my-personal-website-t7tw.onrender.com/api/analyze'

export async function POST(request: Request) {
  try {
    console.log('Starting API request processing')
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ 
        success: false,
        error: 'No file provided',
        result: null
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    
    console.log('Calling Render API...')
    const response = await fetch(RENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    })

    // First get the raw response text
    const rawResponse = await response.text()
    console.log('Raw response:', rawResponse)

    let data
    try {
      // Try to parse the response as JSON
      data = JSON.parse(rawResponse)
      console.log('Parsed response:', data)
    } catch (e) {
      console.error('Failed to parse response:', e)
      // If there's text in the response, include it in the error
      const errorMessage = rawResponse.length > 0 
        ? `Invalid JSON response: ${rawResponse.slice(0, 100)}...` 
        : 'Empty response from server'
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        result: null
      }, { status: 500 })
    }

    // Check if the response has the expected structure
    if (!response.ok || !data.success) {
      console.error('API Error:', data)
      return NextResponse.json({
        success: false,
        error: data.error || 'Failed to process image',
        result: null
      }, { status: response.status || 500 })
    }

    // Validate the response data structure
    if (!data.result?.subject || !data.result?.story) {
      console.error('Invalid response structure:', data)
      return NextResponse.json({
        success: false,
        error: 'Invalid response structure from image analysis service',
        result: null
      }, { status: 500 })
    }

    // Ensure the story has the correct format
    if (!data.result.story.includes('[Story]')) {
      data.result.story = `[Story] ${data.result.story}`
    }
    if (!data.result.story.includes('[Fun Fact:')) {
      data.result.story = `${data.result.story} [Fun Fact: ${data.result.subject}s are fascinating creatures!]`
    }

    console.log('Sending final response:', data)
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error',
      result: null
    }, { status: 500 })
  }
} 