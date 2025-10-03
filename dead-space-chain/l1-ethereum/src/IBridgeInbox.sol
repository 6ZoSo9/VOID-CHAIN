// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice L1-side interface for verifying lock proofs from L2 and marking burn proofs for L2.
interface IBridgeInbox {
    /// @dev Verify a message from L2->L1 (lock proof). Must revert if invalid or already consumed.
    /// Returns (recipient, amount, nonce).
    function verifyLockProof(bytes calldata proof) external returns (address, uint256, bytes32);

    /// @dev Verify and consume a burn proof sent to L2. Typically this is only used on L2.
    function verifyBurnProof(bytes calldata proof) external returns (address, uint256, bytes32);
}
