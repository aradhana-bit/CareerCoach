import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { createAccessToken, createRefreshToken, hashToken } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';

const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8)
      return res.status(400).json({ message: 'Name, valid email and password (8+ characters) are required' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email is already registered' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    const refresh = createRefreshToken(user);
    user.refreshTokenHash = hashToken(refresh);
    await user.save();
    res.status(201).json({ user: safeUser(user), accessToken: createAccessToken(user), refreshToken: refresh });
  } catch (e) { next(e); }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const refresh = createRefreshToken(user);
    user.refreshTokenHash = hashToken(refresh);
    await user.save();
    res.json({ user: safeUser(user), accessToken: createAccessToken(user), refreshToken: refresh });
  } catch (e) { next(e); }
}
export async function refresh(req, res) {
  try {
    const token = req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.sub).select('+refreshTokenHash');
    if (!user || user.refreshTokenHash !== hashToken(token))
      return res.status(401).json({ message: 'Refresh token is invalid or revoked' });
    const nextRefresh = createRefreshToken(user);
    user.refreshTokenHash = hashToken(nextRefresh);
    await user.save();
    res.json({ accessToken: createAccessToken(user), refreshToken: nextRefresh });
  } catch { res.status(401).json({ message: 'Invalid or expired refresh token' }); }
}
export async function logout(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('+refreshTokenHash');
    if (user) { user.refreshTokenHash = null; await user.save(); }
    res.json({ message: 'Logged out' });
  } catch (e) { next(e); }
}
