import React from 'react'
import { Card, Form, Input, Button, Checkbox } from 'antd'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const onFinish = (values: any) => {
    console.log('login', values)
  }
  return (
    <div className="login-page">
      <Card className="login-card" title="登录" bordered={false}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" initialValue={true}>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
          <Form.Item>
            <Link to="/dashboard">直接进入仪表盘</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
