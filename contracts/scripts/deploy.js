const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const initialSupply = hre.ethers.parseUnits('1000000', 18);
  const VoidStones = await hre.ethers.getContractFactory('VoidStones');
  const token = await VoidStones.deploy(initialSupply, deployer.address);
  await token.waitForDeployment();
  console.log('VoidStones deployed at:', await token.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
