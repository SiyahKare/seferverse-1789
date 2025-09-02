#!/usr/bin/env node

/**
 * 🚀 SeferVerse Contract Interaction Script
 * 
 * Kullanım:
 * node scripts/interact.js <contract> <function> [args...]
 * 
 * Örnekler:
 * node scripts/interact.js SeferVerseDAO name
 * node scripts/interact.js SeferVerseDAO setName "Yeni DAO Adı"
 * node scripts/interact.js BaronToken totalSupply
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Load deployments
const deploymentsPath = path.join(__dirname, "../deployments.json");
const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));

// Load environment
require("dotenv").config();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("❌ Kullanım: node scripts/interact.js <contract> <function> [args...]");
    console.log("📚 Örnekler:");
    console.log("   node scripts/interact.js SeferVerseDAO name");
    console.log("   node scripts/interact.js SeferVerseDAO setName 'Yeni DAO Adı'");
    console.log("   node scripts/interact.js BaronToken totalSupply");
    process.exit(1);
  }

  const [contractName, functionName, ...functionArgs] = args;
  
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
  console.log(`🌐 Network: ${network}`);
  console.log(`📋 Contract: ${contractName}`);
  console.log(`📍 Address: ${contractAddress}`);
  console.log(`🔧 Function: ${functionName}`);
  console.log(`📝 Args: ${functionArgs.length > 0 ? functionArgs.join(", ") : "none"}`);
  console.log("─".repeat(50));

  try {
    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Signer: ${deployer.address}`);
    console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

    // Get contract factory
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contract = ContractFactory.attach(contractAddress).connect(deployer);

    // Check if function exists
    if (!contract[functionName]) {
      console.log(`❌ Function '${functionName}' bulunamadı`);
      console.log(`📋 Mevcut fonksiyonlar:`);
      const functions = Object.keys(contract.interface.fragments).filter(f => !f.startsWith("_"));
      functions.forEach(f => console.log(`   - ${f}`));
      process.exit(1);
    }

    // Get function info
    const functionFragment = contract.interface.getFunction(functionName);
    const isView = functionFragment.stateMutability === "view" || functionFragment.stateMutability === "pure";
    
    console.log(`📊 Function Type: ${isView ? "View/Read" : "Write/Transaction"}`);
    console.log(`📋 Parameters: ${functionFragment.inputs.length > 0 ? functionFragment.inputs.map(i => `${i.type} ${i.name}`).join(", ") : "none"}`);

    if (isView) {
      // Read function
      console.log("\n🔍 Reading contract state...");
      const result = await contract[functionName](...functionArgs);
      console.log(`✅ Result: ${result}`);
      
      // Log to deployments.log
      const logEntry = `[${new Date().toISOString()}] READ: ${contractName}.${functionName}() = ${result} (${network})\n`;
      fs.appendFileSync(path.join(__dirname, "../deployments.log"), logEntry);
      
    } else {
      // Write function
      console.log("\n✍️  Sending transaction...");
      
      // Estimate gas
      const gasEstimate = await contract.estimateGas[functionName](...functionArgs);
      console.log(`⛽ Estimated Gas: ${gasEstimate.toString()}`);
      
      // Send transaction
      const tx = await contract[functionName](...functionArgs);
      console.log(`📝 Transaction Hash: ${tx.hash}`);
      console.log(`⏳ Waiting for confirmation...`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()}`);
      
      // Log to deployments.log
      const logEntry = `[${new Date().toISOString()}] WRITE: ${contractName}.${functionName}(${functionArgs.join(", ")}) tx: ${tx.hash} gas: ${receipt.gasUsed} (${network})\n`;
      fs.appendFileSync(path.join(__dirname, "../deployments.log"), logEntry);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    
    // Log error to deployments.log
    const logEntry = `[${new Date().toISOString()}] ERROR: ${contractName}.${functionName}(${functionArgs.join(", ")}) - ${error.message} (${network})\n`;
    fs.appendFileSync(path.join(__dirname, "../deployments.log"), logEntry);
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
