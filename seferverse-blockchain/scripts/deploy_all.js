// scripts/deploy_all.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) Token
  const Token = await ethers.getContractFactory("BaronTokenVotesUpgradeable");
  const initialSupply = ethers.parseUnits("1000000", 18);
  const token = await upgrades.deployProxy(Token, [deployer.address, initialSupply], {
    kind: "uups",
    initializer: "initialize",
  });
  await token.waitForDeployment();
  console.log("Token:", await token.getAddress());

  // 2) Timelock
  const Timelock = await ethers.getContractFactory("SeferTimelockUpgradeable");
  const minDelay = 3600;
  const timelock = await upgrades.deployProxy(
    Timelock,
    [minDelay, [deployer.address], [deployer.address], deployer.address],
    { kind: "uups", initializer: "initialize" }
  );
  await timelock.waitForDeployment();
  console.log("Timelock:", await timelock.getAddress());

  // 3) Governor
  const Governor = await ethers.getContractFactory("SeferGovernorUpgradeable");
  const votingDelay = 1n;
  const votingPeriod = 45818n;
  const proposalThreshold = ethers.parseUnits("1000", 18);
  const quorumPercent = 4;
  const governor = await upgrades.deployProxy(
    Governor,
    [
      await token.getAddress(),
      await timelock.getAddress(),
      deployer.address,
      votingDelay,
      votingPeriod,
      proposalThreshold,
      quorumPercent,
    ],
    { kind: "uups", initializer: "initialize" }
  );
  await governor.waitForDeployment();
  console.log("Governor:", await governor.getAddress());

  // 4) DAO
  const DAO = await ethers.getContractFactory("SeferVerseDAOUpgradeable");
  const dao = await upgrades.deployProxy(DAO, ["SeferVerse 1789", deployer.address], {
    kind: "uups",
    initializer: "initialize",
  });
  await dao.waitForDeployment();
  console.log("DAO:", await dao.getAddress());

  // 5) Rolleri atama
  const GOVERNOR_ROLE = ethers.id("GOVERNOR_ROLE");
  const MODULE_ADMIN_ROLE = ethers.id("MODULE_ADMIN_ROLE");
  const PAUSER_ROLE = ethers.id("PAUSER_ROLE");
  const UPGRADER_ROLE = ethers.id("UPGRADER_ROLE");

  await (await dao.grantRole(GOVERNOR_ROLE, await governor.getAddress())).wait();
  await (await dao.grantRole(MODULE_ADMIN_ROLE, await timelock.getAddress())).wait();
  await (await dao.grantRole(UPGRADER_ROLE, await governor.getAddress())).wait();
  await (await dao.grantRole(PAUSER_ROLE, await timelock.getAddress())).wait();
  await (await token.grantRole(ethers.id("UPGRADER_ROLE"), await governor.getAddress())).wait();

  // 6) DAO'ya TOKEN modülünü ekle
  const KEY_TOKEN = await dao.KEY_TOKEN();
  await (await dao.setModule(KEY_TOKEN, await token.getAddress())).wait();

  console.log("✅ Deploy complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
