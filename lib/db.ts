import { sql } from '@vercel/postgres';

export async function trackPageView(path: string) {
  try {
    await sql`
      INSERT INTO page_views (path, count)
      VALUES (${path}, 1)
      ON CONFLICT (path) 
      DO UPDATE SET count = page_views.count + 1
    `;
  } catch (error) {
    console.error('Database Error:', error);
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