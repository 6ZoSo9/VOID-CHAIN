import fs from 'fs-extra'
import path from 'path'
import { buildTree, hashLeaf, getProof } from './merkle.js'

const CAP = BigInt('666666666000000000000000000')
const SPLIT_NUM = 90n
const SPLIT_DEN = 100n
const MIN_UPTIME = 0.80 // 80% uptime to qualify for flat share

async function main(){
  const epochArg = process.argv[2]
  if(!epochArg){ console.error('usage: node src/build_epoch.js <epoch>'); process.exit(1) }
  const epoch = Number(epochArg)
  const rootDir = process.cwd()
  const outDir = path.join(rootDir, 'public', 'epoch', String(epoch))
  await fs.ensureDir(outDir)

  const stakes = await readCSV(path.join(rootDir,'data','stakes.csv'))
  const stakeMap = new Map()
  for(const r of stakes){
    const addr = String(r.address).toLowerCase()
    const w = BigInt(r.stakeWei||'0')
    if(w>0n) stakeMap.set(addr, (stakeMap.get(addr)||0n) + w)
  }

  // Validator candidates are those who joined AND meet uptime threshold
  const uptime = await readCSV(path.join(rootDir,'data','validators_uptime.csv')) // address,uptime
  const upMap = new Map(uptime.map(r=>[String(r.address).toLowerCase(), Number(r.uptime||'0')]))
  const joinsDir = path.join(rootDir,'joins', String(epoch))
  const validators = []
  if(await fs.pathExists(joinsDir)){
    for(const f of await fs.readdir(joinsDir)){
      if(!f.endsWith('.json')) continue
      const a = '0x'+f.replace('.json','').lower()
    }
  }
  // recompute validators with uptime
  const vs = []
  if(await fs.pathExists(joinsDir)){
    for(const f of await fs.readdir(joinsDir)){
      if(f.endsWith('.json')){
        const addr = ('0x'+f.replace('.json','')).toLowerCase()
        if((upMap.get(addr)||0) >= MIN_UPTIME) vs.push(addr)
      }
    }
  }

  const emittedBefore = await sumPrevious(path.join(rootDir,'public'))
  const remaining = CAP - emittedBefore
  if(remaining <= 0n){
    await fs.writeJson(path.join(outDir,'root.json'), { root: '0x'+('00'.repeat(32)), total: '0' }, { spaces: 2 })
    return
  }

  let R = emissionForEpoch(epoch)
  if(R > remaining) R = remaining

  const R_xeno = (R * SPLIT_NUM) / SPLIT_DEN
  const R_flat = R - R_xeno

  const sumStake = Array.from(stakeMap.values()).reduce((a,b)=>a+b,0n) || 1n

  const accrual = new Map()
  for(const [addr, w] of stakeMap){
    const amt = (R_xeno * w) / sumStake
    if(amt>0n) accrual.set(addr, (accrual.get(addr)||0n) + amt)
  }

  const n = BigInt(vs.length||0)
  if(n>0n && R_flat>0n){
    const each = R_flat / n
    let rem = R_flat - (each * n)
    for(const a of vs){
      let amt = each
      if(rem>0n){ amt += 1n; rem -= 1n }
      if(amt>0n) accrual.set(a, (accrual.get(a)||0n) + amt)
    }
  }

  const accounts = Array.from(accrual.keys()).sort()
  const claims = accounts.map((a,i)=>({ index:i, account:a, amount: accrual.get(a).toString() }))
  const leaves = claims.map(c=> hashLeaf(c.index, c.account, c.amount))
  const tree = buildTree(leaves)
  for(const c of claims){
    const proof = getProof(tree, c.index)
    await fs.writeJson(path.join(outDir, c.account+'.json'), { index:c.index, account:c.account, amount:c.amount, proof }, { spaces: 2 })
  }
  await fs.writeJson(path.join(outDir,'root.json'), { root: tree.root, total: R.toString(), split:{ xeno: R_xeno.toString(), flat: R_flat.toString() }, validators: vs, minUptime: MIN_UPTIME }, { spaces: 2 })
  console.log('epoch', epoch, 'root', tree.root, 'total', R.toString(), 'accounts', accounts.length, 'validators', vs.length)
}

function emissionForEpoch(epoch){
  const e0 = CAP / 2n
  return e0 >> BigInt(epoch)
}

async function readCSV(file){
  const out=[]
  if(!await fs.pathExists(file)) return out
  const txt = await fs.readFile(file, 'utf8')
  const lines = txt.trim().split(/\r?\n/)
  if(lines.length<=1) return out
  const headers = lines[0].split(',')
  for(let i=1;i<lines.length;i++){
    const cols = lines[i].split(',')
    const obj={}
    headers.forEach((h,idx)=> obj[h.trim()] = (cols[idx]||'').trim())
    out.push(obj)
  }
  return out
}

async function sumPrevious(pubDir){
  let total = 0n
  const epDir = path.join(pubDir,'epoch')
  if(!await fs.pathExists(epDir)) return total
  for(const e of await fs.readdir(epDir)){
    if(!/^[0-9]+$/.test(e)) continue
    const rj = path.join(epDir, e, 'root.json')
    if(await fs.pathExists(rj)){
      const j = await fs.readJson(rj).catch(()=>null)
      if(j && j.total) total += BigInt(j.total)
    }
  }
  return total
}

main().catch(e=>{ console.error(e); process.exit(1) })
