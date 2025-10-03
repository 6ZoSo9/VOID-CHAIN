import 'dotenv/config'
import fs from 'fs-extra'
import path from 'path'
import { WebSocketProvider, Contract, formatUnits } from 'ethers'

const L2 = new WebSocketProvider(process.env.L2_RPC)
const L1 = new WebSocketProvider(process.env.L1_RPC)
const PUBLISHER_DIR = process.env.PUBLISHER_DIR || '../publisher'
const STATUS_DIR = path.join(PUBLISHER_DIR, 'status')
const EXPLORER_L2 = (process.env.EXPLORER_L2 || '').replace(/\/?$/,'/')
const EXPLORER_L1 = (process.env.EXPLORER_L1 || '').replace(/\/?$/,'/')
const CHALLENGE_SECONDS = parseInt(process.env.CHALLENGE_SECONDS||'0',10)

const abiL2=[
  "event Locked(bytes32 indexed nonce, address indexed from, address indexed to, uint256 amount)",
  "event Unlocked(bytes32 indexed nonce, address indexed to, uint256 amount)"
]
const abiL1=[
  "event Minted(address indexed to, uint256 amount, bytes32 indexed ref)",
  "event Burned(address indexed from, uint256 amount, bytes32 indexed ref)"
]

const l2Lockbox = new Contract(process.env.L2_LOCKBOX, abiL2, L2)
const l1Lockbox = new Contract(process.env.L1_LOCKBOX, abiL1, L1)

await fs.ensureDir(STATUS_DIR)

function txLinkL2(hash){ return EXPLORER_L2 ? EXPLORER_L2 + hash.replace(/^0x/,'0x') : undefined }
function txLinkL1(hash){ return EXPLORER_L1 ? EXPLORER_L1 + hash.replace(/^0x/,'0x') : undefined }

async function addItem(address, item){
  const f = path.join(STATUS_DIR, address.toLowerCase()+'.json')
  let j = { items: [] }
  if(await fs.pathExists(f)){ j = await fs.readJson(f).catch(()=>j) || j }
  // upsert by nonce+direction
  const idx = j.items.findIndex(x=> x.nonce===item.nonce && x.direction===item.direction)
  if(idx>=0){ j.items[idx] = { ...j.items[idx], ...item } } else { j.items.push(item) }
  await fs.writeJson(f, j, { spaces: 2 })
}

// L2 -> L1: lock
l2Lockbox.on('Locked', async (nonce, from, to, amount, ev)=>{
  const item = {
    nonce: nonce, direction: 'L2->L1', amount: amount.toString(),
    status: 'locked', txHash: txLinkL2(ev.log.transactionHash), ts: Date.now()/1000, challengeSeconds: CHALLENGE_SECONDS
  }
  await addItem(from, item)
})

// L1 -> L2: minted after verified lock
l1Lockbox.on('Minted', async (to, amount, ref, ev)=>{
  const item = {
    nonce: ref, direction: 'L2->L1', amount: amount.toString(),
    status: 'minted', txHash: txLinkL1(ev.log.transactionHash), ts: Date.now()/1000
  }
  await addItem(to, item)
})

// L1 -> L2: burn
l1Lockbox.on('Burned', async (from, amount, ref, ev)=>{
  const item = {
    nonce: ref, direction: 'L1->L2', amount: amount.toString(),
    status: 'burned', txHash: txLinkL1(ev.log.transactionHash), ts: Date.now()/1000, challengeSeconds: CHALLENGE_SECONDS
  }
  await addItem(from, item)
})

// L2 unlock
l2Lockbox.on('Unlocked', async (nonce, to, amount, ev)=>{
  const item = {
    nonce: nonce, direction: 'L1->L2', amount: amount.toString(),
    status: 'unlocked', txHash: txLinkL2(ev.log.transactionHash), ts: Date.now()/1000
  }
  await addItem(to, item)
})

console.log('Relayer/status monitor running.')
