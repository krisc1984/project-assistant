import { Request, Response, NextFunction } from 'express'

type User = { id: number; username: string; role: string }

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

// Simple in-memory RBAC mapping. In production, replace with DB-backed permissions.
const rolePermissions: Record<string, string[]> = {
  admin: ['user:manage', 'project:read', 'project:create', 'score:read', 'score:write'],
  tech_pm: ['project:create', 'project:read', 'score:write'],
  vendor_pm: ['project:read'],
  viewer: ['project:read']
}

export function requirePermission(code: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role) return res.status(401).json({ error: 'Unauthorized' })
    const perms = rolePermissions[role] ?? []
    if (!perms.includes(code)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

export default { requirePermission }
