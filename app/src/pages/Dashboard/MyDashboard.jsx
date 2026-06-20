const plans = [
  {
    id: 1, title: 'Стать Foreman C',
    from: 'Foreman B', to: 'Foreman C', dept: 'BI Development',
    progress: 15, total: 21, deadline: '06 Фев 2027', icon: null,
  },
  {
    id: 2, title: 'План развития на основе оценки',
    from: 'Foreman B', dept: 'BI Development',
    noData: true, icon: 'settings',
  },
  {
    id: 3, title: 'Предыдущий карьерный план',
    from: 'Foreman A', dept: 'BI Development',
    progress: 18, total: 19, deadline: '30 Авг 2024', expired: true, icon: 'description',
  },
]

const INITIAL_PENDING = [
  { id: 1, label: 'BIM-технологии (Revit)', level: 2, source: 'Курс завершён в BILIM' },
  { id: 2, label: 'Lean Construction', level: 1, source: 'Активность на площадке' },
  { id: 3, label: 'Управление субподрядчиками', level: 3, source: 'Данные аттестации' },
  { id: 4, label: 'Контроль качества строительства', level: 2, source: 'Данные аттестации' },
  { id: 5, label: 'Last Planner System', level: 1, source: 'Курс завершён в BI University' },
  { id: 6, label: 'Полевая отчётность и документация', level: 2, source: 'Активность в системе' },
  { id: 7, label: 'Проведение инструктажей по ОТиТБ', level: 3, source: 'Данные аттестации' },
  { id: 8, label: 'Управление материалами и поставками', level: 2, source: 'Активность на площадке' },
]

const notifications = [
  { text: 'В ваш план по должности добавлен новый курс', time: '1 день назад', type: 'plan' },
  { text: 'Навык "Lean Construction" подтверждён', time: '3 дня назад', type: 'skill' },
]

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyDashboard() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(INITIAL_PENDING)
  const [confirmed, setConfirmed] = useState([])

  function confirm(skill) {
    setConfirmed(prev => [...prev, skill])
    setPending(prev => prev.filter(s => s.id !== skill.id))
  }

  function reject(id) {
    setPending(prev => prev.filter(s => s.id !== id))
  }
  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>
          Добро пожаловать, <span style={{ color: '#1a2b3c' }}>Каиржан!</span>
        </h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>Становитесь профессионалом, которым всегда хотели быть <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 24 }}>
        {/* Профиль */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img src="/avatar1.jpeg" alt="Каиржан Бектембаев"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #c7d2fe' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923' }}>Каиржан Бектембаев</div>
                <div style={{ fontSize: 12, color: '#7a8fa0' }}>Foreman B</div>
                <div style={{ fontSize: 12, color: '#7a8fa0' }}>BI Development</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#9aafbd', marginBottom: 4 }}>В BI Group с 17 Июл 2021</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Chip label="Мои навыки" onClick={() => navigate('/dashboard/my-skills')} />
              <Chip label="Ключевые компетенции" onClick={() => navigate('/skills')} />
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8fa0', marginBottom: 12 }}>Рейтинг профиля</div>
            <ScoreGauge score={4.1} />
            <a href="/dashboard/experience" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#4361ee', marginTop: 8 }}>Подробнее →</a>
          </div>
        </div>

        {/* Центр */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Направления в фокусе</div>
              <button onClick={() => navigate('/plans')} style={{ fontSize: 12, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Все планы →</button>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {plans.map(plan => <PlanCard key={plan.id} plan={plan} onClick={() => navigate('/plans', { state: { planId: plan.id } })} />)}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Навыки, ожидающие подтверждения</div>
              {pending.length > 0 && (
                <span style={{ fontSize: 11, background: '#4361ee', color: '#fff', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{pending.length}</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 14 }}>
              Система определила навыки на основе вашей активности. Подтвердите те, которыми владеете — они войдут в профиль как самозаявленные и будут проверены на аттестации.
            </div>

            {confirmed.length > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#15803d', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                Подтверждено: {confirmed.map(s => s.label).join(', ')} — добавлено в профиль навыков
              </div>
            )}

            {pending.length === 0 && confirmed.length > 0 && (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#9aafbd', fontSize: 13 }}>Все навыки обработаны</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: '1px solid #f0f2f8' }}>
                  <LevelDots level={s.level} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#1a2b3c' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 1 }}>{s.source}</div>
                  </div>
                  <button onClick={() => confirm(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #4361ee', background: 'transparent', color: '#4361ee', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>Подтвердить</button>
                  <button onClick={() => reject(s.id)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e0e0e0', background: 'transparent', color: '#7a8fa0', fontSize: 12, cursor: 'pointer' }}>Отклонить</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Уведомления</div>
              <a href="#" style={{ fontSize: 12, color: '#4361ee' }}>Все →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: '#f8f9fc', borderLeft: '3px solid #4361ee' }}>
                  <div style={{ fontSize: 12, color: '#0f1923', marginBottom: 4, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: '#9aafbd' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, onClick }) {
  const pct = plan.noData ? 0 : Math.round((plan.progress / plan.total) * 100)
  return (
    <div onClick={onClick} style={{ flex: 1, border: '1px solid #e8edf2', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(67,97,238,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ fontSize: 11, color: '#9aafbd' }}>{plan.dept}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: 6 }}>
        {plan.icon === null
          ? <img src="/target.png" alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
          : <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#7a8fa0' }}>{plan.icon}</span>}
        {plan.title}
      </div>
      {plan.noData ? (
        <div style={{ fontSize: 11, color: '#9aafbd', lineHeight: 1.4 }}>Навыки не указаны. Получите персональные рекомендации на основе оценки!</div>
      ) : (
        <>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#7a8fa0' }}>Прогресс плана</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#0f1923' }}>{plan.progress}/{plan.total}</span>
            </div>
            <div style={{ height: 5, background: '#f0f2f8', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: '#4361ee', borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: plan.expired ? '#ef4444' : '#7a8fa0', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> Срок: {plan.deadline}
          </div>
        </>
      )}
    </div>
  )
}

function Chip({ label, onClick }) {
  return <span onClick={onClick} style={{ padding: '4px 10px', borderRadius: 20, background: '#f0f2f8', fontSize: 11, color: '#4a6275', cursor: onClick ? 'pointer' : 'default' }}>{label}</span>
}

function LevelDots({ level }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= level ? '#4361ee' : '#e0e6ef' }} />)}
    </div>
  )
}

function ScoreGauge({ score }) {
  const r = 40, circ = 2 * Math.PI * r, offset = circ - ((score / 5) * 100 / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f0f2f8" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#4361ee" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
        <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f1923">{score}</text>
      </svg>
      <div style={{ fontSize: 11, color: '#7a8fa0' }}>из 5.0</div>
    </div>
  )
}
