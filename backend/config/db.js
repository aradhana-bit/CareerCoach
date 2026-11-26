import pg from 'pg';
const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing from environment');
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});
pool.on('error', error => console.error('Unexpected PostgreSQL pool error:', error.message));
export default async function connectDB() {
  await pool.query('SELECT 1');
  console.log('PostgreSQL connected');
}