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

const prevSkillGroups = [
  {
    name: 'Строительные практики', skills: [
      { name: 'Управление строительной площадкой', achieved: 3, label: 'Средний → Продвинутый' },
      { name: 'Контроль качества строительства', achieved: 3, label: 'Базовый → Продвинутый' },
      { name: 'Нормативная база строительства РК', achieved: 3, label: 'Средний → Продвинутый' },
      { name: 'Охрана труда и ТБ', achieved: 4, label: 'Продвинутый → Эксперт' },
    ]
  },
  {
    name: 'Технологии', skills: [
      { name: 'AutoCAD', achieved: 2, label: 'Базовый → Средний' },
      { name: 'MS Project', achieved: 1, label: 'Базовый', skipped: true },
    ]
  },
  {
    name: 'Управление и лидерство', skills: [
      { name: 'Управление командой', achieved: 3, label: 'Средний → Продвинутый' },
      { name: 'Коммуникация с заказчиком', achieved: 3, label: 'Средний → Продвинутый' },
      { name: 'Управление конфликтами', achieved: 2, label: 'Базовый → Средний' },
    ]
  },
  {
    name: 'Языки', skills: [
      { name: 'Казахский язык', achieved: 3, label: 'B1 → B2 (сертифицирован)', cert: true },
      { name: 'Русский язык', achieved: 4, label: 'C1 (подтверждён)', cert: true },
    ]
  },
]

const prevLearning = [
  { name: 'Корпоративный онбординг Foreman B', provider: 'BI University', date: 'Янв 2024', hours: 24, cert: false },
  { name: 'Lean Construction: введение', provider: 'BI University', date: 'Фев 2024', hours: 8, cert: true },
  { name: 'BIM-технологии: базовый курс', provider: 'BILIM', date: 'Авг 2024', hours: 20, cert: true },
  { name: 'Нормативная база строительства РК', provider: 'BI University', date: 'Янв 2025', hours: 8, cert: true },
  { name: 'Охрана труда и ТБ — переаттестация', provider: 'Buildex Training Center', date: 'Янв 2025', hours: 4, cert: true },
]

const TABS = ['Требования к навыкам', 'План обучения', 'Готовность к оценке']

export default function CareerPlanDetail({ plan, onBack }) {
  const [tab, setTab] = useState('Требования к навыкам')
  const [showGapsOnly, setShowGapsOnly] = useState(false)

  const totalSkills = skillGroups.flatMap(g => g.skills).length
  const developed = skillGroups.flatMap(g => g.skills).filter(s => s.status === 'developed').length

  if (plan.expired) return <CompletedPlanView plan={plan} onBack={onBack} />
  if (plan.noData)  return <AwaitingAssessmentView plan={plan} onBack={onBack} />

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '16px 32px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>← Мои планы</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f1923' }}>Карьерный план — {plan.title}</h1>
              <span className="material-symbols-outlined" style={{ color: '#cdd5e0', fontSize: 20 }}>push_pin</span>
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
          <span className="material-symbols-outlined" style={{ fontSize: 18, flexShrink: 0 }}>warning</span> Содержимое вашего плана было обновлено. Пожалуйста, ознакомьтесь с изменениями.
          <button style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, border: '1px solid #fcd34d', background: '#fff', color: '#92400e', fontSize: 12, cursor: 'pointer' }}>Посмотреть изменения</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a6275', cursor: 'pointer' }}>
            <input type="checkbox" checked={showGapsOnly} onChange={e => setShowGapsOnly(e.target.checked)} style={{ accentColor: '#4361ee' }} />
            Только пробелы в навыках
          </label>
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
        {tab === 'План обучения' && <LearningPlanTab />}
      </div>
    </div>
  )
}

function AwaitingAssessmentView({ plan, onBack }) {
  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '16px 32px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>← Мои планы</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>{plan.title}</h1>
        <div style={{ fontSize: 13, color: '#7a8fa0' }}>{plan.dept}</div>
      </div>

      <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <div><span className="material-symbols-outlined" style={{ fontSize: 64, color: '#9aafbd' }}>assignment</span></div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f1923' }}>План ещё не сформирован</div>
        <div style={{ fontSize: 14, color: '#7a8fa0', maxWidth: 480, lineHeight: 1.7 }}>
          Этот план создаётся автоматически после прохождения <strong>оценки компетенций</strong>. По итогам аттестации HR-партнёр или руководитель определит пробелы в навыках и сформирует персональные рекомендации.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16, width: '100%', maxWidth: 560 }}>
          {[
            { step: '1', label: 'Пройти аттестацию', icon: 'fact_check', done: false },
            { step: '2', label: 'HR формирует план', icon: 'person', done: false },
            { step: '3', label: 'План доступен', icon: 'check_circle', done: false },
          ].map(s => (
            <div key={s.step} style={{ background: '#f8f9fc', borderRadius: 12, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#9aafbd' }}>{s.icon}</span>
              <div style={{ fontSize: 11, color: '#9aafbd', fontWeight: 700 }}>Шаг {s.step}</div>
              <div style={{ fontSize: 12, color: '#4a6275', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 8, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 20px', fontSize: 13, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, flexShrink: 0 }}>hourglass_empty</span> Ближайшая аттестация запланирована HR-партнёром. Ожидайте уведомления.
        </div>
      </div>
    </div>
  )
}

function CompletedPlanView({ plan, onBack }) {
  const allSkills = prevSkillGroups.flatMap(g => g.skills)
  const achieved = allSkills.filter(s => !s.skipped).length

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '16px 32px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>← Мои планы</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f1923' }}>{plan.title}</h1>
              <span style={{ fontSize: 11, background: '#d1fae5', color: '#059669', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>✓ Завершён</span>
            </div>
            <div style={{ fontSize: 13, color: '#7a8fa0' }}>{plan.dept} · Foreman A → Foreman B · Срок: {plan.deadline}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#059669' }}>{plan.progress}/{plan.total}</div>
            <div style={{ fontSize: 11, color: '#7a8fa0' }}>навыков выполнено</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px' }}>
        {/* Итоговая сводка */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Навыков достигнуто', value: achieved, icon: 'my_location', color: '#059669', bg: '#d1fae5' },
            { label: 'Курсов пройдено', value: prevLearning.length, icon: 'school', color: '#4361ee', bg: '#eff6ff' },
            { label: 'Сертификатов получено', value: prevLearning.filter(l => l.cert).length, icon: 'workspace_premium', color: '#7c3aed', bg: '#ede9fe' },
            { label: 'Часов обучения', value: prevLearning.reduce((s, l) => s + l.hours, 0), icon: 'timer', color: '#d97706', bg: '#fef3c7' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ marginBottom: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: s.color }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#4a6275', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Достижения по навыкам */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f2f8', fontWeight: 700, fontSize: 14, color: '#0f1923' }}>Достигнутые навыки</div>
          {prevSkillGroups.map(group => (
            <div key={group.name}>
              <div style={{ padding: '8px 20px', background: '#f8f9fc', borderBottom: '1px solid #f0f2f8', fontSize: 12, fontWeight: 700, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {group.name}
              </div>
              {group.skills.map(skill => (
                <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: '1px solid #f8f9fc' }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: i <= skill.achieved ? '#059669' : '#e0e6ef' }} />)}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: skill.skipped ? '#9aafbd' : '#1a2b3c' }}>{skill.name}</span>
                  {skill.cert && <span style={{ fontSize: 10, background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><span className="material-symbols-outlined" style={{ fontSize: 12 }}>workspace_premium</span> Сертификат</span>}
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                    background: skill.skipped ? '#f0f2f8' : '#d1fae5',
                    color: skill.skipped ? '#9aafbd' : '#059669'
                  }}>{skill.skipped ? 'Перенесён' : '✓ ' + skill.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Пройденное обучение */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f2f8', fontWeight: 700, fontSize: 14, color: '#0f1923' }}>Пройденное обучение</div>
          {prevLearning.map(l => (
            <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid #f8f9fc' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#059669' }}>check_circle</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0f1923', marginBottom: 2 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: '#7a8fa0', display: 'flex', alignItems: 'center', gap: 3 }}>{l.provider} · {l.date} · <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> {l.hours} ч</div>
              </div>
              {l.cert && <span style={{ fontSize: 10, background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><span className="material-symbols-outlined" style={{ fontSize: 12 }}>workspace_premium</span> Сертификат</span>}
              <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#d1fae5', padding: '2px 10px', borderRadius: 20 }}>Пройдено</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LEARNING_PLAN = [
  {
    category: 'Обязательные курсы',
    items: [
      { title: 'Управление строительным проектом: уровень Foreman C', type: 'Курс', duration: '16 ч', status: 'in-progress', progress: 60, due: '31 Авг 2026', provider: 'BI University' },
      { title: 'Нормативная база строительства РК (обновление 2025)', type: 'Курс', duration: '8 ч', status: 'done', progress: 100, due: '01 Янв 2026', provider: 'BI University' },
      { title: 'Охрана труда и ТБ — переаттестация', type: 'Сертификат', duration: '4 ч', status: 'done', progress: 100, due: '01 Фев 2026', provider: 'Buildex Training Center' },
      { title: 'BIM-технологии: Revit для прорабов', type: 'Курс', duration: '24 ч', status: 'not-started', progress: 0, due: '01 Окт 2026', provider: 'BILIM' },
    ],
  },
  {
    category: 'Рекомендуемые курсы',
    items: [
      { title: 'Lean Construction: инструменты и практика', type: 'Курс', duration: '12 ч', status: 'in-progress', progress: 30, due: '31 Июл 2026', provider: 'Buildex Training Center' },
      { title: 'Управление субподрядчиками и договорная работа', type: 'Курс', duration: '10 ч', status: 'not-started', progress: 0, due: '01 Ноя 2026', provider: 'BI University' },
      { title: 'MS Project: планирование строительных работ', type: 'Курс', duration: '8 ч', status: 'not-started', progress: 0, due: '01 Дек 2026', provider: 'BILIM' },
    ],
  },
  {
    category: 'Сертификаты для повышения',
    items: [
      { title: 'Удостоверение Foreman C — аттестация BI Group', type: 'Сертификат', duration: '—', status: 'not-started', progress: 0, due: '06 Фев 2027', provider: 'BI Group HR', mandatory: true },
      { title: 'Казахский язык — уровень B2', type: 'Сертификат', duration: '—', status: 'done', progress: 100, due: '12 Мар 2025', provider: 'Казтест', mandatory: true },
    ],
  },
]

const STATUS_META = {
  'done':        { label: 'Пройдено',    color: '#059669', bg: '#d1fae5' },
  'in-progress': { label: 'В процессе', color: '#d97706', bg: '#fef3c7' },
  'not-started': { label: 'Не начато',  color: '#7a8fa0', bg: '#f0f2f8' },
}

function LearningPlanTab() {
  const allItems = LEARNING_PLAN.flatMap(g => g.items)
  const done = allItems.filter(i => i.status === 'done').length
  const inProgress = allItems.filter(i => i.status === 'in-progress').length

  return (
    <div>
      {/* Сводка */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Всего материалов', value: allItems.length, color: '#4361ee' },
          { label: 'Пройдено', value: done, color: '#059669' },
          { label: 'В процессе', value: inProgress, color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {LEARNING_PLAN.map(group => (
        <div key={group.category} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1923', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            {group.category}
            <span style={{ fontSize: 11, color: '#9aafbd', fontWeight: 400 }}>{group.items.length} материала</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map(item => {
              const meta = STATUS_META[item.status]
              return (
                <div key={item.title} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Иконка типа */}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: item.type === 'Сертификат' ? '#fef3c7' : '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: item.type === 'Сертификат' ? '#d97706' : '#4361ee' }}>
                    {item.type === 'Сертификат' ? 'workspace_premium' : 'menu_book'}
                  </span>
                  </div>

                  {/* Основная инфо */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>{item.title}</span>
                      {item.mandatory && <span style={{ fontSize: 10, background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: 6, fontWeight: 600, flexShrink: 0 }}>Обязательно</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#7a8fa0' }}>
                      <span>{item.provider}</span>
                      <span>·</span>
                      <span>{item.type}</span>
                      {item.duration !== '—' && <><span>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> {item.duration}</span></>}
                      <span>·</span>
                      <span>Срок: {item.due}</span>
                    </div>
                    {item.status === 'in-progress' && (
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: '#f0f2f8', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.progress}%`, background: '#d97706', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#d97706', fontWeight: 600, flexShrink: 0 }}>{item.progress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Статус + кнопка */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: meta.bg, color: meta.color }}>{meta.label}</span>
                    {item.status !== 'done' && (
                      <button style={{ fontSize: 11, padding: '4px 12px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4361ee', cursor: 'pointer', fontWeight: 500 }}>
                        {item.status === 'in-progress' ? 'Продолжить →' : 'Начать →'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillRow({ skill }) {
  const [deadline, setDeadline] = useState(null)
  const [picking, setPicking] = useState(false)
  const [tempDate, setTempDate] = useState('')

  function confirm() {
    if (tempDate) setDeadline(tempDate)
    setPicking(false)
  }

  function fmt(iso) {
    const [y, m, d] = iso.split('-')
    const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
    return `${d} ${months[+m - 1]} ${y}`
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: '1px solid #f8f9fc', position: 'relative' }}>
      <LevelBar level={skill.level} max={4} />
      <span style={{ flex: 1, fontSize: 13, color: '#1a2b3c' }}>
        {skill.starred && <span style={{ color: '#f59e0b', marginRight: 4 }}>★</span>}
        {skill.badge && <span style={{ marginRight: 6, fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 8 }}>{skill.badge}</span>}
        {skill.name}
      </span>
      {skill.status === 'developed' && (
        <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: 10 }}>✓ Навык освоен</span>
      )}

      {deadline ? (
        <span
          onClick={() => { setTempDate(deadline); setPicking(true) }}
          style={{ fontSize: 12, color: '#4361ee', cursor: 'pointer', whiteSpace: 'nowrap', background: '#f0f4ff', padding: '2px 8px', borderRadius: 8 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span> {fmt(deadline)}
        </span>
      ) : (
        <span
          onClick={() => setPicking(true)}
          style={{ fontSize: 12, color: '#9aafbd', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span> Установить срок
        </span>
      )}

      {picking && (
        <div style={{
          position: 'absolute', right: 20, top: '100%', zIndex: 100,
          background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
          border: '1px solid #e8edf2', padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0f1923' }}>Срок выполнения</div>
          <input
            type="date"
            value={tempDate}
            onChange={e => setTempDate(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPicking(false)} style={{ flex: 1, padding: '5px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }}>Отмена</button>
            <button onClick={confirm} style={{ flex: 1, padding: '5px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Сохранить</button>
          </div>
        </div>
      )}
    </div>
  )
}

function EligibilityTab() {
  const totalSkills = skillGroups.flatMap(g => g.skills).length
  const developedSkills = skillGroups.flatMap(g => g.skills).filter(s => s.status === 'developed').length
  const skillPct = Math.round((developedSkills / totalSkills) * 100)

  const totalLearning = LEARNING_PLAN.flatMap(g => g.items).filter(i => i.type === 'Курс').length
  const doneLearning = LEARNING_PLAN.flatMap(g => g.items).filter(i => i.type === 'Курс' && i.status === 'done').length

  const reqs = [
    { label: 'Стаж в BI Group (мин. 3 года)', value: '4 г 11 мес', ok: true },
    { label: 'Рейтинг профиля (мин. 3.0)', value: '4.1', ok: true },
    { label: 'Подтверждённый уровень казахского', value: 'B2', ok: true },
    { label: 'Производственный вклад (последние 3 мес)', value: 'Да', ok: true },
    { label: 'Навыки по плану подтверждены', value: `${developedSkills} из ${totalSkills} (${skillPct}%)`, ok: skillPct >= 80, hint: 'Требуется не менее 80%' },
    { label: 'Обязательные курсы пройдены', value: `${doneLearning} из ${totalLearning}`, ok: doneLearning >= totalLearning, hint: 'Все обязательные курсы должны быть завершены' },
  ]
  const allOk = reqs.every(r => r.ok)
  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 4 }}>
          Текущий статус готовности к оценке: Foreman C
        </div>
        <div style={{ fontSize: 13, color: '#7a8fa0', marginBottom: 16 }}>BI Development</div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1e40af', marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0, verticalAlign: 'middle' }}>info</span> Показатели готовности к аттестации обновляются автоматически. Синхронизация может занять до 48 часов.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reqs.map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: r.ok ? '#fafafa' : '#fff8f8', border: `1px solid ${r.ok ? '#f0f2f8' : '#fecaca'}` }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: r.ok ? '#059669' : '#ef4444', flexShrink: 0 }}>{r.ok ? 'check_circle' : 'cancel'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#1a2b3c' }}>{r.label}</div>
                {!r.ok && r.hint && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{r.hint}</div>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: r.ok ? '#059669' : '#ef4444', whiteSpace: 'nowrap' }}>{r.value}</span>
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
