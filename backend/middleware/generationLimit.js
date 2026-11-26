import { pool } from '../config/db.js';
export async function generationLimit(req, res, next) {
  try {
    const result = await pool.query(`SELECT COUNT(*)::int AS total FROM generations WHERE user_id=$1 AND created_at >= NOW() - INTERVAL '1 hour'`, [req.user.id]);
    const count = result.rows[0].total;
    const limit = 10;
    res.setHeader('X-Generation-Limit', String(limit));
    res.setHeader('X-Generation-Remaining', String(Math.max(0,limit-count)));
    if (count >= limit) return res.status(429).json({ message: 'Hourly AI generation limit reached. Try again later.' });
    next();
  } catch (error) { next(error); }
}