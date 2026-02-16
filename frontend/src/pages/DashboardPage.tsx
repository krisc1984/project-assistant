import React from 'react'
import { Card, Row, Col } from 'antd'

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <Row gutter={[16, 16]}>
        {[
          { key: 'total', title: '项目总数', value: 12 },
          { key: 'avg', title: '平均健康度', value: 82 },
          { key: 'at_risk', title: '高风险项目', value: 3 },
          { key: 'updated', title: '最近更新时间', value: '2026-02-16' },
        ].map((item) => (
          <Col xs={24} sm={12} md={12} lg={6} key={item.key}>
            <Card title={item.title} bordered={false} className="stat-card">
              <div className="stat-value">{item.value}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
