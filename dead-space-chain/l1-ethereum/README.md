# L1 (Ethereum) Contracts — wDEAD + Bridge

This folder is for **Ethereum-side** contracts:
- `WDEAD.sol` — ERC20Permit wrapped DEAD on Ethereum (mint/burn).
- `L1MerkleDistributor.sol` — identical claim interface for wDEAD rewards.
- `SimpleBridgeL1.sol` — lock/mint and burn/unlock interface with L2.

> Gas on Ethereum costs **someone**. To make it zero-cost for users, run a **relayer** or an **ERC-4337 Paymaster** to sponsor user claims.
