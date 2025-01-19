import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Create a new FormData with the correct field name
    const pythonFormData = new FormData()
    pythonFormData.append('image', file, file.name)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        body: pythonFormData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Could not connect to Python server. Is it running?' }, 
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error processing request' }, 
      { status: 500 }
    )
  }
} 