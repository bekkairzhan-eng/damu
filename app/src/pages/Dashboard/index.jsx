import { Routes, Route, Navigate } from 'react-router-dom'
import MyDashboard from './MyDashboard'
import MySkills from './MySkills'
import ExperienceProfile from './ExperienceProfile'

export default function Dashboard() {
  return (
    <Routes>
      <Route index element={<Navigate to="my-dashboard" replace />} />
      <Route path="my-dashboard" element={<MyDashboard />} />
      <Route path="my-skills"    element={<MySkills />}    />
      <Route path="experience"   element={<ExperienceProfile />} />
    </Routes>
  )
}
