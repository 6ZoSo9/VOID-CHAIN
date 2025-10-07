# REWARD SPEC (Receipt Model)

**Receipt fields (concept):**
- node_id (BLS key)
- role (GHOST/WRAITH/TITAN)
- epoch
- contrib: { das_samples, relay_receipts, watchdog_flags, storage_audits_passed, zk_jobs }
- nonce
- sig_bls

Rewards are computed per bucket with caps and anti‑sybil rules. Slashing applies to Wraith/Titan misbehavior.
