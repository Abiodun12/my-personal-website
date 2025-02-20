import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file = data.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
        result: null
      }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Forward to Flask API
    const response = await fetch('https://my-personal-website-t7tw.onrender.com/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image
      })
    })

    // Get raw response text first for debugging
    const rawText = await response.text()
    
    try {
      // Try to parse as JSON
      const result = JSON.parse(rawText)
      return NextResponse.json(result)
    } catch (parseError) {
      // If parsing fails, return the raw text in the error
      return NextResponse.json({
        success: false,
        error: `API Response Error: ${rawText.slice(0, 200)}...`,
        result: null
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: `Request Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      result: null
    }, { status: 500 })
  }
} 