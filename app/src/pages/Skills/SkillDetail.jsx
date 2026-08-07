import { useState } from 'react'
import { useSkillFavorite } from '../../hooks/useSkillFavorite'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { INITIAL_SKILLS, LEVELS } from '../../data/skillsCatalog'
import { INITIAL_TESTLAB_TESTS } from '../../data/testlabTests'

const LEVEL_DOT_LABELS = ['', 'Начальный', 'Средний', 'Продвинутый', 'Эксперт']

export default function SkillDetail({ skill, onBack }) {
  const [activeLevel, setActiveLevel] = useState('Базовый')
  const { setBaseCats, custom, setCustom, findInBase, isInPlan: checkInPlan, isRemovable: checkRemovable, addToPlan: addSkillToPlan, removeFromPlan } = useSkillFavorite()
  const [adminSkills] = useLocalStorage('admin:skills', INITIAL_SKILLS)
  const content = adminSkills.find(s => s.name === skill.name)

  // Уровень навыка сотрудник не выставляет сам — приходит из BILIM (1-2) / TestLab (3)
  // автоматически. Единственное ручное действие здесь — запрос подтверждения
  // уровня 4 (Эксперт), доступный только когда уровень 3 уже подтверждён.
  // Навык может уже быть частью профиля (карьерный трек, `baseCats`) либо
  // добавлен самостоятельно (`custom`) — работаем с тем, что найдётся.
  const inBase = findInBase(skill.name)
  const customEntry = custom.find(s => s.name === skill.name)
  const inPlan = checkInPlan(skill.name)
  const removable = checkRemovable(skill.name)
  const currentLevel = inBase ? (inBase.skill.level ?? 0) : (customEntry?.level ?? 0)
  const expertPending = inBase ? !!inBase.skill.expertPending : !!customEntry?.expertPending
  const canRequestExpert = currentLevel === 3 && !expertPending

  function addToPlan() {
    addSkillToPlan(skill.name, skill.category)
  }

  function removeSkill() {
    removeFromPlan(skill.name)
  }

  function requestExpert() {
    if (inBase) {
      setBaseCats(prev => prev.map(cat => cat.name !== inBase.categoryName ? cat : {
        ...cat,
        skills: cat.skills.map(s => s.name === skill.name ? { ...s, expertPending: true } : s),
      }))
    } else {
      setCustom(prev => prev.map(s => s.name === skill.name ? { ...s, expertPending: true } : s))
    }
  }

  return (
    <div>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '16px 32px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4361ee', fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>← Навыки</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923' }}>{skill.name}</h1>
              <span style={{ color: '#cdd5e0', cursor: 'pointer' }}>⋮</span>
              <span style={{ color: '#cdd5e0', cursor: 'pointer' }}>🔗</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button style={btnPrimary}>Поделиться</button>
              {inPlan ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16a34a', fontWeight: 600, alignSelf: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                  Уже в ваших навыках
                  {removable && (
                    <span
                      onClick={removeSkill}
                      className="material-symbols-outlined"
                      title="Убрать из навыков"
                      style={{ fontSize: 16, color: '#ef4444', cursor: 'pointer' }}
                    >
                      close
                    </span>
                  )}
                </span>
              ) : (
                <button onClick={addToPlan} style={btnOutline}>Добавить в план ▾</button>
              )}
              <button style={btnOutline}>Подписаться</button>
              <span style={{ fontSize: 12, color: '#9aafbd', alignSelf: 'center' }}>Обновлено: 1 месяц назад</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {inPlan ? (
              <>
                <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 6 }}>Уровень владения</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#4361ee' }}>
                  {currentLevel ? LEVEL_DOT_LABELS[currentLevel] : 'Не начат'}
                </div>
                <div style={{ display: 'flex', gap: 3, marginTop: 8, justifyContent: 'flex-end' }}>
                  {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: i <= currentLevel ? '#4361ee' : '#e0e6ef' }} />)}
                </div>
                {currentLevel === 0 && (
                  <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 8, maxWidth: 200 }}>Уровень подтверждается автоматически через BILIM/TestLab</div>
                )}
                {canRequestExpert && (
                  <button onClick={requestExpert} style={{ marginTop: 10, padding: '6px 14px', borderRadius: 7, border: '1px solid #4361ee', background: '#fff', color: '#4361ee', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Запросить эксперта →
                  </button>
                )}
                {expertPending && (
                  <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 6, background: '#fff7ed', color: '#ea580c', fontSize: 12, fontWeight: 600 }}>
                    Ожидает эксперта
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 11, color: '#9aafbd', maxWidth: 180 }}>Добавьте навык в план, чтобы отслеживать уровень</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 10 }}>Описание навыка</div>
          <p style={{ fontSize: 13, color: content?.description ? '#4a6275' : '#9aafbd', lineHeight: 1.6, marginBottom: 0 }}>
            {content?.description || 'Описание пока не заполнено администратором.'}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f0f2f8', marginBottom: 16 }}>
            {[...LEVELS, 'Все уровни'].map(l => (
              <button key={l} onClick={() => setActiveLevel(l)} style={{
                padding: '8px 18px', background: 'none', border: 'none',
                borderBottom: activeLevel === l ? '2.5px solid #0f1923' : '2.5px solid transparent',
                fontSize: 13, fontWeight: activeLevel === l ? 600 : 400,
                color: activeLevel === l ? '#0f1923' : '#7a8fa0', cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>

          {activeLevel === 'Все уровни' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {LEVELS.map(l => (
                <div key={l}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', marginBottom: 6 }}>{l}</div>
                  <LevelBody level={l} content={content} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', marginBottom: 8 }}>Что вы должны знать</div>
              <LevelBody level={activeLevel} content={content} />
            </>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923', marginBottom: 14 }}>Учебные материалы</div>
          {materialsList(content).length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {materialsList(content).map(m => (
                <a key={m.title} href={m.url} target="_blank" rel="noreferrer" style={{ border: '1px solid #e8edf2', borderRadius: 10, padding: 14, display: 'flex', gap: 12, textDecoration: 'none' }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0f1923' }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: '#4361ee', marginTop: 2 }}>Открыть →</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: '#9aafbd', textAlign: 'center', padding: 20 }}>Материалы пока не добавлены администратором.</div>
          )}
        </div>

        {/* Практические задания и вопросы для самопроверки — скрыто, пока не нужно (см. обсуждение 07.08.2026) */}
      </div>
    </div>
  )
}

function LevelBody({ level, content }) {
  const levelData = content?.levels?.[level]
  const test = level === 'Продвинутый' ? INITIAL_TESTLAB_TESTS.find(t => t.id === levelData?.testId) : null

  return (
    <>
      <p style={{ fontSize: 13, color: levelData?.description ? '#4a6275' : '#9aafbd', lineHeight: 1.6, marginBottom: 10 }}>
        {levelData?.description || 'Описание уровня пока не заполнено администратором.'}
      </p>
      {level !== 'Эксперт' && level !== 'Продвинутый' && levelData?.link && (
        <a href={levelData.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#4361ee', fontWeight: 600, textDecoration: 'none' }}>
          Пройти курс →
        </a>
      )}
      {level === 'Продвинутый' && (
        test
          ? <div style={{ fontSize: 12, color: '#9aafbd' }}>Подтверждается тестом TestLab «{test.name}» — засчитывается при ближайшем ранжировании (раз в полгода).</div>
          : <div style={{ fontSize: 12, color: '#9aafbd' }}>Тест TestLab для этого уровня пока не привязан администратором.</div>
      )}
      {level === 'Эксперт' && (
        <div style={{ fontSize: 12, color: '#9aafbd' }}>Подтверждается вручную — запросите эксперта, когда будет достигнут уровень 3.</div>
      )}
    </>
  )
}

function materialsList(content) {
  const m = content?.materials
  if (!m) return []
  return [
    m.knowledgeBase?.url ? { title: m.knowledgeBase.title || 'База знаний', url: m.knowledgeBase.url, icon: '📚' } : null,
    m.mandatoryPath?.url ? { title: m.mandatoryPath.title || 'Обязательный учебный путь', url: m.mandatoryPath.url, icon: '🗺' } : null,
  ].filter(Boolean)
}

const btnPrimary = { padding: '7px 16px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }
const btnOutline = { padding: '7px 16px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
