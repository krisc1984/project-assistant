import { Router } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import authMiddleware from '../middlewares/auth'

const router = Router()

// Mock login: returns a simple token encoded as userId|role
router.post('/login', (req, res) => {
  const { username, password, role } = req.body
  // In a real implementation, validate credentials. Here we issue a JWT.
  const userId = 1
  const secret = process.env.JWT_SECRET ?? 'secret'
  const payload = { sub: userId, username: username ?? 'user', role: role ?? 'tech_pm' }
  const token = jwt.sign(payload, secret, { expiresIn: '7d' })
  res.json({ token, user: { id: userId, username, role } })
})

// Get current user profile from token (JWT verification)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user ?? null })
})

export default router
