import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import {
  KPI_BLOCKS, KPI_ACHIEVED, KPI_RISK, KPI_STATUS, INITIAL_KPI_TASKS, INITIAL_IDP,
} from '../../data/kpiData'

// Выполнение задачи: факт/план, не выше 100% (перевыполнение в итог не идёт)
const pctOf = t => (t.plan > 0 ? Math.min(100, Math.max(0, (t.fact / t.plan) * 100)) : 0)
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0)
const fmt = n => (Math.round(n * 10) / 10).toString()

function verdict(pct) {
  if (pct >= KPI_ACHIEVED) return { label: 'Достигает', color: '#059669', bg: '#d1fae5' }
  if (pct >= KPI_RISK) return { label: 'Под риском', color: '#b45309', bg: '#fef3c7' }
  return { label: 'Не достигает', color: '#dc2626', bg: '#fee2e2' }
}

export default function MyKPI() {
  const [tasks, setTasks] = useLocalStorage('kpi:tasks', INITIAL_KPI_TASKS)
  const [status, setStatus] = useLocalStorage('kpi:status', 'approved')
  const [idp, setIdp] = useLocalStorage('kpi:idp', INITIAL_IDP)
  const [newIdp, setNewIdp] = useState({ title: '', due: '' })

  const isDraft = status === 'draft'
  const isApproved = status === 'approved'
  const totalWeight = sum(tasks, t => Number(t.weight) || 0)
  const weightOk = totalWeight === 100
  const invalidPlan = tasks.some(t => !t.name.trim() || !(Number(t.plan) > 0))
  const canSubmit = weightOk && !invalidPlan && tasks.length > 0

  // Итог: сумма (выполнение% × вес) / 100
  const total = weightOk || !isDraft ? sum(tasks, t => (pctOf(t) * t.weight) / 100) : 0
  const totalVerdict = verdict(total)

  const blocks = KPI_BLOCKS.map(b => {
    const list = tasks.filter(t => t.block === b.id)
    const w = sum(list, t => Number(t.weight) || 0)
    const pct = w > 0 ? sum(list, t => pctOf(t) * t.weight) / w : 0
    return { ...b, list, weight: w, pct }
  })
  const riskTasks = tasks.filter(t => pctOf(t) < KPI_RISK)
  const idpDone = idp.filter(i => i.done).length
  const idpPct = idp.length ? (idpDone / idp.length) * 100 : 0
  const today = new Date().toISOString().slice(0, 10)
  const idpOverdue = idp.filter(i => !i.done && i.due && i.due < today)

  const patch = (id, p) => setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...p } : t)))
  const addTask = blockId => setTasks(prev => [...prev, {
    id: 'k' + Date.now(), block: blockId, name: '', unit: '', plan: 0, fact: 0, weight: 0,
  }])
  const removeTask = id => setTasks(prev => prev.filter(t => t.id !== id))

  const addIdp = () => {
    if (!newIdp.title.trim()) return
    setIdp(prev => [...prev, { id: 'i' + Date.now(), type: 'personal', title: newIdp.title.trim(), competency: '', due: newIdp.due, done: false }])
    setNewIdp({ title: '', due: '' })
  }

  return (
    <div style={{ padding: '24px 32px', color: '#0f1923' }}>
      {/* Шапка + статус согласования */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Мои KPI</h1>
          <span style={{ ...badge, color: KPI_STATUS[status].color, background: KPI_STATUS[status].bg }}>{KPI_STATUS[status].label}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isDraft && (
            <button disabled={!canSubmit} onClick={() => setStatus('pending')}
              style={{ ...btnPrimary, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
              Отправить на согласование
            </button>
          )}
          {status === 'pending' && (
            <>
              <button onClick={() => setStatus('approved')} style={btnPrimary}>Согласовать (демо: руководитель)</button>
              <button onClick={() => setStatus('draft')} style={btnOutline}>Вернуть в черновик</button>
            </>
          )}
          {isApproved && <button onClick={() => setStatus('draft')} style={btnOutline}>Пересоздать KPI (демо)</button>}
        </div>
      </div>

      {isDraft && !weightOk && (
        <div style={{ ...notice, background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
          Сумма весов задач — {totalWeight}%, должна быть 100%. Отправить на согласование можно только после этого.
        </div>
      )}
      {isDraft && weightOk && invalidPlan && (
        <div style={{ ...notice, background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
          У каждой задачи должны быть название и плановое значение больше нуля.
        </div>
      )}

      {/* Виджеты */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <div style={cardTitle}>Общее выполнение KPI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Ring pct={total} color={totalVerdict.color} />
            <div>
              <span style={{ ...badge, color: totalVerdict.color, background: totalVerdict.bg }}>{totalVerdict.label}</span>
              <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 8, lineHeight: 1.5 }}>
                Достигает: от {KPI_ACHIEVED}%<br />Под риском: {KPI_RISK}–{KPI_ACHIEVED}%
              </div>
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={cardTitle}>Прогресс по блокам</div>
          {blocks.map(b => (
            <div key={b.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span><b>{b.name}</b> <span style={{ color: '#7a8fa0' }}>· вес {b.weight}%</span></span>
                <span style={{ color: verdict(b.pct).color, fontWeight: 600 }}>{b.list.length ? `${fmt(b.pct)}%` : '—'}</span>
              </div>
              <Bar pct={b.pct} color={b.color} />
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={cardTitle}>Риски</div>
          {riskTasks.length === 0 && idpOverdue.length === 0 && (
            <div style={{ fontSize: 13, color: '#059669' }}>Отстающих задач нет</div>
          )}
          {riskTasks.map(t => (
            <div key={t.id} style={riskRow}>
              <span>{t.name || 'Без названия'}</span>
              <b style={{ color: '#dc2626' }}>{fmt(pctOf(t))}%</b>
            </div>
          ))}
          {idpOverdue.map(i => (
            <div key={i.id} style={riskRow}>
              <span>IDP: {i.title}</span>
              <b style={{ color: '#b45309' }}>просрочено</b>
            </div>
          ))}
          <div style={{ fontSize: 12, color: '#7a8fa0', marginTop: 10 }}>
            Задачи KPI ниже {KPI_RISK}% и просроченные пункты IDP
          </div>
        </div>
      </div>

      {/* Задачи по блокам */}
      {blocks.map(b => (
        <div key={b.id} style={{ ...card, marginBottom: 16, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #e8edf2', borderLeft: `4px solid ${b.color}` }}>
            <b style={{ fontSize: 15 }}>{b.name}</b>
            <span style={{ fontSize: 12, color: '#7a8fa0' }}>вес блока {b.weight}%</span>
            {isDraft && <button onClick={() => addTask(b.id)} style={{ ...btnOutline, marginLeft: 'auto' }}>+ Задача</button>}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#7a8fa0', textAlign: 'left' }}>
                  <th style={th}>Задача</th><th style={th}>Ед.</th><th style={th}>План</th>
                  <th style={th}>Факт</th><th style={th}>Вес, %</th><th style={th}>Выполнение</th>{isDraft && <th style={th} />}
                </tr>
              </thead>
              <tbody>
                {b.list.length === 0 && (
                  <tr><td colSpan={7} style={{ ...td, color: '#7a8fa0' }}>Задач нет</td></tr>
                )}
                {b.list.map(t => (
                  <tr key={t.id}>
                    <td style={td}>{isDraft ? <input style={{ ...inp, width: 240 }} value={t.name} onChange={e => patch(t.id, { name: e.target.value })} placeholder="Название" /> : t.name}</td>
                    <td style={td}>{isDraft ? <input style={{ ...inp, width: 60 }} value={t.unit} onChange={e => patch(t.id, { unit: e.target.value })} /> : t.unit}</td>
                    <td style={td}>{isDraft ? <input type="number" style={{ ...inp, width: 80 }} value={t.plan} onChange={e => patch(t.id, { plan: Number(e.target.value) })} /> : t.plan}</td>
                    <td style={td}>
                      {isApproved
                        ? <input type="number" style={{ ...inp, width: 80 }} value={t.fact} onChange={e => patch(t.id, { fact: Number(e.target.value) })} />
                        : <span style={{ color: '#7a8fa0' }}>{isDraft ? '—' : t.fact}</span>}
                    </td>
                    <td style={td}>{isDraft ? <input type="number" style={{ ...inp, width: 64 }} value={t.weight} onChange={e => patch(t.id, { weight: Number(e.target.value) })} /> : t.weight}</td>
                    <td style={{ ...td, minWidth: 130 }}>
                      {isDraft ? <span style={{ color: '#7a8fa0' }}>—</span> : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1 }}><Bar pct={pctOf(t)} color={verdict(pctOf(t)).color} /></div>
                          <span style={{ fontSize: 12, width: 40 }}>{fmt(pctOf(t))}%</span>
                        </div>
                      )}
                    </td>
                    {isDraft && <td style={td}><button onClick={() => removeTask(t.id)} title="Удалить" style={{ ...btnOutline, padding: '2px 8px' }}>×</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div style={{ fontSize: 12, color: '#7a8fa0', margin: '-4px 0 24px' }}>
        {isApproved
          ? 'План и веса зафиксированы после согласования; вносится только факт. Выполнение задачи = факт / план (максимум 100%).'
          : 'План и веса задаются в черновике. Факт вносится после согласования руководителем.'}
        {' '}Сумма весов: <b style={{ color: weightOk ? '#059669' : '#dc2626' }}>{totalWeight}%</b>
      </div>

      {/* IDP */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ ...cardTitle, margin: 0 }}>IDP — индивидуальный план развития</div>
          <span style={{ fontSize: 12, color: '#7a8fa0' }}>Выполнено {idpDone} из {idp.length} · {fmt(idpPct)}%</span>
        </div>
        <Bar pct={idpPct} color="#10b981" />
        <div style={{ marginTop: 14 }}>
          {idp.map(i => (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #e8edf2', fontSize: 13, flexWrap: 'wrap' }}>
              <input type="checkbox" checked={i.done} onChange={() => setIdp(prev => prev.map(x => x.id === i.id ? { ...x, done: !x.done } : x))} />
              <span style={{ flex: 1, minWidth: 180, textDecoration: i.done ? 'line-through' : 'none', color: i.done ? '#7a8fa0' : '#0f1923' }}>{i.title}</span>
              <span style={{ ...badge, background: i.type === '360' ? '#e0e7ff' : '#f1f4f8', color: i.type === '360' ? '#3730a3' : '#7a8fa0' }}>
                {i.type === '360' ? `Оценка 360 · ${i.competency}` : 'Личная задача'}
              </span>
              <span style={{ fontSize: 12, color: !i.done && i.due && i.due < today ? '#dc2626' : '#7a8fa0' }}>до {i.due || '—'}</span>
              {i.type === 'personal' && <button onClick={() => setIdp(prev => prev.filter(x => x.id !== i.id))} title="Удалить" style={{ ...btnOutline, padding: '2px 8px' }}>×</button>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <input style={{ ...inp, flex: 1, minWidth: 200 }} placeholder="Новая личная задача (например, пробежать марафон)" value={newIdp.title} onChange={e => setNewIdp({ ...newIdp, title: e.target.value })} />
          <input type="date" style={inp} value={newIdp.due} onChange={e => setNewIdp({ ...newIdp, due: e.target.value })} />
          <button onClick={addIdp} style={btnPrimary}>+ Добавить</button>
        </div>
      </div>
    </div>
  )
}

function Bar({ pct, color }) {
  return (
    <div style={{ height: 8, background: '#e8edf2', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: color, borderRadius: 4 }} />
    </div>
  )
}

function Ring({ pct, color }) {
  const r = 38, c = 2 * Math.PI * r
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e8edf2" strokeWidth="10" />
      <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, pct) / 100)} transform="rotate(-90 48 48)" />
      <text x="48" y="54" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f1923">{fmt(pct)}%</text>
    </svg>
  )
}

const card = { background: '#fff', border: '1px solid #e8edf2', borderRadius: 12, padding: 16 }
const cardTitle = { fontSize: 13, fontWeight: 600, color: '#7a8fa0', marginBottom: 12 }
const badge = { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }
const notice = { border: '1px solid', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13 }
const riskRow = { display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, padding: '5px 0' }
const th = { padding: '8px 16px', fontWeight: 500, fontSize: 12 }
const td = { padding: '8px 16px', borderTop: '1px solid #e8edf2' }
const inp = { border: '1px solid #e8edf2', borderRadius: 6, padding: '5px 8px', fontSize: 13, background: '#fff', color: '#0f1923' }
const btnPrimary = { background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnOutline = { background: '#fff', color: '#4361ee', border: '1px solid #4361ee', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
