const { expect } = require("chai");

describe("RefundManager onlyTimelock", function () {
  it("non-timelock cannot setMerkleRoot or pause", async function () {
    const hre = require("hardhat");
    const [admin, other] = await hre.ethers.getSigners();

    const Timelock = await hre.ethers.getContractFactory("SeferTimelock");
    const timelock = await Timelock.deploy(1, [], [], await admin.getAddress());
    await timelock.waitForDeployment();

    const Refund = await hre.ethers.getContractFactory("RefundManager");
    const refund = await Refund.deploy(await timelock.getAddress(), hre.ethers.ZeroHash);
    await refund.waitForDeployment();

    await expect(refund.connect(other).setMerkleRoot(hre.ethers.ZeroHash)).to.be.revertedWithCustomError(refund, 'NotTimelock');
    await expect(refund.connect(other).pause()).to.be.revertedWithCustomError(refund, 'NotTimelock');
  });
});




