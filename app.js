'use strict';
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[7];

var contractAbiArray = [{ "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "joinPot", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawRefund", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalPendingRefunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "ownerWithdraw", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "name", "type": "string" }], "name": "canClosePot", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "PotOfGold", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "availableOwnerWithdraw", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "closePot", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "refunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "createPot", "outputs": [], "payable": true, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "buyIn", "type": "uint256" }, { "indexed": true, "name": "firstPlayer", "type": "address" }], "name": "LogPotCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "newPlayer", "type": "address" }], "name": "LogPotJoined", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotFull", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotExpired", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotClosed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "winner", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogPotWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "loser", "type": "address" }], "name": "LogPotLoser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogAccountRefund", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "totalPendingRefunds", "type": "uint256" }], "name": "log", "type": "event" }];
var contractAddress = '0x313d54d71573d720ca0fa0295149fe2bd08372d2';

var instance = web3.eth.contract(contractAbiArray).at(contractAddress);

var pots = {};
var myPots = [];

instance.LogPotCreated(null, { fromBlock: 0 }, function (err, event) {
    pots[event.args.name] = {
        name: event.args.name,
        buyIn: event.args.buyIn.toNumber(),
        players: [],
        winners: []
    }
});

instance.LogPotJoined(null, { fromBlock: 0 }, function (err, event) {
    pots[event.args.name].players.push(event.args.newPlayer);

    if (event.args.newPlayer === web3.eth.defaultAccount) {
        myPots.push(event.args.name);

        document.getElementById('pots-played').innerText = myPots.length;

        document.getElementById('ether-wagered').innerText = web3.fromWei(
            myPots
                .map(function (name) { return pots[name].buyIn })
                .reduce(function (a, b) { return a + b }, 0)
            , 'ether');

        document.getElementById('ether-pending').innerText = web3.fromWei(
            myPots
                .filter(function (name) { return !pots[name].winners.length })
                .map(function (name) { return pots[name].buyIn })
                .reduce(function (a, b) { return a + b }, 0)
            , 'ether');


    }
});

instance.LogPotFull(null, function (err, event) { console.log(event.event, event.args); })
instance.LogPotExpired(null, function (err, event) { console.log(event.event, event.args); })
instance.LogPotClosed(null, function (err, event) { console.log(event.event, event.args); })
instance.LogPotWinner(null, function (err, event) { console.log(event.event, event.args); })
instance.LogPotLoser(null, function (err, event) { console.log(event.event, event.args); })
instance.LogAccountRefund(null, function (err, event) {
    console.log(event.event, event.args);

    if (event.args.account === web3.eth.defaultAccount) {
        document.getElementById('ether-won').innerText += web3.fromWei(event.args.refundAmount, 'ether');
    }
})

instance.createPot("papaya" + Date.now(), { value: 1054535400, gas: 2000000 })