var PotOfEther = artifacts.require("./PotOfEther.sol");

module.exports = function (deployer) {
  deployer.deploy(PotOfEther);
};
