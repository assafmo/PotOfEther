var PotOfEther = artifacts.require("./PotOfEther.sol");

contract("PotOfEther", accounts => {
  describe("createPot", () => {
    it("fail when buyIn == 0", async () => {
      var instance = await PotOfEther.new();

      try {
        await instance.createPot("banana", {
          from: accounts[0],
          value: 0
        });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty buyIn but didn't fail");
    });

    it("fail when name.length == 0", async () => {
      var instance = await PotOfEther.new();

      try {
        await instance.createPot("", {
          from: accounts[0],
          value: 1000
        });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty name but didn't fail");
    });

    it("fail when name already exists", async () => {
      var instance = await PotOfEther.new();

      await instance.createPot("banana", {
        from: accounts[0],
        value: 1000
      });

      try {
        await instance.createPot("banana", {
          from: accounts[0],
          value: 1000
        });
      } catch (err) {
        assert(true);
        return;
      }

      assert(false, "two pots with same name but didn't fail");
    });

    it("emit LogPotCreated event", async () => {
      var instance = await PotOfEther.new();

      var result = await instance.createPot("banana", {
        from: accounts[0],
        value: 1000
      });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[0].args.name, "banana");
      assert.equal(result.logs[0].args.buyIn.valueOf(), 1000);
      assert.equal(result.logs[0].args.firstPlayer, accounts[0]);
    });

    it("emit LogPotJoin event", async () => {
      var instance = await PotOfEther.new();

      var result = await instance.createPot("banana", {
        from: accounts[0],
        value: 1000
      });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[1].args.name, "banana");
      assert.equal(result.logs[1].args.newPlayer, accounts[0]);
    });
  })

  describe("joinPot", () => {
    it("fail when pot doesn't exists", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      try {
        await instance.joinPot(name, { from: accounts[0], value: 0 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot doesn't exists but didn't fail");
    });

    it("fail when pot is closed", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      var i = 1;
      while (true) {
        // now we create dummy transactions,
        // closePot needs to wait 2 blocks after last player has joined 
        await instance.createPot("dummy" + i, { from: accounts[0], value: 1000 });
        i++;

        if (await instance.canClosePot.call(name) === true) {
          break;
        }
      }

      await instance.closePot(name);

      try {
        await instance.joinPot(name, {
          from: accounts[3],
          value: 1000
        });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is closed but join didn't fail");
    });

  })
});


