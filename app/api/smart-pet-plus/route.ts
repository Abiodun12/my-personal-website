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
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image
      })
    })

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

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      result: null
    }, { status: 500 })
  }
} 