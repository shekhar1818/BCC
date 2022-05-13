var Migrations = artifacts.require("./College.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
