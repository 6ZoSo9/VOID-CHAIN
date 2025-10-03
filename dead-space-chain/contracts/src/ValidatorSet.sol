// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
contract ValidatorSet is Ownable {
    bytes32 public stakeRoot;
    uint64  public epoch;
    struct Validator { bool active; bytes pubkey; string endpoint; uint256 stake; }
    mapping(address => Validator) public validators;
    address[] public validatorList;
    event RootUpdated(uint64 epoch, bytes32 root);
    event Registered(address indexed v, uint256 stake);
    event Deregistered(address indexed v);
    constructor(bytes32 initialRoot, uint64 initialEpoch, address owner_) {
        stakeRoot = initialRoot; epoch = initialEpoch; _transferOwnership(owner_);
    }
    function updateRoot(bytes32 newRoot, uint64 newEpoch) external onlyOwner {
        require(newEpoch > epoch, "epoch rollback");
        stakeRoot = newRoot; epoch = newEpoch; emit RootUpdated(newEpoch, newRoot);
    }
    function register(bytes32[] calldata proof, uint256 stakeAmount, bytes calldata pubkey, string calldata endpoint) external {
        bytes32 leaf = keccak256(abi.encode(msg.sender, stakeAmount, pubkey, keccak256(bytes(endpoint))));
        bytes32 computed = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 p = proof[i];
            computed = computed <= p ? keccak256(abi.encodePacked(computed, p)) : keccak256(abi.encodePacked(p, computed));
        }
        require(computed == stakeRoot, "bad stake proof");
        Validator storage v = validators[msg.sender];
        v.active = true; v.pubkey = pubkey; v.endpoint = endpoint; v.stake = stakeAmount;
        validatorList.push(msg.sender);
        emit Registered(msg.sender, stakeAmount);
    }
    function deregister() external { Validator storage v = validators[msg.sender]; require(v.active, "not active"); v.active = false; emit Deregistered(msg.sender); }
    function allValidators() external view returns (address[] memory) { return validatorList; }
}
