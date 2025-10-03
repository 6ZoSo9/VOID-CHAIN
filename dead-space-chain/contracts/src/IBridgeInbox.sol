// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice An interface for verifying cross-chain messages. In production, implement this
/// with a light client, zk proof, or an optimistic bridge with a challenge period.
interface IBridgeInbox {
    /// @dev Verify a message from L1->L2 (burn proof). Must revert if invalid or already consumed.
    /// Returns (recipient, amount, nonce).
    function verifyBurnProof(bytes calldata proof) external returns (address, uint256, bytes32);

    /// @dev Verify a message from L2->L1 (lock proof). Must revert if invalid or already consumed.
    /// Returns (recipient, amount, nonce).
    function verifyLockProof(bytes calldata proof) external returns (address, uint256, bytes32);
}
