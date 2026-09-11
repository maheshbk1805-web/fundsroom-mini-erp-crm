import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, Role } from './types.js';
const secret = () => process.env.JWT_SECRET || 'development-secret-change-me';
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication is required.' });
  try { req.user = jwt.verify(token, secret()) as AuthRequest['user']; next(); }
  catch { return res.status(401).json({ message: 'Session is invalid or expired.' }); }
}
export const allow = (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) =>
  !req.user || !roles.includes(req.user.role) ? res.status(403).json({ message: 'You do not have permission for this action.' }) : next();
export const signToken = (user: { id: number; role: Role; name: string }) => jwt.sign(user, secret(), { expiresIn: '8h' });
