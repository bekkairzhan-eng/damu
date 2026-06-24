import { useRef } from 'react'

const LEVELS = [
  { grade: 'A1', title: 'Foreman C' },
  { grade: 'A2', title: 'Foreman B', current: true },
  { grade: 'A3', title: 'Foreman A', target: true },
  { grade: 'B1', title: 'Site Manager' },
]

const GEN_REQS = [
  {
    name: 'Работа с заказчиком',
    icon: 'handshake',
    values: [
      'Участвует в совещаниях по проекту в качестве наблюдателя. Фиксирует замечания и передаёт их руководителю. Прямого взаимодействия с представителями заказчика не ведёт.',
      'Участвует в еженедельных планёрках, готовит краткие отчёты о ходе работ. Отвечает на оперативные запросы заказчика в рамках своего участка. Сложные вопросы эскалирует руководителю.',
      'Самостоятельно представляет интересы участка на встречах с заказчиком. Ведёт переговоры по изменениям объёма и технологии работ. Строит рабочие отношения с ключевыми представителями заказчика.',
      'Ведёт сложные переговоры с заказчиком, управляет ожиданиями и своевременно информирует об отклонениях. Отвечает за удовлетворённость заказчика в целом по объекту. Выстраивает долгосрочные партнёрские отношения.',
    ],
  },
  {
    name: 'Управление командой',
    icon: 'group',
    values: [
      'Работает под непосредственным руководством старшего прораба. Получает задания на день и выполняет их в установленные сроки. Координирует работу 1–2 бригад под контролем.',
      'Самостоятельно управляет бригадами на участке без постоянного контроля. Распределяет задания и ресурсы, отслеживает ежедневный план. При необходимости перераспределяет людей между фронтами работ.',
      'Выступает наставником для Foreman C и B, организует работу нескольких бригад. Делегирует и контролирует, разрешает производственные конфликты внутри команды. Участвует в оценке результатов подчинённых прорабов.',
      'Применяет методы лидерства: наставничество, делегирование, коучинг и урегулирование конфликтов. Формирует культуру исполнительской дисциплины и вовлечённости на объекте. Привлекает и удерживает сильных прорабов.',
    ],
  },
  {
    name: 'Строительные практики',
    icon: 'construction',
    values: [
      'Знает базовые строительные нормы и умеет читать чертежи под руководством. Выполняет работы строго по техническому заданию. Соблюдает технологическую последовательность операций.',
      'Самостоятельно читает и применяет проектную документацию. Выявляет несоответствия в проекте и своевременно сообщает руководству. Предлагает простые технические решения по типовым ситуациям.',
      'Предлагает технические решения на своём участке, контролирует соблюдение нормативов. Может вносить изменения в технологическую последовательность при согласовании с ГИПом. Следит за актуальностью норм и обновлений СНиП.',
      'Принимает ключевые технические решения по объекту в целом. Взаимодействует с проектным институтом и техническим надзором. Отвечает за соответствие строительства рабочей документации и требованиям экспертизы.',
    ],
  },
  {
    name: 'Ответственность и полномочия',
    icon: 'verified',
    values: [
      'Несёт ответственность за качество работ на назначенном участке в рамках смены. Полномочия ограничены: самостоятельно принимает решения только по типовым ситуациям, всё остальное согласует с руководителем.',
      'Отвечает за результат работ на участке в полном объёме: качество, сроки, безопасность. Вправе самостоятельно останавливать работы при выявлении нарушений ТБ или качества и уведомлять руководство.',
      'Несёт ответственность за несколько участков и за работу младших прорабов. Вправе перераспределять людей и технику внутри объекта в согласованных рамках без дополнительного одобрения.',
      'Полная операционная ответственность за объект: сроки, бюджет, качество и безопасность. Уполномочен принимать оперативные решения по всем вопросам объекта, включая остановку работ и замену субподрядчиков.',
    ],
  },
  {
    name: 'Отчётность и документация',
    icon: 'assignment',
    values: [
      'Ведёт ежедневный журнал производства работ, фиксирует отклонения. Заполняет акты скрытых работ под контролем руководителя. Фотофиксация и замеры — ежедневно.',
      'Составляет недельные отчёты о выполнении плана, расходе материалов и трудозатратах. Самостоятельно оформляет исполнительную документацию и акты на выполненные работы.',
      'Формирует сводные отчёты по нескольким участкам для руководства. Контролирует правильность исполнительной документации у подчинённых. Участвует в подготовке промежуточных актов с заказчиком (КС-2/КС-3).',
      'Готовит ежемесячные отчёты для заказчика и руководства компании по всему объекту. Обеспечивает полноту и достоверность сдаточной документации при закрытии этапов и сдаче объекта.',
    ],
  },
  {
    name: 'Опыт и требования',
    icon: 'workspace_premium',
    values: [
      'Минимум 1 год опыта в строительстве. Профильное среднее или высшее образование. Базовые знания нормативов и стройматериалов. Казахский язык — B1.',
      'От 3 лет опыта, включая не менее 1 года в роли Foreman C. Уверенное владение AutoCAD на базовом уровне. Казахский язык — B1+. Опыт ведения исполнительной документации на реальных объектах.',
      'От 5 лет опыта, из них не менее 2 лет в роли Foreman B. Казахский язык — B2. Опыт работы на объектах площадью от 2 000 м². Базовое владение BIM-инструментами (Revit или аналог). Опыт наставничества Foreman C и B.',
      'От 8 лет в строительстве, включая опыт руководства крупным объектом (от 5 000 м²). Высшее профильное образование обязательно. Казахский язык — B2. Опыт взаимодействия с заказчиком и проектными организациями.',
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
  { cat: 'Языки', name: 'Казахский', levels: ['B1', 'B1', 'B2', 'B2'] },
]

const KB_BASE = 'https://kb.bi.group'
const KB_LINKS = {
  'Foreman C': `${KB_BASE}/foreman-c`,
  'Foreman B': `${KB_BASE}/foreman-b`,
  'Foreman A': `${KB_BASE}/foreman-a`,
  'Site Manager': `${KB_BASE}/site-manager`,
}

const LEVEL_COLOR = { 'Базовый': '#e0e6ef', 'Средний': '#4361ee', 'Продвинутый': '#22c55e', 'Эксперт': '#f59e0b', 'B1': '#c4b5fd', 'B2': '#8b5cf6' }
const LEVEL_TEXT = { 'Базовый': '#4a6275', 'Средний': '#fff', 'Продвинутый': '#fff', 'Эксперт': '#fff', 'B1': '#fff', 'B2': '#fff' }

export default function Titles() {
  const genRef = useRef(null)
  const skillsRef = useRef(null)

  const cats = [...new Set(SKILL_REQS.map(s => s.cat))]

  const scrollTo = (ref) => {
    if (!ref.current) return
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset - 72
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Должности</h1>
          <p style={{ fontSize: 14, color: '#7a8fa0' }}>Изучите все должности и карьерные пути в компании</p>
        </div>
        <a href="/career-map" style={{ fontSize: 12, color: '#4361ee', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>alt_route</span>
          Посмотреть в Карьерном треке
        </a>
      </div>

      {/* Все должности — кнопка + поиск */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '12px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #4361ee', background: '#f0f4ff', color: '#4361ee', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>work</span>
          Все должности
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>expand_more</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, border: '1px solid #e8edf2', borderRadius: 8, padding: '7px 12px', background: '#fafafa' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9aafbd' }}>search</span>
          <input
            placeholder="Поиск должности или функции"
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f1923', width: '100%', background: 'transparent' }}
          />
        </div>
      </div>

      {/* Таблица */}
      <div ref={genRef} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Заголовки колонок */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', borderBottom: '2px solid #f0f2f8', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderRadius: '12px 12px 0 0' }}>
          <div style={{ padding: '14px 16px' }} />
          {LEVELS.map((l, i) => (
            <div key={l.title} style={{ padding: '14px 12px', borderLeft: '1px solid #f0f2f8', background: l.current ? '#f0f4ff' : l.target ? '#f0fff4' : 'transparent' }}>
              <div style={{ fontSize: 10, color: '#9aafbd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {l.current ? 'ВЫ ЗДЕСЬ' : l.target ? 'СЛЕДУЮЩАЯ ЦЕЛЬ' : `УРОВЕНЬ ${i + 1}`}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: l.current ? '#4361ee' : l.target ? '#16a34a' : '#0f1923' }}>{l.title}</div>
              <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 2 }}>Грейд {l.grade}</div>
              {KB_LINKS[l.title] && (
                <a href={KB_LINKS[l.title]} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, color: l.current ? '#4361ee' : l.target ? '#16a34a' : '#7a8fa0', textDecoration: 'none', background: l.current ? '#e8edff' : l.target ? '#dcfce7' : '#f0f2f8', padding: '3px 8px', borderRadius: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>menu_book</span> Читать в Базе Знаний
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Навигация-якоря */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 16px', borderBottom: '1px solid #f0f2f8', background: '#f8f9fc' }}>
          <span style={{ fontSize: 12, color: '#9aafbd', alignSelf: 'center', marginRight: 4 }}>Перейти к разделу:</span>
          <button onClick={() => scrollTo(genRef)} style={anchorBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>checklist</span>
            Общие требования
          </button>
          <button onClick={() => scrollTo(skillsRef)} style={anchorBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>psychology</span>
            Требования к навыкам ↓
          </button>
        </div>

        {/* ── Секция 1: Общие требования ── */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', background: '#f8f9fc', borderBottom: '1px solid #f0f2f8' }}>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: '#0f1923', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#7a8fa0' }}>checklist</span>
              Общие требования
            </div>
            {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
          </div>

          {GEN_REQS.map(req => (
            <div key={req.name} style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', borderBottom: '1px solid #f0f2f8' }}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9aafbd', marginTop: 1, flexShrink: 0 }}>{req.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', lineHeight: 1.4 }}>{req.name}</span>
              </div>
              {req.values.map((v, i) => (
                <div key={i} style={{ padding: '16px 14px', borderLeft: '1px solid #f0f2f8', fontSize: 12, color: '#4a6275', lineHeight: 1.65, background: LEVELS[i].current ? '#fafbff' : LEVELS[i].target ? '#f9fff9' : 'transparent' }}>
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Секция 2: Требования к навыкам ── */}
        <div ref={skillsRef}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', background: '#f8f9fc', borderBottom: '1px solid #f0f2f8', borderTop: '2px solid #e8edf2' }}>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: '#0f1923', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#7a8fa0' }}>psychology</span>
              Требования к навыкам
            </div>
            {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
          </div>

          {cats.map(cat => {
            const catSkills = SKILL_REQS.filter(s => s.cat === cat)
            return (
              <div key={cat}>
                <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', background: '#fafbfc', borderBottom: '1px solid #f0f2f8' }}>
                  <div style={{ padding: '8px 16px', fontWeight: 600, fontSize: 11, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat}</div>
                  {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
                </div>
                {catSkills.map(skill => (
                  <div key={skill.name} style={{ display: 'grid', gridTemplateColumns: '220px repeat(4, 1fr)', borderBottom: '1px solid #f0f2f8' }}>
                    <div style={{ padding: '10px 16px', fontSize: 13, color: '#1a2b3c', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {skill.mandatory && <span title="Обязательный" style={{ color: '#f59e0b', fontSize: 12 }}>★</span>}
                      {skill.name}
                    </div>
                    {skill.levels.map((lvl, i) => (
                      <div key={i} style={{ padding: '10px 12px', borderLeft: '1px solid #f0f2f8', display: 'flex', alignItems: 'center', background: LEVELS[i].current ? '#fafbff' : LEVELS[i].target ? '#f9fff9' : 'transparent' }}>
                        {lvl
                          ? <span style={{ padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: LEVEL_COLOR[lvl], color: LEVEL_TEXT[lvl] }}>{lvl}</span>
                          : <span style={{ color: '#e0e6ef', fontSize: 16 }}>—</span>
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

const anchorBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 400,
  border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275',
  cursor: 'pointer',
}
