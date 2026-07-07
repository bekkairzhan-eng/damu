import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const SKILLS_BY_TARGET = {
  'Foreman A': [
    'Чтение строительных чертежей', 'Контроль качества СМР', 'Работа с госдокументацией',
    'Нормативно-техническая документация', 'BIM-технологии', 'Управление командой',
    'Управление субподрядчиками', 'Охрана труда (ОТиТБ)',
  ],
  'Foreman B': [
    'Чтение строительных чертежей', 'Контроль качества СМР',
    'Управление командой', 'Охрана труда (ОТиТБ)', 'Управление строительными рисками',
  ],
  'Site Engineer A': [
    'BIM-технологии', 'Нормативно-техническая документация', 'Цифровые инструменты управления',
    'MS Project / Primavera', 'Управление командой', 'Охрана труда (ОТиТБ)',
  ],
}

const DEFAULT_SKILLS = [
  'Чтение строительных чертежей', 'Контроль качества СМР', 'Управление командой', 'Охрана труда (ОТиТБ)',
]

const CURRENT_HR_NAME = 'Айгерим Сейткалиева'

// Тот же дефолт, что и в Assessment/index.jsx и MyPlans/index.jsx — чтобы первая запись
// из этой формы не затёрла демо-историю, если это первое обращение к ключу в сессии
const DEFAULT_ASSESSMENT_HISTORY = [
  {
    id: 2,
    requestedAt: '12 Мар 2025',
    completedAt: '19 Мар 2025',
    status: 'completed',
    hrName: 'Айгерим Сейткалиева',
    hrComment: 'В целом хороший прогресс. Рекомендую сосредоточиться на технических навыках и управлении субподрядчиками.',
    skills: [
      { name: 'Чтение строительных чертежей',    passed: true,  comment: '' },
      { name: 'Контроль качества СМР',            passed: true,  comment: '' },
      { name: 'Работа с госдокументацией',        passed: true,  comment: '' },
      { name: 'BIM-технологии',                   passed: false, comment: 'Необходимо пройти курс Revit Advanced. Текущий уровень недостаточен для перехода на Foreman A.' },
      { name: 'Управление командой',              passed: true,  comment: 'Хорошо справляется с командой до 10 человек.' },
      { name: 'Управление субподрядчиками',       passed: false, comment: 'Нужно больше практики в переговорах. Рекомендую взять 1–2 самостоятельных контракта.' },
      { name: 'Охрана труда (ОТиТБ)',             passed: true,  comment: '' },
      { name: 'Нормативно-техническая документация', passed: false, comment: 'Обновить знания по СНиП 2025. Пройти курс "Актуальные нормативы в строительстве".' },
    ],
  },
  {
    id: 1,
    requestedAt: '5 Сен 2024',
    completedAt: '14 Сен 2024',
    status: 'completed',
    hrName: 'Айгерим Сейткалиева',
    hrComment: 'Хорошая база, но требуется проработка управленческих компетенций.',
    skills: [
      { name: 'Чтение строительных чертежей',    passed: true,  comment: '' },
      { name: 'Контроль качества СМР',            passed: false, comment: 'Нет системного подхода. Рекомендую курс по контролю качества ПИР.' },
      { name: 'Управление командой',              passed: false, comment: 'Не хватает навыков мотивации команды. Пройти тренинг по лидерству.' },
      { name: 'Охрана труда (ОТиТБ)',             passed: true,  comment: '' },
      { name: 'BIM-технологии',                   passed: false, comment: 'Базовый уровень недостаточен. Требуется Revit Intermediate.' },
    ],
  },
]

function formatToday() {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const now = new Date()
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

export default function AssessmentEntry() {
  const { state: employee } = useLocation()
  const navigate = useNavigate()
  const [, setCompleted] = useLocalStorage('hr:completed', [])
  const [, setPending] = useLocalStorage('hr:pending', [])
  const [, setHistory] = useLocalStorage('assessment:history', DEFAULT_ASSESSMENT_HISTORY)
  const [, setAssessmentReq] = useLocalStorage('assessment:request', null)

  const skills = SKILLS_BY_TARGET[employee?.target] ?? DEFAULT_SKILLS
  const [results, setResults] = useState(() =>
    Object.fromEntries(skills.map(s => [s, { passed: true, comment: '' }]))
  )
  const [generalComment, setGeneralComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!employee) {
    navigate('/hr')
    return null
  }

  function togglePassed(skill) {
    setResults(r => ({ ...r, [skill]: { ...r[skill], passed: !r[skill].passed } }))
  }
  function setComment(skill, val) {
    setResults(r => ({ ...r, [skill]: { ...r[skill], comment: val } }))
  }

  function handleSubmit() {
    const passedCount = Object.values(results).filter(r => r.passed).length
    const skillList = skills.map(s => ({ name: s, passed: results[s].passed, comment: results[s].comment }))
    const today = formatToday()

    // Move from pending to completed (для дашборда HR)
    setPending(prev => (prev ?? []).filter(p => p.id !== employee.id))
    setCompleted(prev => [...(prev ?? []), {
      id: employee.id, name: employee.name, position: employee.position,
      target: employee.target, cluster: employee.cluster, dept: employee.dept,
      completedAt: today, passed: passedCount, total: skills.length,
    }])

    // Полная запись с комментариями — то, что увидит сотрудник в «Моём развитии»
    setHistory(prev => [{
      id: Date.now(),
      requestedAt: employee.submittedAt,
      completedAt: today,
      status: 'completed',
      hrName: CURRENT_HR_NAME,
      hrComment: generalComment,
      skills: skillList,
    }, ...(prev ?? [])])
    setAssessmentReq(null)

    setSubmitted(true)
  }

  const passedCount = Object.values(results).filter(r => r.passed).length

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', gap: 16 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#0f766e' }}>check_circle</span>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0f1923' }}>Оценка завершена</div>
        <div style={{ fontSize: 14, color: '#7a8fa0' }}>{employee.name} · {passedCount}/{skills.length} навыков пройдено</div>
        <button onClick={() => navigate('/hr')} style={{ marginTop: 16, padding: '10px 28px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Вернуться к списку
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Back */}
      <button onClick={() => navigate('/hr')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#7a8fa0', fontSize: 13, marginBottom: 20, padding: 0 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
        Назад к списку
      </button>

      {/* Employee card */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0f766e18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#0f766e' }}>person</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923' }}>{employee.name}</div>
            <div style={{ fontSize: 13, color: '#7a8fa0' }}>{employee.position} → <b style={{ color: '#0f1923' }}>{employee.target}</b> · {employee.cluster} · {employee.dept}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: '#7a8fa0' }}>Подано: {employee.submittedAt}</div>
        </div>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f1923', margin: '0 0 16px' }}>Оценка по навыкам</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {skills.map(skill => {
          const res = results[skill]
          return (
            <div key={skill} style={{ background: '#fff', border: `1px solid ${!res.passed ? '#fed7aa' : '#e8edf2'}`, borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: res.passed ? 0 : 12 }}>
                <div style={{ flex: 1, fontWeight: 500, fontSize: 14, color: '#0f1923' }}>{skill}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => !res.passed && togglePassed(skill)} style={{ padding: '5px 14px', borderRadius: 7, border: '2px solid', borderColor: res.passed ? '#16a34a' : '#e8edf2', background: res.passed ? '#f0fdf4' : '#fff', color: res.passed ? '#16a34a' : '#94a3b8', fontSize: 13, fontWeight: res.passed ? 700 : 400, cursor: 'pointer' }}>
                    ✓ Пройден
                  </button>
                  <button onClick={() => res.passed && togglePassed(skill)} style={{ padding: '5px 14px', borderRadius: 7, border: '2px solid', borderColor: !res.passed ? '#ea580c' : '#e8edf2', background: !res.passed ? '#fff7ed' : '#fff', color: !res.passed ? '#ea580c' : '#94a3b8', fontSize: 13, fontWeight: !res.passed ? 700 : 400, cursor: 'pointer' }}>
                    ✗ Не пройден
                  </button>
                </div>
              </div>
              {!res.passed && (
                <textarea
                  value={res.comment}
                  onChange={e => setComment(skill, e.target.value)}
                  placeholder="Что нужно подтянуть..."
                  rows={2}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #fed7aa', borderRadius: 8, fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: '#0f1923' }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* General comment */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '20px 24px', marginBottom: 24 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#0f1923' }}>
          Общий комментарий HR
          <textarea
            value={generalComment}
            onChange={e => setGeneralComment(e.target.value)}
            placeholder="Общее впечатление и рекомендации..."
            rows={3}
            style={{ display: 'block', width: '100%', marginTop: 8, padding: '10px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
        </label>
      </div>

      {/* Summary + submit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '16px 24px' }}>
        <div style={{ fontSize: 14, color: '#0f1923' }}>
          Итого: <b style={{ color: '#16a34a' }}>{passedCount} пройдено</b> · <b style={{ color: '#ea580c' }}>{skills.length - passedCount} не пройдено</b> из {skills.length}
        </div>
        <button onClick={handleSubmit} style={{ padding: '10px 28px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Завершить оценку
        </button>
      </div>
    </div>
  )
}
