const ZONES = [
  { name: 'Brickfields',  density: 0.92, color: '#1d4ed8' },
  { name: 'Chow Kit',     density: 0.78, color: '#2563eb' },
  { name: 'Cheras',       density: 0.65, color: '#3b82f6' },
  { name: 'Wangsa Maju',  density: 0.54, color: '#60a5fa' },
  { name: 'Kepong',       density: 0.43, color: '#93c5fd' },
  { name: 'Setapak',      density: 0.31, color: '#bfdbfe' },
]

const TOP_TRADES = [
  { trade: 'Mobile Mechanic',    avg: 5800, n: 8 },
  { trade: 'Barber Services',    avg: 4800, n: 30 },
  { trade: 'DSLR Photography',   avg: 4200, n: 5 },
  { trade: 'Kuih Seller',        avg: 3500, n: 12 },
  { trade: 'POS Services',       avg: 3100, n: 4 },
]

export default function TngDashboard() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <p style={styles.title}>Layak — TNG Operations View</p>
        <span style={styles.live}>● LIVE</span>
      </header>

      <div style={styles.body}>
        {/* Metrics strip */}
        <div style={styles.metrics}>
          {[
            { label: 'Workers Credentialed', value: '50' },
            { label: 'Scores Issued Today',  value: '37' },
            { label: 'Lender Pulls Today',   value: '142' },
            { label: 'BNPL Volume (RM)',      value: '128,400' },
          ].map(m => (
            <div key={m.label} style={styles.tile}>
              <p style={styles.tileVal}>{m.value}</p>
              <p style={styles.tileLabel}>{m.label}</p>
            </div>
          ))}
        </div>

        <div style={styles.main}>
          {/* Heatmap */}
          <div style={styles.heatmapCard}>
            <p style={styles.cardTitle}>KL QR-Economy Earnings Density</p>
            <div style={styles.heatGrid}>
              {ZONES.map(z => (
                <div key={z.name} style={{ ...styles.heatCell, background: z.color }}>
                  <p style={styles.heatName}>{z.name}</p>
                  <p style={styles.heatDensity}>{(z.density * 100).toFixed(0)}%</p>
                </div>
              ))}
            </div>
            <div style={styles.legend}>
              <span>Low</span>
              <div style={styles.legendBar} />
              <span>High</span>
            </div>
          </div>

          {/* Top trades */}
          <div style={styles.tradesCard}>
            <p style={styles.cardTitle}>Top Trades by Avg Monthly Earnings</p>
            {TOP_TRADES.map((t, i) => (
              <div key={t.trade} style={styles.tradeRow}>
                <span style={styles.tradeRank}>#{i + 1}</span>
                <div style={styles.tradeInfo}>
                  <p style={styles.tradeName}>{t.trade}</p>
                  <p style={styles.tradeN}>{t.n} workers</p>
                </div>
                <div style={styles.tradeRight}>
                  <p style={styles.tradeAvg}>RM{t.avg.toLocaleString()}</p>
                  <div style={styles.tradeBar}>
                    <div style={{ ...styles.tradeBarFill, width: `${(t.avg / 6000) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 32px', borderBottom: '1px solid #1e293b' },
  title: { fontSize: 20, fontWeight: 700, color: '#60a5fa' },
  live: { color: '#4ade80', fontSize: 13, fontWeight: 600 },
  body: { padding: 24 },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  tile: { background: '#1e293b', borderRadius: 12, padding: '16px 20px' },
  tileVal: { fontSize: 28, fontWeight: 800, color: '#60a5fa' },
  tileLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  main: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 },
  heatmapCard: { background: '#1e293b', borderRadius: 12, padding: 24 },
  cardTitle: { fontWeight: 600, marginBottom: 16, color: '#e2e8f0' },
  heatGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  heatCell: { borderRadius: 10, padding: '20px 16px', minHeight: 80 },
  heatName: { fontWeight: 600, fontSize: 14, color: '#fff' },
  heatDensity: { fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,.9)', marginTop: 4 },
  legend: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 12, color: '#94a3b8' },
  legendBar: { flex: 1, height: 6, borderRadius: 3,
    background: 'linear-gradient(to right, #bfdbfe, #1d4ed8)' },
  tradesCard: { background: '#1e293b', borderRadius: 12, padding: 24 },
  tradeRow: { display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 0', borderBottom: '1px solid #0f172a' },
  tradeRank: { color: '#60a5fa', fontWeight: 700, fontSize: 16, width: 28 },
  tradeInfo: { flex: 1 },
  tradeName: { fontWeight: 600, fontSize: 14 },
  tradeN: { color: '#94a3b8', fontSize: 12 },
  tradeRight: { textAlign: 'right' },
  tradeAvg: { fontWeight: 700, color: '#4ade80', fontSize: 14 },
  tradeBar: { height: 4, width: 80, background: '#334155', borderRadius: 2, marginTop: 4 },
  tradeBarFill: { height: '100%', background: '#4ade80', borderRadius: 2 },
}
