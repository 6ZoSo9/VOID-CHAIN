// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {IBridgeInbox} from "./IBridgeInbox.sol";

/// @notice Simple owner-gated inbox for demos. Replace with a light client / zk verifier in production.
contract SimpleInboxL2 is Ownable, IBridgeInbox {
    mapping(bytes32 => bool) public consumed;

    constructor(address owner_) { _transferOwnership(owner_); }

    function verifyBurnProof(bytes calldata proof) external override returns (address to, uint256 amount, bytes32 nonce) {
        // proof format: abi.encode(to, amount, nonce)
        (to, amount, nonce) = abi.decode(proof, (address, uint256, bytes32));
        require(!consumed[nonce], "nonce used");
        consumed[nonce] = true;
    }

    function verifyLockProof(bytes calldata) external pure override returns (address, uint256, bytes32) {
        revert("use L1 inbox for lock proofs");
    }
}
