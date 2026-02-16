export interface Project {
  id: number
  projectNo: string
  name: string
  currentStage: string
  totalScore: number
  status: string
  ownerPmId?: number
  vendorPmId?: number
}
