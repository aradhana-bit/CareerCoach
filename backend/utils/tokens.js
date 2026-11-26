import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export function createAccessToken(user) {
  return jwt.sign({ sub: String(user.id), role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: `${Number(process.env.ACCESS_TOKEN_MINUTES || 15)}m`
  });
}
export function createRefreshToken(user) {
  return jwt.sign({ sub: String(user.id), type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${Number(process.env.REFRESH_TOKEN_DAYS || 7)}d`
  });
}
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}