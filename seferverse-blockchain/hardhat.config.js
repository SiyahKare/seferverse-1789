require('@nomicfoundation/hardhat-toolbox');
module.exports = {
  solidity: '0.8.20',
  networks: {
    base: {
      url: 'https://mainnet.base.org',
      accounts: ['PRIVATE_KEY']
    }
  }
};
