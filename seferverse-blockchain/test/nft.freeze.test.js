const { expect } = require("chai");

describe("BaronNFT freeze & royalty", function () {
  it("freezes baseURI and royalty", async function () {
    const hre = require("hardhat");
    const [admin] = await hre.ethers.getSigners();
    const NFT = await hre.ethers.getContractFactory("BaronNFT");
    const nft = await NFT.deploy(await admin.getAddress());
    await nft.waitForDeployment();

    await (await nft.setBaseURI("ipfs://x/")).wait();
    await (await nft.setDefaultRoyalty(await admin.getAddress(), 500)).wait();
    await (await nft.freezeBaseURI()).wait();
    await (await nft.freezeRoyalty()).wait();

    await expect(nft.setBaseURI("ipfs://y/")).to.be.revertedWith("frozen");
    await expect(nft.setDefaultRoyalty(await admin.getAddress(), 600)).to.be.revertedWith("royalty-frozen");
  });
});




