const GovernorService = require("./services/GovernorService");

async function main() {
  const svc = new GovernorService(
    process.env.RPC_URL,
    process.env.PRIVATE_KEY,
    process.env.DAO_ADDR,
    process.env.GOV_ADDR
  );

  // 1) Propose
  const { proposalId, targets, values, calldatas, description } =
    await svc.proposeSetName(process.env.NEW_NAME || "SeferVerse X");
  console.log("📌 Proposal ID:", proposalId?.toString());

  // Localhost’ta isen votingDelay/votingPeriod için blok atlat:
  if (process.env.LOCAL_ADVANCE === "1") {
    const hh = require("hardhat");
    const delay = Number(process.env.VOTING_DELAY || 1);
    for (let i = 0; i < delay; i++) await hh.network.provider.send("evm_mine");
  }

  // 2) Vote (FOR)
  await svc.vote(proposalId, 1, "Looks good");

  // Localhost için votingPeriod atlat
  if (process.env.LOCAL_ADVANCE === "1") {
    const hh = require("hardhat");
    const period = Number(process.env.VOTING_PERIOD || 10);
    for (let i = 0; i < period; i++) await hh.network.provider.send("evm_mine");
  }

  // 3) Queue
  await svc.queue(targets, values, calldatas, description);

  // Timelock minDelay bekleniyorsa local mine:
  if (process.env.LOCAL_ADVANCE === "1") {
    const hh = require("hardhat");
    const blocks = Number(process.env.TIMELOCK_BLOCKS || 1);
    for (let i = 0; i < blocks; i++) await hh.network.provider.send("evm_mine");
  }

  // 4) Execute
  await svc.execute(targets, values, calldatas, description);

  console.log("✅ Executed.");
}

main().catch((e) => { console.error(e); process.exit(1); });
