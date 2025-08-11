const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) Token (ERC20Votes)
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
  const Token = await hre.ethers.getContractFactory("BaronTokenVotes");
  const token = await Token.deploy(deployer.address, initialSupply);
  await token.waitForDeployment();
  console.log("BaronTokenVotes:", await token.getAddress());

  // 2) Timelock
  const minDelay = 2; // blocks or seconds depending on chain (TimelockController uses seconds)
  const proposers = [];
  const executors = [];
  const Timelock = await hre.ethers.getContractFactory("SeferTimelock");
  const timelock = await Timelock.deploy(minDelay, proposers, executors, deployer.address);
  await timelock.waitForDeployment();
  console.log("SeferTimelock:", await timelock.getAddress());

  // 3) Governor
  const Governor = await hre.ethers.getContractFactory("SeferGovernor");
  const governor = await Governor.deploy(await token.getAddress(), await timelock.getAddress());
  await governor.waitForDeployment();
  console.log("SeferGovernor:", await governor.getAddress());

  // 4) Roles wiring: make Governor the proposer/executor, transfer admin to timelock or governor as desired
  // Proposer
  await (await timelock.grantRole(await timelock.PROPOSER_ROLE(), await governor.getAddress())).wait();
  // Executor: everyone (address(0)) or governor
  await (await timelock.grantRole(await timelock.EXECUTOR_ROLE(), hre.ethers.ZeroAddress)).wait();
  // Revoke deployer admin if desired, keep it simple for now

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });


