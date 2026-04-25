import { useNavigate, useLocation } from "react-router-dom"

const roles = [
  { id: 'worker', label: 'WORKER', path: '/worker/worker_kumar_001', icon: 'person' },
  { id: 'lender', label: 'LENDER', path: '/lender', icon: 'account_balance' },
  { id: 'tng', label: 'TNG OPS', path: '/tng', icon: 'monitoring' }
]

export default function DemoSwitcher() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-2 py-1.5 bg-[#225BA6] rounded-full border-2 border-[#1C4E8F] shadow-[0_12px_40px_-8px_rgba(34,91,166,0.5)] flex items-center gap-1">
      {roles.map((role) => {
        const isActive = location.pathname.startsWith(role.path.split('/').slice(0, 2).join('/'))
        return (
          <button
            key={role.id}
            onClick={() => navigate(role.path)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
              ${isActive 
                ? 'bg-[#FFE100] text-[#225BA6] shadow-md scale-105' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {role.icon}
            </span>
            <span className="text-[11px] font-black tracking-tight uppercase hidden sm:block">{role.label}</span>
          </button>
        )
      })}
    </div>
  )
}
