const BASE = import.meta.env.VITE_API_BASE_URL || ''

export async function getWorker(id: string) {
  const r = await fetch(`${BASE}/api/workers/${id}`)
  if (!r.ok) throw new Error(`Worker ${id} not found`)
  return r.json()
}

export async function getMarket(trade: string, zone: string) {
  const r = await fetch(`${BASE}/api/market/${trade}/${zone}`)
  if (!r.ok) throw new Error('Market data unavailable')
  return r.json()
}

export async function getBnplQuote(workerId: string, assetSku: string) {
  const r = await fetch(`${BASE}/api/bnpl/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worker_id: workerId, asset_sku: assetSku }),
  })
  if (!r.ok) throw new Error('Quote failed')
  return r.json()
}

export async function issueCredential(workerId: string, lenderId: string) {
  const r = await fetch(`${BASE}/api/credentials/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      worker_id: workerId,
      lender_id: lenderId,
      scope: ['earnings', 'score', 'tenure'],
      ttl_seconds: 86400,
    }),
  })
  if (!r.ok) throw new Error('Issue credential failed')
  return r.json()
}

export async function pullCredential(workerId: string) {
  const r = await fetch(`${BASE}/api/credentials/pull/${workerId}`, {
    headers: {
      'X-Lender-Id': 'aeon_credit',
      'X-Lender-Key': 'demo-aeon-key',
    },
  })
  if (!r.ok) throw new Error('Pull credential failed')
  return r.json()
}
