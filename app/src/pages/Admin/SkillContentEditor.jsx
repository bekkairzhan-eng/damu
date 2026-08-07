import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { INITIAL_SKILLS, LEVELS } from '../../data/skillsCatalog'
import { INITIAL_TESTLAB_TESTS } from '../../data/testlabTests'

const LEVEL_LINK_LABEL = {
  'Базовый': 'Ссылка на курс в BILIM',
  'Средний': 'Ссылка на курс в BILIM',
}

const inputStyle = { display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const cardStyle = { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }

export default function SkillContentEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [skills, setSkills] = useLocalStorage('admin:skills', INITIAL_SKILLS)
  const skill = skills.find(s => String(s.id) === id)
  const [activeLevel, setActiveLevel] = useState('Базовый')
  const [saved, setSaved] = useState(false)

  const [description, setDescription] = useState(skill?.description ?? '')
  const [levels, setLevels] = useState(skill?.levels ?? {})
  const [materials, setMaterials] = useState(skill?.materials ?? {})

  if (!skill) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: '#7a8fa0' }}>Навык не найден.</p>
        <button onClick={() => navigate('/admin/skills')} style={{ color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>← Каталог навыков</button>
      </div>
    )
  }

  function updateLevel(level, field, value) {
    setLevels(prev => ({ ...prev, [level]: { ...prev[level], [field]: value } }))
  }

  function updateMaterial(key, field, value) {
    setMaterials(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  function save() {
    setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, description, levels, materials } : s))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/skills')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>← Каталог навыков</button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>{skill.name}</h1>
          <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>{skill.category}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Сохранено</span>}
          <button onClick={save} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Сохранить</button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 10 }}>Описание навыка</div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Опишите, что охватывает этот навык на практике"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f0f2f8', marginBottom: 16 }}>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setActiveLevel(l)} style={{
              padding: '8px 18px', background: 'none', border: 'none',
              borderBottom: activeLevel === l ? '2.5px solid #0f1923' : '2.5px solid transparent',
              fontSize: 13, fontWeight: activeLevel === l ? 600 : 400,
              color: activeLevel === l ? '#0f1923' : '#7a8fa0', cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
          Что нужно знать/уметь на уровне «{activeLevel}»
          <textarea
            value={levels[activeLevel]?.description ?? ''}
            onChange={e => updateLevel(activeLevel, 'description', e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>

        {activeLevel === 'Эксперт' ? (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#7a8fa0' }}>
            Уровень 4 сотрудник запрашивает вручную у эксперта/руководителя — ссылка на курс не нужна.
          </div>
        ) : activeLevel === 'Продвинутый' ? (
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0f1923', marginTop: 14 }}>
            Справочник тестов из TestLab
            <select
              value={levels['Продвинутый']?.testId ?? ''}
              onChange={e => updateLevel('Продвинутый', 'testId', e.target.value ? Number(e.target.value) : null)}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="">— не выбран —</option>
              {INITIAL_TESTLAB_TESTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 6, fontWeight: 400 }}>
              Результат этого теста будет автоматически подтверждать уровень 3 при ранжировании раз в полгода.
            </div>
          </label>
        ) : (
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0f1923', marginTop: 14 }}>
            {LEVEL_LINK_LABEL[activeLevel]}
            <input
              value={levels[activeLevel]?.link ?? ''}
              onChange={e => updateLevel(activeLevel, 'link', e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </label>
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 14 }}>Учебные материалы</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['knowledgeBase', 'mandatoryPath'].map(key => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Название
                <input value={materials[key]?.title ?? ''} onChange={e => updateMaterial(key, 'title', e.target.value)} style={inputStyle} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Ссылка
                <input value={materials[key]?.url ?? ''} onChange={e => updateMaterial(key, 'url', e.target.value)} placeholder="https://..." style={inputStyle} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
