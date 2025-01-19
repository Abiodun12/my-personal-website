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

    // Get the domain from the request headers or use the Vercel URL
    const domain = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    // Construct absolute URL
    const apiUrl = new URL('/api/analyze', domain).toString()
    console.log('Making request to:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        image: base64Image,
        filename: file.name 
      }),
    })

    const responseText = await response.text()
    console.log('API Response:', response.status, responseText)

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${responseText}`)
    }

    // Try to parse the response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Detailed error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error processing request',
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
} 