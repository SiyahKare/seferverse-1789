// seferverse-blockchain/scripts/services/GovernorService.js
const { ethers } = require("ethers");
const daoAbi = require("../abis/SeferVerseDAOUpgradeable.json");
const governorAbi = require("../abis/SeferGovernorUpgradeable.json");

class GovernorService {
  constructor(rpcUrl, privateKey, daoAddr, govAddr) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, provider);
    this.dao = new ethers.Contract(daoAddr, daoAbi.abi || daoAbi, this.signer);
    this.governor = new ethers.Contract(govAddr, governorAbi.abi || governorAbi, this.signer);
  }

  // Teklif paketleyici (frontend/backend/mobil hepsi aynı paketi kullanır)
  async buildSetNameProposal(newName) {
    const calldata = this.dao.interface.encodeFunctionData("setName", [newName]);
    const targets = [this.dao.target];
    const values = [0];
    const calldatas = [calldata];
    const description = `Change name to ${newName}`;
    const descriptionHash = ethers.id(description);
    return { targets, values, calldatas, description, descriptionHash };
  }

  async proposeSetName(newName) {
    const { targets, values, calldatas, description } = await this.buildSetNameProposal(newName);
    const tx = await this.governor.propose(targets, values, calldatas, description);
    const rc = await tx.wait();

    // Sağlam event parse
    const sig = this.governor.interface.getEvent("ProposalCreated").topicHash;
    const log = rc.logs.find(l => l.topics && l.topics[0] === sig);
    const decoded = log ? this.governor.interface.decodeEventLog("ProposalCreated", log.data, log.topics) : null;
    const proposalId = decoded ? decoded.proposalId : undefined;

    return { proposalId, targets, values, calldatas, description };
  }

  async vote(proposalId, support = 1, reason) {
    const tx = reason
      ? await this.governor.castVoteWithReason(proposalId, support, reason)
      : await this.governor.castVote(proposalId, support);
    await tx.wait();
    return true;
  }

  async queue(targets, values, calldatas, description) {
    const tx = await this.governor.queue(targets, values, calldatas, ethers.id(description));
    await tx.wait();
    return true;
  }

  async execute(targets, values, calldatas, description) {
    const tx = await this.governor.execute(targets, values, calldatas, ethers.id(description));
    await tx.wait();
    return true;
  }

  async state(proposalId) {
    return await this.governor.state(proposalId); // 0..7
  }
}

module.exports = GovernorService;
