import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', label: 'Мой дашборд'     },
  { to: '/plans',     label: 'Мои планы'        },
  { to: '/career-map',label: 'Карьерная карта'  },
  { to: '/titles',    label: 'Должности'        },
  { to: '/skills',    label: 'Навыки'           },
]

export default function TopNav() {
  return (
    <header style={{
      background: '#0f1923', height: 56, display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 0, position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 32 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>BD</span>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', lineHeight: 1.1 }}>BI DAMU</div>
          <div style={{ color: '#5a7a8a', fontSize: 9.5, lineHeight: 1.1, letterSpacing: '0.02em' }}>Digital Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', height: '100%', flex: 1 }}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', padding: '0 18px', height: '100%',
            color: isActive ? '#fff' : '#7a9aad',
            borderBottom: isActive ? '2.5px solid #4ade80' : '2.5px solid transparent',
            fontSize: 13.5, fontWeight: isActive ? 600 : 400,
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          })}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a9aad', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a9aad', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
        }}>КБ</div>
      </div>
    </header>
  )
}
