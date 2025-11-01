const OfflineTransaction = artifacts.require("OfflineTransaction");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(OfflineTransaction);
};
