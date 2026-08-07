import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSkillFavorite } from '../../hooks/useSkillFavorite'

const FILTERS = ['Все', 'Избранные', 'Подтверждённые', 'Целевые']

export default function MySkills() {
  const navigate = useNavigate()
  const { baseCats: cats, setBaseCats: setCats, custom, setCustom, toggleFavorite, isRemovable, removeFromPlan } = useSkillFavorite()

  function openInCatalog(name, category) {
    navigate('/skills', { state: { openSkill: { name, category } } })
  }
  const [customOpen, setCustomOpen] = useState({})
  const [activeFilter, setActiveFilter] = useState('Все')
  const [showLegend, setShowLegend] = useState(true)

  function toggle(i) {
    setCats(prev => prev.map((c, idx) => idx === i ? { ...c, open: !c.open } : c))
  }

  function toggleCustomCat(name) {
    setCustomOpen(prev => ({ ...prev, [name]: !(prev[name] ?? true) }))
  }

  // Навыки, добавленные "в план" из каталога /skills — не обязательно относятся
  // к карьерному треку. Пока уровень не выставлен (level === null), их можно
  // исключить обратно; как только уровень выставлен — исключить уже нельзя.
  //
  // Уровни 1-3 сотрудник не выставляет сам — они приходят автоматически из
  // BILIM (1-2) и TestLab (3). Единственное ручное действие — запрос
  // подтверждения уровня 4 (Эксперт) у руководителя/эксперта через BPM,
  // доступный только когда уровень 3 уже подтверждён.
  function requestExpertCustom(name) {
    setCustom(prev => prev.map(s => s.name === name ? { ...s, expertPending: true } : s))
  }

  const customGroups = custom.reduce((acc, s) => {
    (acc[s.category] ||= []).push(s)
    return acc
  }, {})

  function requestExpert(catName, skillName) {
    setCats(prev => prev.map(c =>
      c.name !== catName ? c : {
        ...c,
        skills: c.skills.map(s => s.name !== skillName ? s : { ...s, expertPending: true })
      }
    ))
  }

  function filterSkills(skills) {
    if (activeFilter === 'Избранные') return skills.filter(s => s.starred)
    if (activeFilter === 'Подтверждённые') return skills.filter(s => s.confirmed)
    if (activeFilter === 'Целевые') return skills.filter(s => s.target)
    return skills
  }

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowLegend(v => !v)} style={showLegend ? btnPrimary : btnOutline}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>info</span>
              Легенда уровней
            </span>
          </button>
        </div>
        <button style={btnPrimary}>+ Добавить навык</button>
      </div>

      {showLegend && <LegendInline onClose={() => setShowLegend(false)} />}

      <div style={{ background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#3730a3' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#059669' }}>check_circle</span>
        <span>Ваш профиль навыков актуален. Актуальный профиль помогает получать релевантный контент.</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: '5px 14px', borderRadius: 20,
            border: activeFilter === f ? '1px solid #4361ee' : '1px solid #e0e6ef',
            background: activeFilter === f ? '#4361ee' : '#fff',
            color: activeFilter === f ? '#fff' : '#4a6275',
            fontSize: 12, cursor: 'pointer', fontWeight: activeFilter === f ? 600 : 400,
            transition: 'all 0.15s',
          }}>{f}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={btnOutline}>Только пробелы в навыках</button>
        <button style={btnOutline}>Автообновление навыков</button>
        <button style={btnOutline}>Выбрать</button>
      </div>

      {cats.map((cat, i) => {
        const visible = filterSkills(cat.skills)
        if (visible.length === 0) return null
        return (
          <div key={cat.name} style={{ marginBottom: 12 }}>
            <button onClick={() => toggle(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', border: '1px solid #e8edf2', borderRadius: cat.open ? '10px 10px 0 0' : 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#0f1923' }}>
              <span style={{ transform: cat.open ? 'rotate(180deg)' : 'none', transition: '0.2s', fontSize: 16 }}>▾</span>
              {cat.name}
              <span style={{ marginLeft: 'auto', fontSize: 12, color: '#7a8fa0', fontWeight: 400 }}>{visible.length} навыков</span>
            </button>

            {cat.open && (
              <div style={{ border: '1px solid #e8edf2', borderTop: 'none', borderRadius: '0 0 10px 10px', background: '#fff', overflow: 'hidden' }}>
                {visible.map(s => (
                  <SkillRow key={s.name} skill={s}
                    isLanguage={cat.isLanguage}
                    onStar={() => toggleFavorite(s.name, cat.name)}
                    onRequestExpert={() => requestExpert(cat.name, s.name)}
                    onInfo={() => openInCatalog(s.name, cat.name)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {Object.entries(customGroups).map(([catName, skills]) => {
        const visible = filterSkills(skills)
        if (visible.length === 0) return null
        const open = customOpen[catName] ?? true
        return (
          <div key={`custom-${catName}`} style={{ marginBottom: 12 }}>
            <button onClick={() => toggleCustomCat(catName)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fff', border: '1px solid #e8edf2', borderRadius: open ? '10px 10px 0 0' : 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#0f1923' }}>
              <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s', fontSize: 16 }}>▾</span>
              {catName}
              <span style={{ fontSize: 10, fontWeight: 700, color: '#4361ee', background: '#eff6ff', padding: '2px 8px', borderRadius: 10 }}>Добавлено вами</span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: '#7a8fa0', fontWeight: 400 }}>{visible.length} навыков</span>
            </button>

            {open && (
              <div style={{ border: '1px solid #e8edf2', borderTop: 'none', borderRadius: '0 0 10px 10px', background: '#fff', overflow: 'hidden' }}>
                {visible.map(s => (
                  <SkillRow key={s.name} skill={s}
                    isLanguage={false}
                    onStar={() => toggleFavorite(s.name, catName)}
                    onRequestExpert={() => requestExpertCustom(s.name)}
                    onExclude={isRemovable(s.name) ? () => removeFromPlan(s.name) : undefined}
                    onInfo={() => openInCatalog(s.name, catName)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {cats.every(c => filterSkills(c.skills).length === 0) &&
       Object.values(customGroups).every(skills => filterSkills(skills).length === 0) && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9aafbd' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>search_off</span>
          <div style={{ fontSize: 14 }}>Нет навыков по выбранному фильтру</div>
        </div>
      )}
    </div>
  )
}

const LEVEL_LABELS = ['', 'Начальный', 'Средний', 'Продвинутый', 'Эксперт']

function SkillRow({ skill, isLanguage, onStar, onRequestExpert, onExclude, onInfo }) {
  const canRequestExpert = skill.level === 3 && !skill.expertPending

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid #f8f9fc' }}>
      <span
        onClick={onStar}
        className="material-symbols-outlined"
        style={{ fontSize: 16, cursor: 'pointer', color: skill.starred ? '#f59e0b' : '#cdd5e0', fontVariationSettings: skill.starred ? "'FILL' 1" : "'FILL' 0", flexShrink: 0 }}
      >
        star
      </span>
      {skill.native
        ? <span style={{ fontSize: 10, fontWeight: 700, background: '#d1fae5', color: '#059669', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>Родной</span>
        : isLanguage
          ? <CefrBadge value={skill.cefr} confirmed={skill.confirmed} />
          : <LevelBar level={skill.level} />
      }
      <span style={{ flex: 1, fontSize: 13, color: '#1a2b3c' }}>{skill.name}</span>
      {!skill.level && skill.custom && <span style={{ fontSize: 11, color: '#9aafbd' }}>Уровень не выставлен — ждём данные от BILIM</span>}
      {skill.confirmed && <span title="Подтверждён" className="material-symbols-outlined" style={{ fontSize: 14, color: '#059669' }}>verified</span>}
      {skill.selfDeclared && !skill.expertPending && <span title="Ожидает подтверждения (BILIM/TestLab)" className="material-symbols-outlined" style={{ fontSize: 14, color: '#f59e0b' }}>hourglass_empty</span>}
      {skill.target && <span title="Целевой навык" className="material-symbols-outlined" style={{ fontSize: 14, color: '#4361ee' }}>flag</span>}
      {canRequestExpert && (
        <button
          onClick={onRequestExpert}
          style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid #4361ee', background: '#fff', color: '#4361ee', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Запросить эксперта →
        </button>
      )}
      {skill.expertPending && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6, background: '#fff7ed', color: '#ea580c', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>hourglass_empty</span>
          Ожидает эксперта
        </span>
      )}
      {onExclude ? (
        <span
          onClick={onExclude}
          title="Исключить из моих навыков (доступно, пока уровень не выставлен)"
          className="material-symbols-outlined"
          style={{ fontSize: 16, color: '#ef4444', cursor: 'pointer' }}
        >
          close
        </span>
      ) : (
        <span
          onClick={onInfo}
          title="Открыть навык в каталоге"
          className="material-symbols-outlined"
          style={{ color: '#cdd5e0', fontSize: 16, cursor: 'pointer' }}
        >
          info
        </span>
      )}
    </div>
  )
}

function CefrBadge({ value, confirmed }) {
  // Уровень CEFR больше не редактируется сотрудником напрямую — подтверждается
  // через BILIM/TestLab так же, как и числовые уровни навыков (см. LevelBar).
  return (
    <span
      title={confirmed ? 'Подтверждено' : 'Ожидает подтверждения'}
      style={{
        display: 'inline-block', fontSize: 11, fontWeight: 700,
        background: confirmed ? '#059669' : '#e0e6ef',
        color: confirmed ? '#fff' : '#4a6275',
        padding: '3px 8px', borderRadius: 6,
        whiteSpace: 'nowrap', minWidth: 32, textAlign: 'center', flexShrink: 0,
      }}
    >
      {value ?? '—'}
    </span>
  )
}

function LevelBar({ level }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', position: 'relative' }}>
      {[1,2,3,4].map(i => (
        <div
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          title={LEVEL_LABELS[i]}
          style={{
            width: 12, height: 12, borderRadius: 3,
            background: i <= (level ?? 0) ? '#059669' : '#e0e6ef',
          }}
        />
      ))}
      {hovered && (
        <div style={{
          position: 'absolute', left: 0, bottom: '100%', marginBottom: 6, zIndex: 50,
          background: '#1a2b3c', color: '#fff', fontSize: 11, fontWeight: 500,
          padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          {LEVEL_LABELS[hovered]}
        </div>
      )}
    </div>
  )
}

function LegendInline({ onClose }) {
  const icons = [
    { icon: 'star',            color: '#f59e0b', fill: true,  label: 'Навык добавлен в избранное' },
    { icon: 'flag',             color: '#4361ee', fill: false, label: 'Целевой навык из карьерного плана' },
    { icon: 'verified',        color: '#059669', fill: false, label: 'Подтверждён — BILIM, TestLab или эксперт' },
    { icon: 'hourglass_empty', color: '#f59e0b', fill: false, label: 'Ожидает подтверждения (BILIM/TestLab) — сам сотрудник уровень не выставляет' },
  ]

  const levels = [
    { bars: 1, label: 'Начальный',    desc: 'Знакомы с документацией и основами, практического опыта мало' },
    { bars: 2, label: 'Средний',      desc: 'Есть практический опыт, иногда нужна документация' },
    { bars: 3, label: 'Продвинутый',  desc: 'Уверенный практик, хорошо знаете технологию' },
    { bars: 4, label: 'Эксперт',      desc: 'Глубокие знания и опыт, можете обучать других' },
  ]

  return (
    <div style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: 12, padding: '16px 20px', marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f1923' }}>Как читать профиль навыков</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9aafbd', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Иконки */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Иконки</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {icons.map((ic, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: ic.color, fontVariationSettings: ic.fill ? "'FILL' 1" : "'FILL' 0", flexShrink: 0, width: 20, textAlign: 'center' }}>{ic.icon}</span>
                <span style={{ fontSize: 12, color: '#4a6275' }}>{ic.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Уровни */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Уровни владения</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {levels.map(l => (
              <div key={l.bars} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: i <= l.bars ? '#059669' : '#e0e6ef' }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f1923', minWidth: 96 }}>{l.label}</span>
                <span style={{ fontSize: 11, color: '#7a8fa0' }}>{l.desc}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 5, flexShrink: 0 }}>B2</span>
              <span style={{ fontSize: 11, color: '#7a8fa0' }}>Языки — по шкале CEFR: A1 → A2 → B1 → B2 → C1 → C2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const btnPrimary = { padding: '6px 14px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }
const btnOutline = { padding: '6px 14px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
