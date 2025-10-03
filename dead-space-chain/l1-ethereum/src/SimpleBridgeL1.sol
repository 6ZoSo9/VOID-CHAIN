// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {WDEAD} from "./WDEAD.sol";

contract SimpleBridgeL1 is Ownable {
    WDEAD public immutable wdead;
    event Minted(address indexed to, uint256 amount, bytes32 indexed ref);
    event Burned(address indexed from, uint256 amount, bytes32 indexed ref);

    constructor(WDEAD _wdead, address owner_) { wdead = _wdead; _transferOwnership(owner_); }

    function mintFromL2(address to, uint256 amount, bytes32 ref) external onlyOwner {
        // Owner should be a relayer/governor that verifies L2 burn events
        wdead.mint(to, amount);
        emit Minted(to, amount, ref);
    }

    function burnToL2(address from, uint256 amount, bytes32 ref) external onlyOwner {
        wdead.burn(from, amount);
        emit Burned(from, amount, ref);
    }
}
