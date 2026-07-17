import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Данияр Сейтжанов',   position: 'Foreman B',       dept: 'BI Construction',   cluster: 'K2-Север' },
  { id: 2, name: 'Арман Жумабеков',    position: 'Foreman C',       dept: 'BI Infrastructure', cluster: 'K1' },
  { id: 3, name: 'Серик Байжанов',     position: 'Site Engineer B', dept: 'BI Development',    cluster: 'K2-Юг' },
  { id: 4, name: 'Каиржан Бектембаев', position: 'Foreman B',       dept: 'BI Development',    cluster: 'K2-Север' },
  { id: 5, name: 'Нурлан Ахметов',     position: 'Foreman A',       dept: 'BI Construction',   cluster: 'K1' },
  { id: 6, name: 'Айдос Молдабеков',   position: 'Foreman C',       dept: 'BI Infrastructure', cluster: 'K1' },
  { id: 7, name: 'Гульнара Есенова',   position: 'Site Engineer A', dept: 'BI Development',    cluster: 'K2-International' },
  { id: 8, name: 'Тимур Каримов',      position: 'Foreman B',       dept: 'BI Construction',   cluster: 'K2-Юг' },
]

const CLUSTER_COLORS = {
  'K1':               { bg: '#eff6ff', color: '#2563eb' },
  'K2-Север':         { bg: '#f0fdf4', color: '#16a34a' },
  'K2-Юг':            { bg: '#fff7ed', color: '#ea580c' },
  'K2-International': { bg: '#fdf4ff', color: '#9333ea' },
}

const ACCENT = '#0f766e'
const CLUSTERS = ['Все', 'K1', 'K2-Север', 'K2-Юг', 'K2-International']

export default function Employees() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [cluster, setCluster] = useState('Все')

  const filtered = MOCK_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) &&
    (cluster === 'Все' || e.cluster === cluster)
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Сотрудники</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Справочник сотрудников в скоупе HR</p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени..."
          style={{ flex: '1 1 240px', padding: '9px 14px', borderRadius: 8, border: '1px solid #e8edf2', fontSize: 13, outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid #e8edf2', borderRadius: 10, padding: 4 }}>
          {CLUSTERS.map(c => (
            <button key={c} onClick={() => setCluster(c)} style={{
              padding: '7px 14px', borderRadius: 7, border: 'none',
              background: cluster === c ? ACCENT : 'transparent',
              color: cluster === c ? '#fff' : '#7a8fa0',
              fontSize: 13, fontWeight: cluster === c ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Сотрудник', 'Должность', 'Подразделение', 'Кластер', 'Действие'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: '#7a8fa0', fontSize: 13 }}>Никого не найдено</td>
              </tr>
            )}
            {filtered.map((e, i) => {
              const cc = CLUSTER_COLORS[e.cluster] || CLUSTER_COLORS['K1']
              return (
                <tr key={e.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: ACCENT + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: ACCENT }}>person</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923' }}>{e.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#0f1923' }}>{e.position}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#7a8fa0' }}>{e.dept}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: cc.bg, color: cc.color, fontSize: 12, fontWeight: 600 }}>{e.cluster}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button
                      onClick={() => navigate('/hr/certificates', { state: { employee: e } })}
                      style={{ padding: '6px 14px', background: '#fff', color: ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      + Сертификат
                    </button>
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
