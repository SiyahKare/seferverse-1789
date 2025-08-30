const { expect } = require("chai");

function bufferToHex(buf) { return '0x' + Buffer.from(buf).toString('hex'); }

describe("RefundManager (Merkle)", function () {
  it("rejects bad proof, then claims once, then rejects double-claim", async function () {
    const hre = require("hardhat");
    const [deployer, user] = await hre.ethers.getSigners();

    // Simple 1-leaf merkle tree: leaf = keccak(index, account, amount)
    const index = 0;
    const amount = hre.ethers.parseEther("1");
    const leaf = hre.ethers.solidityPackedKeccak256(
      ['uint256','address','uint256'],
      [index, await user.getAddress(), amount]
    );
    const root = leaf; // single-leaf tree: proof=[] and root==leaf

    const Timelock = await hre.ethers.getContractFactory("SeferTimelock");
    const timelock = await Timelock.deploy(1, [], [], await deployer.getAddress());
    await timelock.waitForDeployment();

    const Refund = await hre.ethers.getContractFactory("RefundManager");
    const refund = await Refund.deploy(await timelock.getAddress(), root);
    await refund.waitForDeployment();

    // fund the contract
    await deployer.sendTransaction({ to: await refund.getAddress(), value: amount });

    // bad proof: different amount first (should revert BadProof)
    await expect(refund.connect(user).claim(index, await user.getAddress(), amount + 1n, []))
      .to.be.revertedWithCustomError(refund, 'BadProof');

    // claim with empty proof (valid in single-leaf case)
    await expect(refund.connect(user).claim(index, await user.getAddress(), amount, []))
      .to.emit(refund, 'Refunded').withArgs(index, await user.getAddress(), amount);

    // re-claim should fail
    await expect(refund.connect(user).claim(index, await user.getAddress(), amount, []))
      .to.be.revertedWithCustomError(refund, 'AlreadyClaimed');
  });
});


