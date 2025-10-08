import React from 'react'
import { useWS } from '../lib/ws'

export default function WSStatus(){
  const { status, lastEvent } = useWS()
  return (
    <section className="p-4 border border-void-accent/20 rounded-2xl bg-black/40">
      <div className="text-xs uppercase opacity-70">Live Updates</div>
      <div className="mt-1 text-sm">
        Status: <span className="px-2 py-0.5 rounded bg-void-dim/30 border border-void-accent/20">{status}</span>
      </div>
      <div className="mt-1 text-xs opacity-70">Last event: {lastEvent || '—'}</div>
      <div className="mt-2 text-xs opacity-60">Tip: set <code>VITE_WS_URL</code> for fastest updates. Falls back to polling if unset.</div>
    </section>
  )
}
