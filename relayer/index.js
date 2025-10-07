import 'dotenv/config'
import pino from 'pino'
import { WebSocketProvider } from 'ethers'

const log = pino({ name: 'void-relayer' })

const RPC = process.env.RPC_WS || ''
if (!RPC) {
  log.warn('Set RPC_WS in .env to connect a websocket provider (e.g., Sepolia WS).')
} else {
  const provider = new WebSocketProvider(RPC)
  provider.on('block', (n) => log.info({ block: n }, 'New block'))
}

log.info('VOID relayer placeholder running.')
