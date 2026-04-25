import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const bnplCatalog = [
  { id: "barber_chair_v2", name: "Pro Barber Chair", price: 3000, monthly: 280, tenor: 12, lift: 40, img: "💺" },
  { id: "clipper_set_pro", name: "Wireless Clipper Set", price: 800, monthly: 75, tenor: 12, lift: 15, img: "✂️" },
  { id: "salon_station", name: "Mirrored Station", price: 1500, monthly: 140, tenor: 12, lift: 25, img: "🪞" },
  { id: "led_signage", name: "LED Signage", price: 400, monthly: 38, tenor: 12, lift: 10, img: "💡" },
]

export default function WorkerApp() {
  const [worker] = useState({
    name: "Kumar Selvarajan",
    trade: "Barber Services",
    zone: "Brickfields, KL",
    score: 720,
    tier: "Excellent"
  })

  // Animation state for gauge
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let startTime: number
    const duration = 2000 // 2 second animation

    // Ease in out cubic calculation
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = Math.min((timestamp - startTime) / duration, 1)
      const eased = easeInOutCubic(elapsed)
      
      setAnimatedScore(Math.floor(eased * worker.score))

      if (elapsed < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [worker.score])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB] text-slate-900 font-sans">
      {/* SideNavBar (hidden on mobile, visible on md) */}
      <aside className="w-64 bg-[#225BA6] border-r border-[#1C4E8F] flex-col p-4 z-40 hidden md:flex text-white/80 shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#FFE100] text-[#225BA6] flex items-center justify-center font-bold text-lg">
            TNG
          </div>
          <div>
            <div className="font-bold text-lg text-white leading-none">Layak Infra</div>
            <div className="text-xs text-[#FFE100] font-medium mt-1">Verified Identity Node</div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {/* Active Nav Item */}
          <a href="#" className="bg-white text-[#225BA6] shadow-sm rounded-lg flex items-center gap-3 px-4 py-3 transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">fingerprint</span>
            <span className="text-sm font-bold">Identity Score</span>
          </a>
          {/* Inactive Nav Items */}
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">handyman</span>
            <span className="text-sm font-semibold">Productive BNPL</span>
          </a>
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span className="text-sm font-semibold">Verified Income</span>
          </a>
          <a href="#" className="text-white/80 flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-[#1C4E8F] rounded-lg">
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            <span className="text-sm font-semibold">Strategic Trends</span>
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
        <header className="bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 h-16 w-full sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <span className="font-bold text-xl text-slate-800 md:hidden">LAYAK</span>
            <span className="font-bold text-lg text-slate-800 hidden md:block">Worker Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:bg-slate-100 transition-all p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="text-slate-400 hover:bg-slate-100 transition-all p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-none">{worker.name}</p>
                <p className="text-xs text-slate-500 mt-1">{worker.trade}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900">Kumar's Overview</h1>
            <p className="text-slate-500 text-lg">Your verified identity and market position metrics.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Layak Score Card (Hero) */}
            <Card className="md:col-span-1 shadow-sm flex flex-col relative overflow-hidden bg-[#225BA6] text-white border-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE100]/20 rounded-bl-full pointer-events-none"></div>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white/90 font-bold">Layak Score</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1 py-8">
                {/* Score Display (Gauge style) */}
                <div className="relative flex items-center justify-center mb-4 w-40 h-40">
                  <svg className="absolute inset-0 w-40 h-40" viewBox="0 0 160 160" style={{ transform: 'rotate(135deg)' }}>
                    {/* Background Arc (270 degrees) */}
                    <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" strokeDasharray="439.82" strokeDashoffset="109.95" />
                    {/* Foreground Animated Arc */}
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      fill="none" 
                      stroke="#FFE100" 
                      strokeWidth="12" 
                      strokeDasharray="439.82" 
                      strokeDashoffset={439.82 - (animatedScore / 1000 * 329.86)} 
                    />
                  </svg>
                  
                  <div className="flex flex-col items-center z-10 w-full text-center">
                    <span className="text-[52px] font-bold shadow-sm leading-none tabular-nums tracking-tighter" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>{animatedScore}</span>
                  </div>
                </div>
                <Badge className="bg-[#FFE100] hover:bg-[#FFE100] text-[#225BA6] font-bold border-0 px-5 py-1.5 uppercase text-[11px] shadow-sm flex items-center justify-center max-w-fit mx-auto mt-2">
                  <span className="material-symbols-outlined text-[14px] mr-1" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                  {worker.tier}
                </Badge>
              </CardContent>
            </Card>

            {/* Score Drivers */}
            <Card className="md:col-span-2 shadow-sm flex flex-col border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 text-lg">Score Drivers</CardTitle>
                  <button className="text-xs font-bold text-[#225BA6] uppercase hover:underline">View Details</button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                {/* Driver 1 */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFE100]/30 text-[#225BA6] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Consistency</h3>
                    <p className="text-slate-900 font-bold text-lg">12 Months</p>
                  </div>
                </div>
                {/* Driver 2 */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFE100]/30 text-[#225BA6] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">work</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Diversification</h3>
                    <p className="text-slate-900 font-bold text-lg">4 Sources</p>
                  </div>
                </div>
                {/* Driver 3 */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFE100]/30 text-[#225BA6] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">show_chart</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Risk Profile</h3>
                    <p className="text-slate-900 font-bold text-lg">Low Volatility</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collective Intelligence (Market Position) */}
            <Card className="md:col-span-3 shadow-sm border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#225BA6] text-[20px]">groups</span>
                  <CardTitle className="text-slate-800 text-lg">Collective Intelligence: Market Position</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-8 items-center pt-2">
                <div className="flex-1 w-full">
                  <p className="text-slate-600 mb-6 border-l-4 border-[#FFE100] pl-3 py-1 bg-slate-50">
                    Barbers in <span className="font-bold text-[#225BA6]">Brickfields</span> average <span className="font-bold text-[#225BA6]">RM4,800/month</span>. You earn <span className="font-bold text-[#225BA6]">RM4,200</span>. Top quartile is <span className="font-bold text-[#225BA6]">RM6,100</span>.
                  </p>

                  {/* Visual Bar Chart (HTML CSS-based) */}
                  <div className="space-y-4 w-full">
                    {/* Top Quartile */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-500 uppercase">Top Quartile</span>
                        <span className="text-sm font-bold text-slate-900">RM6,100</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                        <div className="bg-[#FFE100] w-full h-full rounded-full"></div>
                      </div>
                    </div>
                    {/* Average */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-500 uppercase">Market Average</span>
                        <span className="text-sm font-bold text-slate-900">RM4,800</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
                        <div className="bg-[#225BA6]/30 w-[78%] h-full rounded-full"></div>
                      </div>
                    </div>
                    {/* You */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#225BA6] uppercase">You (Kumar)</span>
                        <span className="text-sm font-bold text-[#225BA6]">RM4,200</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300/50 shadow-sm">
                        <div className="bg-[#225BA6] w-[68%] h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insight Area */}
                <div className="w-full md:w-72 bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Insight</h4>
                  <p className="text-sm text-slate-700 mb-4">
                    Increasing your weekend hours could bridge the gap to the market average based on foot traffic data.
                  </p>
                  <Button variant="outline" className="w-full border-slate-300 text-slate-700 uppercase text-xs font-bold bg-white hover:bg-slate-50">
                    View Strategies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productive BNPL integrated seamlessly */}
          <div className="mt-4">
            <Tabs defaultValue="grow" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="grow" className="font-bold">Grow Your Business</TabsTrigger>
                <TabsTrigger value="history" className="font-bold">History</TabsTrigger>
              </TabsList>

              <TabsContent value="grow" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">Productive-Asset BNPL</h3>
                  <span className="text-xs font-bold text-[#225BA6] bg-[#FFE100]/30 px-3 py-1.5 rounded-full uppercase shadow-sm border border-[#FFE100]/50">Score Qualifies</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bnplCatalog.map((item) => (
                    <Dialog key={item.id}>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:border-[#FFE100] hover:shadow-lg transition-all shadow-sm border-slate-200 bg-white">
                          <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                            <div className="text-4xl bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-1 border border-slate-200 shadow-sm">
                              {item.img}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-tight h-10 flex items-center">{item.name}</h4>
                            <div className="text-[#225BA6] font-bold text-xl mt-auto">RM{item.monthly}<span className="text-xs font-bold text-slate-400">/mo</span></div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-[#225BA6]">Financing Offer</DialogTitle>
                          <DialogDescription className="font-medium text-slate-500">
                            Approved instantly — your Layak Score ({worker.score}) qualifies you.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="bg-slate-50 p-4 rounded-lg space-y-3 my-2 border border-slate-200">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-slate-500 font-bold uppercase text-xs">Asset</span>
                            <span className="font-bold text-slate-900">{item.name}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-slate-500 font-bold uppercase text-xs">Price</span>
                            <span className="font-bold text-slate-900">RM {item.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-slate-500 font-bold uppercase text-xs">Tenor</span>
                            <span className="font-bold text-slate-900">{item.tenor} months</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-bold uppercase text-xs">Projected Lift</span>
                            <Badge className="bg-[#FFE100] text-[#225BA6] hover:bg-[#FFE100] border-none px-3 py-1 shadow-sm font-bold">+{item.lift}% earnings</Badge>
                          </div>
                        </div>

                        <div className="text-center py-4">
                          <div className="text-sm font-bold text-slate-400 uppercase mb-1">Monthly Repayment</div>
                          <div className="text-5xl font-bold text-[#225BA6]">RM {item.monthly}</div>
                        </div>

                        <DialogFooter className="sm:justify-start">
                          <Button type="button" className="w-full bg-[#225BA6] hover:bg-[#1C4E8F] text-white font-bold py-6 text-lg shadow-md border-b-4 border-[#153A6A] active:border-b-0 active:translate-y-1 transition-all">
                            Accept & Approve Installment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-8 text-center text-slate-500 font-medium pb-8 w-full">
                    Transaction history view out of demo scope.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

        </main>
      </div>
    </div>
  )
}
