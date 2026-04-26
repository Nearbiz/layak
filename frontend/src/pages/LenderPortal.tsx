import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import layak2Logo from "@/components/ui/layak_2.svg"

const mockCredential = {
  "credential_id": "lyk_2026_a3f9c1",
  "issuer": "tng.layak.my",
  "subject": "worker_kumar_001",
  "issued_at": "2026-04-26T03:14:22Z",
  "expires_at": "2026-04-26T04:14:22Z",
  "verified_payload": {
    "score": 720,
    "tier": "excellent",
    "earnings_12mo": 112400,
    "earnings_6mo_monthly_avg": 4280,
    "consistency": 0.91,
    "income_sources": 4,
    "diversity_score": 128, // Unique customers
    "tenure_months": 18,
    "trade": "Barber Services",
    "zone": "Brickfields, KL",
    "monthly_history": [
      { month: "May", amount: 3800 },
      { month: "Jun", amount: 4100 },
      { month: "Jul", amount: 3900 },
      { month: "Aug", amount: 4400 },
      { month: "Sep", amount: 4200 },
      { month: "Oct", amount: 4600 },
      { month: "Nov", amount: 4300 },
      { month: "Dec", amount: 4800 },
      { month: "Jan", amount: 4100 },
      { month: "Feb", amount: 4500 },
      { month: "Mar", amount: 4200 },
      { month: "Apr", amount: 4400 },
    ]
  },
  "signature_algorithm": "HS256",
  "signature": "a8f3b1c7ab8bc4d1e2f9a..."
}

export default function LenderPortal() {
  const navigate = useNavigate()
  const [workerId, setWorkerId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [step, setStep] = useState(0) // 0: Idle, 1: Calling API, 2: Done

  const handlePull = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerId) return
    setIsLoading(true)
    setResult(null)
    setStep(1)

    // Simulate API connection flow
    setTimeout(() => {
      setResult(mockCredential)
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#225BA6] text-white px-6 py-5 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            title="Go back to Landing"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <img src={layak2Logo} alt="Layak" className="h-8 w-auto" />
            <span className="font-black tracking-widest text-sm uppercase opacity-90">Console</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs opacity-90 flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#FFE100] animate-pulse"></div>
            API STATUS: ACTIVE
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r hidden lg:flex flex-col p-8 shrink-0">
          <div className="mb-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Standard Verification</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[#225BA6] text-[20px]">verified_user</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">TNG Witnessed</p>
                  <p className="text-[10px] text-slate-500 font-medium">Income verified at source.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[#225BA6] text-[20px]">lock</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Neutral Standard</p>
                  <p className="text-[10px] text-slate-500 font-medium">Worker-consented data pull.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Partner Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-black text-slate-800 tracking-tighter">142</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credential Pulls Today</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-800 tracking-tighter">RM 4.2M</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Underwriting</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Step Visualization */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { id: 1, name: "Issuance", icon: "qr_code_2", status: "completed", desc: "TNG Issued" },
                { id: 2, name: "Consent", icon: "how_to_reg", status: "completed", desc: "Worker App" },
                { id: 3, name: "API Call", icon: "hub", status: step >= 1 ? "active" : "pending", desc: "Secure Pull" },
                { id: 4, name: "Verify", icon: "fact_check", status: step >= 2 ? "completed" : "pending", desc: "Final Report" }
              ].map((s) => (
                <div key={s.id} className={`flex flex-col items-center text-center gap-2 p-4 rounded-2xl transition-all duration-500 border ${
                  s.status === 'completed' ? 'bg-[#225BA6]/5 border-[#225BA6]/20' :
                  s.status === 'active' ? 'bg-[#FFE100]/10 border-[#FFE100] shadow-md scale-105' : 'bg-white border-slate-200 opacity-40'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                    s.status === 'completed' ? 'bg-[#225BA6] text-white' :
                    s.status === 'active' ? 'bg-[#FFE100] text-[#225BA6]' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{s.status === 'completed' ? 'check' : s.icon}</span>
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-tighter ${s.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{s.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="shadow-2xl border-0 bg-white ring-1 ring-slate-200">
              <CardHeader className="pb-8 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black text-[#225BA6] uppercase tracking-tight">Pull Worker Credentials</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                      Establish a secure bridge to the worker's verified TNG financial identity.
                    </CardDescription>
                  </div>
                  <Badge className="bg-[#FFE100] text-[#225BA6] border-0 font-bold px-4 py-1">SECURE BRIDGE</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handlePull} className="flex gap-4">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#225BA6] text-[24px]">id_card</span>
                    <Input
                      placeholder="Enter Worker ID (e.g. worker_kumar_001)"
                      className="pl-12 py-7 text-lg bg-slate-50 border-slate-200 font-bold placeholder:font-normal rounded-xl focus:ring-[#225BA6]/20 transition-all"
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!workerId || isLoading}
                    className="py-7 px-10 text-lg bg-[#225BA6] hover:bg-[#1C4E8F] text-white font-black shadow-xl rounded-xl transition-all active:scale-95"
                  >
                    {isLoading ? <span className="material-symbols-outlined animate-spin mr-2">sync</span> : null}
                    PULL VERIFIED DATA
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">

                {/* Verification Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="bg-[#225BA6] text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full"></div>
                    <CardHeader className="pb-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Layak Score</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-6xl font-black tracking-tighter mb-1">{result.verified_payload.score}</div>
                      <Badge className="bg-[#FFE100] text-[#225BA6] border-0 font-bold px-3 uppercase text-[10px]">
                        {result.verified_payload.tier} TIER
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-xl">
                    <CardHeader className="pb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Stability Score</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{(result.verified_payload.consistency * 100).toFixed(0)}%</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-[#225BA6] h-full rounded-full" style={{ width: `${result.verified_payload.consistency * 100}%` }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-xl">
                    <CardHeader className="pb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Customer Diversity</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{result.verified_payload.diversity_score}</div>
                      <p className="text-[10px] font-bold text-[#225BA6] uppercase">Unique Payers (12mo)</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Trend */}
                <Card className="border-0 shadow-xl ring-1 ring-slate-200 bg-white">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Verified Earnings Trend (TNG-Witnessed)</CardTitle>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 font-bold uppercase text-[9px] px-3 py-1">
                        100% FORGE-PROOF
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="flex items-end gap-2 h-48 w-full">
                      {result.verified_payload.monthly_history.map((h: any, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div
                            className="w-full bg-[#225BA6]/10 group-hover:bg-[#225BA6] rounded-t-sm transition-all duration-300 relative"
                            style={{ height: `${(h.amount / 5000) * 100}%` }}
                          >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                              RM{h.amount}
                             </div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{h.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Monthly Income</p>
                        <p className="text-2xl font-black text-slate-800">RM {result.verified_payload.earnings_6mo_monthly_avg.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annualized Gross</p>
                        <p className="text-2xl font-black text-[#225BA6]">RM {result.verified_payload.earnings_12mo.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Comparison */}
                <div className="pt-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">Why Lenders Trust This Report</h3>
                  <div className="grid md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                    <div className="bg-slate-50 p-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Traditional Data</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-xs font-bold text-rose-600">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Self-Declared (Easy to fake)
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-rose-600">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Raw bank logs (Hard to read)
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-rose-600">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Low Trust / Manual audit
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-6">
                      <p className="text-[10px] font-black text-[#225BA6] uppercase mb-4 tracking-widest">Layak Credentials</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> TNG-Witnessed (Forge-proof)
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Standardized API (Instant)
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> High Trust / Auto-underwrite
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Technical Payload (JSON) */}
                <Tabs defaultValue="visual" className="pt-10">
                  <div className="flex justify-center mb-4">
                    <TabsList className="bg-slate-200 p-1 rounded-lg">
                      <TabsTrigger value="visual" className="text-xs font-bold uppercase px-6">Verification Report</TabsTrigger>
                      <TabsTrigger value="json" className="text-xs font-bold uppercase px-6">JSON Source</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="json">
                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-900 ring-1 ring-white/10">
                      <div className="flex items-center px-4 py-2 border-b border-white/5 bg-slate-800">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="mx-auto text-[10px] font-mono font-bold text-white/40 tracking-wider">SECURE-PAYLOAD.JWT</div>
                      </div>
                      <CardContent className="p-0">
                        <pre className="p-8 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                          <code dangerouslySetInnerHTML={{
                            __html: JSON.stringify(result, null, 2)
                              .replace(/"(.*?)":/g, '<span class="text-white/40">"$1"</span>:')
                              .replace(/: "(.*?)"/g, ': <span class="text-emerald-400 font-bold">"$1"</span>')
                              .replace(/: (\d+)/g, ': <span class="text-white font-bold">$1</span>')
                          }}>
                          </code>
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
