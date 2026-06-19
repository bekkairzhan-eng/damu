import { useState } from 'react'

const SKILL_CATEGORIES = [
  {
    name: 'Языки (CEFR)', open: true,
    skills: [
      { name: 'Казахский', level: 3, confirmed: true },
      { name: 'Русский', level: 4, confirmed: true },
      { name: 'Английский B1', level: 2, selfDeclared: true },
    ],
  },
  {
    name: 'Строительные практики', open: true,
    skills: [
      { name: 'Управление строительной площадкой', level: 3, confirmed: true },
      { name: 'Контроль качества строительства', level: 3, confirmed: true },
      { name: 'Охрана труда и техника безопасности', level: 4, confirmed: true },
      { name: 'Нормативная база строительства', level: 3, selfDeclared: true },
      { name: 'Проектная документация', level: 2, selfDeclared: true },
    ],
  },
  {
    name: 'Технологии', open: false,
    skills: [
      { name: 'BIM-технологии (Revit)', level: 2, selfDeclared: true },
      { name: 'AutoCAD', level: 2, selfDeclared: true },
      { name: 'MS Project', level: 1, selfDeclared: true },
      { name: 'Lean Construction', level: 2, selfDeclared: true },
    ],
  },
  {
    name: 'Управление и лидерство', open: false,
    skills: [
      { name: 'Управление командой', level: 3, confirmed: true },
      { name: 'Управление субподрядчиками', level: 2, selfDeclared: true },
      { name: 'Финансовый контроль проекта', level: 2, selfDeclared: true },
      { name: 'Решение конфликтов', level: 2, selfDeclared: true },
      { name: 'Коммуникация с заказчиком', level: 3, confirmed: true },
    ],
  },
]

export default function MySkills() {
  const [cats, setCats] = useState(SKILL_CATEGORIES)

  function toggle(i) {
    setCats(prev => prev.map((c, idx) => idx === i ? { ...c, open: !c.open } : c))
  }

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#3730a3' }}>
        <span>✅</span>
        <span>Ваш профиль навыков актуален. Актуальный профиль помогает получать релевантный контент.</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={btnOutline}>Легенда уровней</button>
          <button style={btnPrimary}>+ Добавить навык</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['Все', 'Избранные', 'Подтверждённые', 'Целевые'].map(f => (
          <button key={f} style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid #e0e6ef', background: f === 'Все' ? '#4361ee' : '#fff', color: f === 'Все' ? '#fff' : '#4a6275', fontSize: 12, cursor: 'pointer' }}>{f}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={btnOutline}>Только пробелы в навыках</button>
        <button style={btnOutline}>Автообновление навыков</button>
        <button style={btnOutline}>Выбрать</button>
      </div>

      {cats.map((cat, i) => (
        <div key={cat.name} style={{ marginBottom: 12 }}>
          <button onClick={() => toggle(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', border: '1px solid #e8edf2', borderRadius: cat.open ? '10px 10px 0 0' : 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#0f1923' }}>
            <span style={{ transform: cat.open ? 'rotate(180deg)' : 'none', transition: '0.2s', fontSize: 16 }}>▾</span>
            {cat.name}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#7a8fa0', fontWeight: 400 }}>{cat.skills.length} навыков</span>
          </button>

          {cat.open && (
            <div style={{ border: '1px solid #e8edf2', borderTop: 'none', borderRadius: '0 0 10px 10px', background: '#fff', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #f0f2f8' }}>
                <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 600, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ОБНОВИТЬ УРОВЕНЬ НАВЫКА</div>
                <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 600, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '1px solid #f0f2f8' }}>САМОСТОЯТЕЛЬНО ЗАЯВЛЕННЫЕ НАВЫКИ</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ padding: '4px 0' }}>
                  {cat.skills.filter((_, j) => j % 2 === 0).map(s => <SkillRow key={s.name} skill={s} />)}
                </div>
                <div style={{ padding: '4px 0', borderLeft: '1px solid #f0f2f8' }}>
                  {cat.skills.filter((_, j) => j % 2 === 1).map(s => <SkillRow key={s.name} skill={s} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SkillRow({ skill }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid #f8f9fc' }}>
      <span style={{ color: '#cdd5e0', fontSize: 14, cursor: 'pointer' }}>♡</span>
      <LevelBar level={skill.level} />
      <span style={{ flex: 1, fontSize: 13, color: '#1a2b3c' }}>{skill.name}</span>
      {skill.confirmed && <span title="Подтверждён" style={{ fontSize: 11, color: '#059669' }}>✦</span>}
      {skill.selfDeclared && <span title="Самозаявленный" style={{ fontSize: 11, color: '#f59e0b' }}>★</span>}
      <span style={{ color: '#cdd5e0', fontSize: 14, cursor: 'pointer' }}>ℹ</span>
    </div>
  )
}

function LevelBar({ level }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: i <= level ? '#4361ee' : '#e0e6ef' }} />)}
    </div>
  )
}

const btnPrimary = { padding: '6px 14px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }
const btnOutline = { padding: '6px 14px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
