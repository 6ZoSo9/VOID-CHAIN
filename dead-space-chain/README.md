# Dead Space Chain

An EVM-compatible chain with **infinite horizon issuance** capped at **666,666,666 $DEAD** (halving every 100 years), staking-driven security, and a trust-minimizable bridge to Ethereum via wDEAD.

## Components
- **contracts/**: DEAD token, distributors (Merkle), lockboxes, inbox abstraction, examples, faucet
- **publisher/**: epoch builder (90/10 split), proofs, config server
- **relayer/**: watches lockboxes and writes status snapshots for the wallet
- **explorer/**: Blockscout template
- **indexer/**: snapshots $XENO balances → `stakes.csv`
- **sdk/**: small TypeScript helpers for dApps
- **examples/**: NFT, AMM, governance demos + playground

## License
AGPL-3.0 for code. Project names/logos are protected by the Trademark Policy (see `TRADEMARKS.md`).

## Contributing
See `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`. PRs welcome.
