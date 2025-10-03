// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {MerkleDistributor} from "./MerkleDistributor.sol";

contract RootPublisher is Ownable {
    MerkleDistributor public immutable distributor;
    event Published(bytes32 root);
    constructor(MerkleDistributor _d, address owner_) { distributor = _d; _transferOwnership(owner_); }
    function publish(bytes32 root) external onlyOwner { distributor.setRoot(root); emit Published(root); }
}
