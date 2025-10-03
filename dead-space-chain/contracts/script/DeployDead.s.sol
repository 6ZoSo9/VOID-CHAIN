// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {DEADTokenCapped} from "../src/DEADTokenCapped.sol";
import {MerkleDistributor} from "../src/MerkleDistributor.sol";
import {ValidatorSet} from "../src/ValidatorSet.sol";
contract DeployDead is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        uint256 initial = vm.envUint("INITIAL_SUPPLY");
        address treasury = vm.envAddress("TREASURY");
        bytes32 root = vm.envBytes32("ROOT");
        bytes32 stakeRoot = vm.envBytes32("STAKE_ROOT");
        uint64 epoch = uint64(vm.envUint("EPOCH"));
        vm.startBroadcast(pk);
        DEADTokenCapped dead = new DEADTokenCapped(msg.sender, initial);
        MerkleDistributor dist = new MerkleDistributor(dead, root, msg.sender);
        ValidatorSet vset = new ValidatorSet(stakeRoot, epoch, msg.sender);
        dead.transfer(address(dist), initial / 2);
        dead.transfer(treasury, dead.balanceOf(msg.sender));
        console2.log("DEAD:", address(dead));
        console2.log("Distributor:", address(dist));
        console2.log("ValidatorSet:", address(vset));
        vm.stopBroadcast();
    }
}
