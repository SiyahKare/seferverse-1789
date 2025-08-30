const { expect } = require("chai");

describe("Governance flow", function () {
  it("propose -> vote -> queue -> execute -> DAO.setName via Timelock", async function () {
    const hre = require("hardhat");
    const [deployer] = await hre.ethers.getSigners();

    // Deploy token
    const Token = await hre.ethers.getContractFactory("BaronTokenVotes");
    const token = await Token.deploy(deployer.address, hre.ethers.parseUnits("1000", 18));
    await token.waitForDeployment();

    // Self delegate to get voting power
    await (await token.delegate(await deployer.getAddress())).wait();

    // Deploy timelock
    const Timelock = await hre.ethers.getContractFactory("SeferTimelock");
    const timelock = await Timelock.deploy(1, [], [], await deployer.getAddress());
    await timelock.waitForDeployment();

    // Deploy governor
    const Governor = await hre.ethers.getContractFactory("SeferGovernor");
    const governor = await Governor.deploy(await token.getAddress(), await timelock.getAddress());
    await governor.waitForDeployment();

    // Wire roles
    await (await timelock.grantRole(await timelock.PROPOSER_ROLE(), await governor.getAddress())).wait();
    await (await timelock.grantRole(await timelock.EXECUTOR_ROLE(), hre.ethers.ZeroAddress)).wait();

    // Deploy DAO with timelock as controller
    const DAO = await hre.ethers.getContractFactory("SeferVerseDAO");
    const dao = await DAO.deploy("SeferVerse", await timelock.getAddress());
    await dao.waitForDeployment();

    // Build proposal calldata
    const iface = dao.interface;
    const calldata = iface.encodeFunctionData("setName", ["NewName"]);
    const targets = [await dao.getAddress()];
    const values = [0];
    const calldatas = [calldata];
    const description = "Change name to NewName";
    const descHash = hre.ethers.id(description);

    // Propose
    const txProp = await governor.propose(targets, values, calldatas, description);
    const rcProp = await txProp.wait();
    const evTopic = governor.interface.getEvent("ProposalCreated").topicHash;
    const log = rcProp.logs.find((l) => l.topics && l.topics[0] === evTopic);
    const decoded = governor.interface.decodeEventLog("ProposalCreated", log.data, log.topics);
    const proposalId = decoded.proposalId;

    // Advance to voting start
    const delay = Number(await governor.votingDelay());
    for (let i = 0; i < delay; i++) await hre.network.provider.send("evm_mine");

    // Vote For (1)
    await (await governor.castVote(proposalId, 1)).wait();

    // Advance to voting end
    const period = Number(await governor.votingPeriod());
    for (let i = 0; i < period; i++) await hre.network.provider.send("evm_mine");

    // Queue
    await (await governor.queue(targets, values, calldatas, descHash)).wait();

    // Increase time for timelock minDelay
    await hre.network.provider.send("evm_increaseTime", [2]);
    await hre.network.provider.send("evm_mine");

    // Execute
    await (await governor.execute(targets, values, calldatas, descHash)).wait();

    expect(await dao.name()).to.equal("NewName");
  });
});





