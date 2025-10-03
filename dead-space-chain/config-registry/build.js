import fs from 'fs-extra'
import { parse } from 'yaml'
const src = await fs.readFile('./config.yaml','utf8')
const y = parse(src)
const out = {
  DEAD_SPACE_CHAIN: {
    chainId: y.dead_space_chain.chainId,
    chainName: y.dead_space_chain.chainName,
    nativeCurrency: { name: 'DEAD', symbol: 'DEAD', decimals: 18 },
    rpcUrls: y.dead_space_chain.rpcUrls,
    blockExplorerUrls: [y.dead_space_chain.explorer]
  },
  addresses: {
    merkleDistributorDeadSpace: y.addresses.merkleDistributorDeadSpace,
    lockboxL2: y.addresses.lockboxL2
  },
  addressesL1: {
    merkleDistributorL1: y.l1.merkleDistributorL1,
    lockboxL1: y.l1.lockboxL1,
    wdead: y.l1.wdead
  },
  proofBaseUrl: y.proofBaseUrl,
  challengeSeconds: y.challengeSeconds
}
await fs.ensureDir('../publisher/public/config')
await fs.writeJson('../publisher/public/config/config.json', out, { spaces: 2 })
console.log('Wrote publisher/public/config/config.json')
