import { Link } from 'react-router-dom'
import { useRoles } from '../hooks/useRole'

export default function RoleGuard({ role, children }) {
  const roles = useRoles()
  if (!roles.includes(role)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 12, background: '#f5f6fa' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#e8edf2' }}>lock</span>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f1923' }}>Нет доступа</div>
        <div style={{ fontSize: 14, color: '#7a8fa0' }}>У вас нет прав для просмотра этого раздела</div>
        <Link to="/dashboard" style={{ marginTop: 8, padding: '10px 24px', background: '#4361ee', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          Вернуться на главную
        </Link>
      </div>
    )
  }
  return children
}
