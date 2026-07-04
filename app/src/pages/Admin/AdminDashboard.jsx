const STATS = [
  { label: 'Активных сотрудников', value: '3 847', icon: 'group', color: '#4361ee' },
  { label: 'Навыков в каталоге',   value: '18',    icon: 'psychology', color: '#10b981' },
  { label: 'Ожидают апрува',       value: '12',    icon: 'pending_actions', color: '#f59e0b' },
  { label: 'Активных планов',      value: '3 421', icon: 'flag', color: '#8b5cf6' },
]

const ACTIVITY = [
  { text: 'Добавлен навык: Управление ESG-рисками',                   time: '2 ч назад',  icon: 'add_circle',   color: '#10b981' },
  { text: 'Обновлены требования: Foreman A / K2-Север',               time: '5 ч назад',  icon: 'edit',         color: '#4361ee' },
  { text: 'Изменены веса рейтинга: Активность обучения 25% → 30%',   time: 'вчера',      icon: 'bar_chart',    color: '#8b5cf6' },
  { text: 'Добавлена должность: Principal Engineer',                  time: '3 дня назад', icon: 'work',        color: '#f59e0b' },
  { text: 'Карьерный граф K2-International обновлён',                 time: '1 нед назад', icon: 'account_tree', color: '#4361ee' },
]

const CLUSTERS = [
  { label: 'K1 — Инфраструктура и Констракшн', employees: 1240, tracks: 4 },
  { label: 'K2-Север',                          employees: 890,  tracks: 4 },
  { label: 'K2-Юг',                             employees: 1103, tracks: 4 },
  { label: 'K2-International',                  employees: 614,  tracks: 5 },
]

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Обзор</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Состояние платформы BI Damu</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8edf2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#7a8fa0', fontSize: 13 }}>{s.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0f1923' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Clusters */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e8edf2' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#0f1923', marginBottom: 16 }}>Кластеры</div>
          {CLUSTERS.map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f2f5' }}>
              <span style={{ fontSize: 14, color: '#0f1923' }}>{c.label}</span>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#7a8fa0' }}>
                <span><b style={{ color: '#0f1923' }}>{c.employees.toLocaleString('ru')}</b> чел.</span>
                <span><b style={{ color: '#0f1923' }}>{c.tracks}</b> трека</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e8edf2' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#0f1923', marginBottom: 16 }}>Последние действия</div>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < ACTIVITY.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: a.color }}>{a.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#0f1923', lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
