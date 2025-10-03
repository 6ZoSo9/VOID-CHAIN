import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import * as sdk from '../../sdk/src/index'

export default function App(){
  const [prov,setProv]=useState<ethers.BrowserProvider|null>(null)
  const [addr,setAddr]=useState<string>('-')
  const [claim,setClaim]=useState<any>(null)
  const [cfg,setCfg]=useState<any>(null)
  const [epoch,setEpoch]=useState<number>(0)
  const [amount,setAmount]=useState('1.0')
  const [nonce,setNonce]=useState('')

  useEffect(()=>{ (async()=>{
    if(!(window as any).ethereum) return
    const p = new ethers.BrowserProvider((window as any).ethereum)
    setProv(p)
    const [a] = await p.send('eth_requestAccounts', [])
    setAddr(a)
    const conf = await fetch('/config/config.json').then(r=>r.json()).catch(()=>null)
    setCfg(conf)
    const ej = await fetch('/epoch/current').then(r=>r.json()).catch(()=>({epoch:0}))
    setEpoch(ej.epoch||0)
  })() }, [])

  async function join(){
    if(!prov || !cfg) return
    const payload = await sdk.joinEpochSignature(prov, epoch)
    await fetch('/epoch/join', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    alert('Joined epoch!')
  }

  async function pullClaim(){
    if(!cfg) return
    const c = await sdk.fetchClaim(cfg.proofBaseUrl + '/' + epoch, addr)
    setClaim(c)
  }

  async function claimL2(){
    if(!prov || !cfg || !claim) return
    await sdk.claimL2(prov, cfg, addr, claim); alert('Claimed L2')
  }

  async function claimL1(){
    if(!prov || !cfg || !claim) return
    await sdk.claimL1(prov, cfg, addr, claim); alert('Claimed L1 (gas on user)')
  }

  function genNonce(){ const a=new Uint8Array(32); crypto.getRandomValues(a); return '0x'+Array.from(a).map(x=>x.toString(16).padStart(2,'0')).join('') }

  async function lockL2(){
    if(!prov || !cfg) return
    const wei = ethers.parseUnits(amount||'0',18); const n = nonce || genNonce()
    await sdk.lockToL1(prov, cfg, addr, wei, n); alert('Locked on L2')
  }

  async function burnL1(){
    if(!prov || !cfg) return
    const wei = ethers.parseUnits(amount||'0',18); const n = nonce || genNonce()
    await sdk.burnToL2(prov, cfg, wei, n); alert('Burned on L1')
  }

  return (<div style={{fontFamily:'Inter, ui-sans-serif', color:'#e6f0ff', background:'#0b0f15', minHeight:'100vh', padding:'20px'}}>
    <h1>Dead Space Playground</h1>
    <div>Address: {addr}</div>
    <div>Epoch: {epoch}</div>
    <hr/>
    <h3>Join Epoch</h3>
    <button onClick={join}>Join (EIP-712)</button>
    <hr/>
    <h3>Claims</h3>
    <button onClick={pullClaim}>Fetch claim</button>
    <button onClick={claimL2} disabled={!claim}>Claim L2 ($DEAD)</button>
    <button onClick={claimL1} disabled={!claim}>Claim L1 ($wDEAD)</button>
    <hr/>
    <h3>Bridge</h3>
    <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="amount"/>
    <input value={nonce} onChange={e=>setNonce(e.target.value)} placeholder="nonce (auto)"/>
    <div>
      <button onClick={lockL2}>Lock L2 → Mint L1</button>
      <button onClick={burnL1}>Burn L1 → Unlock L2</button>
    </div>
  </div>)
}
