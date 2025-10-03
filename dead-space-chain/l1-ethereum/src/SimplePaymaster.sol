// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Minimal stub to illustrate sponsorship; integrate with a full ERC-4337 stack (EntryPoint v0.6+) before production.
// This contract does not implement validation logic; it's a placeholder for your infra team to extend.

contract SimplePaymaster {
    address public owner;
    constructor(){ owner = msg.sender; }
    receive() external payable {}
    function withdraw(address payable to, uint256 amount) external {
        require(msg.sender==owner, "only owner");
        to.transfer(amount);
    }
}
