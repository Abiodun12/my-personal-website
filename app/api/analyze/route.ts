import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, isAllowedOrigin, isLikelyImageContentType, isValidImageUrl, rateLimit } from '../../../lib/security';

export async function POST(req: NextRequest) {
  try {
    // Basic origin check to prevent cross-site abuse in browsers
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
    }

    // Basic per-IP rate limit (best-effort)
    const ip = getClientIp(req)
    const rl = rateLimit({ key: `analyze:${ip}`, windowMs: 60_000, max: 10 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { imageUrl } = await req.json();
    
    // Check which API we're using (Azure, DashScope, etc.)
    // Let's make sure we're using the correct API key and format
    
    // For DashScope API
    const dashscopeKey = process.env.DASHSCOPE_API_KEY;
    if (!dashscopeKey) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    if (!imageUrl || typeof imageUrl !== 'string' || !isValidImageUrl(imageUrl)) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }
    
    // Optional preflight HEAD to ensure URL looks like an image and not huge
    const MAX_IMAGE_BYTES = parseInt(process.env.MAX_IMAGE_BYTES || '5242880', 10) // 5MB default
    try {
      const controller = new AbortController()
      const t = setTimeout(() => controller.abort(), 5000)
      const head = await fetch(imageUrl, { method: 'HEAD', signal: controller.signal })
      clearTimeout(t)
      const ct = head.headers.get('content-type')
      const len = parseInt(head.headers.get('content-length') || '0', 10)
      if (!isLikelyImageContentType(ct)) {
        return NextResponse.json({ error: 'URL does not point to an image' }, { status: 400 })
      }
      if (len && len > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: 'Image too large' }, { status: 413 })
      }
    } catch {
      // Ignore preflight errors; continue to provider
    }
    
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
    
    // Read response body text to safely try parse
    const responseText = await response.text();
    
    // Try to parse as JSON only if it's valid JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid API response',
        details: responseText.substring(0, 100) + '...' // Include part of the response for debugging
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    // Fix the TypeScript error by properly handling unknown error type
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
