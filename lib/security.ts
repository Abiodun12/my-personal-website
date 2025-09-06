import type { NextRequest } from 'next/server'

// Basic, environment-aware origin allowlist
export function isAllowedOrigin(req: NextRequest): boolean {
  // Allow when no Origin header (same-origin fetch, server-to-server, Postman)
  const origin = req.headers.get('origin') || ''
  if (!origin) return true

  const envList = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // Helpful defaults
  const defaults: string[] = []
  if (process.env.NODE_ENV !== 'production') {
    defaults.push('http://localhost:3000')
  }

  const allowed = new Set([...defaults, ...envList])
  if (allowed.size === 0) {
    // If not configured in production, only allow same-origin
    if (process.env.NODE_ENV === 'production') {
      const host = req.headers.get('host')
      if (!host) return false
      const proto = req.nextUrl.protocol || 'https:'
      const currentOrigin = `${proto}//${host}`
      return origin === currentOrigin
    }
    // In dev with no config, be permissive to avoid friction
    return true
  }
  return allowed.has(origin)
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for') || ''
  if (xff) return xff.split(',')[0].trim()
  const xri = req.headers.get('x-real-ip') || ''
  if (xri) return xri.trim()
  return 'unknown'
}

// Very lightweight in-memory rate limiter (best-effort).
// On serverless this is per-instance; good for dev and mild prod shielding.
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(opts: {
  key: string
  windowMs?: number
  max?: number
}): { allowed: boolean; remaining: number; resetAt: number } {
  const windowMs = opts.windowMs ?? 60_000
  const max = opts.max ?? 20
  const now = Date.now()
  const key = opts.key

  const b = buckets.get(key)
  if (!b || b.resetAt < now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: max - 1, resetAt }
  }

  if (b.count >= max) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt }
  }
  b.count += 1
  return { allowed: true, remaining: max - b.count, resetAt: b.resetAt }
}

export function isLikelyImageContentType(ct?: string | null): boolean {
  if (!ct) return false
  return ct.startsWith('image/')
}

export function isValidImageUrl(url: string): boolean {
  if (typeof url !== 'string') return false
  if (url.length > 2048) return false
  try {
    const u = new URL(url)
    if (!(u.protocol === 'http:' || u.protocol === 'https:')) return false
    // Block obvious local targets
    const host = u.hostname
    const blockedHosts = ['localhost', '127.0.0.1', '::1']
    if (blockedHosts.includes(host)) return false
    return true
  } catch {
    return false
  }
}
