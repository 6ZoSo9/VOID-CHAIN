// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/MerkleDistributor.sol";
import "../src/DEADTokenCapped.sol";

contract MerkleDistributorTest is Test {
    DEADTokenCapped token;
    MerkleDistributor dist;

    function setUp() public {
        token = new DEADTokenCapped(address(this), 1_000_000e18);
        dist = new MerkleDistributor(token, bytes32(0), address(this));
        token.transfer(address(dist), 500_000e18);
    }

    function testSetRootAndClaim() public {
        // simple tree with one element index=0, account=this, amount=100
        // leaf node formula mirrors publisher: keccak256(bytes.concat(keccak256(abi.encode(index, account, amount))))
        uint256 index = 0;
        address account = address(this);
        uint256 amount = 100e18;
        bytes32 node = keccak256(bytes.concat(keccak256(abi.encode(index, account, amount))));
        // root equals node (single element)
        dist.setRoot(node);
        uint256 balBefore = token.balanceOf(account);
        bytes32[] memory proof = new bytes32[](0);
        dist.claim(index, account, amount, proof);
        assertEq(token.balanceOf(account), balBefore + amount);
        assertTrue(dist.isClaimed(index));
    }

    function testDoubleClaimReverts() public {
        uint256 index = 0;
        address account = address(this);
        uint256 amount = 100e18;
        bytes32 node = keccak256(bytes.concat(keccak256(abi.encode(index, account, amount))));
        dist.setRoot(node);
        bytes32[] memory proof = new bytes32[](0);
        dist.claim(index, account, amount, proof);
        vm.expectRevert();
        dist.claim(index, account, amount, proof);
    }
}
