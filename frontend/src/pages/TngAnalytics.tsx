import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import layak2Logo from "@/components/ui/layak_2.svg"
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const klHeatmapZones = [
  // High Density
  { lat: 3.1580, lng: 101.7110, radius: 1100, color: '#FFE100', opacity: 0.6, label: 'KLCC / Bukit Bintang' },
  { lat: 3.1330, lng: 101.6850, radius: 900, color: '#FFE100', opacity: 0.6, label: 'Brickfields Hub' },
  { lat: 3.1410, lng: 101.6250, radius: 1000, color: '#FFE100', opacity: 0.6, label: 'Damansara Heights / TTDI' },
  { lat: 3.1250, lng: 101.6520, radius: 850, color: '#FFE100', opacity: 0.6, label: 'Bangsar Commercial' },
  // Medium Density
  { lat: 3.1750, lng: 101.6930, radius: 1400, color: '#225BA6', opacity: 0.35, label: 'Sentul Raya' },
  { lat: 3.0950, lng: 101.6980, radius: 1800, color: '#225BA6', opacity: 0.3, label: 'Sri Petaling / Bukit Jalil' },
  { lat: 3.1110, lng: 101.7300, radius: 1500, color: '#225BA6', opacity: 0.3, label: 'Cheras Central' },
  { lat: 3.1890, lng: 101.6500, radius: 1600, color: '#225BA6', opacity: 0.25, label: 'Kepong / Segambut' },
  { lat: 3.0730, lng: 101.6050, radius: 2200, color: '#225BA6', opacity: 0.25, label: 'Sunway / Subang' },
]

export default function TngAnalytics() {
  const navigate = useNavigate()
  const [worker] = useState({
    name: "Kumar Selvarajan",
    trade: "Barber Services",
    zone: "Brickfields, KL",
    score: 720,
    tier: "Excellent"
  })

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB] text-slate-900 font-sans">
      {/* SideNavBar (hidden on mobile, visible on md) */}
      <aside className="w-64 bg-[#225BA6] border-r border-[#1C4E8F] flex-col p-4 z-40 hidden md:flex text-white/80 shrink-0">
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            title="Go back to Landing"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        </div>

        <div className="mb-8 flex justify-center -ml-4">
          <img src={layak2Logo} alt="LAYAK Logo" className="w-32 h-auto" />
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link to="/worker/worker_kumar_001" className="text-white/80 flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">fingerprint</span>
            <span className="text-sm font-semibold">Identity Score</span>
          </Link>
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">handyman</span>
            <span className="text-sm font-semibold">Productive BNPL</span>
          </a>
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span className="text-sm font-semibold">Verified Income</span>
          </a>
          <a href="#" className="bg-[#1C4E8F] text-white shadow-sm rounded-lg flex items-center gap-3 px-4 py-3 transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span className="text-sm font-bold">TNG GPS (Trends)</span>
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-[#1C4E8F]">
          <button className="w-full bg-[#1C4E8F] hover:bg-[#153A6A] text-white py-2.5 rounded-lg text-xs font-bold uppercase mb-2 transition-colors">
            Consent Manager
          </button>
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-2 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">shield</span>
            <span className="text-sm">Security</span>
          </a>
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-2 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">contact_support</span>
            <span className="text-sm">Support</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative w-full">
        {/* TopAppBar */}
        <header className="bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 h-16 w-full sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors md:hidden border border-slate-200"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-600">arrow_back</span>
            </button>
            <img src={layak2Logo} alt="Layak" className="h-6 w-auto md:hidden" />
            <span className="font-bold text-lg text-slate-800 hidden md:block uppercase tracking-tight">System Terminal</span>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-slate-400 hover:bg-slate-100 transition-all p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <button className="text-slate-400 hover:bg-slate-100 transition-all p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">{worker.name}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">{worker.trade}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[#225BA6] shadow-sm">
                <span className="material-symbols-outlined text-[24px]">person</span>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button className="text-slate-400 p-2 relative">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#225BA6] p-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              <span className="material-symbols-outlined text-[32px] block">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

          {/* Mobile Menu Drawer Overlay */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Drawer */}
              <div className="fixed inset-y-0 left-0 w-[280px] bg-[#225BA6] z-[70] md:hidden animate-in slide-in-from-left duration-300 shadow-2xl flex flex-col p-6">
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                  >
                    <span className="material-symbols-outlined text-[20px] text-white">arrow_back</span>
                  </button>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[28px]">close</span>
                  </button>
                </div>

                <div className="flex justify-center mb-10">
                  <img src={layak2Logo} alt="LAYAK Logo" className="w-32 h-auto" />
                </div>

                <nav className="flex-1 flex flex-col gap-3">
                  <a href="#" className="bg-white text-[#225BA6] shadow-sm rounded-lg flex items-center gap-4 px-4 py-3.5">
                    <span className="material-symbols-outlined text-[22px]">explore</span>
                    <span className="text-base font-bold">Earnings Map</span>
                  </a>
                  <a href="#" className="text-white/80 flex items-center gap-4 px-4 py-3.5 hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[22px]">bar_chart</span>
                    <span className="text-base font-bold">Trade Benchmarks</span>
                  </a>
                  <a href="#" className="text-white/80 flex items-center gap-4 px-4 py-3.5 hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[22px]">groups</span>
                    <span className="text-base font-bold">Worker Segments</span>
                  </a>
                  <Link to="/worker/worker_kumar_001" className="text-white/80 flex items-center gap-4 px-4 py-3.5 hover:bg-white/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[22px]">person</span>
                    <span className="text-base font-bold">Worker App View</span>
                  </Link>
                </nav>

                <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 px-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFE100]/20 flex items-center justify-center text-[#FFE100] border border-[#FFE100]/30">
                      <span className="material-symbols-outlined text-[24px]">support_agent</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-white leading-none">TNG Operations</p>
                      <p className="text-[10px] uppercase font-bold text-white/50 mt-1 tracking-wider">Admin Terminal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white uppercase border border-white/5">
                      <span className="material-symbols-outlined text-[16px]">settings</span> Settings
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white uppercase border border-white/5">
                      <span className="material-symbols-outlined text-[16px]">logout</span> Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Strategic Trends</h1>
            <p className="text-slate-500 text-lg">KL Zone Earnings Density and Trade Performance Analysis.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Main Column - KL Heatmap Grid */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="flex-1 bg-white border-slate-200 shadow-sm min-h-[500px] overflow-hidden flex flex-col p-2 z-0 rounded-[1.5rem]">
                <CardContent className="flex-1 p-0 relative min-h-[500px] rounded-[1rem] overflow-hidden">
                  <MapContainer
                    center={[3.1390, 101.6869]}
                    zoom={12}
                    scrollWheelZoom={true}
                    className="w-full h-full min-h-[500px] z-10"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />

                    {klHeatmapZones.map((zone, i) => (
                      <Circle
                        key={i}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius}
                        pathOptions={{
                          fillColor: zone.color,
                          color: zone.color,
                          fillOpacity: zone.opacity,
                          weight: 1
                        }}
                      >
                        <Tooltip direction="top" opacity={0.9} className="font-bold text-[#225BA6] bg-white border-0 shadow-md">
                          {zone.label}
                        </Tooltip>
                      </Circle>
                    ))}
                  </MapContainer>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Top Trades */}
            <div className="flex flex-col gap-6">
              <Card className="flex-1 bg-white border-slate-200 shadow-sm rounded-[1.5rem]">
                <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100 font-bold uppercase py-6 px-8 rounded-t-[1.5rem]">
                  <CardTitle className="text-xs font-black text-slate-400 tracking-widest leading-none">Top 5 Monthly Trades</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 px-6">
                  <div className="space-y-4">
                    {[
                      { name: "Specialty Cooks", earnings: "RM 6,400", trend: "+12%" },
                      { name: "Barber Services", earnings: "RM 4,800", trend: "+8%" },
                      { name: "Mobile Mechanics", earnings: "RM 4,450", trend: "+15%" },
                      { name: "Kuih Sellers", earnings: "RM 3,100", trend: "+4%" },
                      { name: "Delivery Run", earnings: "RM 2,800", trend: "-2%" },
                    ].map((trade, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:border-[#225BA6] hover:shadow-md transition-all group cursor-default">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#FFE100]/20 flex items-center justify-center font-black text-[#225BA6] text-sm group-hover:bg-[#FFE100] transition-colors">
                            {i + 1}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight">{trade.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-slate-900 font-bold tracking-tighter">{trade.earnings}</div>
                          <div className={`text-[10px] font-black tracking-widest uppercase ${trade.trend.startsWith('+') ? 'text-[#225BA6]' : 'text-rose-500'}`}>
                            {trade.trend}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 mt-4">
            {[
              { label: "Workers Credentialed", val: "12,450", icon: "group" },
              { label: "Scores Issued Today", val: "892", icon: "monitoring" },
              { label: "Lender Pulls Today", val: "142", icon: "vpn_key" },
              { label: "BNPL Volume (MYR)", val: "1.4M", icon: "payments" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex gap-4 hover:border-[#225BA6] transition-all group items-center">
                <div className="bg-[#FFE100]/20 min-w-[3.5rem] h-14 rounded-xl flex items-center justify-center text-[#225BA6] shadow-sm group-hover:bg-[#FFE100]/30 transition-colors">
                  <span className="material-symbols-outlined text-[28px] leading-none">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.1em] mb-0.5">{stat.label}</div>
                  <div className="text-2xl font-black text-slate-900 tracking-tighter">{stat.val}</div>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
