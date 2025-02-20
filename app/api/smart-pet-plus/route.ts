import { NextResponse } from 'next/server'

// Make sure this matches your Render URL exactly
const RENDER_API_URL = 'https://my-personal-website-t7tw.onrender.com/api/analyze'

export async function POST(request: Request) {
  try {
    console.log('Starting API request processing') // Debug log
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      console.log('No file provided') // Debug log
      return NextResponse.json({ 
        success: false,
        error: 'No file provided',
        result: null
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    
    console.log('Calling Render API...') // Debug log
    const response = await fetch(RENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    })

    const rawResponse = await response.text() // Get raw response first
    console.log('Raw Render API response:', rawResponse) // Debug log

    let data
    try {
      data = JSON.parse(rawResponse)
      console.log('Parsed Render API response:', data) // Debug log
    } catch (e) {
      console.error('Failed to parse response:', e)
      return NextResponse.json({
        success: false,
        error: 'Invalid response from image analysis service',
        result: null
      }, { status: 500 })
    }
    
    if (!response.ok || !data.success) {
      console.error('API Error:', data)
      return NextResponse.json({
        success: false,
        error: data.error || 'Failed to process image',
        result: null
      }, { status: response.status || 500 })
    }

    // Log the final response we're sending back
    console.log('Sending response:', data)
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