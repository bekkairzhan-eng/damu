import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard/index'
import MyPlans from './pages/MyPlans/index'
import CareerMap from './pages/CareerMap'
import Titles from './pages/Titles'
import Skills from './pages/Skills/index'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="plans/*" element={<MyPlans />} />
          <Route path="career-map" element={<CareerMap />} />
          <Route path="titles" element={<Titles />} />
          <Route path="skills/*" element={<Skills />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
