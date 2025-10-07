// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title VoidStones ($VOID)
/// @notice Simple ERC20 for testnet deployments.
contract VoidStones is ERC20, Ownable {
    constructor(uint256 initialSupply, address owner_) ERC20("VoidStones", "VOID") Ownable(owner_) {
        _mint(owner_, initialSupply);
    }
}
