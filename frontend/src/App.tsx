import { Routes, Route, Navigate } from "react-router-dom"
import WorkerApp from "./pages/WorkerApp"
import LenderPortal from "./pages/LenderPortal"
import TngAnalytics from "./pages/TngAnalytics"
import DemoSwitcher from "./components/DemoSwitcher"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/worker/worker_kumar_001" replace />} />
        <Route path="/worker/:id" element={<WorkerApp />} />
        <Route path="/lender" element={<LenderPortal />} />
        <Route path="/tng" element={<TngAnalytics />} />
      </Routes>
      <DemoSwitcher />
    </>
  )
}

export default App
