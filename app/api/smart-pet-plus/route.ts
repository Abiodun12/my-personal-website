import { NextResponse, NextRequest } from 'next/server'
import { getClientIp, isAllowedOrigin, rateLimit } from '../../../lib/security'

const API_TIMEOUT = 55000 // 55 seconds

export async function POST(request: NextRequest) {
  try {
    // Origin check
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ success: false, error: 'Origin not allowed', result: null }, { status: 403 })
    }

    // Rate limit per IP
    const ip = getClientIp(request)
    const rl = rateLimit({ key: `smart-pet:${ip}`, windowMs: 60_000, max: 6 })
    if (!rl.allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests', result: null }, { status: 429 })
    }
    const data = await request.formData()
    const file = data.get('uploaded-file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
        result: null
      }, { status: 400 })
    }

    // Basic file validations
    const MAX_IMAGE_BYTES = parseInt(process.env.MAX_IMAGE_BYTES || '5242880', 10) // 5MB default
    if (typeof file.size === 'number' && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ success: false, error: 'Image too large', result: null }, { status: 413 })
    }
    if (file.type && !file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Unsupported media type', result: null }, { status: 415 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    // API endpoint selection with safe dev fallback
    const PROD_API = 'https://my-personal-website-t7tw.onrender.com/api/analyze'
    const configured = process.env.SMART_PET_API_URL
    const API_ENDPOINT = configured
      ? configured
      : (process.env.NODE_ENV === 'development' ? 'http://localhost:8081/api/analyze' : PROD_API)

    try {
      // Forward to Flask API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(process.env.SMART_PET_SHARED_SECRET
            ? { 'X-Shared-Secret': process.env.SMART_PET_SHARED_SECRET }
            : {})
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

    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof DOMException && error.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Request timed out after 55 seconds',
          result: null
        }, { status: 504 })
      }
      // In development, if local API fails, try production endpoint as fallback
      if (!configured && process.env.NODE_ENV === 'development') {
        try {
          const fallbackResponse = await fetch(PROD_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(process.env.SMART_PET_SHARED_SECRET
                ? { 'X-Shared-Secret': process.env.SMART_PET_SHARED_SECRET }
                : {})
            },
            body: JSON.stringify({ image: base64Image })
          })
          const contentType = fallbackResponse.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const responseData = await fallbackResponse.json()
            if (!fallbackResponse.ok) {
              return NextResponse.json({ success: false, error: responseData.error || 'API Error', result: null }, { status: fallbackResponse.status })
            }
            return NextResponse.json(responseData)
          }
        } catch {}
      }
      
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        result: null
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error processing request',
      result: null
    }, { status: 400 })
  }
} 
