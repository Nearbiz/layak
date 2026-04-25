import { useState } from 'react'
import { issueCredential, pullCredential } from '../api'

export default function LenderPortal() {
  const [workerId, setWorkerId] = useState('worker_kumar_001')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePull() {
    if (!workerId.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      // Issue a fresh credential first (auto-consent for demo)
      await issueCredential(workerId, 'aeon_credit')
      const cred = await pullCredential(workerId)
      setResult(cred)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.brand}>AEON Credit · Layak Partner Console</p>
          <p style={styles.sub}>Credential Verification Portal</p>
        </div>
        <div style={styles.sidebar}>
          <p style={styles.stat}><strong>142</strong> pulls today</p>
          <p style={styles.stat}><strong>3,891</strong> this month</p>
        </div>
      </header>

      <div style={styles.body}>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={workerId}
            onChange={e => setWorkerId(e.target.value)}
            placeholder="Enter Worker ID (e.g. worker_kumar_001)"
          />
          <button style={styles.pullBtn} onClick={handlePull} disabled={loading}>
            {loading ? 'Pulling...' : 'Pull Credential'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.result}>
            <div style={styles.badges}>
              <span style={{ ...styles.badge, background: '#dcfce7', color: '#166534' }}>
                ✓ Issuer: {result.issuer}
              </span>
              <span style={{ ...styles.badge, background: '#dcfce7', color: '#166534' }}>
                ✓ Signature valid
              </span>
              <span style={{ ...styles.badge, ...(result.verified ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }) }}>
                {result.verified ? '✓ Within TTL' : '✗ Expired'}
              </span>
            </div>
            <pre style={styles.json}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '24px 32px', borderBottom: '1px solid #1e293b' },
  brand: { fontSize: 20, fontWeight: 700, color: '#60a5fa' },
  sub: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  sidebar: { textAlign: 'right' },
  stat: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  body: { padding: 32 },
  inputRow: { display: 'flex', gap: 12, marginBottom: 24 },
  input: { flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 8,
    padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none' },
  pullBtn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8,
    padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  error: { color: '#f87171', marginBottom: 16 },
  result: { background: '#1e293b', borderRadius: 12, padding: 20 },
  badges: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  badge: { fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 },
  json: { fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, color: '#94a3b8',
    whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
}
