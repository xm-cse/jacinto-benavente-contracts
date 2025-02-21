const { expect } = require("chai");
const proxyModule = require("../ignition/modules/ProxyModule");
const upgradeModule = require("../ignition/modules/UpgradeModule");
const { ethers } = require("hardhat");

describe("JacintoBenavente Proxy", function () {
  describe("Proxy interaction", function () {
    it("Should be initialized with correct owner", async function () {
      const [deployer, otherAccount] = await ethers.getSigners();
      const { jacintoBenavente } = await ignition.deploy(proxyModule);

      // Check that the owner is set correctly from .env
      expect(await jacintoBenavente.owner()).to.equal(process.env.OWNER_WALLET_ADDRESS);
    });

    it("Should allow owner to mint tokens", async function () {
      const [deployer, recipient] = await ethers.getSigners();
      const { jacintoBenavente } = await ignition.deploy(proxyModule);
      
      // Connect as owner and fund the account
      const ownerSigner = await ethers.getImpersonatedSigner(process.env.OWNER_WALLET_ADDRESS);
      await deployer.sendTransaction({
        to: ownerSigner.address,
        value: ethers.parseEther("1.0")
      });

      await jacintoBenavente.connect(ownerSigner).mint(recipient.address, 1, 100, "0x");

      // Check balance
      expect(await jacintoBenavente.balanceOf(recipient.address, 1)).to.equal(100);
    });

    it("Should prevent non-owners from minting", async function () {
      const [deployer, nonOwner, recipient] = await ethers.getSigners();
      const { jacintoBenavente } = await ignition.deploy(proxyModule);

      // Try to mint as non-owner
      await expect(
        jacintoBenavente.connect(nonOwner).mint(recipient.address, 1, 100, "0x")
      ).to.be.revertedWithCustomError(jacintoBenavente, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to pause/unpause", async function () {
      const [deployer] = await ethers.getSigners();
      const { jacintoBenavente } = await ignition.deploy(proxyModule);
      
      // Connect as owner and fund the account
      const ownerSigner = await ethers.getImpersonatedSigner(process.env.OWNER_WALLET_ADDRESS);
      await deployer.sendTransaction({
        to: ownerSigner.address,
        value: ethers.parseEther("1.0")
      });
      
      // Pause
      await jacintoBenavente.connect(ownerSigner).pause();
      expect(await jacintoBenavente.paused()).to.be.true;

      // Unpause
      await jacintoBenavente.connect(ownerSigner).unpause();
      expect(await jacintoBenavente.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      const [deployer, sender, recipient] = await ethers.getSigners();
      const { jacintoBenavente } = await ignition.deploy(proxyModule);
      
      // Connect as owner and fund the account
      const ownerSigner = await ethers.getImpersonatedSigner(process.env.OWNER_WALLET_ADDRESS);
      await deployer.sendTransaction({
        to: ownerSigner.address,
        value: ethers.parseEther("1.0")
      });

      // Mint tokens and pause
      await jacintoBenavente.connect(ownerSigner).mint(sender.address, 1, 100, "0x");
      await jacintoBenavente.connect(ownerSigner).pause();

      // Try to transfer when paused
      await expect(
        jacintoBenavente.connect(sender).safeTransferFrom(sender.address, recipient.address, 1, 50, "0x")
      ).to.be.revertedWithCustomError(jacintoBenavente, "EnforcedPause");
    });
  });

  describe("Upgrade functionality", function () {
    it("Should upgrade to V2 and maintain functionality", async function () {
      const [deployer, recipient] = await ethers.getSigners();
      
      // Deploy V1 and upgrade to V2
      const { upgradedContract } = await ignition.deploy(upgradeModule);
      
      // Fund owner account
      const ownerSigner = await ethers.getImpersonatedSigner(process.env.OWNER_WALLET_ADDRESS);
      await deployer.sendTransaction({
        to: ownerSigner.address,
        value: ethers.parseEther("1.0")
      });

      // Mint tokens after upgrade
      await upgradedContract.connect(ownerSigner).mint(recipient.address, 1, 100, "0x");
      expect(await upgradedContract.balanceOf(recipient.address, 1)).to.equal(100);
      
      // Check V2 version
      expect(await upgradedContract.version()).to.equal("2.0.0");
    });

    it("Should support new V2 functionality", async function () {
      const [deployer, recipient] = await ethers.getSigners();
      
      // Deploy and upgrade to V2
      const { upgradedContract } = await ignition.deploy(upgradeModule);
      
      // Fund owner account
      const ownerSigner = await ethers.getImpersonatedSigner(process.env.OWNER_WALLET_ADDRESS);
      await deployer.sendTransaction({
        to: ownerSigner.address,
        value: ethers.parseEther("1.0")
      });

      // Test new token naming functionality
      await upgradedContract.connect(ownerSigner).mint(recipient.address, 1, 100, "0x");
      await upgradedContract.connect(ownerSigner).setTokenName(1, "Special Token");
      expect(await upgradedContract.getTokenName(1)).to.equal("Special Token");
    });

    it("Should maintain ownership after upgrade", async function () {
      const [deployer, nonOwner] = await ethers.getSigners();
      
      // Deploy and upgrade to V2
      const { upgradedContract } = await ignition.deploy(upgradeModule);
      
      // Check that owner is maintained
      expect(await upgradedContract.owner()).to.equal(process.env.OWNER_WALLET_ADDRESS);
      
      // Verify owner-only functions still work
      await expect(
        upgradedContract.connect(nonOwner).setTokenName(1, "Test")
      ).to.be.revertedWithCustomError(upgradedContract, "OwnableUnauthorizedAccount");
    });
  });
}); 