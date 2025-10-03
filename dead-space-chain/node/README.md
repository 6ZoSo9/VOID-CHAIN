# Dead Space Node (Devnet — PoA via Geth)

This is a quick local/test devnet. For production, run a full validator set and audited configs.

## What this gives you
- Clique PoA genesis with chainId **54720 (0xD5C0)**
- One bootnode + one validator (both geth), exposed RPC at `http://localhost:8545`

## Usage
```bash
cd dead-space-chain/node
docker compose up -d
# wait a few seconds
curl http://localhost:8545 -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'

# Stop:
docker compose down
```

## Notes
- This is NOT your staking/validator design — just a convenient local chain for testing wallet, publisher, and explorer.
- Change passwords/keys before any public exposure.
