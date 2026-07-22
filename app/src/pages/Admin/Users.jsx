import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const INITIAL_USERS = [
  { id: 'u1', name: 'Каиржан Бектембаев', position: 'Foreman B',           cluster: 'K2', dept: 'BI Development',    roles: ['employee', 'hr', 'admin'] },
  { id: 'u2', name: 'Айгерим Сейткалиева', position: 'HR Business Partner', cluster: 'K2', dept: 'HR Department',     roles: ['employee', 'hr'] },
  { id: 'u3', name: 'Данияр Сейтжанов',    position: 'Foreman B',           cluster: 'K2', dept: 'BI Construction',   roles: ['employee'] },
  { id: 'u4', name: 'Арман Жумабеков',     position: 'Foreman C',           cluster: 'K1',       dept: 'BI Infrastructure', roles: ['employee'] },
  { id: 'u5', name: 'Серик Байжанов',      position: 'Site Engineer B',     cluster: 'K2',       dept: 'BI Development',    roles: ['employee'] },
  { id: 'u6', name: 'Нурлан Ахметов',      position: 'Project Manager',     cluster: 'K1',       dept: 'BI Construction',   roles: ['employee', 'admin'] },
]

const ROLE_LABELS = {
  employee: { label: 'Сотрудник', color: '#4361ee', bg: '#eff6ff' },
  hr:       { label: 'HR',        color: '#0f766e', bg: '#f0fdf4' },
  admin:    { label: 'Админ',     color: '#7c3aed', bg: '#f5f3ff' },
}

export default function Users() {
  const [users, setUsers] = useLocalStorage('admin:users', INITIAL_USERS)
  const [, setAuthRoles] = useLocalStorage('auth:roles', ['employee', 'hr', 'admin'])
  const [editing, setEditing] = useState(null)
  const [editRoles, setEditRoles] = useState([])
  const [search, setSearch] = useState('')

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.position.toLowerCase().includes(search.toLowerCase()))

  function openEdit(user) {
    setEditing(user.id)
    setEditRoles([...user.roles])
  }

  function toggleRole(role) {
    if (role === 'employee') return // employee — базовая роль, нельзя снять
    setEditRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])
  }

  function saveRoles() {
    setUsers(prev => prev.map(u => u.id === editing ? { ...u, roles: editRoles } : u))
    // If editing current user (u1 = demo user), sync auth:roles
    if (editing === 'u1') setAuthRoles(editRoles)
    setEditing(null)
  }

  const editingUser = users.find(u => u.id === editing)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f1923', margin: 0 }}>Пользователи и роли</h1>
        <p style={{ color: '#7a8fa0', fontSize: 14, margin: '4px 0 0' }}>Управление доступом к HR-панели и панели администратора</p>
      </div>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#166534' }}>
        В продакшене роли синхронизируются с Keycloak. Здесь — демо-управление для показа.
      </div>

      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#7a8fa0' }}>search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или должности..." style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #e8edf2', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Сотрудник', 'Должность', 'Кластер', 'Роли', 'Действие'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#7a8fa0', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e8edf2' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: 14, color: '#0f1923' }}>{user.name}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#7a8fa0' }}>{user.position}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#7a8fa0' }}>{user.cluster}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {user.roles.map(role => {
                      const rm = ROLE_LABELS[role]
                      return <span key={role} style={{ padding: '3px 10px', borderRadius: 6, background: rm.bg, color: rm.color, fontSize: 12, fontWeight: 600 }}>{rm.label}</span>
                    })}
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => openEdit(user)} style={{ padding: '5px 12px', border: '1px solid #e8edf2', borderRadius: 6, background: '#fff', fontSize: 13, cursor: 'pointer', color: '#4361ee' }}>Роли</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit roles modal */}
      {editing && editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,25,35,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 400 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1923', margin: '0 0 4px' }}>Роли: {editingUser.name}</h2>
            <p style={{ color: '#7a8fa0', fontSize: 13, margin: '0 0 24px' }}>{editingUser.position} · {editingUser.cluster}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(ROLE_LABELS).map(([role, meta]) => {
                const isActive = editRoles.includes(role)
                const isBase = role === 'employee'
                return (
                  <div key={role} onClick={() => toggleRole(role)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 10, border: `2px solid ${isActive ? meta.color : '#e8edf2'}`, background: isActive ? meta.bg : '#fff', cursor: isBase ? 'default' : 'pointer', opacity: isBase ? 0.7 : 1 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0f1923' }}>{meta.label}</div>
                      <div style={{ fontSize: 12, color: '#7a8fa0' }}>
                        {role === 'employee' && 'Доступ к личному кабинету · всегда включено'}
                        {role === 'hr' && 'Доступ к HR-панели · ввод результатов аттестации'}
                        {role === 'admin' && 'Доступ к панели администратора · настройка системы'}
                      </div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isActive ? meta.color : '#e8edf2'}`, background: isActive ? meta.color : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isActive && <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#fff' }}>check</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '10px 20px', border: '1px solid #e8edf2', borderRadius: 8, background: '#fff', fontSize: 14, cursor: 'pointer' }}>Отмена</button>
              <button onClick={saveRoles} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#4361ee', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
