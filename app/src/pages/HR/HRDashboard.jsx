import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const MOCK_PENDING = [
  { id: 1, name: 'Данияр Сейтжанов',   position: 'Foreman B',      target: 'Foreman A',      cluster: 'K2', dept: 'BI Construction',   submittedAt: '28 Июн 2026' },
  { id: 2, name: 'Арман Жумабеков',     position: 'Foreman C',      target: 'Foreman B',      cluster: 'K1',       dept: 'BI Infrastructure', submittedAt: '25 Июн 2026' },
  { id: 3, name: 'Серик Байжанов',      position: 'Site Engineer B', target: 'Site Engineer A', cluster: 'K2',     dept: 'BI Development',    submittedAt: '20 Июн 2026' },
]

const MOCK_COMPLETED = [
  { id: 4, name: 'Каиржан Бектембаев', position: 'Foreman B', target: 'Foreman A', cluster: 'K2', dept: 'BI Development', completedAt: '19 Мар 2025', passed: 5, total: 8 },
  { id: 5, name: 'Нурлан Ахметов',     position: 'Foreman A', target: 'Site Manager', cluster: 'K1',    dept: 'BI Construction', completedAt: '10 Янв 2025', passed: 7, total: 8 },
]

const CLUSTER_COLORS = {
  'K1':               { bg: '#eff6ff', color: '#2563eb' },
  'K2':               { bg: '#f0fdf4', color: '#16a34a' },
  'K2-International': { bg: '#fdf4ff', color: '#9333ea' },
}

export default function HRDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('pending')
  const [pending] = useLocalStorage('hr:pending', MOCK_PENDING)
  const [completed] = useLocalStorage('hr:completed', MOCK_COMPLETED)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Аттестации</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Запросы от сотрудников на оценку компетенций</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Ожидают оценки', value: pending.length, icon: 'pending_actions', color: '#f59e0b' },
          { label: 'Завершено в этом месяце', value: 2, icon: 'verified', color: '#10b981' },
          { label: 'Всего за год', value: completed.length + pending.length, icon: 'fact_check', color: '#4361ee' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '18px 24px', border: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0f1923' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#7a8fa0' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#fff', border: '1px solid #e8edf2', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[['pending', `Ожидают (${pending.length})`], ['completed', 'Завершённые']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: '8px 20px', borderRadius: 7, border: 'none', background: tab === key ? '#0f766e' : 'transparent', color: tab === key ? '#fff' : '#7a8fa0', fontSize: 14, fontWeight: tab === key ? 600 : 400, cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {tab === 'pending'
                ? ['Сотрудник', 'Текущая → Целевая', 'Кластер', 'Подано', 'Действие'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
                ))
                : ['Сотрудник', 'Текущая → Целевая', 'Кластер', 'Завершено', 'Результат'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {(tab === 'pending' ? pending : completed).map((item, i) => {
              const cc = CLUSTER_COLORS[item.cluster] || CLUSTER_COLORS['K1']
              const list = tab === 'pending' ? pending : completed
              return (
                <tr key={item.id} style={{ borderBottom: i < list.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#7a8fa0' }}>{item.dept}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span style={{ color: '#7a8fa0' }}>{item.position}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#4361ee' }}>arrow_forward</span>
                      <span style={{ fontWeight: 600, color: '#0f1923' }}>{item.target}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: cc.bg, color: cc.color, fontSize: 12, fontWeight: 600 }}>{item.cluster}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#7a8fa0' }}>
                    {tab === 'pending' ? item.submittedAt : item.completedAt}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {tab === 'pending' ? (
                      <button onClick={() => navigate('/hr/assessment', { state: item })} style={{ padding: '7px 16px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Начать оценку
                      </button>
                    ) : (
                      <span style={{ padding: '4px 12px', borderRadius: 6, background: item.passed === item.total ? '#f0fdf4' : '#fff7ed', color: item.passed === item.total ? '#16a34a' : '#ea580c', fontSize: 13, fontWeight: 600 }}>
                        {item.passed}/{item.total} навыков
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
