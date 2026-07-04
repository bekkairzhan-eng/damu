import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/admin',              label: 'Обзор',           icon: 'grid_view',    exact: true },
  { path: '/admin/skills',       label: 'Каталог навыков', icon: 'psychology'                },
  { path: '/admin/positions',    label: 'Должности',       icon: 'work'                      },
  { path: '/admin/career-graph', label: 'Карьерный граф',  icon: 'account_tree'              },
  { path: '/admin/requirements', label: 'Требования',      icon: 'checklist'                 },
  { path: '/admin/rating',       label: 'Веса рейтинга',   icon: 'bar_chart'                 },
  { path: '/admin/users',        label: 'Пользователи',    icon: 'manage_accounts'           },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 244, background: '#0f1923', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>BI DAMU</div>
          <div style={{ color: '#4361ee', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, marginTop: 3, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <NavLink key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 24px', textDecoration: 'none',
                color: isActive ? '#fff' : '#7a8fa0',
                background: isActive ? 'rgba(67,97,238,0.18)' : 'transparent',
                borderLeft: `3px solid ${isActive ? '#4361ee' : 'transparent'}`,
                fontSize: 14, fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/hr" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7a8fa0', textDecoration: 'none', fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>badge</span>
            HR-панель
          </Link>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7a8fa0', textDecoration: 'none', fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
            Мой профиль
          </Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 244, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40 }}>
          <span style={{ color: '#0f1923', fontWeight: 600, fontSize: 15 }}>Панель администратора</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#7a8fa0', fontSize: 13 }}>Администратор</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>А</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
