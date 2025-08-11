// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const {
  PRIVATE_KEY,
  HARDHAT_RPC_URL,
  BASE_MAINNET_RPC_URL,
  BASE_SEPOLIA_RPC_URL,
  BASESCAN_API_KEY,
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",               // kontratlarımızla uyumlu
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,                 // gerekirse aç (daha yavaş compile, daha optimize bytecode)
    },
  },
  networks: {
    // Hardhat/localhost
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: HARDHAT_RPC_URL || "http://127.0.0.1:8545",
    },

    // Base mainnet
    base: {
      url: BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 8453,
    },

    // Base Sepolia
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 84532,
    },
  },
  etherscan: {
    // Tek API key ile iki custom chain’i de doğrular
    apiKey: BASESCAN_API_KEY || "",
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  sourcify: { enabled: false },
  mocha: { timeout: 120000 },
};
