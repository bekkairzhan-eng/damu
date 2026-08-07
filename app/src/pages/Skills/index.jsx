import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SkillDetail from './SkillDetail'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useSkillFavorite } from '../../hooks/useSkillFavorite'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CATEGORIES as CATEGORY_ORDER, INITIAL_SKILLS } from '../../data/skillsCatalog'

const POPULARITY = {
  'BIM-технологии (Revit)': 312,
  'Lean Construction': 245,
  'Управление командой': 230,
  'Охрана труда и ТБ': 210,
  'Контроль качества строительства': 189,
}

// Избранное здесь не показываем — это дело "Мои навыки" (фильтр по своим
// навыкам). Здесь позже появятся другие фильтры (например, по семейству
// должностей), пока — только "Все навыки".
const FILTERS = ['Все навыки']

export default function Skills() {
  const location = useLocation()
  const [openCats, setOpenCats] = useState({ 'BIM и технологии': true })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Все навыки')
  // Переход из "Мои навыки" (значок ⓘ) сразу открывает деталку конкретного
  // навыка — так же, как переход из CareerMap сразу открывает нужный план.
  const [selectedSkill, setSelectedSkill] = useState(() => location.state?.openSkill ?? null)
  const { isInPlan, isRemovable, addToPlan, removeFromPlan } = useSkillFavorite()
  const { isMobile } = useBreakpoint()
  const [adminSkills] = useLocalStorage('admin:skills', INITIAL_SKILLS)

  const CATEGORIES = {}
  for (const cat of CATEGORY_ORDER) {
    const names = adminSkills.filter(s => s.category === cat).map(s => s.name)
    if (names.length) CATEGORIES[cat] = names
  }

  if (selectedSkill) return <SkillDetail skill={selectedSkill} onBack={() => setSelectedSkill(null)} />

  function toggleCat(cat) {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <div style={{ padding: isMobile ? 16 : '24px 32px' }}>
      <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Все навыки</h1>
      {!isMobile && <p style={{ color: '#7a8fa0', fontSize: 14, marginBottom: 20 }}>Станьте профессионалом, которым вы всегда хотели быть</p>}

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Введите название навыка" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 14, outline: 'none', marginBottom: 14 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: isMobile ? 12 : 13, fontWeight: filter === f ? 600 : 400, background: filter === f ? '#0f1923' : '#f0f2f8', color: filter === f ? '#fff' : '#4a6275', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#7a8fa0' }}>Древовидный вид</span>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: '#4361ee', position: 'relative', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', right: 2, top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
              </div>
              <span style={{ fontSize: 12, color: '#7a8fa0' }}>Сортировка: А–Я</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 12, color: '#1e40af' }}>
        ℹ️ <b>Все навыки:</b> Здесь вы найдёте все доступные навыки. <a href="#" style={{ color: '#4361ee' }}>Подробнее о навыках.</a>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {Object.entries(CATEGORIES).map(([cat, skills]) => {
          const filtered = search ? skills.filter(s => s.toLowerCase().includes(search.toLowerCase())) : skills
          if (!filtered.length) return null
          return (
            <div key={cat}>
              <button onClick={() => toggleCat(cat)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0f2f8', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 14, color: '#7a8fa0', transform: openCats[cat] ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f1923' }}>{cat}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9aafbd' }}>{filtered.length}</span>
              </button>
              {openCats[cat] && filtered.map(skill => {
                const inPlan = isInPlan(skill)
                const removable = isRemovable(skill)
                return (
                  <div key={skill} onClick={() => setSelectedSkill({ name: skill, category: cat })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 10px 40px', borderBottom: '1px solid #f8f9fc', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: i <= 2 ? '#4361ee' : '#e0e6ef' }} />)}
                    </div>
                    <span style={{ fontSize: 13, color: '#1a2b3c', flex: 1 }}>{skill}</span>
                    {POPULARITY[skill] && (
                      <span style={{ fontSize: 11, color: '#9aafbd' }}>+{POPULARITY[skill]} добавили</span>
                    )}
                    {inPlan ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#16a34a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                        Уже в ваших навыках
                        {removable && (
                          <span
                            onClick={e => { e.stopPropagation(); removeFromPlan(skill) }}
                            className="material-symbols-outlined"
                            title="Убрать из навыков"
                            style={{ fontSize: 15, color: '#ef4444', cursor: 'pointer' }}
                          >
                            close
                          </span>
                        )}
                      </span>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); addToPlan(skill, cat) }}
                        style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid #d0d7e5', background: '#fff', color: '#4361ee', fontSize: 11, cursor: 'pointer' }}
                      >
                        В план ▾
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
