import React from 'react';
import { render } from 'react-dom';

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[7];

const contractAbiArray = [{ "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "joinPot", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawRefund", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalPendingRefunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "ownerWithdraw", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "name", "type": "string" }], "name": "canClosePot", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "PotOfGold", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "availableOwnerWithdraw", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "closePot", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "refunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "createPot", "outputs": [], "payable": true, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "buyIn", "type": "uint256" }, { "indexed": true, "name": "firstPlayer", "type": "address" }], "name": "LogPotCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "newPlayer", "type": "address" }], "name": "LogPotJoined", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotFull", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotExpired", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotClosed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "winner", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogPotWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "loser", "type": "address" }], "name": "LogPotLoser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogAccountRefund", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "totalPendingRefunds", "type": "uint256" }], "name": "log", "type": "event" }];
const contractAddress = '0x97b023c084bcfcf51ae14163df602446f5b0476f';

const potOfEther = web3.eth.contract(contractAbiArray).at(contractAddress);
potOfEther.createPot("papaya" + Date.now(), { value: 1054535400, gas: 2000000 })

class App extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <AccountInfoPanel />
            </div>
        );
    }
}

class Header extends React.Component {
    render() {
        return <h1>Pot of Ether</h1>;
    }
}

class AccountInfoPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pots: [] };
    }

    componentDidMount() {
        potOfEther.LogPotJoined(null, { fromBlock: 0 }, (err, event) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log(event);

            if (event.args.newPlayer !== web3.eth.defaultAccount)
                return;

            this.setState({
                pots: this.state.pots.concat({
                    name: event.args.name,
                    buyIn: event.args.buyIn,
                    status: 'open'
                }),
            });
        });
    }

    render() {
        const etherWagered = this.state.pots.map(p => p.buyIn).reduce((a, b) => a + b, 0);
        const etherPending = 0;
        const etherWon = 0;

        return (
            <div>
                <h4>Pots played: {this.state.pots.length}</h4>
                <h4>Ether wagered: {etherWagered}</h4>
                <h4>Ether pending: {etherPending}</h4>
                <h4>Ether won: {etherWon}</h4>
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));
