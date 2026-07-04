import { useState } from 'react'

const POSITIONS = [
  { id: 'foreman-d', name: 'Foreman D', grade: 13, track: 'Полевой состав',       description: 'Начальный уровень. Работа под руководством Foreman C.' },
  { id: 'foreman-c', name: 'Foreman C', grade: 14, track: 'Полевой состав',       description: 'Самостоятельное ведение участка. Контроль бригады.' },
  { id: 'foreman-b', name: 'Foreman B', grade: 15, track: 'Полевой состав',       description: 'Управление несколькими участками. Работа с субподрядчиками.' },
  { id: 'foreman-a', name: 'Foreman A', grade: 16, track: 'Полевой состав',       description: 'Старший прораб. Управление объектом целиком.' },
  { id: 'se-d',      name: 'Site Engineer D', grade: 13, track: 'Инженерный трек', description: 'Начальный уровень инженерного направления.' },
  { id: 'se-c',      name: 'Site Engineer C', grade: 14, track: 'Инженерный трек', description: 'Самостоятельная инженерная работа на участке.' },
  { id: 'se-b',      name: 'Site Engineer B', grade: 15, track: 'Инженерный трек', description: 'Технический контроль нескольких объектов.' },
  { id: 'se-a',      name: 'Site Engineer A', grade: 16, track: 'Инженерный трек', description: 'Главный инженер объекта.' },
  { id: 'sm',        name: 'Site Manager',    grade: 17, track: 'Управление объектом', description: 'Управление объектом целиком: бюджет, сроки, команда.' },
  { id: 'dpm',       name: 'Deputy PM',       grade: 18, track: 'Управление проектом', description: 'Заместитель руководителя проекта.' },
  { id: 'pm',        name: 'Project Manager', grade: 19, track: 'Управление проектом', description: 'Полная ответственность за проект.' },
]

const TRACKS = ['Все', 'Полевой состав', 'Инженерный трек', 'Управление объектом', 'Управление проектом']
const TRACK_COLORS = {
  'Полевой состав':      { bg: '#eff6ff', color: '#2563eb' },
  'Инженерный трек':     { bg: '#f0fdf4', color: '#16a34a' },
  'Управление объектом': { bg: '#fff7ed', color: '#ea580c' },
  'Управление проектом': { bg: '#fdf4ff', color: '#9333ea' },
}

export default function Positions() {
  const [activeTrack, setActiveTrack] = useState('Все')
  const [editing, setEditing] = useState(null)
  const [positions, setPositions] = useState(POSITIONS)
  const [form, setForm] = useState({})

  const filtered = activeTrack === 'Все' ? positions : positions.filter(p => p.track === activeTrack)

  function openEdit(pos) { setEditing(pos.id); setForm({ description: pos.description, grade: pos.grade }) }
  function save() {
    setPositions(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p))
    setEditing(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Должности</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>{positions.length} должностей · 4 карьерных трека</p>
      </div>

      {/* Track filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TRACKS.map(t => (
          <button key={t} onClick={() => setActiveTrack(t)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid', borderColor: activeTrack === t ? '#4361ee' : '#e8edf2', background: activeTrack === t ? '#4361ee' : '#fff', color: activeTrack === t ? '#fff' : '#0f1923', fontSize: 13, cursor: 'pointer', fontWeight: activeTrack === t ? 600 : 400 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Должность', 'Грейд', 'Трек', 'Описание', 'Действия'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((pos, i) => {
              const tc = TRACK_COLORS[pos.track]
              return (
                <tr key={pos.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0f1923' }}>{pos.name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: '#f0f2f5', fontSize: 13, fontWeight: 700, color: '#0f1923' }}>{pos.grade}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: tc.bg, color: tc.color, fontSize: 12, fontWeight: 600 }}>{pos.track}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#7a8fa0', maxWidth: 280 }}>{pos.description}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => openEdit(pos)} style={{ padding: '5px 12px', border: '1px solid #e8edf2', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#4361ee' }}>Изменить</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', margin: '0 0 24px' }}>
              {positions.find(p => p.id === editing)?.name}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Грейд
                <input type="number" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: +e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Описание
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer' }}>Отмена</button>
              <button onClick={save} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
