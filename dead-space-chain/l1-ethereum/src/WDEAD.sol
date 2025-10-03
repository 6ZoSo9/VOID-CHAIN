// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "openzeppelin-contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

contract WDEAD is ERC20, ERC20Permit, Ownable {
    constructor(address owner_) ERC20("Wrapped DEAD", "wDEAD") ERC20Permit("Wrapped DEAD") { _transferOwnership(owner_); }
    function mint(address to, uint256 amount) external onlyOwner { _mint(to, amount); }
    function burn(address from, uint256 amount) external onlyOwner { _burn(from, amount); }
}
