// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/// @notice Testnet/demo faucet. DO NOT deploy on mainnet.
contract DeadFaucet is Ownable {
    IERC20 public immutable token;
    uint256 public amount = 1000e18;
    uint256 public cooldown = 1 days;
    mapping(address=>uint256) public last;

    constructor(IERC20 _token, address owner_) {
        token = _token;
        _transferOwnership(owner_);
    }

    function setParams(uint256 _amount, uint256 _cooldown) external onlyOwner {
        amount = _amount; cooldown = _cooldown;
    }

    function drip(address to) external {
        require(block.timestamp - last[to] >= cooldown, "cooldown");
        last[to] = block.timestamp;
        require(token.transfer(to, amount), "transfer failed");
    }
}
