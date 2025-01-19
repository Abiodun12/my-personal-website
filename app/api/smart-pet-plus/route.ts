import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const pythonFormData = new FormData()
    pythonFormData.append('image', file, file.name)

    // Update the API endpoint to use the full URL in production
    const apiUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/analyze`
      : 'http://localhost:3000/api/analyze'

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: pythonFormData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error processing request' }, 
      { status: 500 }
    )
  }
} 