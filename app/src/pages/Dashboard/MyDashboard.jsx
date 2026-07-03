import { plan1TotalSkills, plan1DevelopedSkills, plan1TotalLearning, plan1DoneLearning } from '../../data/careerPlan1'

const POSITION_RANKING = [
  { name: 'Алибек Жанов',       score: 4.7, isMe: false },
  { name: 'Нурлан Сейтжанов',   score: 4.5, isMe: false },
  { name: 'Каиржан Бектембаев', score: 4.3, isMe: true  },
  { name: 'Серик Абенов',       score: 4.1, isMe: false },
  { name: 'Жандос Мухамедов',   score: 3.9, isMe: false },
  { name: 'Дамир Ержанов',      score: 3.8, isMe: false },
  { name: 'Бауыржан Сатов',     score: 3.7, isMe: false },
]

const GENERAL_RANKING = [
  { name: 'Арман Сейткали',     position: 'Site Engineer A', score: 4.9 },
  { name: 'Алибек Жанов',       position: 'Foreman B',       score: 4.7 },
  { name: 'Марат Айтжанов',     position: 'Site Manager',    score: 4.6 },
  { name: 'Нурлан Сейтжанов',   position: 'Foreman B',       score: 4.5 },
  { name: 'Ерлан Қасымов',      position: 'Foreman A',       score: 4.4 },
  { name: 'Каиржан Бектембаев', position: 'Foreman B',       score: 4.3, isMe: true },
  { name: 'Серик Абенов',       position: 'Foreman B',       score: 4.1 },
  { name: 'Дания Омарова',      position: 'Site Engineer B', score: 4.0 },
  { name: 'Жандос Мухамедов',   position: 'Foreman B',       score: 3.9 },
  { name: 'Бауыржан Сатов',     position: 'Foreman B',       score: 3.7 },
]

const BASE_PLANS = [
  {
    id: 2, title: 'План развития на основе оценки',
    from: 'Foreman B', dept: 'BI Development',
    noData: true, icon: 'settings',
  },
  {
    id: 3, title: 'Предыдущий карьерный план',
    from: 'Foreman C', dept: 'BI Development',
    progress: 18, total: 19, deadline: '30 Авг 2024', expired: true, icon: 'description',
  },
]

const INITIAL_PENDING = [
  { id: 1, label: 'BIM-технологии (Revit)', level: 2, source: 'Курс завершён в BILIM' },
  { id: 2, label: 'Lean Construction', level: 1, source: 'Активность на площадке' },
  { id: 3, label: 'Управление субподрядчиками', level: 3, source: 'Данные аттестации' },
  { id: 4, label: 'Контроль качества строительства', level: 2, source: 'Данные аттестации' },
  { id: 5, label: 'Last Planner System', level: 1, source: 'Курс завершён в BI University' },
  { id: 6, label: 'Полевая отчётность и документация', level: 2, source: 'Активность в системе' },
  { id: 7, label: 'Проведение инструктажей по ОТиТБ', level: 3, source: 'Данные аттестации' },
  { id: 8, label: 'Управление материалами и поставками', level: 2, source: 'Активность на площадке' },
]

const notifications = [
  { text: 'В ваш план по должности добавлен новый курс', time: '1 день назад', type: 'plan' },
  { text: 'Навык "Lean Construction" подтверждён', time: '3 дня назад', type: 'skill' },
]

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../../ProfileContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { RATING_COMPONENTS } from '../../data/ratingData'
import { RadarChart } from '../../components/RadarChart'

export default function MyDashboard() {
  const navigate = useNavigate()
  const { overallScore } = useProfile()
  const { isMobile, isTablet } = useBreakpoint()
  const [savedGoal] = useLocalStorage('careermap:goal', 'Foreman A')
  const [pending, setPending] = useLocalStorage('dashboard:pending', INITIAL_PENDING)
  const [confirmed, setConfirmed] = useLocalStorage('dashboard:confirmed', [])

  const activePlan = {
    id: 1, title: `Стать ${savedGoal}`,
    from: 'Foreman B', to: savedGoal, dept: 'BI Development',
    skills: { done: plan1DevelopedSkills, total: plan1TotalSkills },
    learning: { done: plan1DoneLearning, total: plan1TotalLearning },
    deadline: '06 Фев 2027', icon: null,
  }
  const plans = [activePlan, ...BASE_PLANS]

  function confirm(skill) {
    setConfirmed(prev => [...prev, skill])
    setPending(prev => prev.filter(s => s.id !== skill.id))
  }

  function reject(id) {
    setPending(prev => prev.filter(s => s.id !== id))
  }
  const gridCols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : '260px 1fr 280px'
  const pad = isMobile ? '16px' : '28px 32px'

  return (
    <div style={{ padding: pad }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>
          Добро пожаловать, <span style={{ color: '#1a2b3c' }}>Каиржан!</span>
        </h1>
        {!isMobile && (
          <p style={{ color: '#7a8fa0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>Становитесь профессионалом, которым всегда хотели быть <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span></p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? 16 : 24 }}>
        {/* Профиль */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img src="/avatar1.png" alt="Каиржан Бектембаев"
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #c7d2fe' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f1923' }}>Каиржан Бектембаев</div>
                <div style={{ fontSize: 12, color: '#7a8fa0' }}>Foreman B</div>
                <div style={{ fontSize: 12, color: '#7a8fa0' }}>BI Development</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#9aafbd', marginBottom: 4 }}>В BI Group с 17 Июл 2021</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Chip label="Мои навыки" onClick={() => navigate('/dashboard/my-skills')} />
              <Chip label="Ключевые компетенции" onClick={() => navigate('/skills')} />
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8fa0', marginBottom: 8 }}>Рейтинг профиля</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <RadarChart
                size={120}
                showLabels={false}
                scores={RATING_COMPONENTS.map(c => c.score)}
              />
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#4361ee' }}>{overallScore}</span>
                <span style={{ fontSize: 11, color: '#9aafbd' }}>/ 5.0</span>
              </div>
            </div>
            <a href="/dashboard/experience" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#4361ee', marginTop: 8 }}>Подробнее →</a>
          </div>

          <RankingWidget />
        </div>

        {/* Центр */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Направления в фокусе</div>
              <button onClick={() => navigate('/plans')} style={{ fontSize: 12, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Все планы →</button>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              {plans.map(plan => <PlanCard key={plan.id} plan={plan} onClick={() => navigate('/plans', { state: { planId: plan.id } })} />)}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Навыки, ожидающие подтверждения</div>
              {pending.length > 0 && (
                <span style={{ fontSize: 11, background: '#4361ee', color: '#fff', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{pending.length}</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#7a8fa0', marginBottom: 14 }}>
              Система определила навыки на основе вашей активности. Подтвердите те, которыми владеете — они войдут в профиль как самозаявленные и будут проверены на аттестации.
            </div>

            {confirmed.length > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#15803d', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                Подтверждено: {confirmed.map(s => s.label).join(', ')} — добавлено в профиль навыков
              </div>
            )}

            {pending.length === 0 && confirmed.length > 0 && (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#9aafbd', fontSize: 13 }}>Все навыки обработаны</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: '1px solid #f0f2f8' }}>
                  <LevelDots level={s.level} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#1a2b3c' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 1 }}>{s.source}</div>
                  </div>
                  <button onClick={() => confirm(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #4361ee', background: 'transparent', color: '#4361ee', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>Подтвердить</button>
                  <button onClick={() => reject(s.id)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e0e0e0', background: 'transparent', color: '#7a8fa0', fontSize: 12, cursor: 'pointer' }}>Отклонить</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>Уведомления</div>
              <a href="#" style={{ fontSize: 12, color: '#4361ee' }}>Все →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: '#f8f9fc', borderLeft: '3px solid #4361ee' }}>
                  <div style={{ fontSize: 12, color: '#0f1923', marginBottom: 4, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: '#9aafbd' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RankingWidget() {
  const [showGeneral, setShowGeneral] = useState(false)
  const myRank = POSITION_RANKING.findIndex(r => r.isMe) + 1
  const total = POSITION_RANKING.length
  const list = showGeneral ? GENERAL_RANKING : POSITION_RANKING

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#7a8fa0' }}>
          {showGeneral ? 'Общий рейтинг' : 'Рейтинг среди Foreman B'}
        </div>
        {!showGeneral && (
          <span style={{ fontSize: 11, background: '#f0f4ff', color: '#4361ee', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
            #{myRank} из {total}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {list.map((p, i) => (
          <div key={p.name} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px', borderRadius: 8,
            background: p.isMe ? '#f0f4ff' : 'transparent',
            border: p.isMe ? '1px solid #c7d2fe' : '1px solid transparent',
          }}>
            <div style={{ width: 20, textAlign: 'center', flexShrink: 0 }}>
              {i === 0
                ? <span style={{ fontSize: 14 }}>🥇</span>
                : i === 1
                  ? <span style={{ fontSize: 14 }}>🥈</span>
                  : i === 2
                    ? <span style={{ fontSize: 14 }}>🥉</span>
                    : <span style={{ fontSize: 11, fontWeight: 700, color: '#9aafbd' }}>#{i + 1}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: p.isMe ? 700 : 400, color: p.isMe ? '#4361ee' : '#1a2b3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.isMe ? 'Вы' : p.name}
              </div>
              {showGeneral && p.position && (
                <div style={{ fontSize: 10, color: '#9aafbd' }}>{p.position}</div>
              )}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: p.isMe ? '#4361ee' : '#4a6275', flexShrink: 0 }}>{p.score}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowGeneral(v => !v)}
        style={{ width: '100%', padding: '7px', borderRadius: 8, border: '1px solid #d0d7e5', background: showGeneral ? '#f0f4ff' : '#fafafa', color: showGeneral ? '#4361ee' : '#4a6275', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
      >
        {showGeneral ? '← Только Foreman B' : 'Показать общий рейтинг'}
      </button>
    </div>
  )
}

function MiniProgress({ label, done, total, color }) {
  const pct = Math.round((done / total) * 100)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: '#7a8fa0' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#0f1923' }}>{done}/{total}</span>
      </div>
      <div style={{ height: 4, background: '#f0f2f8', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
      </div>
    </div>
  )
}

function PlanCard({ plan, onClick }) {
  const hasDual = plan.skills && plan.learning
  const pct = plan.noData ? 0 : hasDual ? 0 : Math.round((plan.progress / plan.total) * 100)
  return (
    <div onClick={onClick} style={{ flex: 1, border: '1px solid #e8edf2', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(67,97,238,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ fontSize: 11, color: '#9aafbd' }}>{plan.dept}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f1923', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: 6 }}>
        {plan.icon === null
          ? <img src="/target.png" alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
          : <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#7a8fa0' }}>{plan.icon}</span>}
        {plan.title}
      </div>
      {plan.noData ? (
        <div style={{ fontSize: 11, color: '#9aafbd', lineHeight: 1.4 }}>Навыки не указаны. Получите персональные рекомендации на основе оценки!</div>
      ) : hasDual ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <MiniProgress label="Навыки" done={plan.skills.done} total={plan.skills.total} color="#4361ee" />
            <MiniProgress label="Обучение" done={plan.learning.done} total={plan.learning.total} color="#059669" />
          </div>
          <div style={{ fontSize: 11, color: plan.expired ? '#ef4444' : '#7a8fa0', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> Срок: {plan.deadline}
          </div>
        </>
      ) : (
        <>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#7a8fa0' }}>Прогресс плана</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#0f1923' }}>{plan.progress}/{plan.total}</span>
            </div>
            <div style={{ height: 5, background: '#f0f2f8', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: '#4361ee', borderRadius: 3 }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: plan.expired ? '#ef4444' : '#7a8fa0', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span> Срок: {plan.deadline}
          </div>
        </>
      )}
    </div>
  )
}

function Chip({ label, onClick }) {
  return <span onClick={onClick} style={{ padding: '4px 10px', borderRadius: 20, background: '#f0f2f8', fontSize: 11, color: '#4a6275', cursor: onClick ? 'pointer' : 'default' }}>{label}</span>
}

function LevelDots({ level }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= level ? '#4361ee' : '#e0e6ef' }} />)}
    </div>
  )
}

