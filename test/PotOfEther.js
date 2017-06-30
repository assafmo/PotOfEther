var PotOfEther = artifacts.require("./PotOfEther.sol");

contract("PotOfEther", accounts => {
  describe("createPot", () => {
    it("fail when buyIn == 0", async () => {
      var instance = await PotOfEther.new();

      try {
        await instance.createPot("banana", { from: accounts[0], value: 0 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty buyIn but didn't fail");
    });

    it("fail when name.length == 0", async () => {
      var instance = await PotOfEther.new();

      try {
        await instance.createPot("", { from: accounts[0], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty name but didn't fail");
    });

    it("fail when name already exists", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });

      try {
        await instance.createPot(name, { from: accounts[0], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }

      assert(false, "two pots with same name but didn't fail");
    });

    it("emit LogPotCreated event", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      var result = await instance.createPot(name, { from: accounts[0], value: 1000 });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[0].event, "LogPotCreated");
      assert.equal(result.logs[0].args.name, name);
      assert.equal(result.logs[0].args.buyIn.valueOf(), 1000);
      assert.equal(result.logs[0].args.firstPlayer, accounts[0]);
    });

    it("emit LogPotJoined event", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      var result = await instance.createPot(name, { from: accounts[0], value: 1000 });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[1].event, "LogPotJoined");
      assert.equal(result.logs[1].args.name, name);
      assert.equal(result.logs[1].args.newPlayer, accounts[0]);
    });
  });

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

      await untilCanClosePot(instance, name, accounts[9]);

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

    it("fail when pot is full", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      try {
        await instance.joinPot(name, { from: accounts[3], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is full but join didn't fail");
    });

    it("fail when wrong buyIn", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });

      try {
        await instance.joinPot(name, { from: accounts[1], value: 1001 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "join with wrong buyIn didn't fail");
    });

    it("fail when creator entering twice", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });

      try {
        await instance.joinPot(name, { from: accounts[0], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "creator joined twice but didn't fail");
    });

    it("fail when creator entering twice (2)", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });

      try {
        await instance.joinPot(name, { from: accounts[0], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "creator joined twice but didn't fail");
    });

    it("fail when player entering twice", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });

      try {
        await instance.joinPot(name, { from: accounts[1], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "same player joined twice but didn't fail");
    });

    it("emit LogPotJoined event", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      var result = await instance.joinPot(name, { from: accounts[1], value: 1000 });

      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, "LogPotJoined");
      assert.equal(result.logs[0].args.name, name);
      assert.equal(result.logs[0].args.newPlayer, accounts[1]);
    });

    it("emit LogPotJoined & LogPotFull events", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      var result = await instance.joinPot(name, { from: accounts[2], value: 1000 });

      assert.equal(result.logs.length, 2);
      assert.equal(result.logs[0].event, "LogPotJoined");
      assert.equal(result.logs[0].args.name, name);
      assert.equal(result.logs[0].args.newPlayer, accounts[2]);
      assert.equal(result.logs[1].event, "LogPotFull");
      assert.equal(result.logs[1].args.name, name);
    });
  });

  describe("closePot", () => {
    it("fail when pot already closed", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      await instance.closePot(name);

      try {
        await instance.closePot(name);
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is already closed but another close didn't fail");
    });

    it("fail when pot doesn't exists", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      try {
        await instance.closePot(name);
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot doesn't exists but close didn't fail");
    });

    it("fail when close is too early", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      try {
        await instance.closePot(name);
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is too early to close but close didn't fail");
    });

    it("emit LogPotClosed when pot is closed", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      var result = await instance.closePot(name);

      assert.equal(result.logs[0].event, "LogPotClosed");
      assert.equal(result.logs[0].args.name, name);
    });

    it("emit LogPotWinner twice when close is ok", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      var result = await instance.closePot(name);

      var winner1Event = result.logs[1];
      var winner2Event = result.logs[2];

      assert.equal(winner1Event.event, "LogPotWinner");
      assert.equal(winner1Event.args.name, name);
      assert(new Set(accounts.slice(0, 3)).has(winner1Event.args.winner));

      assert.equal(winner2Event.event, "LogPotWinner");
      assert.equal(winner2Event.args.name, name);
      assert(new Set(accounts.slice(0, 3)).has(winner2Event.args.winner));

      assert(winner1Event.args.winner != winner2Event.args.winner);
    });

    it("emit LogPotLoser when close is ok", async () => {
      var instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      var result = await instance.closePot(name);

      var loserEvent = result.logs[3];

      assert.equal(loserEvent.event, "LogPotLoser");
      assert.equal(loserEvent.args.name, name);
      assert(new Set(accounts.slice(0, 3)).has(loserEvent.args.loser));

      assert(loserEvent.args.loser != result.logs[1].args.winner);
      assert(loserEvent.args.loser != result.logs[2].args.winner);
    });
  });
});

async function untilCanClosePot(instance, potName, account) {
  var i = 1;
  while (true) {
    // now we create dummy transactions,
    // closePot needs to wait 2 blocks after last player has joined 
    await instance.createPot(`dummy-${i}`, { from: account, value: 1000 });
    i++;

    if (await instance.canClosePot.call(potName) === true) {
      break;
    }
  }
}
