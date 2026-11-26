import { pool } from '../config/db.js';
export async function usageReport(_req, res, next) {
  try {
    const [users, generations, usage] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total FROM users'),
      pool.query('SELECT COUNT(*)::int AS total FROM generations'),
      pool.query(`SELECT u.id AS "_id",u.name,u.email,COUNT(g.id)::int AS "totalGenerations",
        COUNT(g.id) FILTER (WHERE g.type='resume')::int AS "resumeCount",
        COUNT(g.id) FILTER (WHERE g.type='interview')::int AS "interviewCount"
        FROM users u LEFT JOIN generations g ON g.user_id=u.id
        GROUP BY u.id,u.name,u.email ORDER BY "totalGenerations" DESC,u.name ASC`)
    ]);
    res.json({ totalUsers: users.rows[0].total, totalGenerations: generations.rows[0].total, usageByUser: usage.rows });
  } catch (error) { next(error); }
}