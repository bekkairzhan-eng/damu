import { Routes, Route, Navigate } from 'react-router-dom'
import MyDashboard from './MyDashboard'
import MySkills from './MySkills'
import MyKPI from './MyKPI'
import ExperienceProfile from './ExperienceProfile'

export default function Dashboard() {
  return (
    <Routes>
      <Route index element={<Navigate to="my-dashboard" replace />} />
      <Route path="my-dashboard" element={<MyDashboard />} />
      <Route path="my-skills"    element={<MySkills />}    />
      <Route path="my-kpi"       element={<MyKPI />}       />
      <Route path="experience"   element={<ExperienceProfile />} />
    </Routes>
  )
}
