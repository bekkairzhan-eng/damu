import { useState } from 'react'

const skillGroups = [
  {
    name: 'Строительные практики', skills: [
      { name: 'Управление строительной площадкой', level: 3, target: 4, status: 'gap' },
      { name: 'Контроль качества строительства', level: 3, target: 4, status: 'gap' },
      { name: 'Нормативная база строительства', level: 3, target: 4, status: 'gap' },
    ]
  },
  {
    name: 'Технологии', skills: [
      { name: 'BIM-технологии (Revit)', level: 2, target: 3, status: 'gap' },
      { name: 'AutoCAD', level: 2, target: 3, status: 'gap' },
      { name: 'MS Project', level: 1, target: 2, status: 'gap' },
      { name: 'Lean Construction', level: 2, target: 3, status: 'gap' },
    ]
  },
  {
    name: 'Управление и лидерство', skills: [
      { name: 'Управление командой', level: 3, target: 3, status: 'developed', starred: true },
      { name: 'Управление субподрядчиками', level: 2, target: 3, status: 'gap' },
      { name: 'Финансовый контроль проекта', level: 2, target: 3, status: 'gap' },
      { name: 'Коммуникация с заказчиком', level: 3, target: 3, status: 'developed', starred: true },
    ]
  },
  {
    name: 'Охрана труда', skills: [
      { name: 'Охрана труда и ТБ', level: 4, target: 4, status: 'developed' },
    ]
  },
  {
    name: 'Языки', skills: [
      { name: 'Казахский', level: 3, target: 3, status: 'developed', badge: 'C1' },
    ]
  },
  {
    name: 'Прочее', skills: [
      { name: 'Адаптивность', level: 2, target: 3, status: 'gap' },
      { name: 'Развитие сотрудников', level: 1, target: 2, status: 'gap' },
      { name: 'Командная работа', level: 2, target: 2, status: 'developed', starred: true },
      { name: 'Принятие решений', level: 2, target: 3, status: 'gap' },
      { name: 'Управление конфликтами', level: 2, target: 3, status: 'gap' },
    ]
  },
]

const TABS = ['Требования к навыкам', 'План обучения', 'Готовность к оценке']

export default function CareerPlanDetail({ plan, onBack }) {
  const [tab, setTab] = useState('Требования к навыкам')
  const [showGapsOnly, setShowGapsOnly] = useState(false)

  const totalSkills = skillGroups.flatMap(g => g.skills).length
  const developed = skillGroups.flatMap(g => g.skills).filter(s => s.status === 'developed').length

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '16px 32px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>← Мои планы</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f1923' }}>Карьерный план — {plan.title}</h1>
              <span style={{ color: '#cdd5e0' }}>📌</span>
            </div>
            <div style={{ fontSize: 13, color: '#7a8fa0', marginTop: 4 }}>{plan.dept} · Последнее изменение: недавно</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProgressCircle value={developed} total={totalSkills} />
            <div style={{ fontSize: 11, color: '#7a8fa0', marginTop: 4 }}>Прогресс навыков</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, marginTop: 16 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', background: 'none', border: 'none',
              borderBottom: tab === t ? '2.5px solid #0f1923' : '2.5px solid transparent',
              fontSize: 13.5, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#0f1923' : '#7a8fa0', cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 32px' }}>
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', gap: 10 }}>
          ⚠️ Содержимое вашего плана было обновлено. Пожалуйста, ознакомьтесь с изменениями.
          <button style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, border: '1px solid #fcd34d', background: '#fff', color: '#92400e', fontSize: 12, cursor: 'pointer' }}>Посмотреть изменения</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <button style={btnPrimary}>+ Добавить</button>
          <button style={btnOutline}>+ Добавить учебные материалы</button>
          <div style={{ flex: 1 }} />
          <button style={btnOutline}>Легенда навыков</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a6275', cursor: 'pointer' }}>
            <input type="checkbox" checked={showGapsOnly} onChange={e => setShowGapsOnly(e.target.checked)} style={{ accentColor: '#4361ee' }} />
            Только пробелы в навыках
          </label>
          <button style={btnOutline}>Выбрать элементы</button>
        </div>

        {tab === 'Требования к навыкам' && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {skillGroups.map(group => {
              const skills = showGapsOnly ? group.skills.filter(s => s.status === 'gap') : group.skills
              if (!skills.length) return null
              return (
                <div key={group.name}>
                  <div style={{ padding: '10px 20px', background: '#f8f9fc', borderBottom: '1px solid #f0f2f8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f1923' }}>{group.name}</span>
                    <span style={{ fontSize: 11, color: '#9aafbd' }}>▾</span>
                  </div>
                  {skills.map(skill => <SkillRow key={skill.name} skill={skill} />)}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'Готовность к оценке' && <EligibilityTab />}
        {tab === 'План обучения' && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', color: '#7a8fa0', textAlign: 'center', padding: 40 }}>
            План обучения будет доступен позже
          </div>
        )}
      </div>
    </div>
  )
}

function SkillRow({ skill }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: '1px solid #f8f9fc' }}>
      <LevelBar level={skill.level} max={4} />
      <span style={{ flex: 1, fontSize: 13, color: '#1a2b3c' }}>
        {skill.starred && <span style={{ color: '#f59e0b', marginRight: 4 }}>★</span>}
        {skill.badge && <span style={{ marginRight: 6, fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 8 }}>{skill.badge}</span>}
        {skill.name}
      </span>
      {skill.status === 'developed' && (
        <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: 10 }}>✓ Навык освоен</span>
      )}
      <span style={{ fontSize: 12, color: '#9aafbd', cursor: 'pointer', whiteSpace: 'nowrap' }}>⏱ Установить срок</span>
    </div>
  )
}

function EligibilityTab() {
  const reqs = [
    { label: 'Стаж в BI Group (мин)', value: '3 года', ok: true },
    { label: 'Рейтинг профиля (мин)', value: '3', ok: true },
    { label: 'Подтверждённый уровень казахского', value: 'B2', ok: true },
    { label: 'Производственный вклад (последние 3 мес)', value: 'Да', ok: true },
  ]
  const allOk = reqs.every(r => r.ok)
  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 4 }}>
          Текущий статус готовности к оценке: Начальник участка
        </div>
        <div style={{ fontSize: 13, color: '#7a8fa0', marginBottom: 16 }}>BI Construction</div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1e40af', marginBottom: 20 }}>
          ℹ️ Показатели готовности к аттестации обновляются автоматически. Синхронизация может занять до 48 часов.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reqs.map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: '#fafafa', border: '1px solid #f0f2f8' }}>
              <span style={{ fontSize: 18 }}>{r.ok ? '✅' : '❌'}</span>
              <span style={{ flex: 1, fontSize: 13, color: '#1a2b3c' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: r.ok ? '#059669' : '#ef4444' }}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button style={btnOutline}>Поделиться</button>
          <button style={{ ...btnPrimary, opacity: allOk ? 1 : 0.5 }} disabled={!allOk}>Запросить аттестацию</button>
        </div>
      </div>
    </div>
  )
}

function LevelBar({ level, max = 4 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: i < level ? '#4361ee' : '#e0e6ef' }} />
      ))}
    </div>
  )
}

function ProgressCircle({ value, total }) {
  const pct = total ? (value / total) * 100 : 0
  const r = 28, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ
  return (
    <svg width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r={r} fill="none" stroke="#f0f2f8" strokeWidth="6" />
      <circle cx="35" cy="35" r={r} fill="none" stroke="#4361ee" strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 35 35)" />
      <text x="35" y="39" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f1923">{value}/{total}</text>
    </svg>
  )
}

const btnPrimary = { padding: '7px 16px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }
const btnOutline = { padding: '7px 16px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
