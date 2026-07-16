import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Данияр Сейтжанов',   position: 'Foreman B',       dept: 'BI Construction' },
  { id: 2, name: 'Арман Жумабеков',    position: 'Foreman C',       dept: 'BI Infrastructure' },
  { id: 3, name: 'Серик Байжанов',     position: 'Site Engineer B', dept: 'BI Development' },
  { id: 4, name: 'Каиржан Бектембаев', position: 'Foreman B',       dept: 'BI Development' },
  { id: 5, name: 'Нурлан Ахметов',     position: 'Foreman A',       dept: 'BI Construction' },
  { id: 6, name: 'Айдос Молдабеков',   position: 'Foreman C',       dept: 'BI Infrastructure' },
]

// Демо-данные заявок на обучение (в реальности — статус приходит из UnityBPM,
// см. BPM_INTEGRATION.md, раздел 3). Нужны здесь только чтобы показать проверку
// на существующую заявку перед ручным добавлением сертификата.
const MOCK_TRAINING_REQUESTS = [
  { id: 101, employeeId: 1, programTitle: 'Охрана труда и ТБ — переаттестация', status: 'pending',  requestedAt: '01 Июл 2026' },
  { id: 102, employeeId: 4, programTitle: 'BIM-технологии: продвинутый курс',   status: 'matched',  requestedAt: '15 Июн 2026' },
]

const EMPTY_FORM = { title: '', issuer: '', obtainedAt: '', expiresAt: '', fileUrl: '' }

const ACCENT = '#0f766e'
const btnPrimary = { padding: '9px 20px', borderRadius: 8, border: 'none', background: ACCENT, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnOutline = { padding: '9px 20px', borderRadius: 8, border: '1px solid #e8edf2', background: '#fff', color: '#7a8fa0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const labelStyle = { fontSize: 12, color: '#7a8fa0', marginBottom: 4, fontWeight: 500 }
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8edf2', fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#0f1923' }

function formatToday() {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const now = new Date()
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

// Совпадение по сотруднику + похожему названию программы — заменится на
// GET /api/hr/training-requests/match-check (см. BACKEND_SPEC.md, раздел 5.7)
function findMatchingRequest(requests, employeeId, title) {
  const norm = s => s.trim().toLowerCase()
  return requests.find(r =>
    r.employeeId === employeeId &&
    (r.status === 'pending' || r.status === 'matched') &&
    norm(r.programTitle) === norm(title)
  )
}

export default function AddCertificate() {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useLocalStorage('hr:certificates', [])
  const [trainingRequests, setTrainingRequests] = useLocalStorage('hr:training-requests', MOCK_TRAINING_REQUESTS)

  const [search, setSearch] = useState('')
  const [employee, setEmployee] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [matchDialog, setMatchDialog] = useState(null) // { request } | null
  const [saved, setSaved] = useState(null) // последний сохранённый сертификат

  const filteredEmployees = MOCK_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function resetAll() {
    setEmployee(null)
    setSearch('')
    setForm(EMPTY_FORM)
    setSaved(null)
    setMatchDialog(null)
  }

  function saveCertificate(linkedRequest) {
    const cert = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      obtainedAt: form.obtainedAt,
      expiresAt: form.expiresAt || null,
      fileUrl: form.fileUrl.trim() || null,
      source: 'manual',
      addedBy: 'Айгерим Сейткалиева',
      trainingRequestId: linkedRequest ? linkedRequest.id : null,
      createdAt: formatToday(),
    }
    setCertificates(prev => [cert, ...(prev ?? [])])

    if (linkedRequest) {
      setTrainingRequests(prev =>
        (prev ?? []).map(r => r.id === linkedRequest.id ? { ...r, status: 'completed' } : r)
      )
    }

    setMatchDialog(null)
    setSaved(cert)
  }

  function handleSubmit() {
    if (!employee || !form.title.trim() || !form.obtainedAt) return

    const match = findMatchingRequest(trainingRequests ?? [], employee.id, form.title)
    if (match) {
      setMatchDialog({ request: match })
      return
    }
    saveCertificate(null)
  }

  const canSubmit = !!employee && form.title.trim() && form.obtainedAt

  if (saved) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 32px', gap: 16 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: ACCENT }}>workspace_premium</span>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0f1923' }}>Сертификат добавлен</div>
        <div style={{ fontSize: 14, color: '#7a8fa0', textAlign: 'center' }}>
          «{saved.title}» — {saved.employeeName}
          {saved.trainingRequestId && <><br />Привязан к существующей заявке на обучение</>}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={resetAll} style={btnPrimary}>Добавить ещё</button>
          <button onClick={() => navigate('/hr')} style={btnOutline}>К списку</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Добавить сертификат</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>
          Для случаев, когда обучение прошло офлайн, мимо LMS
        </p>
      </div>

      {/* Шаг 1 — выбор сотрудника */}
      {!employee ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: 20 }}>
          <div style={labelStyle}>Сотрудник</div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени..."
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
            {filteredEmployees.length === 0 && (
              <div style={{ padding: '16px 0', textAlign: 'center', color: '#7a8fa0', fontSize: 13 }}>Никого не найдено</div>
            )}
            {filteredEmployees.map(e => (
              <button
                key={e.id}
                onClick={() => setEmployee(e)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  padding: '10px 14px', borderRadius: 9, border: '1px solid #e8edf2',
                  background: '#fff', cursor: 'pointer',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: ACCENT + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: ACCENT }}>person</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923' }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: '#7a8fa0' }}>{e.position} · {e.dept}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Выбранный сотрудник */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: ACCENT + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: ACCENT }}>person</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f1923' }}>{employee.name}</div>
              <div style={{ fontSize: 13, color: '#7a8fa0' }}>{employee.position} · {employee.dept}</div>
            </div>
            <button onClick={() => setEmployee(null)} style={{ ...btnOutline, padding: '6px 14px' }}>Изменить</button>
          </div>

          {/* Форма сертификата */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={labelStyle}>Название сертификата / программы *</div>
              <input value={form.title} onChange={e => setField('title', e.target.value)}
                placeholder="Напр., Охрана труда и ТБ — переаттестация"
                style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Кем выдан</div>
              <input value={form.issuer} onChange={e => setField('issuer', e.target.value)}
                placeholder="Напр., BI University, Buildex Training Center"
                style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={labelStyle}>Дата получения *</div>
                <input type="date" value={form.obtainedAt} onChange={e => setField('obtainedAt', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Срок действия до (опционально)</div>
                <input type="date" value={form.expiresAt} onChange={e => setField('expiresAt', e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <div style={labelStyle}>Ссылка на файл (опционально)</div>
              <input value={form.fileUrl} onChange={e => setField('fileUrl', e.target.value)}
                placeholder="https://..."
                style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button onClick={() => navigate('/hr')} style={btnOutline}>Отмена</button>
            <button onClick={handleSubmit} disabled={!canSubmit} style={{ ...btnPrimary, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'default' }}>
              Сохранить сертификат
            </button>
          </div>
        </>
      )}

      {/* Диалог: найдена существующая заявка */}
      {matchDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#d97706', flexShrink: 0 }}>info</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f1923', marginBottom: 6 }}>
                  У сотрудника уже есть поданная заявка
                </div>
                <div style={{ fontSize: 13, color: '#7a8fa0', lineHeight: 1.6 }}>
                  «{matchDialog.request.programTitle}» — подана {matchDialog.request.requestedAt}, статус «{matchDialog.request.status === 'pending' ? 'Ожидает' : 'В процессе'}».
                  Подтвердить этим сертификатом?
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => saveCertificate(matchDialog.request)} style={{ ...btnPrimary, width: '100%' }}>
                Привязать к заявке
              </button>
              <button onClick={() => saveCertificate(null)} style={{ ...btnOutline, width: '100%' }}>
                Завести отдельно
              </button>
              <button onClick={() => setMatchDialog(null)} style={{ ...btnOutline, width: '100%', border: 'none', color: '#9aafbd' }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Недавно добавленные */}
      {certificates?.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f1923', margin: '0 0 12px' }}>Недавно добавленные</h2>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Сотрудник', 'Сертификат', 'Дата получения', 'Источник'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certificates.slice(0, 5).map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < Math.min(certificates.length, 5) - 1 ? '1px solid #f0f2f5' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#0f1923', fontWeight: 500 }}>{c.employeeName}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#0f1923' }}>{c.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#7a8fa0' }}>{c.obtainedAt}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: c.trainingRequestId ? '#eff6ff' : '#f0fdf4', color: c.trainingRequestId ? '#2563eb' : '#16a34a' }}>
                        {c.trainingRequestId ? 'Привязан к заявке' : 'Добавлен вручную'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
