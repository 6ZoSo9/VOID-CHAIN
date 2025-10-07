# 🜂 Obelisk Wallet — Genesis Commit

**Obelisk Wallet** is the official interface to the **VOID** blockchain — a decentralized AI computation network.
Network rewards are denominated in **VoidStones ($VOID)**.

> “The Obelisk stands between you and the Void — through it, you command the unknown.”

---

## Project Identity

- **Chain:** VOID  
- **Wallet:** Obelisk Wallet  
- **Token (name):** VoidStones  
- **Token (symbol):** $VOID  
- **Internal codename:** Project Monolith  

This commit serves as a timestamped public record of authorship and architecture for the VOID ecosystem.

**Created by:** ZoSo (GitHub: 6ZoSo9) with AI co‑architect “Oren”  
**Commit date:** 2025-10-07 18:51:03

---

## Repository Layout

```
void/
 ├─ obelisk-wallet/           # Wallet UI scaffold (placeholder)
 ├─ contracts/                # Token + rewards + governance contracts (skeleton)
 ├─ relayer/                  # Off-chain agent / relayer service (skeleton)
 └─ docs/
     ├─ README.md
     ├─ VISION.md
     ├─ WHITEPAPER.md
     ├─ BRAND_GUIDE.md
     ├─ TOKENOMICS.md
     ├─ ARCHITECTURE.md
     ├─ REWARD_SPEC.md
     └─ LEGAL.md
```

- **License for code:** MIT (see `LICENSE`)  
- **License for brand & lore:** CC BY‑NC 4.0 (see `docs/LEGAL.md`)

---

## Quick Start (placeholders; real code to follow)

```bash
# Clone
git clone git@github.com:6ZoSo9/void.git
cd void

# Wallet (placeholder)
cd obelisk-wallet
yarn
yarn dev

# Contracts (placeholder)
cd ../contracts
yarn
yarn hardhat compile

# Relayer (placeholder)
cd ../relayer
yarn
node index.js
```
*(These directories currently contain skeletons and stubs to establish authorship and structure.)*

---

## Vision

- Turn **every wallet** into a **micro‑validator** (opt‑in) with **tiered roles**: Ghost (light), Wraith (medium), Titan (heavy).
- Reward **provable contributions** (DAS sampling, relay quality, fraud proofs, zk jobs) with **VoidStones ($VOID)**.
- Keep UX ethical and transparent (explicit opt‑in, resource caps, battery/CPU/net guards).
- “Project Monolith” is the R&D codename for consensus + agent primitives feeding the **VOID** network.

See `docs/VISION.md` and `docs/REWARD_SPEC.md` for details.

---

## Credits

© 2025-10-07 VOID / Obelisk.  
Created by **ZoSo** (6ZoSo9) • Co‑architect: **Oren**.
