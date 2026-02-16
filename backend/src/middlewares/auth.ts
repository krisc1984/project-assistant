import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

type User = { id: number; username: string; role: string }

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers['authorization'] as string | undefined
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = auth.substring(7)
  try {
    const secret = process.env.JWT_SECRET ?? 'secret'
    const payload = jwt.verify(token, secret) as any
    // Expect payload like { sub: id, username, role }
    const id = payload?.sub ?? payload?.id
    if (!id) throw new Error('Invalid token payload')
    req.user = {
      id,
      username: payload.username ?? `user${id}`,
      role: payload.role ?? 'viewer',
    }
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export default authMiddleware
