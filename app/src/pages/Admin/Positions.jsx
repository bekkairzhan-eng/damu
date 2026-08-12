import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { INITIAL_POSITIONS, INITIAL_REQ_CATEGORIES, TRACKS, missingReqs } from '../../data/positionsCatalog'

const TRACK_FILTERS = ['Все', ...TRACKS]
const TRACK_COLORS = {
  'Полевой состав':      { bg: '#eff6ff', color: '#2563eb' },
  'Инженерный трек':     { bg: '#f0fdf4', color: '#16a34a' },
  'Управление объектом': { bg: '#fff7ed', color: '#ea580c' },
  'Управление проектом': { bg: '#fdf4ff', color: '#9333ea' },
}
const TYPE_COLORS = {
  'ИТР': { bg: '#e0f2fe', color: '#0369a1' },
  'АУП': { bg: '#fce7f3', color: '#9d174d' },
}

export default function Positions() {
  const navigate = useNavigate()
  const [positions, setPositions] = useLocalStorage('admin:positions', INITIAL_POSITIONS)
  const [categories, setCategories] = useLocalStorage('admin:req-categories', INITIAL_REQ_CATEGORIES)
  const [activeTrack, setActiveTrack] = useState('Все')
  const [catModal, setCatModal] = useState(null) // null | 'add' | category object
  const [catName, setCatName] = useState('')
  const [catDelete, setCatDelete] = useState(null)

  const filtered = activeTrack === 'Все' ? positions : positions.filter(p => p.track === activeTrack)
  const enabledCount = positions.filter(p => p.isDamuEnabled).length
  const incomplete = positions.filter(p => missingReqs(p, categories).length > 0)

  function toggleDamu(id) {
    setPositions(prev => prev.map(p => p.id === id ? { ...p, isDamuEnabled: !p.isDamuEnabled } : p))
  }

  function openAddCat() { setCatName(''); setCatModal('add') }
  function openEditCat(cat) { setCatName(cat.name); setCatModal(cat) }

  function saveCat() {
    const name = catName.trim()
    if (!name) return
    if (catModal === 'add') {
      setCategories(prev => [...prev, { id: `cat-${Date.now()}`, name, icon: 'checklist' }])
    } else {
      setCategories(prev => prev.map(c => c.id === catModal.id ? { ...c, name } : c))
    }
    setCatModal(null)
  }

  // Удаление категории убирает и уже заполненные по ней тексты у всех должностей —
  // иначе они остались бы «сиротами» в generalReqs.
  function removeCat(id) {
    setCategories(prev => prev.filter(c => c.id !== id))
    setPositions(prev => prev.map(p => {
      const rest = { ...(p.generalReqs || {}) }
      delete rest[id]
      return { ...p, generalReqs: rest }
    }))
    setCatDelete(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Должности</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>
          {positions.length} должностей · {enabledCount} подключены к Damu
        </p>
      </div>

      {/* Баннер пилота */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#2563eb', flexShrink: 0, marginTop: 1 }}>info</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af' }}>Пилотный режим</div>
          <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>
            Только сотрудники с подключённой должностью синхронизируются из HRMS и получают доступ к Damu.
            Включайте должности постепенно по мере расширения пилота.
          </div>
        </div>
      </div>

      {/* Незаполненные общие требования */}
      {incomplete.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ea580c', flexShrink: 0, marginTop: 1 }}>warning</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9a3412' }}>
              Общие требования заполнены не у всех должностей ({incomplete.length} из {positions.length})
            </div>
            <div style={{ fontSize: 12, color: '#c2410c', marginTop: 2 }}>
              Каждая категория обязательна к заполнению у каждой должности. Незаполненные: {incomplete.map(p => p.name).join(', ')}.
            </div>
          </div>
        </div>
      )}

      {/* Категории общих требований — общий справочник */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f1923' }}>Категории общих требований</div>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 2 }}>
              Общий список для всех должностей. Добавите категорию — её нужно будет заполнить у каждой должности.
            </div>
          </div>
          <button onClick={openAddCat} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Добавить категорию
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map(cat => (
            <span key={cat.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e8edf2', fontSize: 13, color: '#0f1923' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#7a8fa0' }}>{cat.icon}</span>
              {cat.name}
              <span onClick={() => openEditCat(cat)} title="Переименовать" className="material-symbols-outlined" style={{ fontSize: 15, color: '#4361ee', cursor: 'pointer' }}>edit</span>
              <span onClick={() => setCatDelete(cat)} title="Удалить категорию" className="material-symbols-outlined" style={{ fontSize: 15, color: '#ef4444', cursor: 'pointer' }}>close</span>
            </span>
          ))}
          {categories.length === 0 && <span style={{ fontSize: 13, color: '#9aafbd' }}>Категорий нет — добавьте хотя бы одну.</span>}
        </div>
      </div>

      {/* Track filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TRACK_FILTERS.map(t => (
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
              {['Должность', 'Грейд (HRMS)', 'Тип', 'Трек', 'Общие требования', 'В Damu', 'Действия'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((pos, i) => {
              const tc = TRACK_COLORS[pos.track] || { bg: '#f0f2f5', color: '#7a8fa0' }
              const tyc = TYPE_COLORS[pos.employeeType] || { bg: '#f0f2f5', color: '#7a8fa0' }
              const missing = missingReqs(pos, categories)
              const done = categories.length - missing.length
              return (
                <tr key={pos.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f2f5' : 'none', background: pos.isDamuEnabled ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: pos.isDamuEnabled ? '#0f1923' : '#b0bec5' }}>{pos.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span title="Синхронизируется из HRMS, в Damu не редактируется" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: '#f0f2f5', fontSize: 13, fontWeight: 700, color: '#0f1923' }}>{pos.grade}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: tyc.bg, color: tyc.color, fontSize: 12, fontWeight: 600 }}>{pos.employeeType}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: tc.bg, color: tc.color, fontSize: 12, fontWeight: 600 }}>{pos.track}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: missing.length ? '#fff7ed' : '#f0fdf4', color: missing.length ? '#ea580c' : '#16a34a' }}>
                      {done}/{categories.length}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Toggle enabled={pos.isDamuEnabled} onChange={() => toggleDamu(pos.id)} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => navigate(`/admin/positions/${pos.id}`)} style={{ padding: '5px 12px', border: '1px solid #e8edf2', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#4361ee', whiteSpace: 'nowrap' }}>Требования →</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Category add/edit modal */}
      {catModal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', margin: '0 0 8px' }}>
              {catModal === 'add' ? 'Добавить категорию' : 'Переименовать категорию'}
            </h2>
            {catModal === 'add' && (
              <p style={{ fontSize: 13, color: '#7a8fa0', margin: '0 0 20px' }}>
                Категория появится у всех {positions.length} должностей и будет обязательна к заполнению.
              </p>
            )}
            <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
              Название категории
              <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Например: Цифровые компетенции" style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </label>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button onClick={() => setCatModal(null)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer' }}>Отмена</button>
              <button onClick={saveCat} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Category delete confirm */}
      {catDelete !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 400 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', marginBottom: 12 }}>Удалить категорию «{catDelete.name}»?</div>
            <p style={{ color: '#7a8fa0', fontSize: 14, margin: '0 0 24px' }}>
              Категория исчезнет со страницы «Должности», а заполненные по ней тексты будут удалены у всех должностей. Отменить нельзя.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setCatDelete(null)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer' }}>Отмена</button>
              <button onClick={() => removeCat(catDelete.id)} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', padding: 0,
        background: enabled ? '#4361ee' : '#e8edf2',
        position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: enabled ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}
