import express from 'express'
import fs from 'fs-extra'
import path from 'path'
const app = express(); app.use(express.json())

let epoch = 0
const rootDir = process.cwd()

app.use('/config', express.static(path.join(rootDir,'public','config')))
app.use('/epoch', express.static(path.join(rootDir,'public','epoch')))

app.get('/epoch/current', async (req,res)=> res.json({ epoch }))

app.post('/epoch/join', async (req,res)=>{
  const { epoch: e, address, signature } = req.body||{}
  if(typeof address!=='string' || typeof signature!=='string'){ return res.status(400).json({error:'bad payload'}) }
  await fs.ensureDir(path.join(rootDir,'joins', String(e)))
  await fs.writeFile(path.join(rootDir,'joins', String(e), address.toLowerCase()+'.json'), JSON.stringify({address,signature}), 'utf8')
  res.json({ ok:true })
})

app.get('/epoch/current/:address.json', async (req,res)=>{
  const addr = (req.params.address||'').toLowerCase()
  const p = path.join(rootDir,'public','epoch', String(epoch), addr+'.json')
  if(!await fs.pathExists(p)) return res.status(404).json({error:'not found'})
  res.type('application/json').send(await fs.readFile(p))
})

app.post('/admin/advance', async (req,res)=>{
  epoch += 1
  res.json({ ok:true, epoch })
})

app.listen(8080, ()=> console.log('Publisher listening on :8080'))

/**
 * Uptime gating (publisher-side):
 * - Put validator uptime in publisher/data/validators_uptime.csv as `address,uptime`
 * - build_epoch.js can load and filter by minimum uptime (e.g., 0.8) to qualify for the flat 10% pool.
 * - This keeps the on-chain logic simple and avoids frequent writes.
 */


/**
 * Minimal status shim (demo only):
 * Reads a JSON file per address from publisher/status/<address>.json with bridge items.
 * External indexer/relayer can write to that file to reflect on-chain progress.
 */
app.get('/status/:address', async (req,res)=>{
  const addr = (req.params.address||'').toLowerCase()
  const p = path.join(rootDir,'status', addr+'.json')
  if(!await fs.pathExists(p)) return res.json({ items: [] })
  res.json(await fs.readJson(p))
})
