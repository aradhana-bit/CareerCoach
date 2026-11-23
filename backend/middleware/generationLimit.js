import Generation from '../models/Generation.js';

export async function generationLimit(req, res, next) {
  try {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const count = await Generation.countDocuments({ user: req.user._id, createdAt: { $gte: since } });
    const limit = 10;
    res.setHeader('X-Generation-Limit', String(limit));
    res.setHeader('X-Generation-Remaining', String(Math.max(0, limit - count)));
    if (count >= limit) return res.status(429).json({ message: 'Hourly AI generation limit reached. Try again later.' });
    next();
  } catch (error) { next(error); }
}
