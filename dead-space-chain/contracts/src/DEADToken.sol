// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

contract DEADToken is ERC20, Ownable {
    constructor(address initialOwner, uint256 initialSupply) ERC20("Dead Space Chain Token", "DEAD") Ownable(initialOwner) {
        _mint(initialOwner, initialSupply);
    }
    function mint(address to, uint256 amount) external onlyOwner { _mint(to, amount); }
}
