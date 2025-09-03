import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Reuse your existing getUserId function
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

// Generate terminal-style username
function generateUsername(userId: string): string {
  const prefixes = ['terminal', 'dev', 'code', 'bash', 'vim', 'sudo', 'root', 'user'];
  const suffixes = ['ninja', 'wizard', 'master', 'hacker', 'geek', 'pro', 'dev', 'anon'];
  
  // Use userId to generate consistent username for same user
  const hash = crypto.createHash('md5').update(userId).digest('hex');
  const prefixIndex = parseInt(hash.substring(0, 2), 16) % prefixes.length;
  const suffixIndex = parseInt(hash.substring(2, 4), 16) % suffixes.length;
  const number = parseInt(hash.substring(4, 6), 16) % 100;
  
  return `${prefixes[prefixIndex]}_${suffixes[suffixIndex]}_${number}`;
}

// GET - Get likes for a post
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get('slug');
    
    if (!postSlug) {
      return NextResponse.json({ error: 'Post slug required' }, { status: 400 });
    }

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS blog_likes (
        id SERIAL PRIMARY KEY,
        post_slug VARCHAR(255) NOT NULL,
        user_id TEXT NOT NULL,
        username VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_slug, user_id)
      )
    `;

    // Get like count and check if current user liked
    const userId = getUserId(req);
    const { rows: likeData } = await sql`
      SELECT 
        COUNT(*) as total_likes,
        BOOL_OR(user_id = ${userId}) as user_liked
      FROM blog_likes 
      WHERE post_slug = ${postSlug}
    `;

    return NextResponse.json({
      totalLikes: parseInt(likeData[0].total_likes),
      userLiked: likeData[0].user_liked || false
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

// POST - Toggle like
export async function POST(req: NextRequest) {
  try {
    const { postSlug } = await req.json();
    const userId = getUserId(req);
    const username = generateUsername(userId);

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS blog_likes (
        id SERIAL PRIMARY KEY,
        post_slug VARCHAR(255) NOT NULL,
        user_id TEXT NOT NULL,
        username VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_slug, user_id)
      )
    `;

    // Check if user already liked
    const { rows: existingLike } = await sql`
      SELECT id FROM blog_likes 
      WHERE post_slug = ${postSlug} AND user_id = ${userId}
    `;

    if (existingLike.length > 0) {
      // Unlike
      await sql`
        DELETE FROM blog_likes 
        WHERE post_slug = ${postSlug} AND user_id = ${userId}
      `;
      
      // Get new count
      const { rows: countData } = await sql`
        SELECT COUNT(*) as total_likes FROM blog_likes WHERE post_slug = ${postSlug}
      `;
      
      return NextResponse.json({
        liked: false,
        totalLikes: parseInt(countData[0].total_likes),
        message: 'Post unliked'
      });
    } else {
      // Like
      await sql`
        INSERT INTO blog_likes (post_slug, user_id, username)
        VALUES (${postSlug}, ${userId}, ${username})
      `;
      
      // Get new count
      const { rows: countData } = await sql`
        SELECT COUNT(*) as total_likes FROM blog_likes WHERE post_slug = ${postSlug}
      `;
      
      return NextResponse.json({
        liked: true,
        totalLikes: parseInt(countData[0].total_likes),
        message: `Liked as ${username}`
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
