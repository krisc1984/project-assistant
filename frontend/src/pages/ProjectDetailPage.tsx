import React from 'react'
import { Card, Typography } from 'antd'
import StageProgress from '../components/StageProgress'
import ScoreCard from '../components/ScoreCard'

type Checkpoint = { id: number; name: string; score: number; max: number }
const checkpoints: Checkpoint[] = [
  { id: 1, name: '意向反馈', score: 9, max: 10 },
  { id: 2, name: '排期反馈', score: 6, max: 15 },
  { id: 3, name: '需求反讲', score: 5, max: 5 },
  { id: 4, name: '需求质量', score: 9, max: 10 }
]

export default function ProjectDetailPage() {
  return (
    <div>
      <Typography.Title level={3}>项目详情 - PRJ-2026-001</Typography.Title>
      <StageProgress stages={[
        { name: '需求分析', score: 10, max: 10 },
        { name: '远程开发', score: 15, max: 15 },
        { name: '交付实施', score: 15, max: 15 },
        { name: '项目测试', score: 28, max: 30 },
        { name: '上线验收', score: 28, max: 30 }
      ]} />
      <Card title="阶段打分明细" style={{ marginTop: 16 }}>
        {checkpoints.map((cp) => (
          <ScoreCard key={cp.id} title={cp.name} score={cp.score} max={cp.max} description="自动/手动打分示例" />
        ))}
      </Card>
    </div>
  )
}
