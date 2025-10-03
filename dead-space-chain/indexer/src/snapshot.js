import 'dotenv/config'
import fs from 'fs-extra'
import path from 'path'
import { JsonRpcProvider, Interface, zeroPadValue } from 'ethers'

const provider = new JsonRpcProvider(process.env.RPC_URL)
const START_BLOCK = parseInt(process.env.START_BLOCK||'0',10)
const XENO = process.env.XENO_TOKEN
const PUB_DIR = process.env.PUBLISHER_DIR || '../publisher'
const SNAP_FILE = process.env.SNAP_FILE || 'stakes.csv'

const iface = new Interface(["event Transfer(address indexed from, address indexed to, uint256 value)"])

if(!XENO){ console.error('Set XENO_TOKEN in .env'); process.exit(1) }

// naive holder map by scanning Transfer logs
async function main(){
  const latest = await provider.getBlockNumber()
  console.log('Scanning', XENO, 'blocks', START_BLOCK, 'to', latest)

  const filter = { address: XENO, fromBlock: START_BLOCK, toBlock: latest, topics:[ iface.getEvent("Transfer").topicHash ] }
  const logs = await provider.getLogs(filter)
  const m = new Map()

  for(const log of logs){
    const { args } = iface.parseLog(log)
    const from = args[0].toLowerCase()
    const to = args[1].toLowerCase()
    const value = BigInt(args[2].toString())

    if(from !== '0x0000000000000000000000000000000000000000'){
      m.set(from, (m.get(from)||0n) - value)
    }
    if(to !== '0x0000000000000000000000000000000000000000'){
      m.set(to, (m.get(to)||0n) + value)
    }
  }

  // write CSV
  const out = [['address','stakeWei']]
  for(const [addr,bal] of m.entries()){
    if(bal>0n) out.push([addr, bal.toString()])
  }
  const csv = out.map(r=>r.join(',')).join('\n')
  const dest = path.join(PUB_DIR, 'data', SNAP_FILE)
  await fs.ensureDir(path.dirname(dest))
  await fs.writeFile(dest, csv, 'utf8')
  console.log('Wrote', dest, 'holders:', out.length-1)
}

main().catch(e=>{ console.error(e); process.exit(1) })
