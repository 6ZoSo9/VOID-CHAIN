// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DataRegistry {
    struct Record {
        address owner;
        bytes32 ciphertextHash;
        bytes32 manifestHash;
        bytes4 compAlg;
        bytes4 encAlg;
        uint64 size;
        string locator;
        uint64 createdAt;
    }
    event Registered(address indexed owner, bytes32 indexed ciphertextHash, bytes32 manifestHash, string locator);
    mapping(bytes32 => Record) public records;
    function register(bytes32 ciphertextHash, bytes32 manifestHash, bytes4 compAlg, bytes4 encAlg, uint64 size, string calldata locator) external {
        require(records[ciphertextHash].owner == address(0), "exists");
        records[ciphertextHash] = Record(msg.sender, ciphertextHash, manifestHash, compAlg, encAlg, size, locator, uint64(block.timestamp));
        emit Registered(msg.sender, ciphertextHash, manifestHash, locator);
    }
    function exists(bytes32 ciphertextHash) external view returns (bool) {
        return records[ciphertextHash].owner != address(0);
    }
}
