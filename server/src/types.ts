import type { Request } from 'express';
export type Role = 'Admin' | 'Sales' | 'Warehouse' | 'Accounts';
export interface AuthRequest extends Request { user?: { id: number; role: Role; name: string }; }
