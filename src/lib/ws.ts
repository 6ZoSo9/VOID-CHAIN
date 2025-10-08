import React from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || ''

export function useWS(){
  const [status, setStatus] = React.useState<'offline'|'connecting'|'online'|'polling'>('polling')
  const [lastEvent, setLastEvent] = React.useState<string>('')
  const [tick, setTick] = React.useState<number>(0)

  React.useEffect(() => {
    if(!WS_URL){ setStatus('polling'); return }
    let ws: WebSocket | null = null
    let alive = true

    try {
      setStatus('connecting')
      ws = new WebSocket(WS_URL)
      ws.onopen = () => { if(!alive) return; setStatus('online') }
      ws.onclose = () => { if(!alive) return; setStatus('polling') }
      ws.onerror = () => { if(!alive) return; setStatus('polling') }
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg?.method === 'newHeads' || msg?.type === 'tip') {
            setLastEvent(new Date().toLocaleTimeString())
            setTick(t => t + 1)
          }
        } catch {}
      }
    } catch {
      setStatus('polling')
    }

    return () => { alive = false; if(ws) try{ ws.close() } catch{} }
  }, [])

  React.useEffect(() => {
    if(status === 'polling'){
      const id = setInterval(() => setTick(t=>t+1), 5000)
      return () => clearInterval(id)
    }
  }, [status])

  return { status, lastEvent, tick }
}
