require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, BASESCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
  },
  etherscan: {
    apiKey: BASESCAN_API_KEY,   // <-- Tek string key
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};
