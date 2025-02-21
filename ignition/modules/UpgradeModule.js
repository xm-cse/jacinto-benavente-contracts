const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require('dotenv').config();

const proxyModule = require("./ProxyModule");

module.exports = buildModule("UpgradeModule", (m) => {
  // Get the proxy and admin from the original deployment
  const { proxy, proxyAdmin } = m.useModule(proxyModule);

  // Deploy the new implementation
  const jacintoBenaventeV2 = m.contract("JacintoBenaventeV2", [], {
    id: "JacintoBenaventeV2Impl"
  });

  // Upgrade the proxy to the new implementation
  m.call(proxyAdmin, "upgradeAndCall", [proxy, jacintoBenaventeV2, "0x"], {
    id: "UpgradeToV2",
    from: process.env.OWNER_WALLET_ADDRESS
  });

  // Get the upgraded contract instance
  const upgradedContract = m.contractAt("JacintoBenaventeV2", proxy, {
    id: "JacintoBenaventeV2Main"
  });

  // Initialize V2
  m.call(upgradedContract, "initialize", [process.env.OWNER_WALLET_ADDRESS], {
    id: "InitializeV2",
    from: process.env.OWNER_WALLET_ADDRESS
  });

  return {
    upgradedContract,
    proxy,
    proxyAdmin
  };
}); 