require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { INFURA_SEPOLIA_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: INFURA_SEPOLIA_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};
