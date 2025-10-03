// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {IBridgeInbox} from "./IBridgeInbox.sol";

/// @title DeadLockbox (L2 - Dead Space Chain)
/// @notice Escrows DEAD for bridging to L1 (Ethereum) as wDEAD, and releases DEAD when a valid burn
/// proof from L1 is presented. Prevents double-spend via nonce tracking.
contract DeadLockbox is Ownable {
    IERC20 public immutable DEAD;
    IBridgeInbox public inbox;

    mapping(bytes32 => bool) public consumed; // nonces consumed (either lock or burn)
    event Locked(bytes32 indexed nonce, address indexed from, address indexed to, uint256 amount);
    event Unlocked(bytes32 indexed nonce, address indexed to, uint256 amount);
    event InboxUpdated(address inbox);

    constructor(IERC20 dead, address owner_) {
        DEAD = dead;
        _transferOwnership(owner_);
    }

    function setInbox(IBridgeInbox _inbox) external onlyOwner {
        inbox = _inbox;
        emit InboxUpdated(address(_inbox));
    }

    /// @notice User locks DEAD on L2 to mint wDEAD on L1. Off-chain relayer/oracle will submit a lock proof on L1.
    function lockToL1(address to, uint256 amount, bytes32 nonce) external {
        require(!consumed[nonce], "nonce used");
        consumed[nonce] = true;
        require(DEAD.transferFrom(msg.sender, address(this), amount), "transfer failed");
        emit Locked(nonce, msg.sender, to, amount);
    }

    /// @notice Release DEAD on L2 after a burn on L1 is proven via the inbox.
    function unlockFromL1(bytes calldata burnProof) external {
        (address to, uint256 amount, bytes32 nonce) = inbox.verifyBurnProof(burnProof);
        require(!consumed[nonce], "nonce used");
        consumed[nonce] = true;
        require(DEAD.transfer(to, amount), "transfer failed");
        emit Unlocked(nonce, to, amount);
    }
}
