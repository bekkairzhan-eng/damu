const RATING_COMPONENTS = [
  {
    label: 'Подтверждённые навыки',
    weight: 30,
    score: 4.3,
    max: 5,
    detail: '13 из 19 навыков плана подтверждены',
    icon: '🎯',
    color: '#4361ee',
    action: { label: 'Перейти к навыкам', href: '/dashboard/my-skills' },
  },
  {
    label: 'Активность обучения',
    weight: 25,
    score: 4.5,
    max: 5,
    detail: '64 часа обучения · 5 курсов · 4 сертификата',
    icon: '📚',
    color: '#059669',
    action: { label: 'Мои программы', href: '#learning' },
  },
  {
    label: 'Результат аттестации',
    weight: 25,
    score: 4.0,
    max: 5,
    detail: 'Аттестация Foreman B · Авг 2024',
    icon: '📋',
    color: '#7c3aed',
    action: { label: 'Готовность к оценке', href: '/plans', state: { planId: 1, tab: 'Готовность к оценке' } },
  },
  {
    label: 'Заполненность профиля',
    weight: 10,
    score: 3.5,
    max: 5,
    detail: 'Заполнено 70% — добавьте проекты и достижения',
    icon: '👤',
    color: '#d97706',
    action: null,
  },
  {
    label: 'Корпоративная активность',
    weight: 10,
    score: 3.8,
    max: 5,
    detail: 'Участие в 2 инициативах BI Group',
    icon: '🤝',
    color: '#0891b2',
    action: null,
  },
]

const learningHistory = [
  {
    quarter: 'Q2 2025',
    programs: [
      { name: 'Управление строительным проектом: уровень Foreman C', provider: 'BI Group Academy', date: 'Апр 2025', status: 'in-progress', hours: 16, cert: false },
      { name: 'Lean Construction: инструменты и практика', provider: 'BI Group Academy', date: 'Май 2025', status: 'in-progress', hours: 12, cert: false },
    ],
  },
  {
    quarter: 'Q1 2025',
    programs: [
      { name: 'Нормативная база строительства РК (обновление 2024)', provider: 'BI Group Academy', date: 'Янв 2025', status: 'done', hours: 8, cert: true },
      { name: 'Охрана труда и ТБ — переаттестация', provider: 'Внешний провайдер', date: 'Янв 2025', status: 'done', hours: 4, cert: true },
    ],
  },
  {
    quarter: 'Q3 2024',
    programs: [
      { name: 'BIM-технологии: базовый курс', provider: 'Autodesk', date: 'Авг 2024', status: 'done', hours: 20, cert: true },
      { name: 'MS Project: основы планирования', provider: 'BI Group Academy', date: 'Сен 2024', status: 'done', hours: 6, cert: false },
    ],
  },
  {
    quarter: 'Q1 2024',
    programs: [
      { name: 'Корпоративный онбординг Foreman B', provider: 'BI Development', date: 'Янв 2024', status: 'done', hours: 24, cert: false },
      { name: 'Lean Construction: введение', provider: 'BI Group Academy', date: 'Фев 2024', status: 'done', hours: 8, cert: true },
    ],
  },
]

const certs = [
  { name: 'Удостоверение по охране труда и ТБ (РК)', type: 'Сертификат', status: 'Действителен', issued: '15 Мар 2024', expires: '15 Мар 2027' },
  { name: 'Технический надзор в строительстве', type: 'Сертификат', status: 'Действителен', issued: '20 Янв 2024', expires: '20 Янв 2027' },
  { name: 'BIM-технологии: базовый курс (Autodesk)', type: 'Сертификат', status: 'Действителен', issued: '10 Июн 2023', expires: null },
  { name: 'Lean Construction (BI Group)', type: 'Сертификат', status: 'Действителен', issued: '05 Авг 2023', expires: null },
  { name: 'Пожарная безопасность (уровень 2)', type: 'Сертификат', status: 'Истёк', issued: '01 Янв 2022', expires: '01 Янв 2024' },
]

const industryExp = [
  { industry: 'Жилое строительство', sub: '', total: '2 г 3 мес', latest: '01 Июн 2026' },
  { industry: 'Коммерческая недвижимость', sub: '', total: '1 г 1 мес', latest: '28 Авг 2025' },
  { industry: 'Инфраструктурные объекты', sub: 'Badge', total: '8 мес', latest: '02 Фев 2025' },
  { industry: 'Промышленное строительство', sub: '', total: '4 мес', latest: '01 Окт 2024' },
]

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CERT_TYPES = ['Сертификат', 'Удостоверение', 'Диплом', 'Свидетельство']

export default function ExperienceProfile() {
  const [showCertModal, setShowCertModal] = useState(false)
  const [certForm, setCertForm] = useState({ name: '', type: 'Сертификат', issued: '', expires: '', provider: '' })
  const navigate = useNavigate()

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ background: '#f8f9fc', border: '1px solid #e0e6ef', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#4a6275' }}>
        📊 Профиль опыта объединяет данные о вашей производственной деятельности, участии в корпоративных инициативах и программах BI Group.
      </div>

      <Section title="Рейтинг профиля">
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Общий балл */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <RatingGauge score={4.1} />
            <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 6 }}>Общий рейтинг</div>
            <div style={{ fontSize: 11, color: '#9aafbd', marginTop: 2 }}>#3 среди Foreman B</div>
          </div>

          {/* Компоненты */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {RATING_COMPONENTS.map(c => {
              const pct = (c.score / c.max) * 100
              const handleAction = () => {
                if (!c.action) return
                if (c.action.href === '#learning') {
                  document.getElementById('learning-section')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate(c.action.href, c.action.state ? { state: c.action.state } : undefined)
                }
              }
              return (
                <div key={c.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 15 }}>{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f1923', flex: 1 }}>{c.label}</span>
                    {c.action ? (
                      <button onClick={handleAction} style={{ fontSize: 11, color: '#4361ee', background: 'none', border: 'none', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}>
                        {c.action.label} →
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#cdd5e0' }}>скоро</span>
                    )}
                    <span style={{ fontSize: 11, color: '#9aafbd', marginLeft: 8 }}>вес {c.weight}%</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.color, minWidth: 28, textAlign: 'right' }}>{c.score}</span>
                    <span style={{ fontSize: 11, color: '#9aafbd' }}>/ 5</span>
                  </div>
                  <div style={{ height: 6, background: '#f0f2f8', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#9aafbd' }}>{c.detail}</div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      <Section title="Общий опыт">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoRow label="Стаж работы в BI Group" value="4 года 11 месяцев" />
            <InfoRow label="Опыт на текущей должности" value="2 года 6 месяцев" />
            <InfoRow label="Подтверждённый уровень казахского" value={<span>B2 <span style={{ fontSize: 11, color: '#7a8fa0' }}>· Подтверждён 12 Мар 2024</span></span>} />
            <InfoRow label="Рейтинг профиля сотрудника" value={<span style={{ fontWeight: 700, color: '#4361ee' }}>#3 (4.1)</span>} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RoleCard role="Foreman B" dept="BI Development" date="01 Янв 2024" current />
            <RoleCard role="Foreman A" dept="BI Development" date="17 Июл 2021" />
          </div>
        </div>
      </Section>

      <Section title="Отраслевой опыт">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f2f8' }}>
              {['Отрасль / Подотрасль', 'Общий стаж', 'Последний опыт', 'Текущие проекты'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#7a8fa0', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {industryExp.map(row => (
              <tr key={row.industry} style={{ borderBottom: '1px solid #f0f2f8' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500, color: '#0f1923' }}>{row.industry} {row.sub && <span style={{ fontSize: 10, background: '#4361ee', color: '#fff', padding: '1px 6px', borderRadius: 10, marginLeft: 4 }}>Badge</span>}</td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{row.total}</td>
                <td style={{ padding: '10px 12px', color: '#4a6275' }}>{row.latest}</td>
                <td style={{ padding: '10px 12px', color: '#9aafbd' }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Программы обучения" id="learning-section">
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
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: p.status === 'done' ? '#d1fae5' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                      {p.status === 'done' ? '✅' : '📖'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0f1923', marginBottom: 3 }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#7a8fa0' }}>
                        <span>{p.provider}</span>
                        <span>·</span>
                        <span>{p.date}</span>
                        <span>·</span>
                        <span>⏱ {p.hours} ч</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {p.cert && <span style={{ fontSize: 10, background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>🏆 Сертификат</span>}
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
                  placeholder="Напр., BI Group Academy"
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
                      <span style={{ color: '#fff', fontSize: 12 }}>🏆</span>
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

function RatingGauge({ score }) {
  const r = 44, circ = 2 * Math.PI * r
  const offset = circ - (score / 5) * circ
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#f0f2f8" strokeWidth="9" />
      <circle cx="55" cy="55" r={r} fill="none" stroke="#4361ee" strokeWidth="9"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 55 55)" />
      <text x="55" y="51" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f1923">{score}</text>
      <text x="55" y="66" textAnchor="middle" fontSize="11" fill="#9aafbd">из 5.0</text>
    </svg>
  )
}

function Section({ title, children, action, id }) {
  return (
    <div id={id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>{title}</div>
        {action}
      </div>
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
