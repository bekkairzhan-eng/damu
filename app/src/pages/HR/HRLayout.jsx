import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/hr',             label: 'Аттестации',       icon: 'fact_check',      exact: true },
  { path: '/hr/certificates', label: 'Сертификаты',     icon: 'workspace_premium'            },
  { path: '/hr/employees',   label: 'Сотрудники',       icon: 'group'                        },
]

const ACCENT = '#0f766e'

export default function HRLayout() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 244, background: '#0f1923', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>BI DAMU</div>
          <div style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, marginTop: 3, textTransform: 'uppercase' }}>HR Panel</div>
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
                background: isActive ? `${ACCENT}28` : 'transparent',
                borderLeft: `3px solid ${isActive ? ACCENT : 'transparent'}`,
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
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7a8fa0', textDecoration: 'none', fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
            Мой профиль
          </Link>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7a8fa0', textDecoration: 'none', fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>
            Панель администратора
          </Link>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 244, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40 }}>
          <span style={{ color: '#0f1923', fontWeight: 600, fontSize: 15 }}>HR-панель</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#7a8fa0', fontSize: 13 }}>Айгерим Сейткалиева</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>А</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
