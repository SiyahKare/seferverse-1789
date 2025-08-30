const { expect } = require("chai");

describe("RefundVaultEIP712", function () {
  it("valid signature claims; wrong signer or nonce rejected", async function () {
    const hre = require("hardhat");
    const [admin, signerWallet, user] = await hre.ethers.getSigners();

    const Timelock = await hre.ethers.getContractFactory("SeferTimelock");
    const timelock = await Timelock.deploy(1, [], [], await admin.getAddress());
    await timelock.waitForDeployment();

    const Vault = await hre.ethers.getContractFactory("RefundVaultEIP712");
    const vault = await Vault.deploy(await timelock.getAddress(), await signerWallet.getAddress());
    await vault.waitForDeployment();

    const amount = hre.ethers.parseEther("0.5");
    await admin.sendTransaction({ to: await vault.getAddress(), value: amount });

    const chainId = (await hre.ethers.provider.getNetwork()).chainId;
    const domain = {
      name: "SeferVerseRefund",
      version: "1",
      chainId,
      verifyingContract: await vault.getAddress(),
    };
    const types = {
      Refund: [
        { name: 'beneficiary', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' },
      ],
    };
    const value = {
      beneficiary: await user.getAddress(),
      amount: amount,
      nonce: 0,
      expiry: Math.floor(Date.now()/1000) + 3600,
    };

    const sig = await signerWallet.signTypedData(domain, types, value);
    await expect(vault.connect(user).claim(value.beneficiary, value.amount, value.nonce, value.expiry, sig))
      .to.emit(vault, 'Refunded');

    // wrong nonce
    const badValue = { ...value, nonce: 0 };
    await expect(vault.connect(user).claim(badValue.beneficiary, badValue.amount, badValue.nonce, badValue.expiry, sig))
      .to.be.revertedWithCustomError(vault, 'InvalidNonce');
  });
});




