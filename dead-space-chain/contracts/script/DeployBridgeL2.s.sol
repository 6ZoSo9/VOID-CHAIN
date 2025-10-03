// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {SimpleInboxL2} from "../src/SimpleInbox.sol";
import {DeadLockbox} from "../src/DeadLockbox.sol";
import {DEADTokenCapped} from "../src/DEADTokenCapped.sol";

contract DeployBridgeL2 is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deadAddr = vm.envAddress("DEAD");
        vm.startBroadcast(pk);
        SimpleInboxL2 inbox = new SimpleInboxL2(msg.sender);
        DeadLockbox lockbox = new DeadLockbox(DEADTokenCapped(deadAddr), msg.sender);
        lockbox.setInbox(inbox);
        console2.log("L2 Inbox:", address(inbox));
        console2.log("L2 Lockbox:", address(lockbox));
        vm.stopBroadcast();
    }
}
