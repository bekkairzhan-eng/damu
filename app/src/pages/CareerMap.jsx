import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { plan1DevelopedSkills, plan1TotalSkills, plan1DoneLearning, plan1TotalLearning } from '../data/careerPlan1'

const STEP = ['Выбрать цель', 'Установить срок', 'Работать по плану', 'Запросить аттестацию']
const CURRENT_POSITION = 'Foreman B'
const PAST_POSITIONS = new Set(['Foreman C', 'Foreman B'])

const JOB_FUNCTIONS = {
  'Полевой состав': ['Foreman C', 'Foreman B', 'Foreman A'],
  'Управление участком': ['Site Manager', 'Deputy Project Manager'],
  'Техническое руководство': ['ГИП', 'Главный инженер дирекции'],
  'Управление проектом': ['Project Manager'],
}

const CAREER_GRAPH = {
  'Foreman C': ['Foreman B'],
  'Foreman B': ['Foreman A'],
  'Foreman A': ['Site Manager', 'ГИП'],
  'Site Manager': ['Deputy Project Manager'],
  'ГИП': ['Главный инженер дирекции'],
  'Deputy Project Manager': ['Project Manager'],
  'Главный инженер дирекции': ['Project Manager'],
  'Project Manager': [],
}

const POSITION_SEQUENCE = ['Foreman C', 'Foreman B', 'Foreman A', 'Site Manager', 'Deputy Project Manager', 'Project Manager']

const POSITION_DATA = {
  'Foreman C': { grade: 'A1', skills: { done: 8, total: 10 }, learning: { done: 5, total: 6 } },
  'Foreman B': { grade: 'A2', skills: { done: 14, total: 16 }, learning: { done: 7, total: 9 } },
  'Foreman A': { grade: 'A3', skills: { done: plan1DevelopedSkills, total: plan1TotalSkills }, learning: { done: plan1DoneLearning, total: plan1TotalLearning } },
  'Site Manager': { grade: 'B1', skills: { done: 3, total: 20 }, learning: { done: 1, total: 12 } },
  'Deputy Project Manager': { grade: 'B2', skills: { done: 2, total: 18 }, learning: { done: 0, total: 10 } },
  'Project Manager': { grade: 'C1', skills: { done: 0, total: 24 }, learning: { done: 0, total: 14 } },
  'ГИП': { grade: 'D1', skills: { done: 0, total: 22 }, learning: { done: 0, total: 11 } },
  'Главный инженер дирекции': { grade: 'D2', skills: { done: 0, total: 26 }, learning: { done: 0, total: 13 } },
}

const POSITION_DETAILS = {
  'Foreman C': { description: 'Начальный уровень прораба. Отвечает за небольшой участок работ под руководством старшего прораба.', responsibilities: ['Контроль качества работ на участке', 'Координация рабочих бригад', 'Ведение журнала производства работ', 'Соблюдение техники безопасности'], salary: '250 000 – 350 000 ₸', experience: '1–2 года' },
  'Foreman B': { description: 'Самостоятельно ведёт строительный участок средней сложности. Взаимодействует с субподрядчиками и контролирует соблюдение норм.', responsibilities: ['Управление участком до 50 человек', 'Работа с проектной документацией', 'Контроль сроков и бюджета участка', 'Взаимодействие с субподрядчиками'], salary: '400 000 – 550 000 ₸', experience: '3–5 лет' },
  'Foreman A': { description: 'Старший прораб, ведущий крупные и сложные объекты. Наставник для Foreman C и B, участвует в планировании проекта.', responsibilities: ['Управление несколькими участками', 'Наставничество Foreman C и B', 'Участие в тендерах и планировании', 'Взаимодействие с проектным менеджером'], salary: '600 000 – 850 000 ₸', experience: '5–8 лет' },
  'Site Manager': { description: 'Руководит всем строительным объектом целиком, координирует всех прорабов и субподрядчиков.', responsibilities: ['Общее управление объектом', 'Координация всех прорабов', 'Отчётность перед руководством', 'Контроль бюджета объекта'], salary: '900 000 – 1 300 000 ₸', experience: '8–12 лет' },
  'Deputy Project Manager': { description: 'Помощник руководителя проекта, отвечает за операционную часть управления несколькими объектами.', responsibilities: ['Операционное управление проектами', 'Поддержка руководителя проекта', 'Работа с рисками и изменениями', 'Координация между объектами'], salary: '1 200 000 – 1 700 000 ₸', experience: '10–15 лет' },
  'Project Manager': { description: 'Полная ответственность за реализацию крупного строительного проекта от начала до сдачи.', responsibilities: ['Стратегическое управление проектом', 'Работа с заказчиком и инвесторами', 'Формирование и развитие команды', 'P&L проекта'], salary: '2 000 000 – 3 500 000 ₸', experience: '15+ лет' },
  'ГИП': { description: 'Главный инженер проекта — технический руководитель, отвечающий за проектные решения и техническую документацию.', responsibilities: ['Руководство проектированием', 'Согласование технических решений', 'Авторский надзор за строительством', 'Взаимодействие с экспертизой'], salary: '800 000 – 1 200 000 ₸', experience: '7–10 лет' },
  'Главный инженер дирекции': { description: 'Руководит технической политикой дирекции, координирует работу ГИПов на нескольких проектах.', responsibilities: ['Техническое руководство дирекцией', 'Стандартизация проектных решений', 'Развитие технической экспертизы', 'Управление командой ГИПов'], salary: '1 500 000 – 2 200 000 ₸', experience: '12–18 лет' },
}

function findAllPaths(from, to) {
  if (!from || !to || from === to) return from ? [[from]] : []
  const results = []
  function dfs(node, path, visited) {
    if (node === to) { results.push([...path]); return }
    for (const next of CAREER_GRAPH[node] || []) {
      if (!visited.has(next)) {
        visited.add(next); path.push(next)
        dfs(next, path, visited)
        path.pop(); visited.delete(next)
      }
    }
  }
  dfs(from, [from], new Set([from]))
  return results
}

function computeLayout(paths) {
  if (!paths.length) return { prefix: [], branches: [], suffix: [] }
  if (paths.length === 1) return { prefix: paths[0], branches: [], suffix: [] }
  const prefix = []
  for (let i = 0; i < paths[0].length; i++) {
    if (paths.every(p => p[i] === paths[0][i])) prefix.push(paths[0][i])
    else break
  }
  const suffix = []
  for (let i = 1; i <= paths[0].length - prefix.length; i++) {
    const node = paths[0][paths[0].length - i]
    if (paths.every(p => p[p.length - i] === node)) suffix.unshift(node)
    else break
  }
  const branches = paths.map(p => p.slice(prefix.length, p.length - suffix.length))
  return { prefix, branches, suffix }
}

const GOAL_TO_PLAN_ID = { 'Foreman A': 1 }

// Позиции, которые можно установить как карьерную цель с текущей должности
const NEXT_GOAL_OPTIONS = {
  'Foreman B': new Set(['Foreman A']),
  'Foreman A': new Set(['Site Manager', 'ГИП']),
  'Site Manager': new Set(['Deputy Project Manager']),
  'Deputy Project Manager': new Set(['Project Manager']),
  'ГИП': new Set(['Главный инженер дирекции']),
  'Главный инженер дирекции': new Set(['Project Manager']),
}

const TOUR_STEPS = [
  { id: 'here', title: 'Вы здесь', body: 'Это ваша текущая должность. Карьерный путь начинается отсюда.', anchor: 'card-current', position: 'bottom' },
  { id: 'target', title: 'Ваша цель', body: 'Здесь отображается должность, к которой вы стремитесь. Вы уже выбрали Foreman A.', anchor: 'card-target', position: 'bottom' },
  { id: 'build', title: 'Постройте путь', body: 'Выберите «От» и «До» — карта покажет все возможные маршруты, включая альтернативные ветки.', anchor: 'build-path', position: 'bottom' },
  { id: 'suggestions', title: 'Карьерные подсказки', body: 'Включите, чтобы увидеть самые популярные переходы с вашей текущей должности.', anchor: 'suggestions-toggle', position: 'bottom' },
  { id: 'zoom', title: 'Масштаб', body: 'Используйте кнопки + и − для изменения масштаба карты.', anchor: 'zoom-btns', position: 'top' },
]

export default function CareerMap() {
  const navigate = useNavigate()

  // Сохранённая цель юзера (для дефолтного вида)
  const [savedGoal, setSavedGoal] = useLocalStorage('careermap:goal', 'Foreman A')

  // Режим "Построить путь" — не персистируется, сбрасывается при загрузке
  const [buildFrom, setBuildFrom] = useState(CURRENT_POSITION)
  const [buildTo, setBuildTo] = useState(null)   // null = дефолтный вид

  const [fromInput, setFromInput] = useState('')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [toInput, setToInput] = useState('')
  const [showToDropdown, setShowToDropdown] = useState(false)

  const [suggestions, setSuggestions] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [confirmGoal, setConfirmGoal] = useState(null)
  const [zoom, setZoom] = useLocalStorage('careermap:zoom', 1)
  const [tourSeen, setTourSeen] = useLocalStorage('careermap:tour-seen', false)
  const [tourStep, setTourStep] = useState(null)
  const anchors = useRef({})

  useEffect(() => { if (!tourSeen) setTimeout(() => setTourStep(0), 600) }, [])

  function startTour() { setTourStep(0) }
  function nextStep() {
    if (tourStep < TOUR_STEPS.length - 1) setTourStep(tourStep + 1)
    else { setTourStep(null); setTourSeen(true) }
  }
  function prevStep() { if (tourStep > 0) setTourStep(tourStep - 1) }
  function skipTour() { setTourStep(null); setTourSeen(true) }
  function showLater() { setTourStep(null) }

  const currentStep = 2
  const activeTour = tourStep !== null ? TOUR_STEPS[tourStep] : null
  const anyDropdownOpen = showToDropdown || showFromDropdown || activeTour?.anchor === 'build-path'
  const tourProps = { tourStep, total: TOUR_STEPS.length, onNext: nextStep, onPrev: prevStep, onSkip: skipTour, onShowLater: showLater }

  // Режим исследования включён когда выбрано "До"
  const isExploring = buildTo !== null

  // Данные для дефолтного вида
  const goalData = POSITION_DATA[savedGoal] || { grade: '?', skills: { done: 0, total: 0 }, learning: { done: 0, total: 0 } }
  const fromIdx = POSITION_SEQUENCE.indexOf(CURRENT_POSITION)
  const prevPos = fromIdx > 0 ? POSITION_SEQUENCE[fromIdx - 1] : null
  const prevData = prevPos ? POSITION_DATA[prevPos] : null
  const curData = POSITION_DATA[CURRENT_POSITION] || { grade: '?', skills: { done: 0, total: 0 }, learning: { done: 0, total: 0 } }

  // Данные для режима исследования
  const allPaths = isExploring ? findAllPaths(buildFrom, buildTo) : []
  const { prefix, branches, suffix } = computeLayout(allPaths)
  const isBranching = branches.length > 1
  const BRANCH_GAP = 24
  const CARD_H = 170

  const BRANCH_TRACK_LABELS = {
    'Site Manager': 'Операционная ветка',
    'ГИП': 'Техническая ветка',
  }

  return (
    <div style={{ padding: '28px 32px', position: 'relative' }}>
      {selectedCard && (
        <PositionPanel position={selectedCard} isTarget={selectedCard === savedGoal} onClose={() => setSelectedCard(null)} />
      )}

      {confirmGoal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '28px 32px', width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#4361ee' }}>flag</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0f1923' }}>Сменить карьерную цель?</div>
            </div>
            <p style={{ fontSize: 13, color: '#4a6275', lineHeight: 1.6, marginBottom: 8 }}>
              Текущая цель: <strong style={{ color: '#0f1923' }}>{savedGoal}</strong>
            </p>
            <p style={{ fontSize: 13, color: '#4a6275', lineHeight: 1.6, marginBottom: 24 }}>
              Новая цель: <strong style={{ color: '#4361ee' }}>{confirmGoal}</strong>. Карьерный план и рекомендации будут перестроены под новую позицию.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmGoal(null)} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                Отмена
              </button>
              <button onClick={() => { setSavedGoal(confirmGoal); setConfirmGoal(null) }} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#4361ee', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Да, установить
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTour && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', pointerEvents: 'all' }} onClick={skipTour} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f1923' }}>Карьерный трек</h1>
        <button onClick={startTour} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>help_outline</span>
          Показать подсказки
        </button>
      </div>
      <p style={{ color: '#7a8fa0', fontSize: 14, marginBottom: 20 }}>Постройте путь к карьерной цели и скорректируйте его при необходимости</p>

      {/* Панель построения пути */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, position: 'relative', zIndex: anyDropdownOpen ? 450 : 10, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#7a8fa0' }}>alt_route</span>
        <span style={{ fontSize: 13, color: '#7a8fa0', fontWeight: 500 }}>Построить путь</span>

        {/* От */}
        <span style={{ fontSize: 13, color: '#9aafbd' }}>От</span>
        {buildFrom ? (
          <div style={{ padding: '6px 12px', borderRadius: 7, background: '#f0f4ff', border: '1px solid #c7d2fe', fontSize: 13, color: '#4361ee', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            {buildFrom}
            <span onMouseDown={() => { setBuildFrom(null); setFromInput('') }} style={{ cursor: 'pointer', opacity: 0.5, fontSize: 12 }}>✕</span>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <input autoFocus value={fromInput} onChange={e => { setFromInput(e.target.value); setShowFromDropdown(true) }} onFocus={() => setShowFromDropdown(true)} onBlur={() => setTimeout(() => setShowFromDropdown(false), 150)} placeholder="Выберите должность" style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 13, width: 280, outline: 'none' }} />
            {showFromDropdown && <PositionDropdown input={fromInput} onSelect={t => { setBuildFrom(t); setFromInput(''); setShowFromDropdown(false) }} allowAll />}
          </div>
        )}

        {/* До */}
        <span style={{ fontSize: 13, color: '#9aafbd' }}>До</span>
        <div ref={el => anchors.current['build-path'] = el} style={{ position: 'relative', zIndex: activeTour?.anchor === 'build-path' ? 450 : 'auto' }}>
          <TourTooltip active={activeTour?.anchor === 'build-path'} step={activeTour} {...tourProps} position="bottom" />
          {buildTo ? (
            <div style={{ padding: '6px 12px', borderRadius: 7, background: '#f0f4ff', border: '1px solid #c7d2fe', fontSize: 13, color: '#4361ee', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {buildTo}
              <span onMouseDown={() => { setBuildTo(null); setToInput('') }} style={{ cursor: 'pointer', opacity: 0.5, fontSize: 12 }}>✕</span>
            </div>
          ) : (
            <>
              <input value={toInput} onChange={e => { setToInput(e.target.value); setShowToDropdown(true) }} onFocus={() => setShowToDropdown(true)} onBlur={() => setTimeout(() => setShowToDropdown(false), 150)} placeholder="Выберите должность" style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 13, width: 200, outline: 'none' }} />
              {showToDropdown && <PositionDropdown input={toInput} onSelect={t => { setBuildTo(t); setToInput(''); setShowToDropdown(false) }} disabledSet={PAST_POSITIONS} />}
            </>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <input placeholder="🔍 Поиск" style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #d0d7e5', fontSize: 13, width: '100%', outline: 'none' }} />
        </div>

        <div ref={el => anchors.current['suggestions-toggle'] = el} style={{ position: 'relative' }}>
          <TourTooltip active={activeTour?.anchor === 'suggestions-toggle'} step={activeTour} {...tourProps} position="bottom" />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4a6275', cursor: 'pointer', whiteSpace: 'nowrap', zIndex: activeTour?.anchor === 'suggestions-toggle' ? 450 : 1, position: 'relative' }}>
            <input type="checkbox" checked={suggestions} onChange={e => setSuggestions(e.target.checked)} style={{ accentColor: '#4361ee' }} />
            Карьерные подсказки
          </label>
        </div>
      </div>

      {/* Степпер */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, padding: '0 8px' }}>
        {STEP.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, background: i <= currentStep ? '#4361ee' : '#e0e6ef', color: i <= currentStep ? '#fff' : '#9aafbd' }}>
                {i < currentStep ? '✓' : i === STEP.length - 1 && i > currentStep ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === currentStep ? 600 : 400, color: i <= currentStep ? '#0f1923' : '#9aafbd', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEP.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentStep ? '#4361ee' : '#e0e6ef', margin: '0 8px', borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {/* Карта */}
      <div style={{ background: '#f8f9fc', borderRadius: 14, border: '1px solid #e8edf2', height: 'calc(100vh - 310px)', minHeight: 420, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
          <div style={{ fontSize: 11, color: '#9aafbd', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>ads_click</span> Нажмите на карточку для подробностей
          </div>
        </div>

        <div ref={el => anchors.current['zoom-btns'] = el} style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 4, zIndex: activeTour?.anchor === 'zoom-btns' ? 450 : 1 }}>
          <TourTooltip active={activeTour?.anchor === 'zoom-btns'} step={activeTour} {...tourProps} position="top" />
          <button onClick={() => setZoom(z => Math.min(+(z + 0.15).toFixed(2), 2))} style={zoomBtn}>+</button>
          <button onClick={() => setZoom(z => Math.max(+(z - 0.15).toFixed(2), 0.4))} style={zoomBtn}>−</button>
        </div>

        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s' }}>
          {isExploring ? (
            /* ─── Режим исследования: показываем построенный путь ─── */
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isBranching ? (
                <>
                  {prefix.map((pos, i) => (
                    <div key={pos} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 && <Arrow />}
                      <MapCard {...mkCard(pos, { current: pos === CURRENT_POSITION, past: PAST_POSITIONS.has(pos) && pos !== CURRENT_POSITION, fullBars: pos === CURRENT_POSITION })}
                        onDetails={() => setSelectedCard(pos)}
                        onSetGoal={canSetGoal(pos, savedGoal) ? () => setConfirmGoal(pos) : null}
                        isGoal={isCurrentGoal(pos, savedGoal)} />
                    </div>
                  ))}
                  <Arrow />
                  <ForkConnector side="left" count={branches.length} rowH={CARD_H} gap={BRANCH_GAP} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: BRANCH_GAP }}>
                    {branches.map((branch, bi) => (
                      <div key={bi} style={{ display: 'flex', alignItems: 'center', height: CARD_H }}>
                        {branch.map((pos, i) => (
                          <div key={pos} style={{ display: 'flex', alignItems: 'center' }}>
                            {i > 0 && <Arrow />}
                            <MapCard {...mkCard(pos)}
                              onDetails={() => setSelectedCard(pos)}
                              onSetGoal={canSetGoal(pos, savedGoal) ? () => setConfirmGoal(pos) : null}
                              isGoal={isCurrentGoal(pos, savedGoal)} />
                          </div>
                        ))}
                        <Arrow />
                      </div>
                    ))}
                  </div>
                  <ForkConnector side="right" count={branches.length} rowH={CARD_H} gap={BRANCH_GAP} />
                  {suffix.map((pos, i) => (
                    <div key={pos} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 && <Arrow />}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <MapCard {...mkCard(pos, { target: pos === buildTo })}
                          onDetails={() => setSelectedCard(pos)}
                          onSetGoal={canSetGoal(pos, savedGoal) ? () => setConfirmGoal(pos) : null}
                          isGoal={isCurrentGoal(pos, savedGoal)} />
                        {pos === buildTo && <button onClick={() => navigate('/plans', { state: { planId: GOAL_TO_PLAN_ID[buildTo] } })} style={openPlanBtn}>Открыть карьерный план</button>}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* Линейный путь в режиме исследования */
                <>
                  {prefix.map((pos, i) => (
                    <div key={pos} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 && <Arrow />}
                      <MapCard {...mkCard(pos, { current: pos === CURRENT_POSITION, past: PAST_POSITIONS.has(pos) && pos !== CURRENT_POSITION, fullBars: pos === CURRENT_POSITION, target: pos === buildTo && i === prefix.length - 1 })}
                        onDetails={() => setSelectedCard(pos)}
                        onSetGoal={canSetGoal(pos, savedGoal) ? () => setConfirmGoal(pos) : null}
                        isGoal={isCurrentGoal(pos, savedGoal)} />
                    </div>
                  ))}
                  {buildTo && <div style={{ marginLeft: 16 }}><button onClick={() => navigate('/plans', { state: { planId: GOAL_TO_PLAN_ID[buildTo] } })} style={openPlanBtn}>Открыть карьерный план</button></div>}
                </>
              )}
            </div>
          ) : (
            /* ─── Дефолтный вид: Foreman A → Foreman B → Foreman C (по центру) ─── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px minmax(0,1fr)', alignItems: 'center', width: '100%' }}>
                {/* Левая часть */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {prevPos && (
                    <>
                      <MapCard title={prevPos} grade={prevData.grade} past onDetails={() => setSelectedCard(prevPos)} />
                      <Arrow />
                    </>
                  )}
                  <div ref={el => anchors.current['card-current'] = el} style={{ position: 'relative', zIndex: activeTour?.anchor === 'card-current' ? 450 : 1 }}>
                    <TourTooltip active={activeTour?.anchor === 'card-current'} step={activeTour} {...tourProps} position="bottom" />
                    <MapCard title={CURRENT_POSITION} grade={curData.grade} current date="Повышен 01 Янв 2024"
                      skillsDone={curData.skills.total} skillsTotal={curData.skills.total}
                      learningDone={curData.learning.total} learningTotal={curData.learning.total}
                      onDetails={() => setSelectedCard(CURRENT_POSITION)} />
                  </div>
                  <Arrow />
                </div>

                {/* Центр: цель */}
                <div ref={el => anchors.current['card-target'] = el} style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: activeTour?.anchor === 'card-target' ? 450 : 1 }}>
                  <TourTooltip active={activeTour?.anchor === 'card-target'} step={activeTour} {...tourProps} position="bottom" />
                  <MapCard title={savedGoal} grade={goalData.grade} target deadline="06 Фев 2027"
                    skillsDone={goalData.skills.done} skillsTotal={goalData.skills.total}
                    learningDone={goalData.learning.done} learningTotal={goalData.learning.total}
                    onDetails={() => setSelectedCard(savedGoal)} />
                </div>

                <div />
              </div>

              <button
                onClick={() => navigate('/plans', { state: { planId: GOAL_TO_PLAN_ID[savedGoal] } })}
                style={openPlanBtn}
              >
                Открыть карьерный план
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Карьерные подсказки */}
      {suggestions && (() => {
        const SUGGESTIONS = [
          { to: 'Foreman A',   desc: 'Прямой следующий шаг' },
          { to: 'Site Manager', desc: 'Управленческая ветка (через Foreman A)' },
          { to: 'ГИП',         desc: 'Техническая ветка (через Foreman A)' },
        ].map(s => {
          const d = POSITION_DATA[s.to] || { skills: { done: 0, total: 1 }, learning: { done: 0, total: 1 } }
          const skillPct = d.skills.total ? Math.round((d.skills.done / d.skills.total) * 100) : 0
          const learnPct = d.learning.total ? Math.round((d.learning.done / d.learning.total) * 100) : 0
          const pct = Math.round((skillPct + learnPct) / 2)
          return { ...s, pct }
        })
        return (
          <div style={{ marginTop: 16, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f59e0b' }}>lightbulb</span>
              Куда можно перейти с {CURRENT_POSITION}
            </div>
            <div style={{ fontSize: 12, color: '#9aafbd', marginBottom: 14 }}>% соответствия — сколько требований вы уже закрыли</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {SUGGESTIONS.map(s => (
                <div key={s.to} onClick={() => { setBuildFrom(CURRENT_POSITION); setBuildTo(s.to) }}
                  style={{ flex: 1, minWidth: 180, padding: '14px 16px', borderRadius: 10, border: `1px solid ${buildTo === s.to ? '#4361ee' : '#e8edf2'}`, cursor: 'pointer', background: buildTo === s.to ? '#f0f4ff' : '#fafbff' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', marginBottom: 4 }}>{s.to}</div>
                  <div style={{ fontSize: 11, color: '#7a8fa0', marginBottom: 8 }}>{s.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: '#e0e6ef', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: s.pct >= 70 ? '#22c55e' : s.pct >= 40 ? '#f59e0b' : '#4361ee', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#4a6275' }}>{s.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

function canSetGoal(pos, currentGoal) {
  const validGoals = NEXT_GOAL_OPTIONS[CURRENT_POSITION] || new Set()
  return validGoals.has(pos) && pos !== currentGoal
}

function isCurrentGoal(pos, currentGoal) {
  const validGoals = NEXT_GOAL_OPTIONS[CURRENT_POSITION] || new Set()
  return validGoals.has(pos) && pos === currentGoal
}

// Хелпер для пропсов карточки в режиме исследования
function mkCard(pos, opts = {}) {
  const data = POSITION_DATA[pos] || { grade: '?', skills: { done: 0, total: 0 }, learning: { done: 0, total: 0 } }
  return {
    title: pos, grade: data.grade,
    current: opts.current || false,
    target: opts.target || false,
    past: opts.past || false,
    date: opts.current ? 'Повышен 01 Янв 2024' : undefined,
    deadline: opts.target ? '06 Фев 2027' : undefined,
    skillsDone: opts.fullBars ? data.skills.total : data.skills.done,
    skillsTotal: data.skills.total,
    learningDone: opts.fullBars ? data.learning.total : data.learning.done,
    learningTotal: data.learning.total,
  }
}

function ForkConnector({ side, count, rowH, gap }) {
  const totalH = count * rowH + (count - 1) * gap
  const centers = Array.from({ length: count }, (_, i) => rowH / 2 + i * (rowH + gap))
  const w = 24
  const lineX = side === 'left' ? 2 : w - 2
  return (
    <svg width={w} height={totalH} style={{ flexShrink: 0, overflow: 'visible' }}>
      <line x1={lineX} y1={centers[0]} x2={lineX} y2={centers[count - 1]} stroke="#d0d7e5" strokeWidth="2" />
      {centers.map((cy, i) => (
        <line key={i} x1={side === 'left' ? lineX : 0} y1={cy} x2={side === 'left' ? w : lineX} y2={cy} stroke="#d0d7e5" strokeWidth="2" />
      ))}
    </svg>
  )
}

function PositionDropdown({ input, onSelect, disabledSet, allowAll }) {
  return (
    <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 300, background: '#fff', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e8edf2', minWidth: 280, maxHeight: 300, overflowY: 'auto', marginTop: 4 }}>
      {Object.entries(JOB_FUNCTIONS).map(([fn, titles]) => {
        const filtered = titles.filter(t => t.toLowerCase().includes((input || '').toLowerCase()))
        if (!filtered.length) return null
        return (
          <div key={fn}>
            <div style={{ padding: '8px 14px 4px', fontSize: 11, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{fn}</div>
            {filtered.map(t => {
              const isPast = disabledSet?.has(t)
              const disabled = isPast && !allowAll
              return (
                <div key={t} onMouseDown={disabled ? undefined : () => onSelect(t)}
                  style={{ padding: '8px 14px', fontSize: 13, color: disabled ? '#c0ccd8' : '#1a2b3c', cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: disabled ? '#fafafa' : 'transparent' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: disabled ? '#e0e6ef' : '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, color: disabled ? '#9aafbd' : '#fff' }}>А</div>
                  <span style={{ flex: 1 }}>{t}</span>
                  {isPast && <span style={{ fontSize: 10, color: '#9aafbd', background: '#f0f2f8', padding: '1px 6px', borderRadius: 4 }}>Пройдено</span>}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function TourTooltip({ active, step, tourStep, total, onNext, onSkip, onShowLater, position }) {
  if (!active || !step) return null
  const isLast = tourStep === total - 1
  const BG = '#3d6fd4'
  return (
    <div style={{ position: 'absolute', ...(position === 'bottom' ? { top: 'calc(100% + 14px)' } : { bottom: 'calc(100% + 14px)' }), left: '50%', transform: 'translateX(-50%)', width: 320, background: BG, borderRadius: 12, padding: '18px 20px', zIndex: 500, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', pointerEvents: 'all' }}>
      <div style={{ position: 'absolute', ...(position === 'bottom' ? { top: -10 } : { bottom: -10 }), left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, ...(position === 'bottom' ? { borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `10px solid ${BG}` } : { borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `10px solid ${BG}` }) }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{step.title}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', marginLeft: 12, marginTop: 2 }}>{tourStep + 1} из {total}</span>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, marginBottom: 18 }}>{step.body}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, padding: 0 }}>Пропустить тур</button>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isLast && <button onClick={onShowLater} style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.4)', background: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Показать позже</button>}
          <button onClick={onNext} style={{ padding: '6px 16px', borderRadius: 7, border: 'none', background: '#fff', color: BG, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{isLast ? 'Понятно!' : 'Далее'}</button>
        </div>
      </div>
    </div>
  )
}

function MapCard({ title, grade, current, target, past, date, deadline, skillsDone, skillsTotal, learningDone, learningTotal, onDetails, onSetGoal, isGoal }) {
  const skillPct = skillsTotal ? Math.round((skillsDone / skillsTotal) * 100) : 0
  const learnPct = learningTotal ? Math.round((learningDone / learningTotal) * 100) : 0
  const headerBg = current ? '#4361ee' : target ? '#3d9970' : null
  const width = (current || target) ? 300 : 220
  return (
    <div style={{ width, background: '#fff', borderRadius: 12, overflow: 'hidden', border: current ? '2px solid #4361ee' : target ? '2px solid #3d9970' : '1px solid #e8edf2', boxShadow: current || target ? '0 4px 20px rgba(67,97,238,0.18)' : '0 1px 4px rgba(0,0,0,0.05)', opacity: past ? 0.55 : 1 }}>
      {(current || target) && (
        <div style={{ background: headerBg, padding: '6px 14px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{current ? 'ВЫ ЗДЕСЬ' : 'ВАША СЛЕДУЮЩАЯ ЦЕЛЬ'}</span>
        </div>
      )}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${current ? '#4361ee' : target ? '#3d9970' : '#d0d7e5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0, color: current ? '#4361ee' : target ? '#3d9970' : '#7a8fa0' }}>{grade}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923', lineHeight: 1.2 }}>{title}</div>
            <div style={{ fontSize: 11, color: '#7a8fa0', marginTop: 1 }}>BI Development</div>
          </div>
          {deadline && <div style={{ fontSize: 11, color: '#7a8fa0', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> {deadline}</div>}
        </div>
        {date && <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 13 }}>calendar_today</span> {date}</div>}
        {skillsTotal != null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            <MiniBar label="Навыки" done={skillsDone} total={skillsTotal} pct={skillPct} color="#4361ee" />
            <MiniBar label="Обучение" done={learningDone} total={learningTotal} pct={learnPct} color="#059669" />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={onDetails} style={{ fontSize: 12, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600, textAlign: 'left' }}>Подробнее →</button>
          {isGoal && (
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>✓ Текущая карьерная цель</span>
          )}
          {onSetGoal && !isGoal && (
            <button onClick={onSetGoal} style={{ fontSize: 11, color: '#059669', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600, textAlign: 'left' }}>
              ✦ Установить карьерную цель
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PositionPanel({ position, isTarget, onClose }) {
  const data = POSITION_DATA[position] || { grade: '?', skills: { done: 0, total: 0 }, learning: { done: 0, total: 0 } }
  const details = POSITION_DETAILS[position] || {}
  const skillPct = data.skills.total ? Math.round((data.skills.done / data.skills.total) * 100) : 0
  const learnPct = data.learning.total ? Math.round((data.learning.done / data.learning.total) * 100) : 0
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 590, background: 'rgba(0,0,0,0.18)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.12)', zIndex: 600, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #e8edf2' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Должность</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0f1923', lineHeight: 1.2 }}>{position}</div>
              <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 4 }}>{data.grade} · BI Development</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9aafbd', fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: '#f0f4ff', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#7a8fa0', marginBottom: 2 }}>Зарплата</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f1923' }}>{details.salary || '—'}</div>
            </div>
            <div style={{ flex: 1, background: '#f0f4ff', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#7a8fa0', marginBottom: 2 }}>Опыт</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f1923' }}>{details.experience || '—'}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1923', marginBottom: 8 }}>Описание роли</div>
            <p style={{ fontSize: 13, color: '#4a6275', lineHeight: 1.6, margin: 0 }}>{details.description || '—'}</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1923', marginBottom: 8 }}>Обязанности</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(details.responsibilities || []).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#4a6275' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4361ee', flexShrink: 0, marginTop: 5 }} />
                  {r}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f1923', marginBottom: 10 }}>Прогресс</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ label: 'Навыки', done: data.skills.done, total: data.skills.total, pct: skillPct, color: '#4361ee' }, { label: 'Обучение', done: data.learning.done, total: data.learning.total, pct: learnPct, color: '#059669' }].map(b => (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#4a6275' }}>{b.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f1923' }}>{b.done}/{b.total}</span>
                  </div>
                  <div style={{ height: 6, background: '#f0f2f8', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {isTarget && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e8edf2' }}>
            <button style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Открыть карьерный план
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function MiniBar({ label, done, total, pct, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: '#9aafbd' }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#0f1923' }}>{done}/{total}</span>
      </div>
      <div style={{ height: 3, background: '#f0f2f8', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 32, height: 2, background: '#d0d7e5' }} />
      <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '8px solid #d0d7e5' }} />
    </div>
  )
}

const openPlanBtn = { padding: '10px 28px', borderRadius: 8, border: 'none', background: '#4361ee', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 3px 12px rgba(67,97,238,0.35)', whiteSpace: 'nowrap' }
const zoomBtn = { width: 32, height: 32, borderRadius: 6, border: '1px solid #e0e6ef', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#4a6275', display: 'flex', alignItems: 'center', justifyContent: 'center' }
