const RPC_URL = import.meta.env.VITE_RPC_URL
import React from 'react'

export async function rpcCall(method: string, params: any[]): Promise<any> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  })
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(safeText(`${data.error.code}: ${data.error.message}`))
  return data.result
}

export function useRPC(){
  const rpcUrl = RPC_URL
  const wsUrl = import.meta.env.VITE_WS_URL || ''
  const [chainId, setChainId] = React.useState<string | null>(null)
  const [latestBlock, setLatestBlock] = React.useState<any | null>(null)
  const [latencyMs, setLatency] = React.useState<number | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function refresh(){
    setError(null)
    try{
      const t0 = performance.now()
      const [cid, block] = await Promise.all([
        rpcCall('eth_chainId', []),
        rpcCall('eth_getBlockByNumber', ['latest', true])
      ])
      setChainId(String(parseInt(cid, 16)))
      setLatestBlock(block)
      setLatency(Math.round(performance.now() - t0))
    }catch(e: any){
      setError(safeText(e.message || String(e)))
    }
  }

  React.useEffect(() => { refresh() }, [])

  return { rpcUrl, wsUrl, chainId, latestBlock, latencyMs, error, refresh }
}

export function safeText(input: string, max=800){
  return String(input).replace(/[\x00-\x09\x0B-\x1F\x7F]/g,'').slice(0, max)
}
