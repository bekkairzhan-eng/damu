import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNav />
      <div style={{ flex: 1, background: '#f5f6fa' }}>
        <Outlet />
      </div>
    </div>
  )
}
