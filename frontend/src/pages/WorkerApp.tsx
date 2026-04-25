import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getWorker, getMarket, getBnplQuote } from '../api'

const TIER_COLOR: Record<string, string> = {
  excellent: '#16a34a',
  good: '#2563eb',
  fair: '#d97706',
  building: '#9ca3af',
}

const ASSET_CATALOG = [
  { sku: 'barber_chair_v2',     name: 'Professional Barber Chair', price: 3000, lift: 40 },
  { sku: 'clipper_set_pro',     name: 'Pro Clipper Set',           price: 850,  lift: 20 },
  { sku: 'commercial_oven_30l', name: 'Commercial Oven 30L',       price: 4200, lift: 35 },
  { sku: 'packaging_machine',   name: 'Packaging Machine',         price: 2800, lift: 30 },
  { sku: 'dslr_kit',            name: 'DSLR Photography Kit',      price: 5500, lift: 45 },
  { sku: 'led_lighting_kit',    name: 'LED Lighting Kit',          price: 1200, lift: 25 },
]

export default function WorkerApp() {
  const { id } = useParams<{ id: string }>()
  const [worker, setWorker] = useState<any>(null)
  const [market, setMarket] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'score' | 'bnpl'>('score')
  const [quote, setQuote] = useState<any>(null)
  const [quotingSku, setQuotingSku] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getWorker(id).then((w: any) => {
      setWorker(w)
      if (w.trade && w.zone) getMarket(w.trade, w.zone).then(setMarket)
    }).finally(() => setLoading(false))
  }, [id])

  async function handleGetQuote(sku: string) {
    setQuotingSku(sku)
    try {
      const q = await getBnplQuote(id!, sku)
      setQuote(q)
    } finally {
      setQuotingSku(null)
    }
  }

  if (loading) return <div style={styles.center}>Loading...</div>
  if (!worker) return <div style={styles.center}>Worker not found.</div>

  const score = worker.score?.value ?? 0
  const tier = worker.score?.tier ?? 'building'
  const drivers = worker.score?.drivers ?? {}
  const tierColor = TIER_COLOR[tier] ?? '#9ca3af'

  const marketBars = market ? [
    { name: 'You', value: worker.earnings_6mo_monthly?.slice(-1)[0] ?? 0, you: true },
    { name: 'Avg', value: market.avg_monthly_myr, you: false },
    { name: 'Top 25%', value: market.p75_monthly_myr, you: false },
  ] : []

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <span style={styles.logo}>TNG · <strong>Layak</strong></span>
        <span style={styles.avatar}>{worker.name?.charAt(0) ?? 'K'}</span>
      </header>

      {/* Score card */}
      <div style={{ ...styles.card, borderTop: `4px solid ${tierColor}` }}>
        <p style={styles.label}>Layak Score</p>
        <p style={{ ...styles.scoreNum, color: tierColor }}>{score}</p>
        <span style={{ ...styles.tierBadge, background: tierColor }}>
          {tier.toUpperCase()}
        </span>
        <div style={styles.drivers}>
          {Object.entries(drivers).slice(0, 3).map(([k, v]: [string, any]) => (
            <div key={k} style={styles.chip}>
              <span style={styles.chipLabel}>{k}</span>
              <span style={styles.chipVal}>{((v?.value ?? 0) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(activeTab === 'score' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('score')}>Market Position</button>
        <button style={{ ...styles.tab, ...(activeTab === 'bnpl' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('bnpl')}>Grow your business</button>
      </div>

      {activeTab === 'score' && market && (
        <div style={styles.card}>
          <p style={styles.cardTitle}>{worker.trade?.replace(/_/g, ' ')} in {worker.zone?.replace(/_/g, ' ')}</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={marketBars} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis tickFormatter={(v: number) => `RM${(v/1000).toFixed(1)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `RM${v.toLocaleString()}`} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {marketBars.map((entry, i) => (
                  <Cell key={i} fill={entry.you ? '#0070f3' : '#d1d5db'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={styles.marketNote}>
            You earn RM{(marketBars[0]?.value ?? 0).toLocaleString()} / avg RM{market.avg_monthly_myr?.toLocaleString()} / top RM{market.p75_monthly_myr?.toLocaleString()}
          </p>
        </div>
      )}

      {activeTab === 'bnpl' && (
        <div style={styles.catalog}>
          {ASSET_CATALOG.map(item => (
            <div key={item.sku} style={styles.assetCard}>
              <p style={styles.assetName}>{item.name}</p>
              <p style={styles.assetPrice}>RM{item.price.toLocaleString()}</p>
              <p style={styles.assetLift}>+{item.lift}% earnings lift</p>
              <button style={styles.quoteBtn}
                disabled={quotingSku === item.sku}
                onClick={() => handleGetQuote(item.sku)}>
                {quotingSku === item.sku ? 'Getting quote...' : 'Get Quote'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quote modal */}
      {quote && (
        <div style={styles.overlay} onClick={() => setQuote(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <p style={styles.modalTitle}>{quote.asset?.name}</p>
            <div style={styles.modalRow}><span>Price</span><strong>RM{quote.asset?.price_myr?.toLocaleString()}</strong></div>
            <div style={styles.modalRow}><span>Tenor</span><strong>{quote.tenor_months} months</strong></div>
            <div style={styles.modalRow}><span>Monthly</span><strong>RM{quote.monthly_myr}</strong></div>
            <div style={styles.modalRow}><span>Earnings lift</span><strong>+{quote.projected_lift_pct}%</strong></div>
            <div style={{ ...styles.approveBox, background: quote.approval_status === 'approved' ? '#dcfce7' : '#fee2e2' }}>
              {quote.approval_status === 'approved'
                ? '✓ Approved instantly — your Layak Score qualifies you'
                : '✗ Score below threshold'}
            </div>
            <button style={styles.closeBtn} onClick={() => setQuote(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 480, margin: '0 auto', padding: '0 0 32px' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', background: '#fff', borderBottom: '1px solid #e5e7eb' },
  logo: { fontSize: 18, color: '#0070f3' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#0070f3',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 20, margin: '16px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' },
  label: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
  scoreNum: { fontSize: 72, fontWeight: 800, lineHeight: 1, margin: '8px 0' },
  tierBadge: { display: 'inline-block', color: '#fff', fontSize: 12, fontWeight: 700,
    padding: '3px 10px', borderRadius: 20, letterSpacing: 1 },
  drivers: { display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  chip: { background: '#f3f4f6', borderRadius: 20, padding: '4px 12px', display: 'flex', gap: 4, fontSize: 13 },
  chipLabel: { color: '#6b7280', textTransform: 'capitalize' },
  chipVal: { fontWeight: 600 },
  tabs: { display: 'flex', margin: '0 16px', borderBottom: '2px solid #e5e7eb' },
  tab: { flex: 1, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, color: '#6b7280' },
  tabActive: { color: '#0070f3', borderBottom: '2px solid #0070f3', marginBottom: -2, fontWeight: 600 },
  cardTitle: { fontWeight: 600, marginBottom: 12, textTransform: 'capitalize' },
  marketNote: { fontSize: 12, color: '#6b7280', marginTop: 8 },
  catalog: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: 16 },
  assetCard: { background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,.08)' },
  assetName: { fontWeight: 600, fontSize: 13, marginBottom: 4 },
  assetPrice: { color: '#0070f3', fontWeight: 700, fontSize: 15 },
  assetLift: { color: '#16a34a', fontSize: 12, margin: '4px 0 8px' },
  quoteBtn: { width: '100%', background: '#0070f3', color: '#fff', border: 'none',
    borderRadius: 8, padding: '8px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: 24, width: 320, boxShadow: '0 8px 32px rgba(0,0,0,.2)' },
  modalTitle: { fontWeight: 700, fontSize: 18, marginBottom: 16 },
  modalRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0',
    borderBottom: '1px solid #f3f4f6', fontSize: 14 },
  approveBox: { borderRadius: 8, padding: '12px 16px', margin: '16px 0', fontSize: 13, fontWeight: 600 },
  closeBtn: { width: '100%', background: '#f3f4f6', border: 'none', borderRadius: 8,
    padding: '10px 0', cursor: 'pointer', fontWeight: 600 },
}
