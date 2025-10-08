import React from 'react'
import { useRPC } from './lib/rpc'
import Blocks from './components/Blocks'
import WSStatus from './components/WSStatus'

export default function App() {
  const { rpcUrl, wsUrl, chainId, latestBlock, latencyMs, error, refresh } = useRPC()

  return (
    <div className="min-h-screen bg-void-bg text-void-fg font-mono p-4 selection:bg-void-accent/30">
      <div className="max-w-5xl mx-auto space-y-4">
        <header className="p-4 border border-void-accent/20 rounded-2xl shadow-crt bg-black/40 backdrop-blur">
          <h1 className="text-2xl md:text-3xl tracking-widest">VOID CHAIN // RETRO EXPLORER</h1>
          <p className="text-sm opacity-70 mt-2">A view into the abyss — read‑only, security‑first.</p>
        </header>

        <section className="grid md:grid-cols-4 gap-4">
          <div className="col-span-2 p-4 border border-void-accent/20 rounded-2xl bg-black/40">
            <div className="text-xs opacity-70 uppercase">RPC</div>
            <div className="truncate mt-1">{rpcUrl}</div>
            <div className="text-xs opacity-70 uppercase mt-3">WebSocket</div>
            <div className="truncate mt-1">{wsUrl || '— (polling fallback)'}</div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="opacity-70">Chain ID:</span>
              <span className="px-2 py-0.5 rounded bg-void-dim/30 border border-void-accent/20">{chainId ?? '—'}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="opacity-70">Latency:</span>
              <span className="px-2 py-0.5 rounded bg-void-dim/30 border border-void-accent/20">{latencyMs ? `${latencyMs} ms` : '—'}</span>
            </div>
            <button onClick={refresh} className="mt-3 px-3 py-1 rounded-xl border border-void-accent/30 hover:border-void-accent/60 active:scale-95 transition">
              refresh
            </button>
            {error && <div className="mt-2 text-red-300 text-sm break-words">{error}</div>}
          </div>

          <div className="col-span-2 p-4 border border-void-accent/20 rounded-2xl bg-black/40">
            <div className="text-xs opacity-70 uppercase">Latest Block</div>
            <div className="mt-1 text-xl">{latestBlock?.number ?? '—'}</div>
            <div className="mt-1 text-sm opacity-80 break-words">hash: {latestBlock?.hash ?? '—'}</div>
            <div className="mt-1 text-sm opacity-80">txs: {latestBlock?.transactions?.length ?? '—'}</div>
          </div>
        </section>

        <WSStatus />

        <Blocks />
        
        <footer className="pt-6 text-xs opacity-60 text-center">
          VOID Labs — Obelisk + VOID // retro mode. No secrets. No write ops.
        </footer>
      </div>
    </div>
  )
}
