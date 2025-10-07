# ARCHITECTURE (Overview)

## Roles
- **Ghost (light)**: DAS‑lite, gossip relay, liveness attestations.
- **Wraith (medium)**: committee votes, partial storage pledges, fraud proof forwarding.
- **Titan (heavy)**: block proposers, finality, zk proving, archival storage.

## Networking
- libp2p/QUIC, peer scoring, encrypted gossip.
- Receipts are signed (BLS) and aggregated per epoch.

## Consensus (sketch)
- PoS with rotating committees; BLS aggregated attestations for finality checkpoints.
