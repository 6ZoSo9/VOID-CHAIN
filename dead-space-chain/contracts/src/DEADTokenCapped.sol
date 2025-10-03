// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
contract DEADTokenCapped is ERC20, Ownable {
    uint256 public immutable CAP = 666666666 * 1e18;
    constructor(address initialOwner, uint256 initialSupply) ERC20("Dead Space Chain Token", "DEAD") Ownable(initialOwner) {
        require(initialSupply <= CAP, "cap exceeded");
        _mint(initialOwner, initialSupply);
    }
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= CAP, "cap exceeded");
        _mint(to, amount);
    }
}
