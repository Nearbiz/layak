import { Routes, Route, useLocation } from "react-router-dom"
import Landing from "./pages/Landing"
import WorkerApp from "./pages/WorkerApp"
import LenderPortal from "./pages/LenderPortal"
import TngAnalytics from "./pages/TngAnalytics"
import DemoSwitcher from "./components/DemoSwitcher"

function App() {
  const location = useLocation()
  const isLenderPage = location.pathname === "/lender"
  const isWorkerPage = location.pathname.startsWith("/worker")
  const isTngPage = location.pathname === "/tng"
  const hideSwitcher = isLenderPage || isWorkerPage || isTngPage

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/worker/:id" element={<WorkerApp />} />
        <Route path="/lender" element={<LenderPortal />} />
        <Route path="/tng" element={<TngAnalytics />} />
      </Routes>
      {!hideSwitcher && <DemoSwitcher />}
    </>
  )
}

export default App
