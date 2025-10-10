import { ethers } from "hardhat";

async function main() {
  const DR = await ethers.getContractFactory("DataRegistry");
  const WO = await ethers.getContractFactory("WalletOracle");
  const dr = await DR.deploy(); await dr.waitForDeployment();
  const wo = await WO.deploy(); await wo.waitForDeployment();
  console.log("DataRegistry:", await dr.getAddress());
  console.log("WalletOracle:", await wo.getAddress());
}
main().catch((e)=>{console.error(e);process.exit(1);});
