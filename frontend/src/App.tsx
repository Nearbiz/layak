import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import WorkerApp from "./pages/WorkerApp"
import LenderPortal from "./pages/LenderPortal"
import TngAnalytics from "./pages/TngAnalytics"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/worker/:id" element={<WorkerApp />} />
      <Route path="/lender" element={<LenderPortal />} />
      <Route path="/tng" element={<TngAnalytics />} />
    </Routes>
  )
}

export default App
