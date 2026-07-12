import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Trips from '../pages/Trips'
import Expenses from '../pages/Expenses'
import Report from '../pages/Report'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route all main subpages under the DashboardLayout using nested routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Report />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
