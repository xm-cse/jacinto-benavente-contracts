const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require('dotenv').config();

module.exports = buildModule("ProxyModule", (m) => {
  // Deploy the implementation contract
  const jacintoBenavente = m.contract("JacintoBenavente", [], {
    id: "JacintoBenaventeImpl"
  });

  // Deploy the TransparentUpgradeableProxy with empty initialization data
  const proxy = m.contract("TransparentUpgradeableProxy", [
    jacintoBenavente,
    process.env.OWNER_WALLET_ADDRESS,
    "0x"
  ], {
    id: "JacintoBenaventeProxy"
  });

  // Get ProxyAdmin address from event
  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin"
  );

  // Get ProxyAdmin contract instance
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress, {
    id: "JacintoBenaventeProxyAdmin"
  });

  // Get contract instance at proxy address and initialize it
  const proxiedContract = m.contractAt("JacintoBenavente", proxy, {
    id: "JacintoBenaventeProxied"
  });

  // Initialize the contract
  m.call(proxiedContract, "initialize", [process.env.OWNER_WALLET_ADDRESS], {
    id: "InitializeProxy"
  });

  return {
    jacintoBenavente: proxiedContract,
    proxy,
    proxyAdmin
  };
}); 