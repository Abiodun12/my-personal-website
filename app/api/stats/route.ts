import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET() {
  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        path VARCHAR(255) PRIMARY KEY,
        count INT NOT NULL DEFAULT 1
      )
    `;

    const { rows } = await sql`
      SELECT path, count 
      FROM page_views 
      ORDER BY count DESC 
      LIMIT 5
    `;

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 