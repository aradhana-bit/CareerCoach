import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { createAccessToken, createRefreshToken, hashToken } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';
const safeUser = user => ({ id: user.id, name: user.name, email: user.email, role: user.role });
export async function register(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8)
      return res.status(400).json({ message: 'Name, valid email and password (8+ characters) are required' });
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query('INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,role', [name,email,passwordHash]);
    const user = result.rows[0];
    const refreshToken = createRefreshToken(user);
    await pool.query('UPDATE users SET refresh_token_hash=$1,updated_at=NOW() WHERE id=$2', [hashToken(refreshToken),user.id]);
    res.status(201).json({ user: safeUser(user), accessToken: createAccessToken(user), refreshToken });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Email is already registered' });
    next(error);
  }
}
export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const result = await pool.query('SELECT id,name,email,role,password_hash FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.password_hash)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const refreshToken = createRefreshToken(user);
    await pool.query('UPDATE users SET refresh_token_hash=$1,updated_at=NOW() WHERE id=$2', [hashToken(refreshToken),user.id]);
    res.json({ user: safeUser(user), accessToken: createAccessToken(user), refreshToken });
  } catch (error) { next(error); }
}
export async function refresh(req, res) {
  try {
    const token = req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') return res.status(401).json({ message: 'Invalid refresh token' });
    const result = await pool.query('SELECT id,name,email,role,refresh_token_hash FROM users WHERE id=$1', [decoded.sub]);
    const user = result.rows[0];
    if (!user || user.refresh_token_hash !== hashToken(token))
      return res.status(401).json({ message: 'Refresh token is invalid or revoked' });
    const nextRefresh = createRefreshToken(user);
    await pool.query('UPDATE users SET refresh_token_hash=$1,updated_at=NOW() WHERE id=$2', [hashToken(nextRefresh),user.id]);
    res.json({ accessToken: createAccessToken(user), refreshToken: nextRefresh });
  } catch { res.status(401).json({ message: 'Invalid or expired refresh token' }); }
}
export async function logout(req, res, next) {
  try {
    await pool.query('UPDATE users SET refresh_token_hash=NULL,updated_at=NOW() WHERE id=$1', [req.user.id]);
    res.json({ message: 'Logged out' });
  } catch (error) { next(error); }
}