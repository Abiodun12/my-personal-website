import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    
    // Check which API we're using (Azure, DashScope, etc.)
    // Let's make sure we're using the correct API key and format
    
    // For DashScope API
    const dashscopeKey = process.env.DASHSCOPE_API_KEY;
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }
    
    // Let's add proper error handling and debugging
    console.log('Calling API with image URL:', imageUrl);
    
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/vision/image-understanding/basic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dashscopeKey}`
      },
      body: JSON.stringify({
        model: 'vision-caption',
        input: {
          image: imageUrl
        },
        parameters: {
          // Add any required parameters here
        }
      })
    });
    
    // Debug the response
    const responseText = await response.text();
    console.log('Raw API response:', responseText);
    
    // Try to parse as JSON only if it's valid JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse API response as JSON:', error);
      return NextResponse.json({ 
        error: 'Invalid API response',
        details: responseText.substring(0, 100) + '...' // Include part of the response for debugging
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error processing request:', error);
    // Fix the TypeScript error by properly handling unknown error type
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 