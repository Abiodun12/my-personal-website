import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')

    // Make the request directly to analyze.py
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        image: base64Image,
        filename: file.name 
      }),
    })

    console.log('Response status:', response.status) // Debug log

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Full error response:', errorText) // Debug log
      throw new Error(errorText || 'Failed to process image')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Detailed error:', error) // Debug log
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error processing request',
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
} 