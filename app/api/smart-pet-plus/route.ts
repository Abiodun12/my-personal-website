import { NextResponse } from 'next/server'

const API_TIMEOUT = 55000 // 55 seconds

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

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      // Forward to Flask API
      const response = await fetch('https://my-personal-website-t7tw.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      let responseData
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        const textResponse = await response.text()
        return NextResponse.json({
          success: false,
          error: `Invalid response format: ${textResponse.substring(0, 100)}...`,
          result: null
        }, { status: 500 })
      }

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: responseData.error || `API Error (${response.status})`,
          result: null
        }, { status: response.status })
      }

      return NextResponse.json(responseData)

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Request timed out. Please try again.',
          result: null
        }, { status: 504 })
      }
      throw fetchError
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      result: null
    }, { status: 500 })
  }
} 