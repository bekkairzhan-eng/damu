import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MyDashboard from './MyDashboard'
import MySkills from './MySkills'
import ExperienceProfile from './ExperienceProfile'

const TABS = [
  { id: 'my-dashboard', label: 'Мой дашборд', path: 'my-dashboard' },
  { id: 'my-skills',    label: 'Мои навыки',  path: 'my-skills'    },
  { id: 'experience',   label: 'Профиль опыта', path: 'experience' },
]

export default function Dashboard() {
  return (
    <div>
      <SubNav />
      <Routes>
        <Route index element={<Navigate to="my-dashboard" replace />} />
        <Route path="my-dashboard" element={<MyDashboard />} />
        <Route path="my-skills"    element={<MySkills />}    />
        <Route path="experience"   element={<ExperienceProfile />} />
      </Routes>
    </div>
  )
}

function SubNav() {
  const { pathname } = window.location
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '0 32px' }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {TABS.map(t => {
          const active = pathname.includes(t.path)
          return (
            <a key={t.id} href={`/dashboard/${t.path}`} style={{
              padding: '14px 20px', fontSize: 13.5, fontWeight: active ? 600 : 400,
              color: active ? '#1a2b3c' : '#7a8fa0',
              borderBottom: active ? '2.5px solid #1a2b3c' : '2.5px solid transparent',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{t.label}</a>
          )
        })}
      </div>
    </div>
  )
}
