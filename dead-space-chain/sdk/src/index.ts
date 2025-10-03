import { ethers } from 'ethers'

export type Config = {
  DEAD_SPACE_CHAIN: any
  addresses: { merkleDistributorDeadSpace: string, lockboxL2: string }
  addressesL1: { merkleDistributorL1: string, lockboxL1: string, wdead: string }
  proofBaseUrl: string
}
const abiMerkle=[{"type":"function","name":"claim","inputs":[{"name":"index","type":"uint256"},{"name":"account","type":"address"},{"name":"amount","type":"uint256"},{"name":"merkleProof","type":"bytes32[]"}],"outputs":[],"stateMutability":"nonpayable"}]
const abiLockboxL2=[{"type":"function","name":"lockToL1","inputs":[{"type":"address"},{"type":"uint256"},{"type":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}]
const abiLockboxL1=[{"type":"function","name":"burnToL2","inputs":[{"type":"uint256"},{"type":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"}]

export async function joinEpochSignature(provider: ethers.BrowserProvider, epoch: number){
  const signer = await provider.getSigner(); const addr = await signer.getAddress(); const net = await provider.getNetwork()
  const domain = { name: 'DeadSpaceHoldStake', version: '1', chainId: Number(net.chainId), verifyingContract: '0x0000000000000000000000000000000000000000' }
  const types = { HoldStake: [ { name: 'epoch', type: 'uint256' }, { name: 'staker', type: 'address' } ] }
  const signature = await signer.signTypedData(domain as any, types as any, { epoch, staker: addr })
  return { epoch, address: addr, signature }
}

export async function fetchClaim(proofBaseUrl: string, address: string){
  const res = await fetch(`${proofBaseUrl}/${address.toLowerCase()}.json`)
  if(!res.ok) return null
  return await res.json()
}

export async function claimL2(provider: ethers.BrowserProvider, cfg: Config, address: string, claim:any){
  const signer = await provider.getSigner()
  const dist = new (ethers as any).Contract(cfg.addresses.merkleDistributorDeadSpace, abiMerkle, signer)
  return await dist.claim(BigInt(claim.index), address, BigInt(claim.amount), claim.proof)
}

export async function claimL1(provider: ethers.BrowserProvider, cfg: Config, address: string, claim:any){
  const signer = await provider.getSigner()
  const dist = new (ethers as any).Contract(cfg.addressesL1.merkleDistributorL1, abiMerkle, signer)
  return await dist.claim(BigInt(claim.index), address, BigInt(claim.amount), claim.proof)
}

export async function lockToL1(provider: ethers.BrowserProvider, cfg: Config, to: string, amountWei: bigint, nonce: string){
  const signer = await provider.getSigner()
  const lockbox = new (ethers as any).Contract(cfg.addresses.lockboxL2, abiLockboxL2, signer)
  return await lockbox.lockToL1(to, amountWei, nonce)
}

export async function burnToL2(provider: ethers.BrowserProvider, cfg: Config, amountWei: bigint, nonce: string){
  const signer = await provider.getSigner()
  const lockbox = new (ethers as any).Contract(cfg.addressesL1.lockboxL1, abiLockboxL1, signer)
  return await lockbox.burnToL2(amountWei, nonce)
}
