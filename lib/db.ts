import { sql } from '@vercel/postgres';

export async function trackPageView(path: string) {
  try {
    // Skip database tracking in development if no connection string
    if (!process.env.POSTGRES_URL) {
      console.log('Development mode: Skipping page view tracking for', path);
      return;
    }
    
    await sql`
      INSERT INTO page_views (path, count)
      VALUES (${path}, 1)
      ON CONFLICT (path) 
      DO UPDATE SET count = page_views.count + 1
    `;
  } catch (error) {
    console.error('Database Error:', error);
    // Don't throw in development to avoid breaking the page
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Ignoring database error');
      return;
    }
    throw error;
  }
}

export async function getPopularPages() {
  const { rows } = await sql`
    SELECT path, count 
    FROM page_views 
    ORDER BY count DESC 
    LIMIT 5
  `;
  return rows;
} 