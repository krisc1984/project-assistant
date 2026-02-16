import React from 'react'
import { Card, Progress, Typography } from 'antd'

type Props = {
  title: string
  score: number
  max: number
  description?: string
}
export default function ScoreCard({ title, score, max, description }: Props) {
  const percent = Math.round((score / max) * 100)
  return (
    <Card style={{ margin: '8px 0' }} title={title} bordered={false}>
      <Typography.Text type="secondary">{description}</Typography.Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <Progress percent={percent} status={percent >= 60 ? 'normal' : 'exception'} strokeWidth={12} showInfo={false} />
        <span style={{ fontWeight: 600 }}>{score} / {max}</span>
      </div>
    </Card>
  )
}
