import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const POSITIONS = [
  'Foreman D', 'Foreman C', 'Foreman B', 'Foreman A',
  'Site Engineer D', 'Site Engineer C', 'Site Engineer B', 'Site Engineer A',
  'Site Manager', 'Deputy PM', 'Project Manager',
]

const CLUSTERS = ['K1', 'K2', 'K2-International']

const LEVEL_LABELS = { 0: '—', 1: 'Базовый', 2: 'Средний', 3: 'Продвинутый', 4: 'Эксперт' }
const LEVEL_COLORS = {
  0: { bg: '#f8fafc', color: '#94a3b8' },
  1: { bg: '#f0fdf4', color: '#16a34a' },
  2: { bg: '#eff6ff', color: '#2563eb' },
  3: { bg: '#fff7ed', color: '#ea580c' },
  4: { bg: '#fdf4ff', color: '#9333ea' },
}

const INITIAL_SKILLS = [
  'Чтение строительных чертежей', 'Контроль качества СМР', 'Работа с госдокументацией',
  'Нормативно-техническая документация', 'Управление строительными рисками',
  'BIM-технологии', 'Цифровые инструменты управления',
  'Управление командой', 'Управление субподрядчиками', 'Работа с заказчиком',
  'Бюджетирование проекта', 'Охрана труда (ОТиТБ)', 'Экологические требования',
]

// Default requirements: position × skill → level (per cluster)
function makeDefaults() {
  const req = {}
  POSITIONS.forEach(pos => {
    req[pos] = {}
    INITIAL_SKILLS.forEach(skill => {
      // Simple heuristic for demo data
      const grade = ['Foreman D', 'Site Engineer D'].includes(pos) ? 1
        : ['Foreman C', 'Site Engineer C'].includes(pos) ? 1
        : ['Foreman B', 'Site Engineer B'].includes(pos) ? 2
        : ['Foreman A', 'Site Engineer A'].includes(pos) ? 3
        : ['Site Manager'].includes(pos) ? 3
        : 4
      req[pos][skill] = { 'K1': grade, 'K2': grade, 'K2-International': grade }
    })
  })
  return req
}

export default function Requirements() {
  const [position, setPosition] = useState('Foreman B')
  const [cluster, setCluster] = useState('K1')
  const [requirements, setRequirements] = useLocalStorage('admin:requirements', makeDefaults)
  const [saved, setSaved] = useState(false)

  function setLevel(skill, level) {
    setRequirements(prev => ({
      ...prev,
      [position]: {
        ...prev[position],
        [skill]: { ...prev[position]?.[skill], [cluster]: level },
      }
    }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const posReqs = requirements[position] || {}

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Требования к навыкам</h1>
          <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Требуемый уровень навыка на конкретную должность в конкретном кластере</p>
        </div>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, background: saved ? '#10b981' : '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{saved ? 'check' : 'save'}</span>
          {saved ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>

      {/* Selectors */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Должность</div>
          <select value={position} onChange={e => setPosition(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff', minWidth: 200 }}>
            {POSITIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Кластер</div>
          <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid #e8edf2', borderRadius: 10, padding: 4 }}>
            {CLUSTERS.map(c => (
              <button key={c} onClick={() => setCluster(c)} style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: cluster === c ? '#4361ee' : 'transparent', color: cluster === c ? '#fff' : '#7a8fa0', fontSize: 13, fontWeight: cluster === c ? 600 : 400, cursor: 'pointer' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8edf2', fontSize: 13, fontWeight: 600, color: '#0f1923', background: '#f8fafc' }}>
          {position} · {cluster} — {INITIAL_SKILLS.length} навыков
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Навык', 'Требуемый уровень', 'Выбрать уровень'].map(h => (
                <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INITIAL_SKILLS.map((skill, i) => {
              const level = posReqs[skill]?.[cluster] ?? 0
              const lc = LEVEL_COLORS[level]
              return (
                <tr key={skill} style={{ borderBottom: i < INITIAL_SKILLS.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                  <td style={{ padding: '13px 20px', fontSize: 14, color: '#0f1923' }}>{skill}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 6, background: lc.bg, color: lc.color, fontSize: 12, fontWeight: 600 }}>{LEVEL_LABELS[level]}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0, 1, 2, 3, 4].map(l => (
                        <button key={l} onClick={() => setLevel(skill, l)} style={{ width: 32, height: 32, borderRadius: 7, border: '2px solid', borderColor: level === l ? LEVEL_COLORS[l].color : '#e8edf2', background: level === l ? LEVEL_COLORS[l].bg : '#fff', color: level === l ? LEVEL_COLORS[l].color : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          {l === 0 ? '—' : l}
                        </button>
                      ))}
                    </div>
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
