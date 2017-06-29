var PotOfEther = artifacts.require("./PotOfEther.sol");

contract('PotOfEther', accounts => {
  it("should emit LogPotCreated event on pot creation", async () => {
    var instance = await PotOfEther.deployed();

    return instance.createPot("banana", {
      from: accounts[0],
      value: 1000
    })
      .then(result => {
        assert.equal(result.logs.length, 2);
        assert.equal(result.logs[0].args.name, "banana");
        assert.equal(result.logs[0].args.buyIn.valueOf(), 1000);
        assert.equal(result.logs[0].args.firstPlayer, accounts[0]);
      })
  });
});


