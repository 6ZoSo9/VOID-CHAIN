// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {RootPublisher} from "../src/RootPublisher.sol";

contract PublishRoot is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address publisher = vm.envAddress("PUBLISHER");
        bytes32 root = vm.envBytes32("ROOT");

        vm.startBroadcast(pk);
        RootPublisher(publisher).publish(root);
        vm.stopBroadcast();
    }
}
