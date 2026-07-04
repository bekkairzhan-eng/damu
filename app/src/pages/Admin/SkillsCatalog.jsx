import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const CATEGORIES = ['Строительные практики', 'Технологии', 'Управление и лидерство', 'Охрана труда', 'Языки', 'Прочее']
const APPROVERS = ['РП', 'Тех. специалист', 'Самостоятельно']
const LEVEL_NAMES = { 1: 'Базовый', 2: 'Средний', 3: 'Продвинутый', 4: 'Эксперт' }

const INITIAL_SKILLS = [
  { id: 1,  name: 'Чтение строительных чертежей',    category: 'Строительные практики', approver: 'РП' },
  { id: 2,  name: 'Контроль качества СМР',            category: 'Строительные практики', approver: 'РП' },
  { id: 3,  name: 'Работа с госдокументацией',        category: 'Строительные практики', approver: 'РП' },
  { id: 4,  name: 'Нормативно-техническая документация', category: 'Строительные практики', approver: 'Тех. специалист' },
  { id: 5,  name: 'Управление строительными рисками', category: 'Строительные практики', approver: 'РП' },
  { id: 6,  name: 'BIM-технологии',                  category: 'Технологии',            approver: 'Тех. специалист' },
  { id: 7,  name: 'Цифровые инструменты управления', category: 'Технологии',            approver: 'Тех. специалист' },
  { id: 8,  name: 'MS Project / Primavera',           category: 'Технологии',            approver: 'Тех. специалист' },
  { id: 9,  name: 'Управление командой',              category: 'Управление и лидерство', approver: 'РП' },
  { id: 10, name: 'Управление субподрядчиками',       category: 'Управление и лидерство', approver: 'РП' },
  { id: 11, name: 'Работа с заказчиком',              category: 'Управление и лидерство', approver: 'РП' },
  { id: 12, name: 'Бюджетирование проекта',           category: 'Управление и лидерство', approver: 'РП' },
  { id: 13, name: 'Управление претензиями',           category: 'Управление и лидерство', approver: 'РП' },
  { id: 14, name: 'Охрана труда (ОТиТБ)',             category: 'Охрана труда',           approver: 'Тех. специалист' },
  { id: 15, name: 'Экологические требования',         category: 'Охрана труда',           approver: 'Тех. специалист' },
  { id: 16, name: 'Русский язык',                     category: 'Языки',                  approver: 'Самостоятельно' },
  { id: 17, name: 'Казахский язык',                   category: 'Языки',                  approver: 'Самостоятельно' },
  { id: 18, name: 'Английский язык',                  category: 'Языки',                  approver: 'Самостоятельно' },
]

const APPROVER_COLORS = {
  'РП':              { bg: '#eff6ff', color: '#2563eb' },
  'Тех. специалист': { bg: '#f0fdf4', color: '#16a34a' },
  'Самостоятельно':  { bg: '#f5f3ff', color: '#7c3aed' },
}

const EMPTY_FORM = { name: '', category: CATEGORIES[0], approver: APPROVERS[0] }

export default function SkillsCatalog() {
  const [skills, setSkills] = useLocalStorage('admin:skills', INITIAL_SKILLS)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Все')
  const [modal, setModal] = useState(null) // null | 'add' | skill object
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'Все' || s.category === filterCat
    return matchSearch && matchCat
  })

  function openAdd() { setForm(EMPTY_FORM); setModal('add') }
  function openEdit(skill) { setForm({ name: skill.name, category: skill.category, approver: skill.approver }); setModal(skill) }

  function save() {
    if (!form.name.trim()) return
    if (modal === 'add') {
      setSkills(prev => [...prev, { id: Date.now(), ...form }])
    } else {
      setSkills(prev => prev.map(s => s.id === modal.id ? { ...s, ...form } : s))
    }
    setModal(null)
  }

  function remove(id) {
    setSkills(prev => prev.filter(s => s.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Каталог навыков</h1>
          <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>{skills.length} навыков · Уровни 1–2 самостоятельно, 3–4 требуют апрув</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Добавить навык
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#7a8fa0' }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск навыка..." style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Все', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid', borderColor: filterCat === cat ? '#4361ee' : '#e8edf2', background: filterCat === cat ? '#4361ee' : '#fff', color: filterCat === cat ? '#fff' : '#0f1923', fontSize: 13, cursor: 'pointer', fontWeight: filterCat === cat ? 600 : 400 }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Навык', 'Категория', 'Апрувер (ур. 3–4)', 'Действия'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((skill, i) => {
              const ap = APPROVER_COLORS[skill.approver] || APPROVER_COLORS['РП']
              return (
                <tr key={skill.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#0f1923', fontWeight: 500 }}>{skill.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#7a8fa0' }}>{skill.category}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, background: ap.bg, color: ap.color, fontSize: 12, fontWeight: 600 }}>{skill.approver}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(skill)} style={{ padding: '5px 12px', border: '1px solid #e8edf2', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#4361ee' }}>Изменить</button>
                      <button onClick={() => setDeleteConfirm(skill.id)} style={{ padding: '5px 12px', border: '1px solid #fee2e2', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#ef4444' }}>Удалить</button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#7a8fa0', fontSize: 14 }}>Ничего не найдено</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', margin: '0 0 24px' }}>{modal === 'add' ? 'Добавить навык' : 'Редактировать навык'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Название навыка
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Например: Управление ESG-рисками" style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Категория
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f1923' }}>
                Кто апрувит уровни 3–4
                <select value={form.approver} onChange={e => setForm(f => ({ ...f, approver: e.target.value }))} style={{ display: 'block', width: '100%', marginTop: 6, padding: '9px 12px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  {APPROVERS.map(a => <option key={a}>{a}</option>)}
                </select>
              </label>
              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#7a8fa0' }}>
                Уровни 1 (Базовый) и 2 (Средний) — сотрудник выставляет самостоятельно всегда
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#0f1923' }}>Отмена</button>
              <button onClick={save} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 360 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', marginBottom: 12 }}>Удалить навык?</div>
            <p style={{ color: '#7a8fa0', fontSize: 14, margin: '0 0 24px' }}>Навык будет удалён из каталога. Требования по должностям, где он использовался, также будут обнулены.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer' }}>Отмена</button>
              <button onClick={() => remove(deleteConfirm)} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
