import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    "tenure_months": 18,
    "trade": "barber_services",
    "zone": "brickfields_kl"
  },
  "signature_algorithm": "HS256",
  "signature": "a8f3b1c7ab8bc4d1e2f9a..."
}

export default function LenderPortal() {
  const [workerId, setWorkerId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handlePull = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerId) return
    setIsLoading(true)
    setResult(null)

    // In a real demo, this fetches from /api/credentials/pull/:workerId
    setTimeout(() => {
      setResult(mockCredential)
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#225BA6] text-white px-6 py-4 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="font-serif italic text-3xl font-bold tracking-tighter text-[#FFE100]">AEON</div>
          <div className="h-6 w-px bg-white/30 mx-2"></div>
          <span className="font-bold tracking-wide">Layak Partner Console</span>
        </div>
        <div className="text-sm opacity-90 flex items-center gap-2 font-bold bg-[#1C4E8F] px-4 py-1.5 rounded-full border border-[#153A6A]">
          <div className="w-2 h-2 rounded-full bg-[#FFE100] animate-pulse"></div>
          API Connected
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:block p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Portal Activity</h3>

          <div className="space-y-6">
            <div>
              <div className="text-3xl font-black text-slate-800">142</div>
              <div className="text-sm font-medium text-slate-500">Recent pulls today</div>
            </div>

            <div>
              <div className="text-3xl font-black text-slate-800">3,891</div>
              <div className="text-sm font-medium text-slate-500">Pulls this month</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-8">

            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle>Pull Layak Credential</CardTitle>
                <CardDescription>
                  Enter a worker ID to pull their verified income and score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePull} className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]">search</span>
                    <Input
                      placeholder="e.g. worker_kumar_001"
                      className="pl-12 py-6 text-lg bg-slate-50 border-slate-300 font-bold placeholder:font-normal"
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!workerId || isLoading}
                    className="py-6 px-8 text-lg bg-[#225BA6] hover:bg-[#1C4E8F] text-[#FFE100] font-bold shadow-md"
                  >
                    {isLoading ? <span className="material-symbols-outlined animate-spin mr-2">sync</span> : null}
                    Pull Data
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-[#FFE100]/20 text-[#225BA6] border-[#225BA6]/30 py-1.5 px-3 uppercase font-bold tracking-wide">
                    <span className="material-symbols-outlined text-[16px] mr-1">shield</span> Issuer verified
                  </Badge>
                  <Badge variant="outline" className="bg-[#FFE100]/20 text-[#225BA6] border-[#225BA6]/30 py-1.5 px-3 uppercase font-bold tracking-wide">
                    <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span> Signature valid
                  </Badge>
                  <Badge variant="outline" className="bg-[#FFE100]/20 text-[#225BA6] border-[#225BA6]/30 py-1.5 px-3 uppercase font-bold tracking-wide">
                    <span className="material-symbols-outlined text-[16px] mr-1">schedule</span> Within TTL
                  </Badge>
                </div>

                <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                  <div className="flex items-center px-4 py-2 border-b border-slate-200 bg-slate-50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FFE100]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#225BA6]"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="mx-auto text-xs font-mono font-bold text-slate-500">credential-payload.json</div>
                  </div>
                  <CardContent className="p-0">
                    <pre className="p-6 text-sm font-mono text-[#225BA6] overflow-x-auto">
                      <code dangerouslySetInnerHTML={{
                        __html: JSON.stringify(result, null, 2)
                          .replace(/"(.*?)":/g, '<span class="text-slate-600">"$1"</span>:')
                          .replace(/: "(.*?)"/g, ': <span class="text-[#225BA6] font-bold">"$1"</span>')
                          .replace(/: (\d+)/g, ': <span class="text-[#225BA6] font-bold">$1</span>')
                      }}>
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
