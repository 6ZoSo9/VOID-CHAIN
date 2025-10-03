// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {WDEAD} from "./WDEAD.sol";
import {IBridgeInbox} from "./IBridgeInbox.sol";

/// @title L1Lockbox (Ethereum)
/// @notice Mints wDEAD after a verified L2 lock, and burns wDEAD to initiate an L2 unlock.
/// Prevents double-spend via nonce tracking. Trustless if Inbox is a light client / ZK verifier.
contract L1Lockbox is Ownable {
    WDEAD public immutable wdead;
    IBridgeInbox public inbox;

    mapping(bytes32 => bool) public consumed;
    event Minted(bytes32 indexed nonce, address indexed to, uint256 amount);
    event Burned(bytes32 indexed nonce, address indexed from, uint256 amount);
    event InboxUpdated(address inbox);

    constructor(WDEAD _wdead, address owner_) {
        wdead = _wdead;
        _transferOwnership(owner_);
    }

    function setInbox(IBridgeInbox _inbox) external onlyOwner {
        inbox = _inbox;
        emit InboxUpdated(address(_inbox));
    }

    /// @notice Mint wDEAD on L1 after a verified lock on L2 (no double-spend).
    function mintFromL2(bytes calldata lockProof) external {
        (address to, uint256 amount, bytes32 nonce) = inbox.verifyLockProof(lockProof);
        require(!consumed[nonce], "nonce used");
        consumed[nonce] = true;
        wdead.mint(to, amount);
        emit Minted(nonce, to, amount);
    }

    /// @notice Burn wDEAD on L1 and emit an intent that will be proven on L2 for unlock.
    function burnToL2(uint256 amount, bytes32 nonce) external {
        require(!consumed[nonce], "nonce used");
        consumed[nonce] = true;
        wdead.burn(msg.sender, amount);
        emit Burned(nonce, msg.sender, amount);
        // An off-chain relayer takes this event and submits a burnProof to L2 inbox for unlock
    }
}
