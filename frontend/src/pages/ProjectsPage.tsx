import React from 'react'
import { Table, Button } from 'antd'
import { Link } from 'react-router-dom'

type Project = {
  id: number
  projectNo: string
  name: string
  currentStage: string
  totalScore: number
  status: string
}

const data: Project[] = [
  { id: 1, projectNo: 'PRJ-2026-001', name: '智能双录健康度系统', currentStage: '远程开发', totalScore: 85, status: 'in_progress' },
  { id: 2, projectNo: 'PRJ-2026-002', name: '数据治理平台', currentStage: '项目测试', totalScore: 78, status: 'in_progress' },
]

export default function ProjectsPage() {
  const columns = [
    { title: '项目编号', dataIndex: 'projectNo', key: 'projectNo' },
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '当前阶段', dataIndex: 'currentStage', key: 'currentStage' },
    { title: '健康度', dataIndex: 'totalScore', key: 'totalScore' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作', key: 'action', render: (_: any, r: Project) => (
      <Link to={`/projects/${r.id}`}>
        <Button type="primary" size="small">查看/打分</Button>
      </Link>
    )}
  ]
  return (
    <div>
      <h2>项目列表</h2>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
