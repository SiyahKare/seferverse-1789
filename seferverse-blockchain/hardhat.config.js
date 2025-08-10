require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, BASESCAN_API_KEY, HARDHAT_RPC_URL } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: HARDHAT_RPC_URL || "http://127.0.0.1:8545",
      // accounts: Hardhat local node provides unlocked accounts; no need to specify
    },
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
