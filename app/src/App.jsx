import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard/index'
import MyPlans from './pages/MyPlans/index'
import CareerMap from './pages/CareerMap'
import Titles from './pages/Titles'
import Skills from './pages/Skills/index'
import Assessment from './pages/Assessment/index'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import SkillsCatalog from './pages/Admin/SkillsCatalog'
import Positions from './pages/Admin/Positions'
import CareerGraph from './pages/Admin/CareerGraph'
import Requirements from './pages/Admin/Requirements'
import RatingWeights from './pages/Admin/RatingWeights'
import Users from './pages/Admin/Users'
import HRLayout from './pages/HR/HRLayout'
import HRDashboard from './pages/HR/HRDashboard'
import AssessmentEntry from './pages/HR/AssessmentEntry'
import RoleGuard from './components/RoleGuard'
import { ProfileProvider } from './ProfileContext'

export default function App() {
  return (
    <ProfileProvider>
    <BrowserRouter>
      <Routes>
        {/* Employee app */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="plans/*" element={<MyPlans />} />
          <Route path="career-map" element={<CareerMap />} />
          <Route path="titles" element={<Titles />} />
          <Route path="skills/*" element={<Skills />} />
          <Route path="assessment" element={<Assessment />} />
        </Route>
        {/* Admin panel */}
        <Route path="/admin" element={<RoleGuard role="admin"><AdminLayout /></RoleGuard>}>
          <Route index element={<AdminDashboard />} />
          <Route path="skills" element={<SkillsCatalog />} />
          <Route path="positions" element={<Positions />} />
          <Route path="career-graph" element={<CareerGraph />} />
          <Route path="requirements" element={<Requirements />} />
          <Route path="rating" element={<RatingWeights />} />
          <Route path="users" element={<Users />} />
        </Route>
        {/* HR panel */}
        <Route path="/hr" element={<RoleGuard role="hr"><HRLayout /></RoleGuard>}>
          <Route index element={<HRDashboard />} />
          <Route path="assessment" element={<AssessmentEntry />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ProfileProvider>
  )
}
