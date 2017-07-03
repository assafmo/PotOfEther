import React from 'react';
import { render } from 'react-dom';
import { Tabs, Tab, Table } from 'react-bootstrap';

// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545 "));
// web3.eth.defaultAccount = web3.eth.accounts[0];

// const abiArray = [{ "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "joinPot", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawRefund", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalPendingRefunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "ownerWithdraw", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "name", "type": "string" }], "name": "canClosePot", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "PotOfGold", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "availableOwnerWithdraw", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "closePot", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "refunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "createPot", "outputs": [], "payable": true, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "buyIn", "type": "uint256" }, { "indexed": true, "name": "firstPlayer", "type": "address" }], "name": "LogPotCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "newPlayer", "type": "address" }], "name": "LogPotJoined", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotFull", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotExpired", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotClosed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "winner", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogPotWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "loser", "type": "address" }], "name": "LogPotLoser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogAccountRefund", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "totalPendingRefunds", "type": "uint256" }], "name": "log", "type": "event" }];
// const potOfEther = web3.eth
//     .contract(abiArray)
//     .at('0x7d4c43c7a49c7f022986e274193e1aa205fc6cbd');

// potOfEther.createPot("papaya" + Date.now(), { value: 54654654, gas: 2000000 })

class App extends React.Component {
    render() {
        return <div style={{ padding: 10 }}>
            <Header />
            <AccountGamesInfo />
            <MainBody />
        </div>
    }
}

class Header extends React.Component {
    render() {
        return <div>Pot of Ether</div>;
    }
}

class AccountGamesInfo extends React.Component {
    render() {
        return <center>
            Games played, Ether wagered, Ether won, Ether pending...
        </center>
    }
}

class About extends React.Component {
    render() {
        return <div>
            Three players fill a pot with Ether, one of them will leave empty handed.
        </div>

    }
}

class PlayTab extends React.Component {
    render() {
        return <div style={{ padding: 10 }}>
            <Table striped bordered condensed hover style={{ margin: "auto" }}>
                <thead>
                    <tr>
                        <th>Pot name</th>
                        <th>Players</th>
                        <th>Buy in (Ether)</th>
                        <th>Potential profit</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        [1, '1 out of 3', 1.123, 4],
                        [5, '2 out of 3', 11.23, 8],
                        [9, '1 out of 3', , 3.123, 12]
                    ]
                        .map((row, i) => <tr key={i}>{row.map(col => <td key={col}>{col}</td>)}</tr>)}
                </tbody>
            </Table>
        </div>
    }
}
class MainBody extends React.Component {
    render() {
        return <Tabs defaultActiveKey={1} id="main-tabs">
            <Tab eventKey={1} title="Play">
                <PlayTab />
            </Tab>
            <Tab eventKey={2} title="Your games">
                Tab 1 content
            </Tab>
            <Tab eventKey={3} title="Games History">
                Tab 2 content
            </Tab>
            <Tab eventKey={4} title="About">
                <About />
            </Tab>
            <Tab eventKey={5} title="Terms of service">
                ToS
            </Tab>
        </Tabs>
    }
}


render(<App />, document.getElementById('app'));
