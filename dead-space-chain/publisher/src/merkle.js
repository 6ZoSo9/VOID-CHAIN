import { keccak256, getBytes } from 'ethers'

export function hashLeaf(index, account, amount){
  const data = abiEncode(index, account, amount)
  const node = keccak256(data)
  return keccak256(getBytes(node))
}

export function buildTree(nodes){
  const layers = [nodes]
  while(layers[layers.length-1].length > 1){
    const prev = layers[layers.length-1]
    const next = []
    for(let i=0;i<prev.length;i+=2){
      const a = prev[i]
      const b = i+1<prev.length ? prev[i+1] : prev[i]
      next.push(hashPair(a,b))
    }
    layers.push(next)
  }
  return { layers, root: layers[layers.length-1][0] }
}

export function getProof(tree, index){
  const proof = []
  let idx = index
  for(let l=0; l<tree.layers.length-1; l++){
    const layer = tree.layers[l]
    const pairIdx = idx ^ 1
    const pair = layer[pairIdx] ?? layer[idx]
    proof.push(pair)
    idx = Math.floor(idx / 2)
  }
  return proof
}

export function hashPair(a,b){
  const [x,y] = a.toLowerCase() <= b.toLowerCase() ? [a,b] : [b,a]
  return keccak256(concatBytes(getBytes(x), getBytes(y)))
}

function concatBytes(a,b){
  const out = new Uint8Array(a.length + b.length)
  out.set(a,0); out.set(b,a.length)
  return out
}

function abiEncode(index, account, amount){
  const buf = new Uint8Array(32+32+32)
  writeUint(buf, 0, BigInt(index))
  const addr = account.toLowerCase().replace('0x','').padStart(40,'0')
  const addrBytes = hexToBytes(addr)
  buf.set(addrBytes, 12)
  writeUint(buf, 64, BigInt(amount))
  return buf
}

function writeUint(buf, off, bn){
  const hex = bn.toString(16).padStart(64,'0')
  const bytes = hexToBytes(hex)
  buf.set(bytes, off)
}

function hexToBytes(hex){
  if(hex.length%2!==0) hex='0'+hex
  const arr=new Uint8Array(hex.length/2)
  for(let i=0;i<arr.length;i++){ arr[i]=parseInt(hex.substr(i*2,2),16) }
  return arr
}
