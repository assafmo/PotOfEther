const PotOfEther = artifacts.require("./PotOfEther.sol");

contract("PotOfEther", accounts => {
  describe("createPot", () => {
    it("fail when buyIn == 0", async () => {
      const instance = await PotOfEther.new();

      try {
        await instance.createPot("banana", { from: accounts[0], value: 0 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty buyIn but didn't fail");
    });

    it("fail when name.length == 0", async () => {
      const instance = await PotOfEther.new();

      try {
        await instance.createPot("", { from: accounts[0], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "empty name but didn't fail");
    });

    it("fail when name already exists", async () => {
      const instance = await PotOfEther.new();
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

    it("reduce creator balance by buyIn", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      const txResult = await instance.createPot(name, { from: accounts[0], value: 1000 });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[0].event, "LogPotCreated");
      assert.equal(txResult.logs[0].args.name, name);
      assert.equal(txResult.logs[0].args.buyIn.valueOf(), 1000);
      assert.equal(txResult.logs[0].args.firstPlayer, accounts[0]);
    });

    it("emit LogPotCreated event", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      const txResult = await instance.createPot(name, { from: accounts[0], value: 1000 });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[0].event, "LogPotCreated");
      assert.equal(txResult.logs[0].args.name, name);
      assert.equal(txResult.logs[0].args.buyIn.valueOf(), 1000);
      assert.equal(txResult.logs[0].args.firstPlayer, accounts[0]);
    });

    it("emit LogPotJoined event", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      const txResult = await instance.createPot(name, { from: accounts[0], value: 1000 });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[1].event, "LogPotJoined");
      assert.equal(txResult.logs[1].args.name, name);
      assert.equal(txResult.logs[1].args.newPlayer, accounts[0]);
    });
  });

  describe("joinPot", () => {
    it("fail when pot doesn't exists", async () => {
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      await instance.closePot(name);

      try {
        await instance.joinPot(name, { from: accounts[3], value: 1000 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is closed but join didn't fail");
    });

    it("fail when pot is full", async () => {
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      const txResult = await instance.joinPot(name, { from: accounts[1], value: 1000 });

      assert.equal(txResult.logs.length, 1);
      assert.equal(txResult.logs[0].event, "LogPotJoined");
      assert.equal(txResult.logs[0].args.name, name);
      assert.equal(txResult.logs[0].args.newPlayer, accounts[1]);
    });

    it("emit LogPotJoined & LogPotFull events", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      const txResult = await instance.joinPot(name, { from: accounts[2], value: 1000 });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[0].event, "LogPotJoined");
      assert.equal(txResult.logs[0].args.name, name);
      assert.equal(txResult.logs[0].args.newPlayer, accounts[2]);
      assert.equal(txResult.logs[1].event, "LogPotFull");
      assert.equal(txResult.logs[1].args.name, name);
    });
  });

  describe("closePot", () => {
    it("fail when pot already closed", async () => {
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
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
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      const txResult = await instance.closePot(name);

      assert.equal(txResult.logs[0].event, "LogPotClosed");
      assert.equal(txResult.logs[0].args.name, name);
    });

    it("emit LogPotWinner twice when close is ok", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      const txResult = await instance.closePot(name);

      const winner1Event = txResult.logs[1];
      const winner2Event = txResult.logs[2];

      assert.equal(winner1Event.event, "LogPotWinner");
      assert.equal(winner1Event.args.name, name);
      assert(new Set(accounts.slice(0, 3)).has(winner1Event.args.winner));

      assert.equal(winner2Event.event, "LogPotWinner");
      assert.equal(winner2Event.args.name, name);
      assert(new Set(accounts.slice(0, 3)).has(winner2Event.args.winner));

      assert(winner1Event.args.winner != winner2Event.args.winner);
    });

    it("emit LogPotLoser when close is ok", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, name, accounts[9]);

      const txResult = await instance.closePot(name);

      const loserEvent = txResult.logs[3];

      assert.equal(loserEvent.event, "LogPotLoser");
      assert.equal(loserEvent.args.name, name);
      assert(new Set(accounts.slice(0, 3)).has(loserEvent.args.loser));

      assert(loserEvent.args.loser != txResult.logs[1].args.winner);
      assert(loserEvent.args.loser != txResult.logs[2].args.winner);
    });

    it("emit LogPotExpired when close is expired", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      await instance.createPot(name, { from: accounts[0], value: 1000 });
      await instance.joinPot(name, { from: accounts[1], value: 1000 });
      await instance.joinPot(name, { from: accounts[2], value: 1000 });

      await untilPotExpires(instance, name, accounts[9]);

      const txResult = await instance.closePot(name);

      const expiresEvent = txResult.logs[1];

      assert.equal(expiresEvent.event, "LogPotExpired");
      assert.equal(expiresEvent.args.name, name);
    });
  });

  describe("withdrawRefund", () => {
    it("refund winners, deduce fee", async () => {
      const instance = await PotOfEther.new();
      const name = "banana";

      const accountToIndex = {};
      accountToIndex[accounts[0]] = 0;
      accountToIndex[accounts[1]] = 1;
      accountToIndex[accounts[2]] = 2;

      const buyIn = 1000;

      await instance.createPot(name, { from: accounts[0], value: buyIn, gasPrice: 1 });
      await instance.joinPot(name, { from: accounts[1], value: buyIn, gasPrice: 1 });
      await instance.joinPot(name, { from: accounts[2], value: buyIn, gasPrice: 1 });

      await untilCanClosePot(instance, name, accounts[9]);

      const txResult = await instance.closePot(name, { from: accounts[9] });

      const winner1Index = accountToIndex[txResult.logs[1].args.winner];
      const winner2Index = accountToIndex[txResult.logs[2].args.winner];

      for (let i of [winner1Index, winner2Index]) {
        const beforeRefund = web3.eth.getBalance(accounts[i]).toNumber();
        const txResult = await instance.withdrawRefund({ from: accounts[i], gasPrice: 1 });

        const afterRefundShoudBe = beforeRefund -
          txResult.receipt.gasUsed +
          buyIn +
          Math.floor(Math.floor(Math.floor(buyIn / 2) * 99) / 100); //0.5 buyIn - 1% fee (no floats in solidity)

        assert.equal(afterRefundShoudBe, web3.eth.getBalance(accounts[i]).toNumber());
      }
    });
  });
});

async function untilCanClosePot(instance, potName, account) {
  let i = 1;
  while (true) {
    // now we create dummy transactions,
    // closePot needs to wait 2 blocks after last player has joined 
    await instance.createPot(`dummy-${i}`, { from: account, value: 1 });
    i++;

    if (await instance.canClosePot.call(potName) === true) {
      break;
    }
  }
}

async function untilPotExpires(instance, potName, account) {
  for (let i = 0; i < 257; i++) {
    // now we create dummy transactions,
    // we need to wait 257 blocks after last player has joined
    // this is due to hash storage limits
    // solidity can get hash of only last 256 blocks (not including the current one)
    await instance.createPot(`dummy-${i}`, { from: account, value: 1 });
  }
}
