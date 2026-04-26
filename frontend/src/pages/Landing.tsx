import { Link } from "react-router-dom"
import layak2Logo from "@/components/ui/layak_2.svg"

const stats = [
  { label: "Trapped-middle workers", value: "500,000+" },
  { label: "Avg monthly through TNG", value: "RM 4,800" },
  { label: "Rate they pay today", value: "12–18%" },
  { label: "Rate salaried pay", value: "5–7%" },
]

const layers = [
  {
    num: "01",
    title: "Collective intelligence",
    body: "TNG sees the entire QR economy. Aggregated by trade and zone, the same data calibrates every Layak Score honestly.",
  },
  {
    num: "02",
    title: "Layak Score credentials",
    body: "A signed, machine-readable income credential — like an EPF statement, but for QR work. Worker-consented, lender-consumed.",
  },
  {
    num: "03",
    title: "Productive-asset BNPL",
    body: "Financing for tools that pay themselves back. A barber's second chair. A kuih seller's commercial oven. Underwritten on income lift.",
  },
]

const scenes = [
  {
    to: "/worker/worker_kumar_001",
    label: "Worker app",
    desc: "Kumar's view. Layak Score, market position, BNPL catalog with instant quotes.",
    api: "GET /api/workers/:id",
  },
  {
    to: "/lender",
    label: "Lender portal",
    desc: "AEON Credit pulls Kumar's signed credential, verifies the JWT, reads the income.",
    api: "GET /api/credentials/pull/:workerId",
  },
  {
    to: "/tng",
    label: "TNG analytics",
    desc: "Internal operations view. Heatmap of QR-earnings density across Klang Valley.",
    api: "Aggregate intelligence layer",
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-900 font-sans antialiased">
      {/* Top bar */}
      <nav className="border-b border-[#1C4E8F] sticky top-0 bg-[#225BA6] text-white z-20 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={layak2Logo} alt="Layak" className="h-7 w-auto" />
            <span className="hidden sm:inline text-xs text-white/50 ml-1 font-medium tracking-wider">/ TNG FINHACK 2026</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-8 text-sm font-semibold">
            <Link to="/worker/worker_kumar_001" className="hidden sm:inline text-white/80 hover:text-[#FFE100] transition-colors">Worker</Link>
            <Link to="/lender" className="hidden sm:inline text-white/80 hover:text-[#FFE100] transition-colors">Lender</Link>
            <Link to="/tng" className="hidden sm:inline text-white/80 hover:text-[#FFE100] transition-colors">TNG</Link>
            <Link
              to="/worker/worker_kumar_001"
              className="px-4 py-2 bg-[#FFE100] text-[#225BA6] rounded-sm hover:bg-[#F7D800] transition shadow-sm font-bold uppercase text-[11px] tracking-wider"
            >
              View demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 sm:pt-28 pb-24 sm:pb-32">
        <p className="text-xs uppercase tracking-[0.18em] text-[#225BA6] font-semibold mb-6">
          Team FinNIX · Financial Inclusion Track
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-5xl">
          Trusted credit requires a third-party witness.
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
          Kumar earns RM 112,000 a year through TNG. To his bank, he is invisible.
          Layak is the neutral credentials standard for Malaysia's QR economy —
          TNG-issued, lender-consumed, worker-controlled.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/worker/worker_kumar_001"
            className="px-5 py-3 bg-[#225BA6] text-white text-sm font-medium rounded-sm hover:bg-[#1C4E8F] transition"
          >
            See Kumar's view →
          </Link>
          <Link
            to="/tng"
            className="px-5 py-3 border border-slate-300 text-slate-800 text-sm font-medium rounded-sm hover:border-slate-500 transition"
          >
            Open TNG analytics
          </Link>
        </div>

        {/* Numbers strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b border-slate-200 bg-slate-200">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#FAFAF7] p-6">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Witness gap */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24 grid md:grid-cols-12 gap-10 sm:gap-12">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#225BA6] font-semibold mb-4">
              The insight
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              The witness gap.
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Banks don't trust the worker's word — they trust the witnesses.
              Salaried workers have two. QR-economy workers have none.
              This isn't a documentation gap. It's a witness gap.
            </p>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-6">
            <div className="border border-slate-200 p-6 rounded-sm bg-[#FAFAF7]">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-3">
                Salaried worker
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>Employer attests to salary</li>
                <li>EPF attests to monthly deductions</li>
                <li>Two independent witnesses</li>
              </ul>
              <p className="mt-5 text-sm font-medium text-emerald-700">
                Loan in 30 minutes at 5–7%
              </p>
            </div>
            <div className="border border-slate-200 p-6 rounded-sm bg-[#FAFAF7]">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-3">
                QR-economy worker
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>Self-declared income</li>
                <li>i-Saraan tracks savings, not earnings</li>
                <li>No third-party attestor</li>
              </ul>
              <p className="mt-5 text-sm font-medium text-rose-700">
                Rejected — or charged 12–18%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Layers */}
      <section className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <p className="text-xs uppercase tracking-[0.18em] text-[#225BA6] font-semibold mb-4">
            The product
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl leading-tight">
            Three layers. One standard. Issued by TNG.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {layers.map((l) => (
              <div key={l.num} className="bg-[#FAFAF7] p-8">
                <p className="font-mono text-xs text-[#225BA6]">{l.num}</p>
                <h3 className="mt-4 font-semibold text-lg tracking-tight">{l.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moat */}
      <section className="border-t border-slate-200 bg-[#225BA6] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <p className="text-xs uppercase tracking-[0.18em] text-[#FFE100] font-semibold mb-6">
            The moat
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug max-w-4xl">
            TNG's moat isn't data exclusivity — it's structural neutrality.
            TNG is the only major QR-economy player that isn't a lender,
            making it the natural neutral issuer.
          </p>
          <p className="mt-8 text-sm text-blue-100/80 max-w-xl">
            Like Plaid for US bank data: first to standardize wins. Maybank can't be neutral.
            CIMB can't be neutral. TNG can.
          </p>
        </div>
      </section>

      {/* Demo */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#225BA6] font-semibold mb-4">
                The demo
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Three views, one credential.
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              49 workers and 31,228 transactions seeded. Kumar's score is computed live —
              not hard-coded.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {scenes.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="block border border-slate-200 p-6 rounded-sm hover:border-[#225BA6] hover:shadow-sm transition group bg-[#FAFAF7]"
              >
                <p className="font-semibold text-lg tracking-tight">{s.label}</p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                <p className="mt-6 font-mono text-[11px] text-slate-400">{s.api}</p>
                <p className="mt-4 text-sm text-[#225BA6] font-medium group-hover:translate-x-0.5 transition">
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img src={layak2Logo} alt="Layak" className="h-5 w-auto" />
            <span>— because Kumar's work makes him worthy.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Team FinNIX</span>
            <span>TNG FINHACK 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
