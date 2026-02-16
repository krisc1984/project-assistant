import axios from 'axios'
import { Score } from './types'

export const getScores = (projectId: number) => axios.get(`/api/projects/${projectId}/scores`)
export const createScore = (projectId: number, payload: Partial<Score>) =>
  axios.post(`/api/projects/${projectId}/scores`, payload)
export const updateScore = (projectId: number, scoreId: number, payload: Partial<Score>) =>
  axios.put(`/api/projects/${projectId}/scores/${scoreId}`, payload)
