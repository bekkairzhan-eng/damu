import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import TopNav from './TopNav'

const NAV_ITEMS = [
  { path: '/dashboard/my-dashboard', label: 'Моя страница',  icon: 'dashboard'     },
  { path: '/dashboard/my-skills',    label: 'Мои навыки',   icon: 'school'        },
  { path: '/dashboard/experience',   label: 'Профиль опыта', icon: 'person'       },
]

const SOON_ITEMS = [
  { label: 'Аттестация',    icon: 'fact_check'   },
  { label: 'Мой наставник', icon: 'support_agent' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const W = collapsed ? 64 : 244

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNav />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* Кнопка свернуть/развернуть — на границе сайдбара */}
        <div style={{
          position: 'fixed',
          left: W,
          top: 74,
          transform: 'translateX(-50%)',
          transition: 'left 0.25s ease',
          zIndex: 50,
        }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Развернуть' : 'Свернуть'}
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#002068', color: '#fff', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,32,104,0.35)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14, transition: 'transform 0.25s', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              chevron_right
            </span>
          </button>
        </div>

        {/* Сайдбар */}
        <aside style={{
          width: W, flexShrink: 0, background: '#fff',
          borderRight: '1px solid #e8edf2',
          position: 'sticky', top: 56, height: 'calc(100vh - 56px)',
          overflowY: 'auto', overflowX: 'hidden',
          transition: 'width 0.25s ease',
          display: 'flex', flexDirection: 'column',
          padding: '12px 8px',
        }}>
          <style>{`
            .sb-link:hover { background: #f0f2f8 !important; }
            .sb-link-active:hover { background: #eef0ff !important; }
          `}</style>

          <div style={{ padding: '0 8px 8px', marginBottom: 2, minHeight: 24 }}>
            {!collapsed && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Личный кабинет
              </span>
            )}
          </div>

          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '9px 12px',
                borderRadius: 12, marginBottom: 2,
                color: isActive ? '#4361ee' : '#002068',
                background: isActive ? '#eef0ff' : 'transparent',
                fontSize: 14, fontWeight: isActive ? 600 : 400,
                textDecoration: 'none', transition: 'all 0.15s',
                whiteSpace: 'nowrap', overflow: 'hidden',
              })}
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{
                    fontSize: 22, flexShrink: 0,
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    color: isActive ? '#4361ee' : '#002068',
                  }}>{item.icon}</span>
                  {!collapsed && item.label}
                </>
              )}
            </NavLink>
          ))}

          <div style={{ height: 1, background: '#e8edf2', margin: '10px 4px' }} />

          {!collapsed && (
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px 8px' }}>
              Скоро
            </div>
          )}

          {SOON_ITEMS.map(item => (
            <div key={item.label}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '9px 12px',
                borderRadius: 12, marginBottom: 2,
                color: '#c0cad4', fontSize: 14, cursor: 'not-allowed',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, flexShrink: 0, color: '#c0cad4' }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 10, background: '#f0f2f8', color: '#9aafbd', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>скоро</span>
                </>
              )}
            </div>
          ))}
        </aside>

        {/* Основной контент */}
        <div style={{ flex: 1, minWidth: 0, background: '#f5f6fa' }}>
          <Outlet />
        </div>

      </div>
    </div>
  )
}
