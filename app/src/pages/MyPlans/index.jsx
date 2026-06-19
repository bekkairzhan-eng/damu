import { useState } from 'react'
import CareerPlanDetail from './CareerPlanDetail'

const recPlans = [
  { id: 1, title: 'Стать Foreman C', from: 'Foreman B', dept: 'BI Development', progress: 15, total: 21, deadline: '06 Фев 2027', pinned: true },
  { id: 2, title: 'План развития на основе оценки', from: 'Foreman B', dept: 'BI Development', noData: true },
  { id: 3, title: 'Предыдущий карьерный план', from: 'Foreman A', dept: 'BI Development', progress: 18, total: 19, deadline: '30 Авг 2024', expired: true, pinned: true },
]

const PLAN_TYPES = ['Обратная связь', 'Наставничество', 'Проект', 'Адаптация', 'Вклад в команду', 'OKR', 'KPI', 'Вектор навыков']

export default function MyPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showModal, setShowModal] = useState(false)

  if (selectedPlan) return <CareerPlanDetail plan={selectedPlan} onBack={() => setSelectedPlan(null)} />

  return (
    <div style={{ padding: '28px 32px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>Мои планы</h1>
      <p style={{ color: '#7a8fa0', fontSize: 14, marginBottom: 28 }}>Станьте профессионалом, которым вы всегда хотели быть</p>

      <Section title="Рекомендовано для роста" subtitle="Планы, рекомендованные вам для дальнейшего развития">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {recPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} onClick={() => setSelectedPlan(plan)} />
          ))}
        </div>
      </Section>

      <Section title="Личные планы" subtitle="Планы, созданные вами, вашим руководителем, HR-партнёром или советником по навыкам">
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => setShowModal(true)} style={{
            width: 220, height: 120, border: '2px dashed #d0d7e5', borderRadius: 12,
            background: '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, color: '#4361ee',
            fontSize: 13, fontWeight: 500,
          }}>
            <span style={{ fontSize: 24 }}>+</span> Добавить план
          </button>
        </div>
      </Section>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 400, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 20 }}>Выберите тип личного плана</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {PLAN_TYPES.map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#1a2b3c' }}>
                  <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#4361ee' }} />
                  {t}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={btnOutline}>Пропустить</button>
              <button onClick={() => setShowModal(false)} style={btnPrimary}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, subtitle, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f1923' }}>{title}</h2>
        <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9aafbd', fontSize: 16 }}>{open ? '▴' : '▾'}</button>
      </div>
      <p style={{ fontSize: 12, color: '#9aafbd', marginBottom: 16 }}>{subtitle}</p>
      {open && children}
    </div>
  )
}

function PlanCard({ plan, onClick }) {
  const pct = plan.noData ? 0 : Math.round((plan.progress / plan.total) * 100)
  return (
    <div onClick={onClick} style={{
      minWidth: 220, flex: 1, maxWidth: 300, border: '1px solid #e8edf2', borderRadius: 12, padding: 16,
      background: '#fff', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎯</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {plan.pinned && <span title="Закреплён" style={{ color: '#4361ee', fontSize: 14 }}>📌</span>}
          <span style={{ color: '#cdd5e0', cursor: 'pointer' }}>⋮</span>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f1923', marginBottom: 4, lineHeight: 1.3 }}>{plan.title}</div>
      <div style={{ fontSize: 11, color: '#7a8fa0', marginBottom: 12 }}>{plan.from} · {plan.dept}</div>
      {plan.noData ? (
        <div style={{ fontSize: 11, color: '#9aafbd', lineHeight: 1.4 }}>Навыки не указаны. Получите персональные рекомендации по итогам оценки!</div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#7a8fa0' }}>Прогресс плана</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{plan.progress}/{plan.total}</span>
          </div>
          <div style={{ height: 5, background: '#f0f2f8', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#4361ee', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: plan.expired ? '#ef4444' : '#7a8fa0' }}>⏱ Срок: {plan.deadline}</div>
        </>
      )}
    </div>
  )
}

const btnPrimary = { padding: '8px 20px', borderRadius: 8, border: 'none', background: '#4361ee', color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }
const btnOutline = { padding: '8px 20px', borderRadius: 8, border: '1px solid #d0d7e5', background: '#fff', color: '#4a6275', fontSize: 13, cursor: 'pointer' }
