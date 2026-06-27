import { RATING_COMPONENTS } from '../../data/ratingData'

const CORP_ITEMS = [
  { id: 1, label: 'Пожертвование в благотворительный Фонд Жулдызай', checked: true, value: null },
  { id: 2, label: 'Индекс эффективности согласования (UnityBPM)', sub: 'Должен быть выше 4.0 из 5.0', checked: true, value: 4.3 },
  { id: 3, label: 'Участие в корпоративных активностях', sub: 'Жестокие игры, корпоративные турниры и т.п.', checked: true, value: null },
]

const learningHistory = [
  {
    quarter: 'Q2 2026',
    programs: [
      { name: 'Управление строительным проектом: уровень Foreman C', provider: 'BI University', date: 'Апр 2026', status: 'in-progress', hours: 16, cert: false },
      { name: 'Lean Construction: инструменты и практика', provider: 'Buildex Training Center', date: 'Май 2026', status: 'in-progress', hours: 12, cert: false },
    ],
  },
  {
    quarter: 'Q1 2026',
    programs: [
      { name: 'Нормативная база строительства РК (обновление 2025)', provider: 'BI University', date: 'Янв 2026', status: 'done', hours: 8, cert: true },
      { name: 'Охрана труда и ТБ — переаттестация', provider: 'Buildex Training Center', date: 'Фев 2026', status: 'done', hours: 4, cert: true },
    ],
  },
  {
    quarter: 'Q3 2025',
    programs: [
      { name: 'BIM-технологии: базовый курс', provider: 'BILIM', date: 'Авг 2025', status: 'done', hours: 20, cert: true },
      { name: 'MS Project: основы планирования', provider: 'BILIM', date: 'Сен 2025', status: 'done', hours: 6, cert: false },
    ],
  },
  {
    quarter: 'Q1 2025',
    programs: [
      { name: 'Корпоративный онбординг Foreman B', provider: 'BI University', date: 'Янв 2025', status: 'done', hours: 24, cert: false },
      { name: 'Lean Construction: введение', provider: 'BI University', date: 'Фев 2025', status: 'done', hours: 8, cert: true },
    ],
  },
]

const certs = [
  { name: 'Удостоверение по охране труда и ТБ (РК)', type: 'Сертификат', status: 'Действителен', issued: '15 Мар 2024', expires: '15 Мар 2027', provider: 'Buildex Training Center' },
  { name: 'Технический надзор в строительстве', type: 'Сертификат', status: 'Действителен', issued: '20 Янв 2024', expires: '20 Янв 2027', provider: 'BI University' },
  { name: 'BIM-технологии: базовый курс (Autodesk)', type: 'Сертификат', status: 'Действителен', issued: '10 Июн 2023', expires: null, provider: 'BILIM' },
  { name: 'Lean Construction (BI Group)', type: 'Сертификат', status: 'Действителен', issued: '05 Авг 2023', expires: null, provider: 'BI University' },
  { name: 'Пожарная безопасность (уровень 2)', type: 'Сертификат', status: 'Истёк', issued: '01 Мар 2024', expires: '01 Мар 2026', provider: 'Buildex Training Center' },
]

const workHistory = [
  { role: 'Foreman B', org: 'BI Development', from: '01.01.2024', to: null,       tenure: '2 г 5 мес' },
  { role: 'Foreman C', org: 'BI Development', from: '17.07.2021', to: '31.12.2023', tenure: '2 г 5 мес' },
]

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../../ProfileContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { RadarChart } from '../../components/RadarChart'

const CERT_TYPES = ['Сертификат', 'Удостоверение', 'Диплом', 'Свидетельство']
const PROJECT_TYPES = ['Жилой комплекс', 'Коммерческая недвижимость', 'Инфраструктура', 'Промышленный объект', 'Социальный объект', 'Другое']

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: 'ЖК "GreenLine Sakura" — 1-я очередь',
    type: 'Жилой комплекс',
    role: 'Foreman C',
    from: '2022-03',
    to: '2023-08',
    description: 'Руководство бригадой 18 человек. Монолитные работы, кровля, фасад. Сдача объекта в срок.',
  },
  {
    id: 2,
    name: 'ЖК "GreenLine Headliner Exclusive"',
    type: 'Жилой комплекс',
    role: 'Foreman B',
    from: '2024-02',
    to: null,
    description: 'Контроль внутренней отделки и инженерных систем. Координация субподрядчиков по MEP.',
  },
]

const EMPTY_PROJECT = { name: '', type: 'Жилой комплекс', role: '', from: '', to: '', description: '' }

export default function ExperienceProfile() {
  const [showCertModal, setShowCertModal] = useState(false)
  const [certForm, setCertForm] = useState({ name: '', type: 'Сертификат', issued: '', expires: '', provider: '' })
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT)
  const [corpItems, setCorpItems] = useState(CORP_ITEMS)
  const [enrollCert, setEnrollCert] = useState(null)
  const [enrollForm, setEnrollForm] = useState({ date: '', comment: '' })
  const [enrollSent, setEnrollSent] = useState(false)
  const navigate = useNavigate()
  const { setOverallScore } = useProfile()
  const { isMobile } = useBreakpoint()

  function openEnroll(cert) {
    setEnrollCert(cert)
    setEnrollForm({ date: '', comment: '' })
    setEnrollSent(false)
  }

  function submitEnroll() {
    setEnrollSent(true)
  }

  function toggleCorp(id) {
    setCorpItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function saveProject() {
    if (!projectForm.name.trim()) return
    setProjects(prev => [...prev, { ...projectForm, id: Date.now() }])
    setProjectForm(EMPTY_PROJECT)
    setShowProjectModal(false)
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const profileScore = (() => {
    let score = 1.5                                                    // HR данные всегда есть
    score += 0.5                                                       // казахский подтверждён
    if (certs.filter(c => c.status === 'Действителен').length > 0) score += 0.5
    if (projects.length === 1) score += 1.0
    else if (projects.length === 2) score += 1.5
    else if (projects.length >= 3) score += 2.5
    return Math.min(parseFloat(score.toFixed(1)), 5.0)
  })()

  const profilePct = Math.round((profileScore / 5) * 100)

  const profileDetail = (() => {
    if (projects.length === 0) return `Заполнено ${profilePct}% — добавьте проекты для повышения рейтинга`
    if (projects.length === 1) return `Заполнено ${profilePct}% — добавьте ещё проекты`
    if (projects.length === 2) return `Заполнено ${profilePct}% — хороший профиль`
    return `Заполнено ${profilePct}% — профиль заполнен`
  })()

  const corpChecked = corpItems.filter(i => i.checked).length
  const corpScore = parseFloat((corpChecked === 3 ? 5.0 : corpChecked === 2 ? 3.3 : corpChecked === 1 ? 1.7 : 0).toFixed(1))

  const overallScore = parseFloat(
    (RATING_COMPONENTS.reduce((sum, c) => {
      const s = c.label === 'Заполненность профиля' ? profileScore
              : c.label === 'Корпоративная активность' ? corpScore
              : c.score
      return sum + s * c.weight
    }, 0) / 100).toFixed(1)
  )

  useEffect(() => { setOverallScore(overallScore) }, [overallScore])

  return (
    <div style={{ padding: isMobile ? 16 : '24px 32px' }}>
      <div style={{ background: '#f8f9fc', border: '1px solid #e0e6ef', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#4a6275' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>bar_chart</span> Профиль опыта объединяет данные о вашей производственной деятельности, участии в корпоративных инициативах и программах BI Group.
      </div>

      <Section title="Рейтинг профиля">
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          {/* Радар */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <RadarChart
              size={280}
              showLabels
              scores={RATING_COMPONENTS.map(c => {
                if (c.label === 'Заполненность профиля') return profileScore
                if (c.label === 'Корпоративная активность') return corpScore
                return c.score
              })}
              shortLabels={RATING_COMPONENTS.map(c => c.shortLabel)}
            />
            <div style={{ marginTop: 4, textAlign: 'center' }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#4361ee' }}>{overallScore}</span>
              <span style={{ fontSize: 12, color: '#9aafbd', marginLeft: 4 }}>/ 5.0</span>
            </div>
            <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 2 }}>Взвешенный рейтинг</div>
          </div>

          {/* Компоненты — компактный список */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RATING_COMPONENTS.map(c => {
              const score  = c.label === 'Заполненность профиля' ? profileScore
                           : c.label === 'Корпоративная активность' ? corpScore
                           : c.score
              const detail = c.label === 'Заполненность профиля' ? profileDetail
                           : c.label === 'Корпоративная активность' ? `${corpChecked} из 3 выполнено`
                           : c.detail
              const pct = (score / c.max) * 100
              const handleAction = () => {
                if (!c.action) return
                if (c.action.href === '#learning') {
                  document.getElementById('learning-section')?.scrollIntoView({ behavior: 'smooth' })
                } else if (c.action.href === '#projects') {
                  document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })
                } else if (c.action.href === '#corporate') {
                  document.getElementById('corporate-section')?.scrollIntoView({ behavior: 'smooth' })
                } else if (c.action.href === '#superapp') {
                  document.getElementById('superapp-section')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate(c.action.href, c.action.state ? { state: c.action.state } : undefined)
                }
              }
              return (
                <div key={c.label} style={{ padding: '8px 10px', borderRadius: 8, background: '#fafbfc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: c.color, flexShrink: 0 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f1923', flex: 1 }}>{c.label}</span>
                    <span style={{ fontSize: 10, color: '#b0bec5' }}>вес {c.weight}%</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.color, minWidth: 24, textAlign: 'right' }}>{score}</span>
                    <span style={{ fontSize: 10, color: '#9aafbd' }}>/5</span>
                  </div>
                  <div style={{ height: 4, background: '#e8edf2', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <span style={{ fontSize: 10, color: '#b0bec5' }}>{detail}</span>
                    {c.action && (
                      <button onClick={handleAction} style={{ fontSize: 10, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}>
                        {c.action.label} →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      <Section title="Опыт в Компании">
        {/* Ключевые показатели */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Стаж в BI Group', value: '4 г 11 мес', icon: 'calendar_today', color: '#4361ee' },
            { label: 'Текущая должность', value: 'Foreman B', icon: 'badge', color: '#059669' },
            { label: 'Рейтинг профиля', value: `${overallScore} / 5.0`, icon: 'star', color: '#d97706' },
            { label: 'Казахский язык', value: 'B2', icon: 'translate', color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ background: '#f8f9fc', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.color, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f1923' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* История должностей */}
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9aafbd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>История должностей</div>
        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{ position: 'absolute', left: 5, top: 4, bottom: 4, width: 2, background: '#e8edf2' }} />
          {workHistory.map((w, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i < workHistory.length - 1 ? 14 : 0, paddingLeft: 16 }}>
              <div style={{ position: 'absolute', left: -6, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#4361ee' : '#e8edf2', border: `2px solid ${i === 0 ? '#4361ee' : '#c8d0e0'}` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>{w.role}</span>
                <span style={{ fontSize: 12, color: '#7a8fa0' }}>{w.org}</span>
                <span style={{ fontSize: 11, color: '#9aafbd' }}>·</span>
                <span style={{ fontSize: 11, color: '#9aafbd' }}>{w.from} — {w.to ?? 'по настоящее время'}</span>
                <span style={{ fontSize: 11, background: i === 0 ? '#eef0ff' : '#f0f2f8', color: i === 0 ? '#4361ee' : '#7a8fa0', padding: '1px 8px', borderRadius: 10, fontWeight: 500 }}>{w.tenure}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: '#ef4444' }}>
          * В случае отображения некорректной информации, обратитесь к своему HR Менеджеру
        </div>
      </Section>

      <Section title="Мои проекты" id="projects-section" action={<button style={btnPrimary} onClick={() => setShowProjectModal(true)}>+ Добавить проект</button>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, background: '#f8f9fc', borderRadius: 8, padding: '8px 12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#4361ee' }}>account_circle</span>
          <span style={{ fontSize: 12, color: '#4a6275' }}>Заполненность профиля</span>
          <div style={{ flex: 1, height: 5, background: '#e8edf2', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${profilePct}%`, background: '#4361ee', borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4361ee', whiteSpace: 'nowrap' }}>{profilePct}%</span>
          {projects.length < 3 && (
            <span style={{ fontSize: 11, color: '#9aafbd', whiteSpace: 'nowrap' }}>+{projects.length === 0 ? 30 : projects.length === 1 ? 20 : 10}% за проект</span>
          )}
        </div>
        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#9aafbd', fontSize: 13 }}>
            Добавьте проекты, в которых вы участвовали как член команды
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map(p => (
            <div key={p.id} style={{ border: '1px solid #e8edf2', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#4361ee' }}>apartment</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923' }}>{p.name}</div>
                  <button onClick={() => deleteProject(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cdd5e0', flexShrink: 0, padding: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, background: '#f0f4ff', color: '#4361ee', padding: '1px 7px', borderRadius: 6, fontWeight: 500 }}>{p.type}</span>
                  <span style={{ fontSize: 11, color: '#9aafbd' }}>{p.role}</span>
                  <span style={{ fontSize: 11, color: '#9aafbd' }}>·</span>
                  <span style={{ fontSize: 11, color: '#9aafbd' }}>{p.from?.slice(0, 7).replace('-', '.')} — {p.to ? p.to.slice(0, 7).replace('-', '.') : 'по наст. время'}</span>
                </div>
                {p.description && (
                  <div style={{ fontSize: 11, color: '#7a8fa0', marginTop: 5, lineHeight: 1.5 }}>{p.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Рейтинг результативности в SuperApp */}
      <Section title="Рейтинг результативности в SuperApp" id="superapp-section">
        {/* Заголовочная строка — текущий балл */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f3f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#7c3aed' }}>speed</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#7a8fa0', marginBottom: 2 }}>Текущий индекс результативности</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: '#7c3aed' }}>4.0</span>
              <span style={{ fontSize: 14, color: '#9aafbd' }}>/ 5.0</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: '#9aafbd', marginBottom: 4 }}>Для макс. балла</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#d97706' }}>4.5</span>
              <span style={{ fontSize: 10, color: '#9aafbd' }}>/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: '#9aafbd' }}>
            <span>0</span>
            <span style={{ color: '#d97706', fontWeight: 600 }}>порог 4.5</span>
            <span>5.0</span>
          </div>
          <div style={{ position: 'relative', height: 10, background: '#f0f2f8', borderRadius: 5, overflow: 'hidden' }}>
            {/* Заливка до 4.0 */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: 5, transition: 'width 0.4s' }} />
            {/* Зазор до порога 4.5 — оранжевый штрих */}
            <div style={{ position: 'absolute', left: '80%', top: 0, bottom: 0, width: 'calc(10% - 2px)', background: 'rgba(217,119,6,0.18)', borderRadius: '0 5px 5px 0' }} />
          </div>
          {/* Маркер порога */}
          <div style={{ position: 'relative', height: 0 }}>
            <div style={{ position: 'absolute', left: '90%', top: -12, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: 1, height: 8, background: '#d97706', marginTop: -6 }} />
            </div>
          </div>
        </div>

        {/* Подвал — источник */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '8px 12px', background: '#f8f9fc', borderRadius: 8, fontSize: 11, color: '#9aafbd' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
          Данные синхронизируются автоматически из SuperApp
        </div>
      </Section>

      <Section title="Корпоративная жизнь" id="corporate-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          {corpItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `1px solid ${item.checked ? '#a7f3d0' : '#e8edf2'}`, background: item.checked ? '#f0fdf4' : '#fafafa' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: item.checked ? '#059669' : '#d0d7e5', flexShrink: 0 }}>
                {item.checked ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0f1923' }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 11, color: '#7a8fa0', marginTop: 1 }}>{item.sub}</div>}
              </div>
              {item.value !== null ? (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: item.value >= 4 ? '#059669' : '#ef4444' }}>{item.value}</span>
                  <span style={{ fontSize: 11, color: '#9aafbd' }}> / 5</span>
                </div>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 600, color: item.checked ? '#059669' : '#9aafbd' }}>
                  {item.checked ? 'Выполнено' : 'Не выполнено'}
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fc', borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7a8fa0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
            Данные заполняются HR-менеджером на основе корпоративных документов
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: corpScore === 5 ? '#059669' : '#d97706' }}>
            {corpChecked} / 3 → {corpScore} баллов
          </div>
        </div>
      </Section>

      <Section title="Программы обучения" id="learning-section" warning={
        certs.filter(c => c.status === 'Истёк').map(c => (
          <div key={c.name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: '#fff7ed', border: '1px solid #fed7aa',
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, flexShrink: 0, color: '#ea580c' }}>warning</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 2 }}>
                Сертификат просрочен: {c.name}
              </div>
              <div style={{ fontSize: 11, color: '#b45309' }}>
                Истёк {c.expires} · Требуется переаттестация
              </div>
            </div>
            <button onClick={() => openEnroll(c)} style={{
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: '#ea580c', color: '#fff', fontSize: 12,
              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              Записаться →
            </button>
          </div>
        ))
      }>
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {[
            { label: 'Программ пройдено', value: learningHistory.flatMap(q => q.programs).filter(p => p.status === 'done').length, color: '#059669' },
            { label: 'В процессе', value: learningHistory.flatMap(q => q.programs).filter(p => p.status === 'in-progress').length, color: '#d97706' },
            { label: 'Часов обучения', value: learningHistory.flatMap(q => q.programs).filter(p => p.status === 'done').reduce((s, p) => s + p.hours, 0), color: '#4361ee' },
            { label: 'Сертификатов получено', value: learningHistory.flatMap(q => q.programs).filter(p => p.cert).length, color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: '#f8f9fc', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#7a8fa0', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: '#f0f2f8' }} />
          {learningHistory.map(quarter => (
            <div key={quarter.quarter} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ position: 'absolute', left: 0, width: 14, height: 14, borderRadius: '50%', background: '#4361ee', border: '2px solid #fff', boxShadow: '0 0 0 2px #c7d2fe' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4361ee' }}>{quarter.quarter}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {quarter.programs.map(p => (
                  <div key={p.name} style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: p.status === 'done' ? '#d1fae5' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: p.status === 'done' ? '#059669' : '#d97706' }}>{p.status === 'done' ? 'check_circle' : 'auto_stories'}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0f1923', marginBottom: 3 }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#7a8fa0' }}>
                        <span>{p.provider}</span>
                        <span>·</span>
                        <span>{p.date}</span>
                        <span>·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> {p.hours} ч</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {p.cert && <span style={{ fontSize: 10, background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><span className="material-symbols-outlined" style={{ fontSize: 12 }}>workspace_premium</span> Сертификат</span>}
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: p.status === 'done' ? '#d1fae5' : '#fef3c7', color: p.status === 'done' ? '#059669' : '#d97706' }}>
                        {p.status === 'done' ? 'Пройдено' : 'В процессе'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {showProjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 480, maxWidth: '92vw' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 20 }}>Добавить проект</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={labelStyle}>Название объекта / проекта *</div>
                <input value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Напр., ЖК Нурлы Тау — 3-я очередь"
                  style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={labelStyle}>Тип объекта</div>
                  <select value={projectForm.type} onChange={e => setProjectForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                    {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={labelStyle}>Ваша роль</div>
                  <input value={projectForm.role} onChange={e => setProjectForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Напр., Foreman A, мастер участка"
                    style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={labelStyle}>Начало</div>
                  <input type="month" value={projectForm.from} onChange={e => setProjectForm(f => ({ ...f, from: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <div style={labelStyle}>Окончание (пусто — по наст. время)</div>
                  <input type="month" value={projectForm.to} onChange={e => setProjectForm(f => ({ ...f, to: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div>
                <div style={labelStyle}>Описание вклада (опционально)</div>
                <textarea value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Что вы делали на этом объекте?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowProjectModal(false)} style={btnOutline}>Отмена</button>
              <button onClick={saveProject} style={{ ...btnPrimary, opacity: projectForm.name.trim() ? 1 : 0.5 }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 440, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 20 }}>Добавить сертификат</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 4 }}>Название *</div>
                <input value={certForm.name} onChange={e => setCertForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Напр., Удостоверение по охране труда"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 4 }}>Тип</div>
                <select value={certForm.type} onChange={e => setCertForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none' }}>
                  {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 4 }}>Организация-выдавщик</div>
                <input value={certForm.provider} onChange={e => setCertForm(f => ({ ...f, provider: e.target.value }))}
                  placeholder="Напр., BI University, Buildex Training Center, BILIM"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 4 }}>Дата выдачи</div>
                  <input type="date" value={certForm.issued} onChange={e => setCertForm(f => ({ ...f, issued: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 4 }}>Срок действия до</div>
                  <input type="date" value={certForm.expires} onChange={e => setCertForm(f => ({ ...f, expires: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowCertModal(false)} style={btnOutline}>Отмена</button>
              <button onClick={() => setShowCertModal(false)} style={btnPrimary}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {enrollCert && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {enrollSent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#059669' }}>check_circle</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#0f1923', marginBottom: 8 }}>Заявка отправлена</div>
                <div style={{ fontSize: 13, color: '#7a8fa0', lineHeight: 1.6, marginBottom: 6 }}>
                  Менеджер по обучению получит заявку и свяжется с вами для подтверждения даты.
                </div>
                <div style={{ fontSize: 12, color: '#9aafbd', marginBottom: 24 }}>
                  В будущем этот процесс будет автоматически обрабатываться через систему.
                </div>
                <button onClick={() => setEnrollCert(null)} style={btnPrimary}>Закрыть</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 4 }}>Запись на переаттестацию</div>
                    <div style={{ fontSize: 12, color: '#7a8fa0' }}>Заявка будет направлена менеджеру по обучению</div>
                  </div>
                  <button onClick={() => setEnrollCert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9aafbd', padding: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                  </button>
                </div>

                {/* Инфо о сертификате */}
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ea580c', flexShrink: 0, marginTop: 1 }}>workspace_premium</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>{enrollCert.name}</div>
                    <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>Истёк {enrollCert.expires} · {enrollCert.type}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={labelStyle}>Организация</div>
                    <input value={enrollCert.provider} readOnly
                      style={{ ...inputStyle, background: '#f8f9fc', color: '#4a6275', cursor: 'default' }} />
                  </div>
                  <div>
                    <div style={labelStyle}>Желаемая дата прохождения</div>
                    <input type="date" value={enrollForm.date}
                      onChange={e => setEnrollForm(f => ({ ...f, date: e.target.value }))}
                      style={inputStyle} />
                  </div>
                  <div>
                    <div style={labelStyle}>Комментарий (необязательно)</div>
                    <textarea
                      value={enrollForm.comment}
                      onChange={e => setEnrollForm(f => ({ ...f, comment: e.target.value }))}
                      placeholder="Напр., предпочтительное время, группа или другие пожелания"
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '10px 14px', marginTop: 16, fontSize: 11, color: '#4a6275', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#4361ee', flexShrink: 0, marginTop: 1 }}>info</span>
                  В продакшене заявка автоматически уйдёт ответственному менеджеру по обучению с привязкой к процессу согласования.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                  <button onClick={() => setEnrollCert(null)} style={btnOutline}>Отмена</button>
                  <button onClick={submitEnroll} style={{ ...btnPrimary, background: '#ea580c' }}>
                    Отправить заявку
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Section title="Сертификаты" action={<button style={btnPrimary} onClick={() => setShowCertModal(true)}>+ Добавить</button>}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#7a8fa0' }}>Сортировка:</span>
          <select style={{ fontSize: 12, border: '1px solid #e0e6ef', borderRadius: 6, padding: '2px 8px', color: '#4a6275' }}>
            <option>Дата выдачи</option><option>Срок истечения</option>
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f2f8' }}>
              {['Сертификат', 'Тип', 'Статус', 'Дата выдачи', 'Дата истечения'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7a8fa0', fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #f0f2f8' }}>
                <td style={{ padding: '10px 12px', color: '#0f1923', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff' }}>workspace_premium</span>
                    </div>
                    {c.name}
                  </div>
                </td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{c.type}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: c.status === 'Действителен' ? '#d1fae5' : '#fee2e2', color: c.status === 'Действителен' ? '#059669' : '#dc2626' }}>{c.status}</span>
                </td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{c.issued}</td>
                <td style={{ padding: '10px 12px', color: c.expires ? (c.status === 'Истёк' ? '#dc2626' : '#4a6275') : '#9aafbd' }}>{c.expires ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  )
}


function Section({ title, children, action, id, warning }) {
  return (
    <div id={id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>{title}</div>
        {action}
      </div>
      {warning}
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#9aafbd', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#0f1923' }}>{value}</div>
    </div>
  )
}

function RoleCard({ role, dept, date, current }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${current ? '#c7d2fe' : '#e8edf2'}`, background: current ? '#f0f4ff' : '#fafafa' }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: current ? '#4361ee' : '#0f1923' }}>{role} {current && <span style={{ fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 10 }}>текущая</span>}</div>
      <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 2 }}>{dept} · с {date}</div>
    </div>
  )
}

const btnPrimary = { padding: '7px 16px', borderRadius: 7, border: 'none', background: '#4361ee', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }
const btnOutline = { padding: '7px 16px', borderRadius: 7, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 12, cursor: 'pointer' }
const labelStyle = { fontSize: 12, color: '#7a8fa0', marginBottom: 4 }
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d7e5', fontSize: 13, outline: 'none', boxSizing: 'border-box' }
