# Explorer (Blockscout template)

We recommend deploying **Blockscout** for Dead Space Chain.

## Quickstart (template)
1. Ensure your Dead Space RPC is reachable (HTTP+WS).
2. Set env vars in `docker-compose.yml` (RPC_URL, WS_URL, NETWORK_NAME, CHAIN_ID).
3. `docker compose up -d`

> Note: Blockscout indexes EVM-compatible chains. For production, add a real database, backups, and monitoring.
