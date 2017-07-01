const PotOfEther = artifacts.require("./PotOfEther.sol");
PotOfEther.deployed().then(x => console.log(x.address));

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
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });

      try {
        await instance.createPot(potName, { from: accounts[0], value: buyIn });
      } catch (err) {
        assert(true);
        return;
      }

      assert(false, "two pots with same name but didn't fail");
    });

    it("emit LogPotCreated event", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      const txResult = await instance.createPot(potName, { from: accounts[0], value: 1000 });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[0].event, "LogPotCreated");
      assert.equal(txResult.logs[0].args.name, potName);
      assert.equal(txResult.logs[0].args.buyIn.toNumber(), 1000);
    });

    it("emit LogPotJoined event", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      const txResult = await instance.createPot(potName, { from: accounts[0], value: buyIn });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[1].event, "LogPotJoined");
      assert.equal(txResult.logs[1].args.name, potName);
      assert.equal(txResult.logs[1].args.newPlayer, accounts[0]);
      assert.equal(txResult.logs[1].args.buyIn.toNumber(), buyIn);
    });
  });

  describe("joinPot", () => {
    it("fail when pot doesn't exists", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      try {
        await instance.joinPot(potName, { from: accounts[0], value: 0 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot doesn't exists but didn't fail");
    });

    it("fail when pot is closed", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      await untilCanClosePot(instance, potName, accounts[9]);

      await instance.closePot(potName);

      try {
        await instance.joinPot(potName, { from: accounts[3], value: buyIn });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is closed but join didn't fail");
    });

    it("fail when pot is full", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      try {
        await instance.joinPot(potName, { from: accounts[3], value: buyIn });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is full but join didn't fail");
    });

    it("fail when wrong buyIn", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      await instance.createPot(potName, { from: accounts[0], value: 1000 });

      try {
        await instance.joinPot(potName, { from: accounts[1], value: 1001 });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "join with wrong buyIn didn't fail");
    });

    it("fail when creator entering first and second", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });

      try {
        await instance.joinPot(potName, { from: accounts[0], value: buyIn });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "creator joined twice but didn't fail");
    });

    it("fail when creator entering first and third", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });

      try {
        await instance.joinPot(potName, { from: accounts[0], value: buyIn });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "creator joined twice but didn't fail");
    });

    it("fail when player entering second and third", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });

      try {
        await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "same player joined twice but didn't fail");
    });

    it("emit LogPotJoined event", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      const txResult = await instance.joinPot(potName, { from: accounts[1], value: buyIn });

      assert.equal(txResult.logs.length, 1);
      assert.equal(txResult.logs[0].event, "LogPotJoined");
      assert.equal(txResult.logs[0].args.name, potName);
      assert.equal(txResult.logs[0].args.newPlayer, accounts[1]);
      assert.equal(txResult.logs[0].args.buyIn.toNumber(), buyIn);

    });

    it("emit LogPotJoined & LogPotFull events", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      const txResult = await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      assert.equal(txResult.logs.length, 2);
      assert.equal(txResult.logs[0].event, "LogPotJoined");
      assert.equal(txResult.logs[0].args.name, potName);
      assert.equal(txResult.logs[0].args.newPlayer, accounts[2]);
      assert.equal(txResult.logs[0].args.buyIn.toNumber(), buyIn);
      assert.equal(txResult.logs[1].event, "LogPotFull");
      assert.equal(txResult.logs[1].args.name, potName);
    });
  });

  describe("closePot", () => {
    it("fail when pot already closed", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      await instance.createPot(potName, { from: accounts[0], value: 1000 });
      await instance.joinPot(potName, { from: accounts[1], value: 1000 });
      await instance.joinPot(potName, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, potName, accounts[9]);

      await instance.closePot(potName);

      try {
        await instance.closePot(potName);
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is already closed but another close didn't fail");
    });

    it("fail when pot doesn't exists", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      try {
        await instance.closePot(potName);
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot doesn't exists but close didn't fail");
    });

    it("fail when close is too early", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      await instance.createPot(potName, { from: accounts[0], value: 1000 });
      await instance.joinPot(potName, { from: accounts[1], value: 1000 });
      await instance.joinPot(potName, { from: accounts[2], value: 1000 });

      try {
        await instance.closePot(potName);
      } catch (err) {
        assert(true);
        return;
      }
      assert(false, "pot is too early to close but close didn't fail");
    });

    it("emit LogPotClosed when pot is closed", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      await instance.createPot(potName, { from: accounts[0], value: 1000 });
      await instance.joinPot(potName, { from: accounts[1], value: 1000 });
      await instance.joinPot(potName, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, potName, accounts[9]);

      const txResult = await instance.closePot(potName);

      assert.equal(txResult.logs[0].event, "LogPotClosed");
      assert.equal(txResult.logs[0].args.name, potName);
    });

    it("emit LogPotWinner twice when close is ok", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      await untilCanClosePot(instance, potName, accounts[9]);

      const txResult = await instance.closePot(potName);

      const winner1Event = txResult.logs[1];
      const winner2Event = txResult.logs[2];

      assert.equal(winner1Event.event, "LogPotWinner");
      assert.equal(winner1Event.args.name, potName);
      assert.equal(winner1Event.args.refundAmount, buyInToRefund(buyIn));
      assert(new Set(accounts.slice(0, 3)).has(winner1Event.args.winner));

      assert.equal(winner2Event.event, "LogPotWinner");
      assert.equal(winner2Event.args.name, potName);
      assert.equal(winner2Event.args.refundAmount, buyInToRefund(buyIn));
      assert(new Set(accounts.slice(0, 3)).has(winner2Event.args.winner));

      assert(winner1Event.args.winner != winner2Event.args.winner);
    });

    it("emit LogPotLoser when close is ok", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      await instance.createPot(potName, { from: accounts[0], value: 1000 });
      await instance.joinPot(potName, { from: accounts[1], value: 1000 });
      await instance.joinPot(potName, { from: accounts[2], value: 1000 });

      await untilCanClosePot(instance, potName, accounts[9]);

      const txResult = await instance.closePot(potName);

      const loserEvent = txResult.logs[3];

      assert.equal(loserEvent.event, "LogPotLoser");
      assert.equal(loserEvent.args.name, potName);
      assert(new Set(accounts.slice(0, 3)).has(loserEvent.args.loser));

      assert(loserEvent.args.loser != txResult.logs[1].args.winner);
      assert(loserEvent.args.loser != txResult.logs[2].args.winner);
    });

    it("emit LogPotExpired when close is expired", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      await instance.createPot(potName, { from: accounts[0], value: 1000 });
      await instance.joinPot(potName, { from: accounts[1], value: 1000 });
      await instance.joinPot(potName, { from: accounts[2], value: 1000 });

      await untilPotExpires(instance, potName, accounts[9]);

      const txResult = await instance.closePot(potName);

      const expiresEvent = txResult.logs[1];

      assert.equal(expiresEvent.event, "LogPotExpired");
      assert.equal(expiresEvent.args.name, potName);
    });
  });

  describe("withdrawRefund", () => {
    it("refund winners, minus fee", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      const accountToIndex = {};
      accountToIndex[accounts[0]] = 0;
      accountToIndex[accounts[1]] = 1;
      accountToIndex[accounts[2]] = 2;

      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      await untilCanClosePot(instance, potName, accounts[9]);

      const txResult = await instance.closePot(potName, { from: accounts[9] });

      const winner1Index = accountToIndex[txResult.logs[1].args.winner];
      const winner2Index = accountToIndex[txResult.logs[2].args.winner];

      for (let i of [winner1Index, winner2Index]) {
        const txResult = await instance.withdrawRefund({ from: accounts[i] });

        const refundShoudBe = buyInToRefund(buyIn);

        const refundEvent = txResult.logs[0];

        assert.equal(refundEvent.event, "LogAccountRefund");
        assert.equal(refundEvent.args.account, accounts[i]);
        assert.equal(refundEvent.args.refundAmount, refundShoudBe);
      }
    });

    it("zero refund for account with zero refund", async () => {
      const instance = await PotOfEther.new();

      const txResult = await instance.withdrawRefund({ from: accounts[0] });
      const refundEvent = txResult.logs[0];

      assert.equal(refundEvent.event, "LogAccountRefund");
      assert.equal(refundEvent.args.account, accounts[0]);
      assert.equal(refundEvent.args.refundAmount, 0);
    });

    it("zero refund for loser", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";

      const accountToIndex = {};
      accountToIndex[accounts[0]] = 0;
      accountToIndex[accounts[1]] = 1;
      accountToIndex[accounts[2]] = 2;

      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      await untilCanClosePot(instance, potName, accounts[9]);

      const closeTxResult = await instance.closePot(potName, { from: accounts[9] });
      const loserIndex = accountToIndex[closeTxResult.logs[3].args.loser];

      const withdrawTxResult = await instance.withdrawRefund({ from: accounts[loserIndex] });
      const refundEvent = withdrawTxResult.logs[0];

      assert.equal(refundEvent.event, "LogAccountRefund");
      assert.equal(refundEvent.args.account, accounts[loserIndex]);
      assert.equal(refundEvent.args.refundAmount, 0);
    });
  });

  describe("availableOwnerWithdraw", () => {
    it("zero on init", async () => {
      const instance = await PotOfEther.new();
      assert.equal((await instance.availableOwnerWithdraw.call()).toNumber(), 0);
    });

    it("zero after pot creation", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });

      assert.equal((await instance.availableOwnerWithdraw.call()).toNumber(), 0);
    });

    it("zero after pot join", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });

      assert.equal((await instance.availableOwnerWithdraw.call()).toNumber(), 0);
    });

    it("zero while pot is open", async () => {
      const instance = await PotOfEther.new();
      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      assert.equal((await instance.availableOwnerWithdraw.call()).toNumber(), 0);
    });

    it("1% of winnins after pot close", async () => {
      const instance = await PotOfEther.new();
      const before = (await instance.availableOwnerWithdraw.call()).toNumber();

      const potName = "banana";
      const buyIn = 1000;

      await instance.createPot(potName, { from: accounts[0], value: buyIn });
      await instance.joinPot(potName, { from: accounts[1], value: buyIn });
      await instance.joinPot(potName, { from: accounts[2], value: buyIn });

      await untilCanClosePot(instance, potName, accounts[9]);

      await instance.closePot(potName, { from: accounts[9] });

      const after = (await instance.availableOwnerWithdraw.call()).toNumber();

      assert.equal(after - before, buyInToFee(buyIn));
    });
  });
});

//1% fee (no floats in solidity)
function buyInToFee(buyIn) {
  return buyIn - Math.floor(Math.floor(buyIn * 99) / 100);
}

//buyIn + 0.5*buyIn - 1% fee (no floats in solidity)
function buyInToRefund(buyIn) {
  return buyIn + Math.floor(Math.floor(Math.floor(buyIn / 2) * 99) / 100);
}

// closePot needs to wait 2 blocks after last player has joined 
// so we'll create dummy transactions,
async function untilCanClosePot(instance, potName, account) {
  while (true) {
    await instance.ownerWithdraw();

    if (await instance.canClosePot.call(potName) === true) {
      break;
    }
  }
}

// we need to wait 257 blocks after last player has joined
// this is due to hash storage limits
// solidity can get hash of only last 256 blocks (not including the current one)
// so we'll create dummy transactions
async function untilPotExpires(instance, potName, account) {
  for (let i = 0; i < 257; i++) {
    await instance.ownerWithdraw();
  }
}
