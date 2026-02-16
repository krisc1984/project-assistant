import React from 'react'
import { Table } from 'antd'

type User = { id: number; username: string; role: string; name: string; email?: string }
const data: User[] = [
  { id: 1, username: 'pm_line', name: '赵岩', role: '科技项目经理' },
  { id: 2, username: 'vendor_mgr', name: '李娜', role: '公司项目经理' },
]

export default function UsersPage() {
  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role' }
  ]
  return (
    <div>
      <h2>用户管理</h2>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
