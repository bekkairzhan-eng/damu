import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', label: 'Мой дашборд'    },
  { to: '/plans',     label: 'Мои планы'       },
  { to: '/career-map',label: 'Карьерная карта' },
  { to: '/titles',    label: 'Должности'       },
  { to: '/skills',    label: 'Навыки'          },
]

const NOTIFICATIONS = [
  {
    type: 'task',
    system: 'BI DAMU',
    systemColor: '#4361ee',
    systemBg: '#e0e7ff',
    title: 'Оценка навыков: Foreman B',
    desc: 'Ждёт вашего подтверждения',
    time: '26 мая, 09:14',
    read: false,
  },
  {
    type: 'task',
    system: 'BI DAMU',
    systemColor: '#4361ee',
    systemBg: '#e0e7ff',
    title: 'Карьерный план обновлён',
    desc: 'Появились новые требования к навыкам',
    time: '27 мая, 10:02',
    read: false,
  },
  {
    type: 'mention',
    title: 'Сейткали Ерлан упомянул вас',
    desc: '«Каиржан, проверьте план по объекту А3»',
    time: '25 мая, 09:00',
    read: true,
  },
  {
    type: 'news',
    title: 'Құрбан айт мерекесі құтты болсын!',
    desc: 'Новость от BI Group',
    time: '27 мая',
    read: false,
  },
  {
    type: 'news',
    title: 'Новый учебный курс: Lean Construction',
    desc: 'Доступен в разделе Навыки',
    time: '25 мая',
    read: true,
  },
]

const TYPE_META = {
  task:    { icon: 'pending_actions', color: '#4361ee', label: 'Задача'      },
  mention: { icon: 'alternate_email',  color: '#0f766e', label: 'Упоминание' },
  news:    { icon: 'newspaper',        color: '#7c3aed', label: 'Новости'    },
}

const LANGUAGES = [
  { code: 'RU', name: 'Русский'      },
  { code: 'KZ', name: 'Қазақша'      },
  { code: 'EN', name: 'English'       },
  { code: 'UZ', name: "O'zbekcha"     },
  { code: 'UA', name: 'Українська'    },
  { code: 'AZ', name: 'Azərbaycanca' },
]

export default function TopNav() {
  const [notifOpen, setNotifOpen] = useState(false)
  const [newsNotif, setNewsNotif] = useState(true)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [lang, setLang] = useState('RU')
  const [langOpen, setLangOpen] = useState(false)
  const panelRef = useRef(null)
  const langRef  = useRef(null)

  const visible = notifications.filter(n => n.type !== 'news' || newsNotif)
  const unread  = visible.filter(n => !n.read).length

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  useEffect(() => {
    function h(e) { if (panelRef.current && !panelRef.current.contains(e.target)) setNotifOpen(false) }
    if (notifOpen) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [notifOpen])

  useEffect(() => {
    function h(e) { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false) }
    if (langOpen) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [langOpen])

  return (
    <header style={{
      background: '#0f1923', height: 56, display: 'flex', alignItems: 'center',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      {/* Лого */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 28, flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>BD</span>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', lineHeight: 1.1 }}>BI DAMU</div>
          <div style={{ color: '#5a7a8a', fontSize: 9.5, lineHeight: 1.1 }}>Digital Platform</div>
        </div>
      </div>

      {/* Навигация */}
      <nav style={{ display: 'flex', height: '100%', flex: 1 }}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', padding: '0 16px', height: '100%',
            color: isActive ? '#fff' : '#7a9aad',
            borderBottom: isActive ? '2.5px solid #4ade80' : '2.5px solid transparent',
            fontSize: 13.5, fontWeight: isActive ? 600 : 400,
            transition: 'all 0.15s', whiteSpace: 'nowrap', textDecoration: 'none',
          })}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Правая часть */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} ref={panelRef}>

        {/* Язык */}
        <div style={{ position: 'relative' }} ref={langRef}>
          <button
            onClick={() => setLangOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 2, padding: '5px 10px',
              borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: '#a0b4c4', letterSpacing: '0.05em',
            }}
          >
            {lang}
            <span className="material-symbols-outlined" style={{ fontSize: 16, transition: '0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </button>

          {langOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              border: '1px solid #e8edf2', width: 180, zIndex: 200, overflow: 'hidden',
            }}>
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 14px', background: lang === l.code ? '#eeedf6' : '#fff',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#1a1b22', fontWeight: lang === l.code ? 600 : 400 }}>{l.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: lang === l.code ? '#4361ee' : '#c4c5d5', letterSpacing: '0.05em' }}>{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Колокольчик */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            style={{ padding: 8, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: '#7a9aad', display: 'flex', position: 'relative' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 16, height: 16, borderRadius: '50%',
                background: '#dc2626', color: '#fff', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0f1923',
              }}>{unread}</span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              background: '#fff', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
              border: '1px solid #e8edf2', width: 380, zIndex: 200, overflow: 'hidden',
            }}>
              {/* Шапка */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f2f8' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1b22' }}>Уведомления</span>
                {unread > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#4361ee', fontWeight: 600 }}>
                    Отметить все прочитанными
                  </button>
                )}
              </div>

              {/* Список */}
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {visible.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 8, color: '#9aafbd' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36 }}>notifications_off</span>
                    <span style={{ fontSize: 13 }}>Нет уведомлений</span>
                  </div>
                ) : (
                  visible.map((n, i) => {
                    const meta = TYPE_META[n.type]
                    return (
                      <div key={i} style={{
                        display: 'flex', gap: 12, padding: '12px 16px',
                        borderBottom: '1px solid #f8f9fc', cursor: 'pointer',
                        background: n.read ? '#fff' : '#f0f4ff',
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: n.systemBg ?? `${meta.color}18`,
                        }}>
                          {n.system ? (
                            <span style={{ fontSize: 9, fontWeight: 700, color: n.systemColor }}>{n.system.split(' ')[0]}</span>
                          ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: meta.color }}>{meta.icon}</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: `${meta.color}18`, color: meta.color }}>{meta.label}</span>
                            {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4361ee', flexShrink: 0 }} />}
                          </div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1b22', marginBottom: 2, lineHeight: 1.35 }}>{n.title}</p>
                          <p style={{ fontSize: 11, color: '#7a8fa0', lineHeight: 1.4 }}>{n.desc}</p>
                          <p style={{ fontSize: 10, color: '#c4c5d5', marginTop: 4 }}>{n.time}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Подвал */}
              <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f2f8', background: '#fafafa', display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={newsNotif} onChange={e => setNewsNotif(e.target.checked)}
                    style={{ accentColor: '#4361ee', width: 14, height: 14 }} />
                  <span style={{ fontSize: 11, color: '#444653' }}>Получать уведомления о новостях и предложениях</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Apps */}
        <button style={{ padding: 8, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: '#7a9aad', display: 'flex' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>apps</span>
        </button>

        {/* Аватар */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%', marginLeft: 6,
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          border: '2px solid #2a4a5a',
        }}>КБ</div>
      </div>
    </header>
  )
}
