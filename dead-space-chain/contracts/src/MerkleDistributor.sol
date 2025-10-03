// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
library BitMaps {
    struct BitMap { mapping(uint256 => uint256) _data; }
    function get(BitMap storage bitmap, uint256 index) internal view returns (bool) {
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        return bitmap._data[bucket] & mask != 0;
    }
    function set(BitMap storage bitmap, uint256 index) internal {
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        bitmap._data[bucket] |= mask;
    }
}
contract MerkleDistributor is Ownable {
    using BitMaps for BitMaps.BitMap;
    IERC20  public immutable token;
    bytes32 public merkleRoot;
    BitMaps.BitMap private claimed;
    uint256 public totalClaimed;
    event Claimed(uint256 indexed index, address indexed account, uint256 amount);
    event RootUpdated(bytes32 root);
    constructor(IERC20 _token, bytes32 _root, address owner_) {
        token = _token; merkleRoot = _root; _transferOwnership(owner_);
    }
    function isClaimed(uint256 index) public view returns (bool) { return claimed.get(index); }
    function _setClaimed(uint256 index) private { claimed.set(index); }
    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external {
        require(!isClaimed(index), "Already claimed");
        bytes32 node = keccak256(bytes.concat(keccak256(abi.encode(index, account, amount))));
        bytes32 computed = node;
        for (uint256 i = 0; i < merkleProof.length; i++) {
            bytes32 p = merkleProof[i];
            computed = computed <= p ? keccak256(abi.encodePacked(computed, p)) : keccak256(abi.encodePacked(p, computed));
        }
        require(computed == merkleRoot, "Bad proof");
        _setClaimed(index);
        totalClaimed += amount;
        require(token.transfer(account, amount), "Transfer failed");
        emit Claimed(index, account, amount);
    }
    function setRoot(bytes32 root) external onlyOwner { merkleRoot = root; emit RootUpdated(root); }
}
