import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TngAnalytics() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#1C4E8F] bg-[#225BA6] px-6 py-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#FFE100] text-[#225BA6] flex items-center justify-center font-bold text-lg shadow-sm">
            TNG
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">LAYAK</span>
            <span className="text-xs text-[#FFE100] font-medium">Operations View</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1C4E8F] px-4 py-1.5 rounded-full border border-[#153A6A] shadow-inner">
           <div className="h-4 w-4 rounded-full flex items-center justify-center">
             <div className="w-2.5 h-2.5 rounded-full bg-[#FFE100] animate-pulse"></div>
           </div>
           <span className="text-sm font-bold text-white">System Neutral</span>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1600px] w-full mx-auto">
        
        {/* Left/Main Column - KL Heatmap Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight text-[#225BA6] flex items-center gap-2 uppercase">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
            KL Zone Earnings Density
          </h2>
          
          <Card className="flex-1 bg-white border-slate-200 shadow-sm min-h-[400px] overflow-hidden flex flex-col p-1">
            <CardContent className="flex-1 p-0 flex items-center justify-center bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/101.6869,3.1390,11,0/800x600?access_token=pk.eyJ1IjoiZGVtbyIsImEiOiJjazkxeWg3NGwwMmtuM2VxcHlxYmtmaXk2In0.1')] bg-cover bg-center bg-no-repeat relative p-8 rounded-lg outline outline-1 outline-slate-200">
              {/* Fake Map Grid overlay */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
              
              {/* Actual grid visualizer */}
              <div className="relative z-10 w-full max-w-2xl aspect-[2/1] grid grid-cols-6 grid-rows-4 gap-1.5 p-2 bg-white rounded-xl shadow-[0_15px_40px_-10px_rgba(34,91,166,0.2)] border border-slate-100">
                {[
                  "bg-[#83A1CD]", "bg-[#FFE100]", "bg-[#FFE100]", "bg-[#FFE100]", "bg-[#F0F4F8]", "bg-[#225BA6]",
                  "bg-[#83A1CD]", "bg-[#F0F4F8]", "bg-[#FFE100]", "bg-[#83A1CD]", "bg-[#FFE100]", "bg-[#FFE100]",
                  "bg-[#F0F4F8]", "bg-[#83A1CD]", "bg-[#225BA6]", "bg-[#F0F4F8]", "bg-[#F0F4F8]", "bg-[#83A1CD]",
                  "bg-[#FFE100]", "bg-[#83A1CD]", "bg-[#F0F4F8]", "bg-[#F0F4F8]", "bg-[#225BA6]", "bg-[#F0F4F8]"
                ].map((colorClass, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm hover:opacity-80 hover:scale-[1.03] transition-all cursor-pointer ${colorClass}`}
                    title="Zone Data"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Top Trades */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight text-[#225BA6] uppercase">Top 5 Trades</h2>
          <Card className="flex-1 bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2 bg-slate-50 border-b border-slate-200 rounded-t-lg">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">By Average Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {[
                  { name: "Specialty Cooks", earnings: "RM 6,400", trend: "+12%" },
                  { name: "Barber Services", earnings: "RM 4,800", trend: "+8%" },
                  { name: "Mobile Mechanics", earnings: "RM 4,450", trend: "+15%" },
                  { name: "Kuih Sellers", earnings: "RM 3,100", trend: "+4%" },
                  { name: "Delivery Run", earnings: "RM 2,800", trend: "-2%" },
                ].map((trade, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:border-[#225BA6] hover:shadow-sm transition-all group cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFE100]/30 flex items-center justify-center font-bold text-[#225BA6] text-sm group-hover:bg-[#FFE100] transition-colors">
                        {i + 1}
                      </div>
                      <span className="font-bold text-slate-800">{trade.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-slate-900 font-bold">{trade.earnings}</div>
                      <div className={`text-xs font-bold ${trade.trend.startsWith('+') ? 'text-[#225BA6]' : 'text-rose-500'}`}>
                        {trade.trend} YoY
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Strip */}
      <footer className="bg-white border-t border-slate-200 p-6 z-10 w-full mt-auto shadow-inner">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-[#F8F9FB] p-5 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-[#225BA6]/30 transition-colors shadow-sm">
            <div className="bg-[#FFE100]/20 p-3 rounded-xl text-[#225BA6]"><span className="material-symbols-outlined text-[28px]">group</span></div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Workers Credentialed</div>
              <div className="text-3xl font-black text-[#225BA6]">12,450</div>
            </div>
          </div>
          
          <div className="bg-[#F8F9FB] p-5 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-[#225BA6]/30 transition-colors shadow-sm">
            <div className="bg-[#FFE100]/20 p-3 rounded-xl text-[#225BA6]"><span className="material-symbols-outlined text-[28px]">monitoring</span></div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Scores Issued Today</div>
              <div className="text-3xl font-black text-[#225BA6]">892</div>
            </div>
          </div>
          
          <div className="bg-[#F8F9FB] p-5 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-[#225BA6]/30 transition-colors shadow-sm">
            <div className="bg-[#FFE100]/20 p-3 rounded-xl text-[#225BA6]"><span className="material-symbols-outlined text-[28px]">vpn_key</span></div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Lender Pulls Today</div>
              <div className="text-3xl font-black text-[#225BA6]">142</div>
            </div>
          </div>
          
          <div className="bg-[#F8F9FB] p-5 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-[#225BA6]/30 transition-colors shadow-sm">
            <div className="bg-[#FFE100]/20 p-3 rounded-xl text-[#225BA6]"><span className="material-symbols-outlined text-[28px]">payments</span></div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">BNPL Volume (MYR)</div>
              <div className="text-3xl font-black text-[#225BA6]">1.4M</div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}
