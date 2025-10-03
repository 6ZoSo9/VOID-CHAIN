# Dead Space Examples

This folder contains simple, hackable examples developers can deploy Day 1:

- **DeadSpaceNFT.sol** — a basic ERC721 minter (owner-mint). Set `baseURI` and `maxSupply`.
- **DeadSimpleAMM.sol** — toy constant-product AMM for demos (NOT audited).
- **DeadGovToken.sol + DeadSimpleGovernor.sol** — minimal voting token + barebones governor (for demos only).

> For production governance and AMMs, use audited implementations (e.g. OpenZeppelin Governor + Timelock, Uniswap style pools).

## Suggested Flow
1. Deploy `DeadSpaceNFT` and mint a few NFTs for testers.
2. Spin up `DeadSimpleAMM` with two ERC20s (e.g., DEAD + test token) and add liquidity.
3. Deploy `DeadGovToken`, mint to community wallets, and try a proposal with `DeadSimpleGovernor`.
