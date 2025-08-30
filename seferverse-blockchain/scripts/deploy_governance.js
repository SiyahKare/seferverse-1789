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
  const minDelay = 2; // seconds (TimelockController uses seconds)
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

  // 4) Roles wiring: make Governor the proposer; executor everyone
  // Proposer
  await (await timelock.grantRole(await timelock.PROPOSER_ROLE(), await governor.getAddress())).wait();
  // Executor: everyone (address(0)) or governor
  await (await timelock.grantRole(await timelock.EXECUTOR_ROLE(), hre.ethers.ZeroAddress)).wait();
  // Revoke deployer admin if desired, keep it simple for now

  // 5) Deploy DAO, owned by Timelock (constructor expects timelock)
  const DAO = await hre.ethers.getContractFactory("SeferVerseDAO");
  const dao = await DAO.deploy("SeferVerseDAO", await timelock.getAddress());
  await dao.waitForDeployment();
  console.log("SeferVerseDAO:", await dao.getAddress());

  // 6) Deploy RefundManager with merkle root (zero root initially)
  const Refund = await hre.ethers.getContractFactory("RefundManager");
  const refund = await Refund.deploy(await timelock.getAddress(), hre.ethers.ZeroHash);
  await refund.waitForDeployment();
  console.log("RefundManager:", await refund.getAddress());

  // 7) Deploy BaronNFT and wire roles to Timelock
  const NFT = await hre.ethers.getContractFactory("BaronNFT");
  const nft = await NFT.deploy(await deployer.getAddress());
  await nft.waitForDeployment();
  console.log("BaronNFT:", await nft.getAddress());

  // Grant DEFAULT_ADMIN_ROLE to Timelock on Token and NFT, and operational roles
  const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
  const MINTER_ROLE = await token.MINTER_ROLE();
  const PAUSER_ROLE = await token.PAUSER_ROLE();
  await (await token.grantRole(DEFAULT_ADMIN_ROLE, await timelock.getAddress())).wait();
  await (await token.grantRole(MINTER_ROLE, await timelock.getAddress())).wait();
  await (await token.grantRole(PAUSER_ROLE, await timelock.getAddress())).wait();
  // Optional: revoke deployer admin to enforce Timelock control
  await (await token.revokeRole(DEFAULT_ADMIN_ROLE, await deployer.getAddress())).wait();

  const NFT_DEFAULT_ADMIN_ROLE = await nft.DEFAULT_ADMIN_ROLE();
  const NFT_MINTER_ROLE = await nft.MINTER_ROLE();
  await (await nft.grantRole(NFT_DEFAULT_ADMIN_ROLE, await timelock.getAddress())).wait();
  await (await nft.grantRole(NFT_MINTER_ROLE, await timelock.getAddress())).wait();
  await (await nft.revokeRole(NFT_DEFAULT_ADMIN_ROLE, await deployer.getAddress())).wait();

  // 8) Optional: hand Timelock admin to SAFE (Gnosis Safe)
  const SAFE_ADMIN = process.env.SAFE_ADMIN;
  if (SAFE_ADMIN) {
    const DEFAULT_ADMIN_ROLE_TL = await timelock.DEFAULT_ADMIN_ROLE();
    await (await timelock.grantRole(DEFAULT_ADMIN_ROLE_TL, SAFE_ADMIN)).wait();
    await (await timelock.revokeRole(DEFAULT_ADMIN_ROLE_TL, await deployer.getAddress())).wait();
    console.log("Timelock admin handed to SAFE:", SAFE_ADMIN);
  }

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });


