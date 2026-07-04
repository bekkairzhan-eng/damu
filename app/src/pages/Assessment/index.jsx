import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const MOCK_HISTORY = [
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

export default function Assessment() {
  const { isMobile } = useBreakpoint()
  const [assessmentReq] = useLocalStorage('assessment:request', null)
  const [history] = useLocalStorage('assessment:history', MOCK_HISTORY)
  const [expanded, setExpanded] = useState(null)

  const allItems = [
    ...(assessmentReq ? [{ id: 'pending', requestedAt: assessmentReq.sentAt || 'Сегодня', status: 'pending', hrName: assessmentReq.hrName }] : []),
    ...history,
  ]

  return (
    <div style={{ padding: isMobile ? 16 : '28px 32px', maxWidth: 800 }}>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Аттестация</h1>
      <p style={{ color: '#7a8fa0', fontSize: 14, marginBottom: 28 }}>История всех ваших аттестаций и их результатов</p>

      {allItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#7a8fa0' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>fact_check</span>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Аттестаций пока нет</div>
          <div style={{ fontSize: 13 }}>Запросите аттестацию через раздел «Моё развитие»</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {allItems.map((item, idx) => {
          const isPending = item.status === 'pending'
          const isOpen = expanded === item.id
          const passedCount = item.skills?.filter(s => s.passed).length ?? 0
          const totalCount = item.skills?.length ?? 0
          const failedSkills = item.skills?.filter(s => !s.passed) ?? []

          return (
            <div key={item.id} style={{ background: '#fff', border: `1px solid ${isPending ? '#fde68a' : '#e8edf2'}`, borderRadius: 12, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: !isPending ? 'pointer' : 'default' }} onClick={() => !isPending && setExpanded(isOpen ? null : item.id)}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isPending ? '#fef3c7' : passedCount === totalCount ? '#f0fdf4' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: isPending ? '#d97706' : passedCount === totalCount ? '#16a34a' : '#ea580c' }}>
                    {isPending ? 'hourglass_empty' : passedCount === totalCount ? 'verified' : 'fact_check'}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0f1923' }}>
                      {idx === 0 && !isPending ? 'Последняя аттестация' : `Аттестация ${allItems.length - idx}`}
                    </span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: isPending ? '#fef3c7' : '#f0f2f5', color: isPending ? '#d97706' : '#7a8fa0' }}>
                      {isPending ? `Ожидает: ${item.hrName}` : item.completedAt}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#7a8fa0', marginTop: 2 }}>
                    {isPending ? `Подано ${item.requestedAt}` : `Подано ${item.requestedAt} · HR: ${item.hrName}`}
                  </div>
                </div>
                {!isPending && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: passedCount === totalCount ? '#16a34a' : '#ea580c' }}>{passedCount}/{totalCount}</div>
                      <div style={{ fontSize: 11, color: '#7a8fa0' }}>прошёл</div>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#7a8fa0', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                  </div>
                )}
              </div>

              {/* Expanded details */}
              {isOpen && item.skills && (
                <div style={{ borderTop: '1px solid #f0f2f5' }}>
                  {item.hrComment && (
                    <div style={{ padding: '14px 24px', background: '#f8fafc', borderBottom: '1px solid #f0f2f5', fontSize: 13, color: '#0f1923' }}>
                      <span style={{ fontWeight: 600, color: '#7a8fa0', marginRight: 6 }}>Комментарий HR:</span>
                      {item.hrComment}
                    </div>
                  )}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Навык', 'Результат', 'Комментарий HR'].map(h => (
                          <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.skills.map((skill, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #f0f2f5', background: !skill.passed ? '#fffbf5' : '#fff' }}>
                          <td style={{ padding: '12px 24px', fontSize: 14, color: '#0f1923' }}>{skill.name}</td>
                          <td style={{ padding: '12px 24px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: skill.passed ? '#f0fdf4' : '#fff7ed', color: skill.passed ? '#16a34a' : '#ea580c' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{skill.passed ? 'check' : 'close'}</span>
                              {skill.passed ? 'Пройден' : 'Не пройден'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 24px', fontSize: 13, color: '#7a8fa0', lineHeight: 1.4 }}>
                            {skill.comment || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
