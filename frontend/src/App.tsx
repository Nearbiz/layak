import { Routes, Route, Navigate } from 'react-router-dom'
import WorkerApp from './pages/WorkerApp'
import LenderPortal from './pages/LenderPortal'
import TngDashboard from './pages/TngDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/worker/worker_kumar_001" replace />} />
      <Route path="/worker/:id" element={<WorkerApp />} />
      <Route path="/lender" element={<LenderPortal />} />
      <Route path="/tng" element={<TngDashboard />} />
    </Routes>
  )
}
