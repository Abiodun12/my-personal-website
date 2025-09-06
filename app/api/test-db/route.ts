import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      const expected = process.env.ADMIN_API_SECRET
      if (!expected) {
        return NextResponse.json({ success: false, error: 'Disabled in production' }, { status: 403 })
      }
      const provided = req.headers.get('x-admin-secret') || ''
      if (provided !== expected) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
    }
    const result = await sql`SELECT NOW();`;
    return NextResponse.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }
}
