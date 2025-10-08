import React, { useEffect, useState } from 'react'
import { rpcCall } from '../lib/rpc'
import { useWS } from '../lib/ws'

type Block = {
  number: string
  hash: string
  transactions: string[]
  timestamp?: string
}

export default function Blocks() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(false)
  const { tick } = useWS()

  async function load(){
    setLoading(true)
    try {
      const latestHex = await rpcCall('eth_blockNumber', [])
      const latest = parseInt(latestHex, 16)
      const toFetch = Array.from({ length: 10 }, (_, i) => latest - i).filter(n => n >= 0)
      const results = await Promise.all(toFetch.map(n => rpcCall('eth_getBlockByNumber', [ '0x' + n.toString(16), true ])))
      const cleaned = results.map((b: any) => ({
        number: b?.number ?? '0x0',
        hash: b?.hash ?? '',
        transactions: Array.isArray(b?.transactions) ? b.transactions.map(String) : [],
        timestamp: b?.timestamp
      }))
      setBlocks(cleaned as Block[])
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { load() }, [tick])

  return (
    <section className="p-4 border border-void-accent/20 rounded-2xl bg-black/40">
      <div className="text-xs opacity-70 uppercase">Recent Blocks</div>
      {loading && <div className="mt-2 text-sm opacity-70">loading…</div>}
      <div className="mt-2 grid md:grid-cols-2 gap-3">
        {blocks.map((b) => (
          <div key={b.hash} className="p-3 rounded-xl border border-void-accent/20 hover:border-void-accent/50 transition">
            <div className="text-sm">#{parseInt(b.number, 16)}</div>
            <div className="text-xs opacity-70 break-words">hash: {b.hash}</div>
            <div className="text-xs opacity-70">txs: {b.transactions.length}</div>
            {b.timestamp && <div className="text-xs opacity-70">ts: {parseInt(b.timestamp, 16)}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
