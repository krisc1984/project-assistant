import React from 'react'
import { Layout, Menu, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { UserOutlined, DashboardOutlined, ProjectOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons'

const { Sider } = Layout

export default function Navigation() {
  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ height: '100vh', background: 'var(--bg)' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>项目管理助理</span>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]} style={{ background: 'var(--bg)' }}>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">仪表盘</Link>
        </Menu.Item>
        <Menu.Item key="projects" icon={<ProjectOutlined />}>
          <Link to="/projects">项目</Link>
        </Menu.Item>
        <Menu.Item key="users" icon={<TeamOutlined />}>
          <Link to="/users">用户管理</Link>
        </Menu.Item>
        <Menu.Item key="reports" icon={<BarChartOutlined />}>
          <Link to="/dashboard">报表</Link>
        </Menu.Item>
      </Menu>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar size="small" icon={<UserOutlined />} />
        <span style={{ color: 'var(--text)' }}>Admin</span>
      </div>
    </Sider>
  )
}
