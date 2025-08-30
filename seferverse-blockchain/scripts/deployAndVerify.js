const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

const ENV_PATH = ".env";
const DEPLOYMENTS_JSON = "deployments.json";
const DEPLOYMENTS_LOG = "deployments.log";

// 🔹 Smart parser: boşluk, tırnak, virgül temizler, tipleri tahmin eder
function parseArgs(raw) {
  if (!raw || raw.trim().length === 0) return [];
  const cleaned = raw
    .trim()
    .replace(/^['"]|['"]$/g, "") // baş/son tırnak temizle
    .replace(/\s+/g, " ");       // fazla boşlukları tek boşluk yap

  const parts = cleaned
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map((x) => {
      if (x.startsWith("0x") && x.length === 42) return x; // address
      if (!isNaN(x)) return Number(x);                     // number
      return x;                                            // string
    });

  return parts.length > 0 ? parts : [cleaned];
}

// 🔹 .env update (sadece *_ADDRESS)
function updateEnvAddress(key, value) {
  const envLines = fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/);
  let updated = false;

  const newLines = envLines.map((line) => {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) return line;
    if (trimmed.startsWith(`${key}=`)) {
      updated = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!updated) newLines.push(`${key}=${value}`);
  fs.writeFileSync(ENV_PATH, newLines.join("\n"), "utf8");
  console.log(`📝 .env updated -> ${key}=${value}`);
}

// 🔹 deployments.json update
function updateDeploymentsJson(contractName, network, address, txHash, args, gasUsed) {
  let registry = {};
  if (fs.existsSync(DEPLOYMENTS_JSON)) {
    registry = JSON.parse(fs.readFileSync(DEPLOYMENTS_JSON, "utf8"));
  }
  if (!registry[network]) registry[network] = {};
  registry[network][contractName] = {
    address,
    txHash,
    args,
    gasUsed: `${hre.ethers.formatEther(gasUsed)} ETH`,
    date: new Date().toISOString()
  };
  fs.writeFileSync(DEPLOYMENTS_JSON, JSON.stringify(registry, null, 2));
  console.log(`📝 deployments.json updated for ${contractName}`);
}

// 🔹 deployments.log append
function appendTextLog(contractName, network, address, txHash, gasUsed) {
  const logLine = `${new Date().toISOString()} | ${network} | ${contractName} | ${address} | tx: ${txHash} | gas: ${hre.ethers.formatEther(gasUsed)} ETH\n`;
  fs.appendFileSync(DEPLOYMENTS_LOG, logLine);
  console.log(`📝 deployments.log appended`);
}

// 🔹 Ana deploy & verify fonksiyonu
async function deployAndVerify(contractName) {
  const network = hre.network.name;
  const argsEnvKey = `${contractName.toUpperCase()}_ARGS`;
  const addrEnvKey = `${contractName.toUpperCase()}_ADDRESS`;

  console.log(`DEBUG args raw:`, process.env[argsEnvKey]);

  const args = parseArgs(process.env[argsEnvKey] || "");
  console.log(`DEBUG parsed args:`, args);

  console.log(`\n🚀 Deploying ${contractName} to ${network}...`);
  if (args.length > 0) console.log(`🔹 Constructor args: ${JSON.stringify(args)}`);

  const ContractFactory = await hre.ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy(...args);
  const tx = contract.deploymentTransaction();
  console.log(`⏳ Tx sent: ${tx.hash}`);

  await contract.waitForDeployment();
  await tx.wait(5); // 5 block confirm

  const address = await contract.getAddress();
  const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash);
  const gasPrice = (receipt.effectiveGasPrice ?? tx.gasPrice ?? 0n);
  const gasUsed = receipt.gasUsed * gasPrice;

  console.log(`✅ ${contractName} deployed at: ${address}`);
  console.log(`💰 Gas Used: ${receipt.gasUsed} (~${hre.ethers.formatEther(gasUsed)} ETH)`);

  // Verify
  try {
    console.log(`🔎 Verifying ${contractName}...`);
    await hre.run("verify:verify", {
      address,
      constructorArguments: args,
    });
    console.log(`🎉 ${contractName} verified successfully!`);
  } catch (err) {
    console.warn(`⚠️ ${contractName} verify failed: ${err.message}`);
  }

  // 🔹 Env, JSON ve Text log update
  updateEnvAddress(addrEnvKey, address);
  updateDeploymentsJson(contractName, network, address, tx.hash, args, gasUsed);
  try {
    // export core ABIs for apps
    const path = require('path');
    const fs = require('fs');
    const root = process.cwd();
    const abiOut = path.join(root, 'abis');
    if (!fs.existsSync(abiOut)) fs.mkdirSync(abiOut);
    const map = {
      SeferVerseDAO: 'contracts/SeferVerseDAO.sol/SeferVerseDAO.json',
      SeferGovernor: 'contracts/governance/SeferGovernor.sol/SeferGovernor.json',
      SeferTimelock: 'contracts/governance/SeferTimelock.sol/SeferTimelock.json',
    };
    const rel = map[contractName];
    if (rel) {
      const src = path.join(root, 'artifacts', rel);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(abiOut, path.basename(src)));
    }
  } catch {}
  appendTextLog(contractName, network, address, tx.hash, gasUsed);

  // 🔹 Özet: Ağa göre son dağıtımlar
  try {
    const registry = JSON.parse(fs.readFileSync(DEPLOYMENTS_JSON, "utf8"));
    const networkMap = registry[network] || {};
    console.log(`\n===== DEPLOY SUMMARY @ ${network} =====`);
    for (const [name, meta] of Object.entries(networkMap)) {
      console.log(`${name}: ${meta.address} (tx: ${meta.txHash || meta.transactionHash || "-"})`);
    }
    console.log("====================================\n");
  } catch (e) {
    console.warn("⚠️ Summary print failed:", e.message);
  }

  return address;
}

// 🔹 Main
async function main() {
  await deployAndVerify(process.env.SEFERVERSE_CONTRACT_NAME || "SeferVerseDAO");

  // Birden fazla kontrat deploy etmek için:
  // await deployAndVerify(process.env.MYCONTRACT_NAME || "MyContract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
