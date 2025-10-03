// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/DEADTokenCapped.sol";
import "../src/DeadLockbox.sol";
import "../src/SimpleInbox.sol";

contract LockboxNonceTest is Test {
    DEADTokenCapped token;
    DeadLockbox lockbox;
    SimpleInboxL2 inbox;

    address alice = address(0xA11CE);

    function setUp() public {
        token = new DEADTokenCapped(address(this), 1_000_000e18);
        lockbox = new DeadLockbox(IERC20(address(token)), address(this));
        inbox = new SimpleInboxL2(address(this));
        lockbox.setInbox(inbox);

        token.transfer(alice, 1_000e18);
        vm.startPrank(alice);
        token.approve(address(lockbox), type(uint256).max);
        vm.stopPrank();
    }

    function testNonceReplayBlocked() public {
        bytes32 nonce = keccak256("n1");
        vm.prank(alice);
        lockbox.lockToL1(alice, 100e18, nonce);
        vm.expectRevert();
        vm.prank(alice);
        lockbox.lockToL1(alice, 100e18, nonce); // same nonce should revert
    }
}
