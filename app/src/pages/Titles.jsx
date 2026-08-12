import { useRef } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CATEGORIES, categoryOf } from '../data/skillsCatalog'
import { INITIAL_POSITIONS, INITIAL_REQ_CATEGORIES } from '../data/positionsCatalog'

// Какие должности показываем в сравнительной таблице и как помечаем текущую/цель.
// Грейд и «Общие требования» берём из каталога должностей (см. positionsCatalog.js),
// а не хардкодим здесь — раньше грейды тут расходились с админкой.
const SHOWN_POSITIONS = ['Foreman C', 'Foreman B', 'Foreman A', 'Site Manager']
const CURRENT_POSITION = 'Foreman B'
const TARGET_POSITION = 'Foreman A'


// Категория каждого навыка выводится из общего каталога (skillsCatalog.js) —
// здесь только требуемый уровень по грейдам (Foreman C/B/A, Site Manager).
const SKILL_REQS = [
  { name: 'Управление строительной площадкой', levels: ['Базовый', 'Средний', 'Продвинутый', 'Эксперт'], mandatory: true },
  { name: 'Контроль качества строительства', levels: ['Базовый', 'Средний', 'Продвинутый', 'Продвинутый'], mandatory: true },
  { name: 'Нормативная база строительства', levels: ['Базовый', 'Средний', 'Средний', 'Продвинутый'], mandatory: true },
  { name: 'Охрана труда и ТБ', levels: ['Средний', 'Средний', 'Продвинутый', 'Эксперт'], mandatory: true },
  { name: 'BIM-технологии (Revit)', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { name: 'AutoCAD', levels: ['Базовый', 'Базовый', 'Средний', 'Продвинутый'] },
  { name: 'MS Project', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { name: 'Lean Construction', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { name: 'Управление субподрядчиками', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { name: 'Финансовый контроль проекта', levels: [null, 'Базовый', 'Средний', 'Продвинутый'] },
  { name: 'Управление командой', levels: ['Базовый', 'Базовый', 'Средний', 'Средний'] },
  { name: 'Казахский', levels: ['B1', 'B1', 'B2', 'B2'] },
]

const LEVEL_COLOR = { 'Базовый': '#e0e6ef', 'Средний': '#4361ee', 'Продвинутый': '#22c55e', 'Эксперт': '#f59e0b', 'B1': '#c4b5fd', 'B2': '#8b5cf6' }
const LEVEL_TEXT = { 'Базовый': '#4a6275', 'Средний': '#fff', 'Продвинутый': '#fff', 'Эксперт': '#fff', 'B1': '#fff', 'B2': '#fff' }

export default function Titles() {
  const genRef = useRef(null)
  const skillsRef = useRef(null)
  const { isMobile } = useBreakpoint()
  const [positions] = useLocalStorage('admin:positions', INITIAL_POSITIONS)
  const [reqCategories] = useLocalStorage('admin:req-categories', INITIAL_REQ_CATEGORIES)

  // Грейд, тексты «Общих требований» и ссылка на Базу знаний приходят из
  // каталога должностей — их заводит админ в /admin/positions/:id.
  const LEVELS = SHOWN_POSITIONS
    .map(name => positions.find(p => p.name === name))
    .filter(Boolean)
    .map(p => ({
      title: p.name,
      grade: p.grade,
      kbUrl: p.kbUrl,
      generalReqs: p.generalReqs || {},
      current: p.name === CURRENT_POSITION,
      target: p.name === TARGET_POSITION,
    }))

  const cats = CATEGORIES.filter(cat => SKILL_REQS.some(s => categoryOf(s.name) === cat))
  const gridCols = `220px repeat(${LEVELS.length}, 1fr)`

  const scrollTo = (ref) => {
    if (!ref.current) return
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset - 72
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div style={{ padding: isMobile ? '16px 12px' : '24px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 16 : 24 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Должности</h1>
          {!isMobile && <p style={{ fontSize: 14, color: '#7a8fa0' }}>Изучите все должности и карьерные пути в компании</p>}
        </div>
        {!isMobile && (
          <a href="/career-map" style={{ fontSize: 12, color: '#4361ee', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>alt_route</span>
            Посмотреть в Карьерном треке
          </a>
        )}
      </div>

      {/* Все должности — кнопка + поиск */}
      <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? '10px 12px' : '12px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
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
      <div style={{ overflowX: 'auto', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div ref={genRef} style={{ background: '#fff', borderRadius: 12, minWidth: isMobile ? 700 : 'auto' }}>

        {/* Заголовки колонок */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '2px solid #f0f2f8', position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderRadius: '12px 12px 0 0' }}>
          <div style={{ padding: '14px 16px' }} />
          {LEVELS.map((l, i) => (
            <div key={l.title} style={{ padding: '14px 12px', borderLeft: '1px solid #f0f2f8', background: l.current ? '#f0f4ff' : l.target ? '#f0fff4' : 'transparent' }}>
              <div style={{ fontSize: 10, color: '#9aafbd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {l.current ? 'ВЫ ЗДЕСЬ' : l.target ? 'СЛЕДУЮЩАЯ ЦЕЛЬ' : `УРОВЕНЬ ${i + 1}`}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: l.current ? '#4361ee' : l.target ? '#16a34a' : '#0f1923' }}>{l.title}</div>
              <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 2 }}>Грейд {l.grade}</div>
              {l.kbUrl && (
                <a href={l.kbUrl} target="_blank" rel="noreferrer"
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
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, background: '#f8f9fc', borderBottom: '1px solid #f0f2f8' }}>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: '#0f1923', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#7a8fa0' }}>checklist</span>
              Общие требования
            </div>
            {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
          </div>

          {reqCategories.map(cat => (
            <div key={cat.id} style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1px solid #f0f2f8' }}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9aafbd', marginTop: 1, flexShrink: 0 }}>{cat.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', lineHeight: 1.4 }}>{cat.name}</span>
              </div>
              {LEVELS.map((l, i) => {
                const text = l.generalReqs[cat.id]
                return (
                  <div key={i} style={{ padding: '16px 14px', borderLeft: '1px solid #f0f2f8', fontSize: 12, color: text ? '#4a6275' : '#c3cedb', lineHeight: 1.65, background: l.current ? '#fafbff' : l.target ? '#f9fff9' : 'transparent' }}>
                    {text || 'Не заполнено'}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* ── Секция 2: Требования к навыкам ── */}
        <div ref={skillsRef}>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, background: '#f8f9fc', borderBottom: '1px solid #f0f2f8', borderTop: '2px solid #e8edf2' }}>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 13, color: '#0f1923', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#7a8fa0' }}>psychology</span>
              Требования к навыкам
            </div>
            {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
          </div>

          {cats.map(cat => {
            const catSkills = SKILL_REQS.filter(s => categoryOf(s.name) === cat)
            return (
              <div key={cat}>
                <div style={{ display: 'grid', gridTemplateColumns: gridCols, background: '#fafbfc', borderBottom: '1px solid #f0f2f8' }}>
                  <div style={{ padding: '8px 16px', fontWeight: 600, fontSize: 11, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat}</div>
                  {LEVELS.map((_, i) => <div key={i} style={{ borderLeft: '1px solid #f0f2f8' }} />)}
                </div>
                {catSkills.map(skill => (
                  <div key={skill.name} style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1px solid #f0f2f8' }}>
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
    </div>
  )
}

const anchorBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 400,
  border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275',
  cursor: 'pointer',
}
