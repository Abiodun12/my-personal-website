import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Generate a unique user ID if one doesn't exist
function getUserId(req: NextRequest) {
  const cookieStore = cookies();
  let userId = cookieStore.get('user_id')?.value;
  
  if (!userId) {
    userId = crypto.randomUUID();
    cookieStore.set('user_id', userId, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }
  
  return userId;
}

// GET handler to fetch user preferences
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    
    // Get user preferences from database
    const { rows } = await sql`
      SELECT preferences FROM user_preferences 
      WHERE user_id = ${userId}
    `;
    
    if (rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        preferences: {
          performanceMode: true,
          effectsEnabled: false,
          particlesEnabled: false
        } 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      preferences: rows[0].preferences 
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

// POST handler to save user preferences
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const { preferences } = await req.json();
    
    // Save user preferences to database using upsert pattern
    await sql`
      INSERT INTO user_preferences (user_id, preferences) 
      VALUES (${userId}, ${JSON.stringify(preferences)})
      ON CONFLICT (user_id) 
      DO UPDATE SET preferences = ${JSON.stringify(preferences)}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
} 