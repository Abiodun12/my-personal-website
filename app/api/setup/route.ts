import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// This endpoint will create the necessary database table
export async function GET() {
  try {
    // Create user_preferences table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id TEXT PRIMARY KEY,
        preferences JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully' 
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Database setup failed' },
      { status: 500 }
    );
  }
} 