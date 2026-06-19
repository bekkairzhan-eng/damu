import { useState } from 'react'

const STEP = ['Выбрать цель', 'Установить срок', 'Работать по плану', 'Запросить аттестацию']

const JOB_FUNCTIONS = {
  'Полевой состав': ['Foreman A', 'Foreman B', 'Foreman C'],
  'Управление участком': ['Site Manager', 'Deputy Manager'],
  'Управление проектом': ['Project Manager'],
  'Высший менеджмент': ['Директор Управления', 'Генеральный Директор'],
}

export default function CareerMap() {
  const [to, setTo] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [suggestions, setSuggestions] = useState(false)
  const currentStep = to ? 1 : 0

  return (
    <div style={{ padding: '28px 32px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Карьерная карта</h1>
      <p style={{ color: '#7a8fa0', fontSize: 14, marginBottom: 20 }}>Постройте путь к карьерной цели и скорректируйте его при необходимости</p>

      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 14 }}>🗺</span>
        <span style={{ fontSize: 13, color: '#7a8fa0', fontWeight: 500 }}>Построить путь</span>
        <span style={{ fontSize: 13, color: '#9aafbd' }}>От</span>
        <div style={{ padding: '6px 12px', borderRadius: 7, background: '#f0f4ff', border: '1px solid #c7d2fe', fontSize: 13, color: '#4361ee', fontWeight: 500 }}>
          Foreman B ✕
        </div>
        <span style={{ fontSize: 13, color: '#9aafbd' }}>До</span>
        <div style={{ position: 'relative' }}>
          <input
            value={to}
            onChange={e => { setTo(e.target.value); setShowDropdown(true) }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Выберите должность"
            style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 13, width: 200, outline: 'none' }}
          />
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, background: '#fff', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e8edf2', minWidth: 280, maxHeight: 300, overflowY: 'auto', marginTop: 4 }}>
              {Object.entries(JOB_FUNCTIONS).map(([fn, titles]) => (
                <div key={fn}>
                  <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{fn}</div>
                  {titles.map(t => (
                    <div key={t} onMouseDown={() => { setTo(t); setShowDropdown(false) }} style={{ padding: '8px 14px', fontSize: 13, color: '#1a2b3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>А</div>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <input placeholder="🔍 Поиск" style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 13, width: '100%', outline: 'none' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a6275', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={suggestions} onChange={e => setSuggestions(e.target.checked)} style={{ accentColor: '#4361ee' }} />
          Карьерные подсказки
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, padding: '0 8px' }}>
        {STEP.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: i <= currentStep ? '#4361ee' : '#e0e6ef',
                color: i <= currentStep ? '#fff' : '#9aafbd',
              }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === currentStep ? 600 : 400, color: i <= currentStep ? '#0f1923' : '#9aafbd', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEP.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < currentStep ? '#4361ee' : '#e0e6ef', margin: '0 8px', borderRadius: 2 }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ background: '#f8f9fc', borderRadius: 14, border: '1px solid #e8edf2', minHeight: 420, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, color: '#9aafbd', display: 'flex', alignItems: 'center', gap: 6 }}>🖱 Перетащите карту мышью</div>
          <div style={{ fontSize: 11, color: '#9aafbd', display: 'flex', alignItems: 'center', gap: 6 }}>🔲 Нажмите на карточку для подробностей</div>
        </div>

        <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button style={zoomBtn}>+</button>
          <button style={zoomBtn}>−</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <MapCard title="Foreman A" dept="BI Construction" grade="A" past />
          <Arrow />
          <MapCard title="Foreman B" dept="BI Construction" grade="B" current date="Повышен 01 Янв 2024" />
          <Arrow />
          {to
            ? <MapCard title={to} dept="BI Construction" grade="→" target deadline="06 Фев 2027" />
            : <div style={{ width: 200, height: 100, border: '2px dashed #d0d7e5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aafbd', fontSize: 13 }}>Выберите цель →</div>
          }
        </div>

        {to && (
          <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)' }}>
            <button style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#4361ee', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 3px 12px rgba(67,97,238,0.35)' }}>
              Открыть карьерный план
            </button>
          </div>
        )}
      </div>

      {suggestions && (
        <div style={{ marginTop: 16, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', marginBottom: 12 }}>
            💡 Популярные переходы с Foreman B
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { to: 'Foreman C', pct: 68, desc: 'Самый частый следующий шаг' },
              { to: 'Site Manager', pct: 22, desc: 'Для тех, кто пропускает уровень' },
              { to: 'Deputy Manager', pct: 10, desc: 'Переход в управление' },
            ].map(s => (
              <div key={s.to} onClick={() => setTo(s.to)} style={{ flex: 1, minWidth: 180, padding: '14px 16px', borderRadius: 10, border: '1px solid #e8edf2', cursor: 'pointer', background: '#fafbff' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', marginBottom: 4 }}>{s.to}</div>
                <div style={{ fontSize: 11, color: '#7a8fa0', marginBottom: 8 }}>{s.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: '#e0e6ef', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: '#4361ee', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#4361ee' }}>{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MapCard({ title, dept, grade, current, target, past, date, deadline }) {
  return (
    <div style={{
      width: 210, background: '#fff', borderRadius: 12, padding: 16,
      border: current ? '2px solid #4361ee' : target ? '2px solid #22c55e' : '1px solid #e8edf2',
      boxShadow: current || target ? '0 4px 20px rgba(67,97,238,0.15)' : '0 1px 4px rgba(0,0,0,0.05)',
      opacity: past ? 0.7 : 1,
    }}>
      {current && <div style={{ fontSize: 10, fontWeight: 700, color: '#4361ee', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ВЫ ЗДЕСЬ</div>}
      {target && <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ВАША СЛЕДУЮЩАЯ ЦЕЛЬ</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: current ? '#4361ee' : target ? '#22c55e' : '#e0e6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: current || target ? '#fff' : '#4a6275', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{grade}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: 11, color: '#7a8fa0' }}>{dept}</div>
        </div>
      </div>
      {date && <div style={{ fontSize: 11, color: '#9aafbd' }}>📅 {date}</div>}
      {deadline && <div style={{ fontSize: 11, color: '#7a8fa0' }}>⏱ Срок: {deadline}</div>}
      <button style={{ marginTop: 8, fontSize: 11, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Подробнее ↓</button>
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 40, height: 2, background: '#d0d7e5' }} />
      <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '8px solid #d0d7e5' }} />
    </div>
  )
}

const zoomBtn = { width: 32, height: 32, borderRadius: 6, border: '1px solid #e0e6ef', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#4a6275', display: 'flex', alignItems: 'center', justifyContent: 'center' }
