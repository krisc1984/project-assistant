import React from 'react'
import { Progress, Card, Row, Col } from 'antd'

type Stage = { name: string; score: number; max: number }
export default function StageProgress({ stages }: { stages: Stage[] }) {
  const totalMax = stages.reduce((a, s) => a + s.max, 0)
  const totalScore = stages.reduce((a, s) => a + s.score, 0)
  return (
    <Card title="阶段进度" bordered={false}>
      <Row gutter={16}>
        {stages.map((s, idx) => (
          <Col key={idx} span={24 / stages.length}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.name}</div>
              <Progress percent={Math.round((s.score / s.max) * 100)} strokeWidth={10} />
            </div>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: 'right', marginTop: 8, fontWeight: 600 }}>
        总分 {totalScore} / {totalMax}
      </div>
    </Card>
  )
}
