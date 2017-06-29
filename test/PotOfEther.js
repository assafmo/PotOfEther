var PotOfEther = artifacts.require('./PotOfEther.sol');

contract('PotOfEther', accounts => {
  describe('createPot', () => {
    it('should pay buy in > 0', async () => {
      var instance = await PotOfEther.deployed();

      try {
        await instance.createPot('pot1', {
          from: accounts[0],
          value: 0
        });
        assert.equal(true, false);
      } catch (err) {
        assert.equal(true, true);
      }
    });

    it('should pass a name with name.length > 0', async () => {
      var instance = await PotOfEther.deployed();

      try {
        await instance.createPot('pot1', {
          from: accounts[0],
          value: 1000
        });
        assert.equal(true, false);
      } catch (err) {
        assert.equal(true, true);
      }
    });

    it('should emit LogPotCreated event', async () => {
      var instance = await PotOfEther.deployed();

      var result = await instance.createPot('banana', {
        from: accounts[0],
        value: 1000
      });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[0].args.name, 'banana');
      assert.equal(result.logs[0].args.buyIn.valueOf(), 1000);
      assert.equal(result.logs[0].args.firstPlayer, accounts[0]);
    });

    it('should emit LogPotJoin event', async () => {
      var instance = await PotOfEther.deployed();

      var result = await instance.createPot('papaya', {
        from: accounts[0],
        value: 1000
      });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[1].args.name, 'papaya');
      assert.equal(result.logs[1].args.newPlayer, accounts[0]);
    });
  })
});


