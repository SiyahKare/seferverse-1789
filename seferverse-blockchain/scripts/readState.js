#!/usr/bin/env node

/**
 * 📊 SeferVerse Contract State Reader Script
 * 
 * Kullanım:
 * node scripts/readState.js <contract> [property]
 * 
 * Örnekler:
 * node scripts/readState.js SeferVerseDAO
 * node scripts/readState.js SeferVerseDAO name
 * node scripts/readState.js BaronToken totalSupply
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Load deployments
const deploymentsPath = path.join(__dirname, "../deployments.json");
const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));

// Load environment
require("dotenv").config();

// Common contract properties to check
const COMMON_PROPERTIES = {
  "SeferVerseDAO": ["name", "owner", "version"],
  "BaronToken": ["name", "symbol", "totalSupply", "decimals", "owner"],
  "BaronNFT": ["name", "symbol", "totalSupply", "owner"],
  "RefundManager": ["owner", "totalRefunds", "isActive"],
  "SeferVerse": ["owner", "version", "isActive"]
};

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log("❌ Kullanım: node scripts/readState.js <contract> [property]");
    console.log("📚 Örnekler:");
    console.log("   node scripts/readState.js SeferVerseDAO");
    console.log("   node scripts/readState.js SeferVerseDAO name");
    console.log("   node scripts/readState.js BaronToken totalSupply");
    process.exit(1);
  }

  const [contractName, specificProperty] = args;
  
  // Get network from env or default to localhost
  const network = process.env.HARDHAT_NETWORK || "localhost";
  
  if (!deployments[network]) {
    console.log(`❌ Network '${network}' bulunamadı`);
    console.log(`📋 Mevcut ağlar: ${Object.keys(deployments).join(", ")}`);
    process.exit(1);
  }

  if (!deployments[network][contractName]) {
    console.log(`❌ Contract '${contractName}' ${network} ağında bulunamadı`);
    console.log(`📋 Mevcut kontratlar: ${Object.keys(deployments[network]).join(", ")}`);
    process.exit(1);
  }

  const contractAddress = deployments[network][contractName].address;
  const deployInfo = deployments[network][contractName];
  
  console.log(`🌌 SeferVerse 1789 - Contract State Reader`);
  console.log("=".repeat(60));
  console.log(`🌐 Network: ${network}`);
  console.log(`📋 Contract: ${contractName}`);
  console.log(`📍 Address: ${contractAddress}`);
  console.log(`📅 Deploy Date: ${deployInfo.date || 'Unknown'}`);
  console.log(`⛽ Deploy Gas: ${deployInfo.gasUsed || 'Unknown'}`);
  console.log("=".repeat(60));

  try {
    // Get signer
    const [deployer] = await ethers.getSigners();
    
    // Get contract factory
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contract = ContractFactory.attach(contractAddress).connect(deployer);

    if (specificProperty) {
      // Read specific property
      await readProperty(contract, contractName, specificProperty);
    } else {
      // Read all common properties
      await readAllProperties(contract, contractName);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

async function readProperty(contract, contractName, propertyName) {
  try {
    console.log(`\n🔍 Reading: ${propertyName}`);
    console.log("─".repeat(40));
    
    const result = await contract[propertyName]();
    console.log(`📊 ${propertyName}: ${result}`);
    
    // Log to deployments.log
    const logEntry = `[${new Date().toISOString()}] READ_STATE: ${contractName}.${propertyName} = ${result}\n`;
    fs.appendFileSync(path.join(__dirname, "../deployments.log"), logEntry);
    
  } catch (error) {
    console.log(`❌ ${propertyName}: Error - ${error.message}`);
  }
}

async function readAllProperties(contract, contractName) {
  const properties = COMMON_PROPERTIES[contractName] || [];
  
  if (properties.length === 0) {
    console.log(`\n⚠️  No predefined properties for ${contractName}`);
    console.log("💡 Try: node scripts/readState.js <contract> <property>");
    return;
  }

  console.log(`\n📋 Reading ${properties.length} common properties:`);
  console.log("─".repeat(40));

  for (const property of properties) {
    try {
      const result = await contract[property]();
      console.log(`✅ ${property.padEnd(15)}: ${result}`);
      
      // Log to deployments.log
      const logEntry = `[${new Date().toISOString()}] READ_STATE: ${contractName}.${property} = ${result}\n`;
      fs.appendFileSync(path.join(__dirname, "../deployments.log"), logEntry);
      
    } catch (error) {
      console.log(`❌ ${property.padEnd(15)}: Error - ${error.message}`);
    }
  }

  // Try to get additional info
  console.log("\n🔍 Additional Contract Info:");
  console.log("─".repeat(40));
  
  try {
    // Check if contract has balance
    const balance = await ethers.provider.getBalance(contract.address);
    console.log(`💰 Contract Balance: ${ethers.utils.formatEther(balance)} ETH`);
  } catch (error) {
    console.log(`💰 Contract Balance: Error - ${error.message}`);
  }

  try {
    // Check contract code
    const code = await ethers.provider.getCode(contract.address);
    if (code === "0x") {
      console.log(`📜 Contract Code: Not deployed (empty address)`);
    } else {
      console.log(`📜 Contract Code: Deployed (${code.length} bytes)`);
    }
  } catch (error) {
    console.log(`📜 Contract Code: Error - ${error.message}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



