const plans = [
  {
    id: 1, title: 'Стать Начальником участка',
    from: 'Прораб C', to: 'Начальник участка', dept: 'BI Construction',
    progress: 15, total: 21, deadline: '06 Фев 2027', icon: '🎯',
  },
  {
    id: 2, title: 'План развития на основе оценки',
    from: 'Прораб C', dept: 'BI Construction',
    noData: true, icon: '⚙️',
  },
  {
    id: 3, title: 'Предыдущий карьерный план',
    from: 'Прораб B', dept: 'BI Construction',
    progress: 18, total: 19, deadline: '30 Авг 2024', expired: true, icon: '📋',
  },
]

const pendingSkills = [
  { label: 'BIM-технологии', level: 2 },
  { label: 'Lean Construction', level: 1 },
  { label: 'Управление субподрядчиками', level: 3 },
  { label: 'Контроль качества строительства', level: 2 },
]

const notifications = [
  { text: 'Готовы ли вы к повышению до Начальника участка?', time: '2 дня назад', type: 'promo' },
  { text: 'Аттестация: Прораб C. Результаты обработаны.', time: '4 дня назад', type: 'assess' },
]

export default function MyDashboard() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>
          Добро пожаловать, <span style={{ color: '#1a2b3c' }}>Каиржан!</span>
        </h1>
        <p style={{ color: '#7a8fa0', fontSize: 14 }}>Становитесь профессионалом, которым всегда хотели быть 🚀</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 24 }}>
        {/* Профиль */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: '#4361ee',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0,
              }}>КБ</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923' }}>Каиржан Бектембаев</div>
                <div style={{ fontSize: 12, color: '#7a8fa0' }}>Прораб C</div>
                <div style={{ fontSize: 12, color: '#7a8fa0' }}>BI Construction</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#9aafbd', marginBottom: 4 }}>В BI Group с 17 Июл 2021</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Chip label="Мои навыки" />
              <Chip label="Ключевые компетенции" />
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8fa0', marginBottom: 12 }}>Рейтинг профиля</div>
            <ScoreGauge score={4.1} />
            <a href="#" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#4361ee', marginTop: 8 }}>Подробнее →</a>
          </div>
        </div>

        {/* Центр */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Направления в фокусе</div>
              <a href="/plans" style={{ fontSize: 12, color: '#4361ee' }}>Все планы →</a>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 4 }}>Навыки, ожидающие подтверждения</div>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 14 }}>Подтвердите или отклоните навыки, которые система определила на основе вашей активности</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingSkills.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid #f0f2f8' }}>
                  <LevelDots level={s.level} />
                  <span style={{ flex: 1, fontSize: 13 }}>{s.label}</span>
                  <button style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #4361ee', background: 'transparent', color: '#4361ee', fontSize: 12, cursor: 'pointer' }}>Подтвердить</button>
                  <button style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e0e0e0', background: 'transparent', color: '#7a8fa0', fontSize: 12, cursor: 'pointer' }}>Отклонить</button>
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

function PlanCard({ plan }) {
  const pct = plan.noData ? 0 : Math.round((plan.progress / plan.total) * 100)
  return (
    <div style={{ flex: 1, border: '1px solid #e8edf2', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, color: '#9aafbd' }}>{plan.dept}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', lineHeight: 1.3 }}>{plan.icon} {plan.title}</div>
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
          <div style={{ fontSize: 11, color: plan.expired ? '#ef4444' : '#7a8fa0' }}>⏱ Срок: {plan.deadline}</div>
        </>
      )}
    </div>
  )
}

function Chip({ label }) {
  return <span style={{ padding: '4px 10px', borderRadius: 20, background: '#f0f2f8', fontSize: 11, color: '#4a6275', cursor: 'pointer' }}>{label}</span>
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
