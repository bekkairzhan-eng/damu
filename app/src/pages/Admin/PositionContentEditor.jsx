import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { INITIAL_POSITIONS, INITIAL_REQ_CATEGORIES, missingReqs } from '../../data/positionsCatalog'

const inputStyle = { display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const cardStyle = { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }

export default function PositionContentEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [positions, setPositions] = useLocalStorage('admin:positions', INITIAL_POSITIONS)
  const [categories] = useLocalStorage('admin:req-categories', INITIAL_REQ_CATEGORIES)
  const position = positions.find(p => p.id === id)

  const [description, setDescription] = useState(position?.description ?? '')
  const [kbUrl, setKbUrl] = useState(position?.kbUrl ?? '')
  const [generalReqs, setGeneralReqs] = useState(position?.generalReqs ?? {})
  const [saved, setSaved] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  if (!position) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: '#7a8fa0' }}>Должность не найдена.</p>
        <button onClick={() => navigate('/admin/positions')} style={{ color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>← Должности</button>
      </div>
    )
  }

  const missing = missingReqs({ generalReqs }, categories)
  const canSave = missing.length === 0 && description.trim()

  function updateReq(catId, value) {
    setGeneralReqs(prev => ({ ...prev, [catId]: value }))
  }

  // Пустые поля запрещены: категория обязательна к заполнению у каждой
  // должности, иначе на /titles появится «шахматка» из пропусков.
  function save() {
    if (!canSave) { setShowErrors(true); return }
    setPositions(prev => prev.map(p => p.id === position.id ? { ...p, description, kbUrl, generalReqs } : p))
    setShowErrors(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/positions')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>← Должности</button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>{position.name}</h1>
          <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>
            {position.track} · {position.employeeType} · грейд {position.grade}
            <span style={{ marginLeft: 8, fontSize: 12, color: '#9aafbd' }}>(грейд — из HRMS, не редактируется)</span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Сохранено</span>}
          <button onClick={save} disabled={!canSave} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: canSave ? '#4361ee' : '#cdd5e0', color: '#fff', fontSize: 14, fontWeight: 600, cursor: canSave ? 'pointer' : 'not-allowed' }}>Сохранить</button>
        </div>
      </div>

      {showErrors && missing.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#9a3412' }}>
          Заполните все категории — незаполнено: {missing.map(c => c.name).join(', ')}.
        </div>
      )}

      <div style={cardStyle}>
        <label style={{ fontSize: 15, fontWeight: 700, color: '#0f1923' }}>
          Краткое описание должности
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Одна–две фразы для карточки должности"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', fontWeight: 400 }}
          />
        </label>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0f1923', marginTop: 16 }}>
          Ссылка на Базу знаний (пространство Damu)
          <input value={kbUrl} onChange={e => setKbUrl(e.target.value)} placeholder="https://kb.bi.group/damu/positions/..." style={inputStyle} />
        </label>
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#0f1923' }}>Общие требования</span>
          <span style={{ marginLeft: 8, padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: missing.length ? '#fff7ed' : '#f0fdf4', color: missing.length ? '#ea580c' : '#16a34a' }}>
            {categories.length - missing.length}/{categories.length}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 16 }}>
          Все категории обязательны. Список категорий общий для всех должностей — меняется на странице «Должности».
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {categories.map(cat => {
            const value = generalReqs[cat.id] ?? ''
            const isEmpty = !value.trim()
            return (
              <label key={cat.id} style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#7a8fa0' }}>{cat.icon}</span>
                  {cat.name}
                  {isEmpty && <span style={{ color: '#ea580c', fontWeight: 400, fontSize: 12 }}>— не заполнено</span>}
                </span>
                <textarea
                  value={value}
                  onChange={e => updateReq(cat.id, e.target.value)}
                  placeholder={`Что ожидается от ${position.name} по категории «${cat.name}»`}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontWeight: 400, borderColor: showErrors && isEmpty ? '#fed7aa' : '#e8edf2' }}
                />
              </label>
            )
          })}
          {categories.length === 0 && (
            <div style={{ fontSize: 13, color: '#9aafbd' }}>Категорий пока нет — добавьте их на странице «Должности».</div>
          )}
        </div>
      </div>
    </div>
  )
}
