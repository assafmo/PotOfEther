import React from 'react';
import { render } from 'react-dom';
import { Tabs, Tab, Table, Button, Panel } from 'react-bootstrap';

// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545 "));
// web3.eth.defaultAccount = web3.eth.accounts[0];

// const abiArray = [{ "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "joinPot", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawRefund", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalPendingRefunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "ownerWithdraw", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "name", "type": "string" }], "name": "canClosePot", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "PotOfGold", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "availableOwnerWithdraw", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "closePot", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "refunds", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "createPot", "outputs": [], "payable": true, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "buyIn", "type": "uint256" }, { "indexed": true, "name": "firstPlayer", "type": "address" }], "name": "LogPotCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "newPlayer", "type": "address" }], "name": "LogPotJoined", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotFull", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotExpired", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }], "name": "LogPotClosed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "winner", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogPotWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "name", "type": "string" }, { "indexed": true, "name": "loser", "type": "address" }], "name": "LogPotLoser", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "account", "type": "address" }, { "indexed": false, "name": "refundAmount", "type": "uint256" }], "name": "LogAccountRefund", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "balance", "type": "uint256" }, { "indexed": false, "name": "totalPendingRefunds", "type": "uint256" }], "name": "log", "type": "event" }];
// const potOfEther = web3.eth
//     .contract(abiArray)
//     .at('0x7d4c43c7a49c7f022986e274193e1aa205fc6cbd');

// potOfEther.createPot("papaya" + Date.now(), { value: 54654654, gas: 2000000 })

class App extends React.Component {
    render() {
        return <div >
            <About />
            <div style={{ padding: 10 }}>
                <AccountGamesInfo />
                <MainBody />
            </div>
        </div>
    }
}

class AccountGamesInfo extends React.Component {
    render() {
        return <div className="center">
            Games played, Wagered, Profit, Pending...
        </div>
    }
}

class About extends React.Component {
    render() {
        return <div className="center" style={{ fontSize: "x-large" }}>
            <div>
                Three players fill a pot with Ether. One of them will leave empty handed.
            </div>
            <div>
                Provably Fair, No accounts, No deposits.
            </div>
        </div>

    }
}

class PlayTab extends React.Component {
    render() {
        const mockBuyIn = 1.215646;
        const mockProfit = mockBuyIn * 0.5 - mockBuyIn * 0.01;
        return <div style={{ padding: 10 }}>
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        {['Pot name',
                            'Buy in (ETH)',
                            'Potential profit (ETH)',
                            'Players (Date joined)',
                            'Join pot']
                            .map((header, idx) => <th key={idx} style={{ verticalAlign: 'middle' }}>
                                <div className="center">
                                    {header}
                                </div>
                            </th>)}
                    </tr>
                </thead>
                <tbody>
                    {[
                        ['banana', mockBuyIn, mockProfit, [{ account: '0xe04969173ccbbd8ab40c33b0d3868d9e6131cfa3', date: new Date() }], null],
                        ['papaya', mockBuyIn, mockProfit, [{ account: '0xe04969173ccbbd8ab40c33b0d3868d9e6131cfa3', date: new Date() }, { account: '0xe04969173ccbbd8ab40c33b0d3868d9e6131cfa3', date: new Date() }], null],
                        ['/dev/null', mockBuyIn, mockProfit, [{ account: '0xe04969173ccbbd8ab40c33b0d3868d9e6131cfa3', date: new Date() }], null]
                    ]
                        .map((row, i) => <tr key={i}>
                            {row.map(col => <td key={col} style={{ verticalAlign: 'middle' }}>
                                <div className="center">
                                    {col ? (Array.isArray(col) ?
                                        col.map(x => <div>{x.account} ({x.date.toJSON()})</div>)
                                        : col) : <Button bsStyle="success">Join</Button>}
                                </div>
                            </td>)}
                        </tr>)}
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
                Tab 2 content
            </Tab>
            <Tab eventKey={3} title="Games History">
                Tab 2 content
            </Tab>
            <Tab eventKey={4} title="Terms of service">
                <div style={{ padding: 10, fontSize: 'large' }}>
                    <div className="center">
                        <h2>DISCLAIMER</h2>
                        <p>Pot of Ether is an alph software on the experimental Ethereum blockchain and peer-to-peer network. By accessing the PotOfEther.com site you are agreeing to the following terms and any other terms or conditions that may be imposed from time to time.</p>
                        <p>Pot of Ether accepts no responsibility or liability for any losses which may be incurred by any person or persons using the whole or part of the contents of the information, systems, plans, methods, and games contained herein and shown on this site. Use the information provided on the PotOfEther.com site at your own risk.</p>
                        <p>Although Pot of Ether may show an address for decentralised application, we accept no responsibility for anything which may or may not occur through any dealings you have through interaction with that decentralised application on the blockchain.</p>
                        <p>It is your responsibility to satisfy yourself that all decentralised applications that you deal with have a good code-base and will function correctly and as verified.</p>
                        <p>No gambling occurs on the PotOfEther.com Website. Pot of Ether is not a casino. Only addresses for decentralised gambling games stored as decentralised ethereum applications are provided on the website for convenience.</p>
                        <p>Pot of Ether does not promote or encourage illegal or underage gambling, or gambling to persons who reside in jurisdictions where gambling is considered unlawful. In those instances, this site is presented for informational and entertainment purposes only.</p>
                        <p>By entering PotOfEther.com and using the Pot of Ether service you agree that you are aware of the terms outlined herein.</p>
                    </div>
                </div>
            </Tab>
        </Tabs>
    }
}


render(<App />, document.getElementById('app'));
