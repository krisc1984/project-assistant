export type UserRole = 'admin' | 'tech_pm' | 'vendor_pm' | 'viewer'

export interface User {
  id: number
  username: string
  name: string
  email?: string
  role: UserRole
}

export interface Project {
  id: number
  projectNo: string
  name: string
  currentStage: string
  totalScore: number
  status: string
}

export interface Stage {
  id: number
  name: string
  max: number
  score: number
}
export interface Checkpoint {
  id: number
  name: string
  score: number
  max: number
}
