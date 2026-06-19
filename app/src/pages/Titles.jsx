import { useState } from 'react'

const LEVELS = [
  { grade: 'A', title: 'Прораб A' },
  { grade: 'B', title: 'Прораб B' },
  { grade: 'C', title: 'Прораб C', current: true },
  { grade: 'НУ', title: 'Начальник участка', target: true },
]

const GEN_REQS = [
  {
    name: 'Работа с заказчиком',
    values: [
      'Участвует в совещаниях по проекту.',
      'Активно участвует в совещаниях. Может вести ограниченное взаимодействие с заказчиком.',
      'Работает напрямую с заказчиком в зоне ответственности. Ведёт умеренные переговоры.',
      'Ведёт сложные переговоры с заказчиком, выстраивает доверие, управляет ожиданиями.',
    ],
  },
  {
    name: 'Управление командой',
    values: [
      'Работает под непосредственным руководством.',
      'Работает самостоятельно без постоянного контроля.',
      'Выступает наставником для менее опытных коллег. Организует работу бригады.',
      'Применяет методы лидерства (наставничество, делегирование, коучинг, урегулирование конфликтов).',
    ],
  },
  {
    name: 'Строительные практики',
    values: [
      'Понимает базовые строительные нормы и чертежи.',
      'Самостоятельно читает и применяет проектную документацию.',
      'Предлагает технические решения, контролирует соблюдение нормативов.',
      'Отвечает за архитектурные и технические решения на участке, принимает ключевые решения.',
    ],
  },
]

const SKILL_REQS = [
  { cat: 'Строительные практики', name: 'Управление строительной площадкой', levels: ['Базовый', 'Средний', 'Продвинутый', 'Эксперт'], mandatory: true },
  { cat: 'Строительные практики', name: 'Контроль качества строительства', levels: ['Базовый', 'Средний', 'Продвинутый', 'Продвинутый'], mandatory: true },
  { cat: 'Строительные практики', name: 'Нормативная база строительства', levels: ['Базовый', 'Средний', 'Средний', 'Продвинутый'], mandatory: true },
  { cat: 'Строительные практики', name: 'Охрана труда и ТБ', levels: ['Средний', 'Средний', 'Продвинутый', 'Эксперт'], mandatory: true },
  { cat: 'Технологии', name: 'BIM-технологии (Revit)', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { cat: 'Технологии', name: 'AutoCAD', levels: ['Базовый', 'Базовый', 'Средний', 'Продвинутый'] },
  { cat: 'Технологии', name: 'MS Project', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { cat: 'Технологии', name: 'Lean Construction', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { cat: 'Управление и лидерство', name: 'Управление субподрядчиками', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { cat: 'Управление и лидерство', name: 'Финансовый контроль проекта', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { cat: 'Управление и лидерство', name: 'Управление командой', levels: ['Базовый', 'Базовый', 'Средний', 'Средний'] },
  { cat: 'Языки', name: 'Казахский', levels: [null, null, 'B2', 'B2'] },
]

const LEVEL_COLOR = { 'Базовый': '#e0e6ef', 'Средний': '#4361ee', 'Продвинутый': '#22c55e', 'Эксперт': '#f59e0b', 'B2': '#8b5cf6' }
const LEVEL_TEXT = { 'Базовый': '#4a6275', 'Средний': '#fff', 'Продвинутый': '#fff', 'Эксперт': '#fff', 'B2': '#fff' }

export default function Titles() {
  const [tab, setTab] = useState('Общие требования')
  const [showMyLevel, setShowMyLevel] = useState(false)

  const cats = [...new Set(SKILL_REQS.map(s => s.cat))]

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Должности</h1>
          <p style={{ fontSize: 14, color: '#7a8fa0' }}>Изучите все должности и карьерные пути в компании</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/career-map" style={{ fontSize: 12, color: '#4361ee' }}>Посмотреть карьерные пути на карте →</a>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 12, color: '#4a6275' }}>Все должности</div>
        <input placeholder="🔍 Поиск по функциям или должностям" style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 13, flex: 1, outline: 'none' }} />
        <div style={{ padding: '5px 12px', borderRadius: 7, background: '#f0f4ff', border: '1px solid #c7d2fe', fontSize: 12, color: '#4361ee', display: 'flex', alignItems: 'center', gap: 6 }}>
          Функция: Строительство ✕
        </div>
        <div style={{ padding: '5px 12px', borderRadius: 7, background: '#f0f4ff', border: '1px solid #c7d2fe', fontSize: 12, color: '#4361ee', display: 'flex', alignItems: 'center', gap: 6 }}>
          Отдел: BI Construction ✕
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px 12px 0 0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', borderBottom: '2px solid #f0f2f8' }}>
          <div style={{ padding: '14px 16px' }} />
          {LEVELS.map((l, i) => (
            <div key={l.title} style={{ padding: '14px 12px', borderLeft: '1px solid #f0f2f8', background: l.current ? '#f0f4ff' : l.target ? '#f0fff4' : 'transparent' }}>
              <div style={{ fontSize: 10, color: '#9aafbd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {l.current ? 'ВЫ ЗДЕСЬ' : l.target ? 'ВАША ЦЕЛЬ' : `УРОВЕНЬ ${i + 1}`}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: l.current ? '#4361ee' : l.target ? '#16a34a' : '#0f1923' }}>{l.title}</div>
              <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 2 }}>Грейд {l.grade}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0, padding: '0 16px', borderBottom: '1px solid #f0f2f8' }}>
          {['Общие требования', 'Требования к навыкам'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 20px', background: 'none', border: 'none',
              borderBottom: tab === t ? '2.5px solid #0f1923' : '2.5px solid transparent',
              fontSize: 13, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#0f1923' : '#7a8fa0', cursor: 'pointer',
            }}>{t}</button>
          ))}
          {tab === 'Требования к навыкам' && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a6275', cursor: 'pointer' }}>
                <input type="checkbox" checked={showMyLevel} onChange={e => setShowMyLevel(e.target.checked)} style={{ accentColor: '#4361ee' }} />
                Показать мой уровень
              </label>
              <button style={btnOutline}>Выделить навыки</button>
            </div>
          )}
        </div>

        {tab === 'Общие требования' ? (
          <div>
            {GEN_REQS.map(req => (
              <div key={req.name} style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', borderBottom: '1px solid #f0f2f8' }}>
                <div style={{ padding: '16px', fontWeight: 600, fontSize: 13, color: '#0f1923', display: 'flex', alignItems: 'flex-start' }}>{req.name}</div>
                {req.values.map((v, i) => (
                  <div key={i} style={{ padding: '16px 12px', borderLeft: '1px solid #f0f2f8', fontSize: 12, color: '#4a6275', lineHeight: 1.5, background: LEVELS[i].current ? '#fafbff' : LEVELS[i].target ? '#f9fff9' : 'transparent' }}>
                    {v}
                    <div style={{ marginTop: 8, fontSize: 11, color: '#9aafbd', fontStyle: 'italic' }}>Также рекомендуется: проявлять проактивную коммуникацию.</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {cats.map(cat => {
              const catSkills = SKILL_REQS.filter(s => s.cat === cat)
              return (
                <div key={cat}>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', background: '#f8f9fc', borderBottom: '1px solid #f0f2f8' }}>
                    <div style={{ padding: '8px 16px', fontWeight: 700, fontSize: 12, color: '#0f1923' }}>{cat}</div>
                    {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
                  </div>
                  {catSkills.map(skill => (
                    <div key={skill.name} style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr)', borderBottom: '1px solid #f0f2f8' }}>
                      <div style={{ padding: '10px 16px', fontSize: 13, color: '#1a2b3c', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {skill.mandatory && <span title="Обязательный" style={{ color: '#f59e0b', fontSize: 12 }}>★</span>}
                        {skill.name}
                      </div>
                      {skill.levels.map((lvl, i) => (
                        <div key={i} style={{ padding: '10px 12px', borderLeft: '1px solid #f0f2f8', display: 'flex', alignItems: 'center', gap: 6, background: LEVELS[i].current ? '#fafbff' : LEVELS[i].target ? '#f9fff9' : 'transparent' }}>
                          {lvl ? (
                            <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: LEVEL_COLOR[lvl], color: LEVEL_TEXT[lvl] }}>{lvl}</span>
                          ) : <span style={{ color: '#e0e6ef', fontSize: 16 }}>—</span>}
                          {LEVELS[i].current && lvl && <span title="Развивается" style={{ fontSize: 12, color: '#4361ee' }}>↑</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const btnOutline = { padding: '5px 12px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
