import { NextResponse } from 'next/server'

// Make sure this matches your Render URL exactly
const RENDER_API_URL = 'https://my-personal-website-t7tw.onrender.com/api/analyze'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file provided',
        result: null
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    
    const response = await fetch(RENDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    })

    const data = await response.json()
    console.log('Render API response:', data) // Add this for debugging
    
    if (!response.ok || !data.success) {
      return NextResponse.json({
        success: false,
        error: data.error || 'Failed to process image',
        result: null
      }, { status: response.status || 500 })
    }

    return NextResponse.json({
      success: true,
      error: null,
      result: {
        subject: data.result?.subject || '',
        story: data.result?.story || ''
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error',
      result: null
    }, { status: 500 })
  }
} 