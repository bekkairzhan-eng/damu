import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const COMPONENTS_META = [
  { key: 'skills',    label: 'Подтверждённые навыки', icon: 'psychology',     source: 'Damu',     color: '#4361ee' },
  { key: 'learning',  label: 'Активность обучения',   icon: 'school',         source: 'LMS + ручной ввод', color: '#10b981' },
  { key: 'superapp',  label: 'Рейтинг SuperApp',      icon: 'star',           source: 'SuperApp (в разработке)', color: '#f59e0b' },
  { key: 'profile',   label: 'Заполненность профиля', icon: 'person',         source: 'Damu',     color: '#8b5cf6' },
  { key: 'corporate', label: 'Корпоративная активность', icon: 'corporate_fare', source: 'HRMS',  color: '#06b6d4' },
]

const DEFAULT_WEIGHTS = { skills: 30, learning: 25, superapp: 25, profile: 10, corporate: 10 }

export default function RatingWeights() {
  const [weights, setWeights] = useLocalStorage('admin:rating-weights', DEFAULT_WEIGHTS)
  const [saved, setSaved] = useState(false)

  const total = Object.values(weights).reduce((s, v) => s + Number(v), 0)
  const isValid = total === 100

  function setWeight(key, val) {
    const n = Math.max(0, Math.min(100, Number(val) || 0))
    setWeights(prev => ({ ...prev, [key]: n }))
  }

  function handleSave() {
    if (!isValid) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function reset() { setWeights(DEFAULT_WEIGHTS) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Веса рейтинга</h1>
          <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Настройка весов 5 компонентов итогового балла. Сумма должна быть 100%.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={reset} style={{ padding: '10px 18px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#0f1923' }}>Сбросить</button>
          <button onClick={handleSave} disabled={!isValid} style={{ display: 'flex', alignItems: 'center', gap: 6, background: saved ? '#10b981' : isValid ? '#4361ee' : '#94a3b8', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: isValid ? 'pointer' : 'not-allowed', transition: 'background 0.3s' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{saved ? 'check' : 'save'}</span>
            {saved ? 'Сохранено' : 'Сохранить'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        {/* Weights editor */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8edf2', fontWeight: 600, fontSize: 14, color: '#0f1923' }}>Компоненты</div>
          {COMPONENTS_META.map(comp => {
            const w = weights[comp.key] || 0
            return (
              <div key={comp.key} style={{ padding: '20px 24px', borderBottom: '1px solid #f0f2f5', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: comp.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: comp.color }}>{comp.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923' }}>{comp.label}</div>
                  <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 2 }}>Источник: {comp.source}</div>
                  <div style={{ marginTop: 10, height: 6, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${w}%`, background: comp.color, borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <input
                    type="number" min={0} max={100} value={w}
                    onChange={e => setWeight(comp.key, e.target.value)}
                    style={{ width: 64, padding: '8px 10px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 16, fontWeight: 700, color: '#0f1923', textAlign: 'center', outline: 'none' }}
                  />
                  <span style={{ fontSize: 16, color: '#7a8fa0' }}>%</span>
                </div>
              </div>
            )
          })}

          {/* Total */}
          <div style={{ padding: '16px 24px', background: isValid ? '#f0fdf4' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#0f1923' }}>Итого</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isValid && <span style={{ fontSize: 13, color: '#ea580c' }}>{total > 100 ? `+${total - 100}% лишних` : `−${100 - total}% не распределено`}</span>}
              <span style={{ fontSize: 22, fontWeight: 800, color: isValid ? '#16a34a' : '#ea580c' }}>{total}%</span>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: isValid ? '#16a34a' : '#ea580c' }}>{isValid ? 'check_circle' : 'error'}</span>
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923', marginBottom: 16 }}>Пример расчёта</div>
          <div style={{ fontSize: 13, color: '#7a8fa0', marginBottom: 16 }}>Сотрудник с такими баллами:</div>
          {COMPONENTS_META.map(comp => {
            const exampleScore = { skills: 4.3, learning: 4.5, superapp: 4.0, profile: 3.5, corporate: 4.2 }[comp.key]
            const w = weights[comp.key] || 0
            return (
              <div key={comp.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f0f2f5', fontSize: 13 }}>
                <span style={{ color: '#0f1923' }}>{comp.label}</span>
                <span style={{ color: '#7a8fa0' }}>{exampleScore} × {w}%</span>
              </div>
            )
          })}
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 4 }}>Итоговый балл</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#4361ee' }}>
              {isValid
                ? (COMPONENTS_META.reduce((sum, c) => {
                    const score = { skills: 4.3, learning: 4.5, superapp: 4.0, profile: 3.5, corporate: 4.2 }[c.key]
                    return sum + score * (weights[c.key] || 0) / 100
                  }, 0)).toFixed(2)
                : '—'
              }
              <span style={{ fontSize: 16, color: '#7a8fa0', fontWeight: 400 }}> / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
