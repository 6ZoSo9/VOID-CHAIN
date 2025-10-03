// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {WDEAD} from "../src/WDEAD.sol";
import {SimpleInboxL1} from "../src/SimpleInbox.sol";
import {L1Lockbox} from "../src/L1Lockbox.sol";

contract DeployBridgeL1 is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);
        WDEAD wdead = new WDEAD(msg.sender);
        SimpleInboxL1 inbox = new SimpleInboxL1(msg.sender);
        L1Lockbox lockbox = new L1Lockbox(wdead, msg.sender);
        lockbox.setInbox(inbox);
        console2.log("L1 wDEAD:", address(wdead));
        console2.log("L1 Inbox:", address(inbox));
        console2.log("L1 Lockbox:", address(lockbox));
        vm.stopBroadcast();
    }
}
