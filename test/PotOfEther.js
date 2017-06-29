var PotOfEther = artifacts.require('./PotOfEther.sol');

contract('PotOfEther', accounts => {
  describe('createPot', () => {
    it('should fail when buyIn == 0', async () => {
      var instance = await PotOfEther.new();

      try {
        await instance.createPot('pot1', {
          from: accounts[0],
          value: 0
        });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty buyIn but didn't fail");
    });

    it('should fail when name.length == 0', async () => {
      var instance = await PotOfEther.new();

      try {
        await instance.createPot('', {
          from: accounts[0],
          value: 1000
        });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty name but didn't fail");
    });

    it('should emit LogPotCreated event', async () => {
      var instance = await PotOfEther.new();

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
      var instance = await PotOfEther.new();

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


