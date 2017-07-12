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
                                        col.map((x, idx) => <div key={idx}>{x.account} ({x.date.toJSON()})</div>)
                                        : col) : <Button bsStyle="success">Join</Button>}
                                </div>
                            </td>)}
                        </tr>)}
                </tbody>
            </Table>
        </div>
    }
}

class TermsOfService extends React.Component {
    render() {
        return <div style={{ padding: 10, fontSize: 'large' }}>
            <div className="center">
                <h2>DISCLAIMER</h2>
                <p>PotOfEther is an alph software on the experimental Ethereum blockchain and peer-to-peer network. By accessing the PotOfEther.com site you are agreeing to the following terms and any other terms or conditions that may be imposed from time to time.</p>
                <p>PotOfEther accepts no responsibility or liability for any losses which may be incurred by any person or persons using the whole or part of the contents of the information, systems, plans, methods, and games contained herein and shown on this site. Use the information provided on the PotOfEther.com site at your own risk.</p>
                <p>Although PotOfEther may show an address for decentralised application, we accept no responsibility for anything which may or may not occur through any dealings you have through interaction with that decentralised application on the blockchain.</p>
                <p>It is your responsibility to satisfy yourself that all decentralised applications that you deal with have a good code-base and will function correctly and as verified.</p>
                <p>No gambling occurs on the PotOfEther.com Website. PotOfEther is not a casino. Only addresses for decentralised gambling games stored as decentralised Ethereum applications are provided on the website for convenience.</p>
                <p>PotOfEther does not promote or encourage illegal or underage gambling, or gambling to persons who reside in jurisdictions where gambling is considered unlawful. In those instances, this site is presented for informational and entertainment purposes only.</p>
                <p>By entering PotOfEther.com and using the PotOfEther service you agree that you are aware of the terms outlined herein.</p>
            </div>
        </div>
    }
}

class FAQ extends React.Component {
    render() {
        return <div style={{ padding: 10 }}>
            <h4><b>What is this?</b></h4>
            PotOfEther is a distributed application written as a smart contract and powered by the Ethereum blockchain.
            <h4><b>What is a pot?</b></h4>
            A pot is a game between 3 players. It is created with a buy-in amount, and each player must pay the buy-in in order to participate. After the third player had joined the game, two winners are chosen at random and they split the loser's buy-in between them. <b>Therefore, in each game a player has 66.67% chance of winnig 50% of the buy-in.</b>
            <h4><b>Do I need an account?</b></h4>
            No. Your sending address is your account. You can track all your games under "Your games" section.
            <h4><b>How much does it cost to play?</b></h4>
            PotOfEther takes 1% fee from your winnigs. For example, if you win a pot with a buy-in of 1 ETH, you profit 0.495 ETH and PotOfEther gets 0.005 ETH.
            <h4><b>When can a pot be closed?</b></h4>
            A pot can be closed two blocks after the last player had joined the game, which is roughly 1-2 minutes. Also a pot must be closed less then 256 blocks after the last player had joined. This is due to Ethereum blockhash storage limits. If a pot is closed later then 256 blocks (roughly 2 hours) after the last player had joined, PotOfEther refunds each player the buy-in minus 1% fee.
            <h4><b>Who can close a pot?</b></h4>
            Anyone. PotOfEther is a distributed application powered by the Ethereum blockchain, therefore is has no servers and cannot know when to close a pot. One of the players must close the pot.
            <h4><b>How winners are decided?</b></h4>
            PotOfEther uses the blockhash of the block following the last player's entrance to the game in order to determine the winners.
            <h4><b>What about miners cheating?</b></h4>
            It is not worth to cheat as a miner when a pot's profit is less then 4.375 ETH. <b>Therefore it is not advisable to join a pot with a buy-in amount lager than 8.75 ETH.</b>
            <h4><b>What is the contact's address?</b></h4>
            <ul>
                <li>MainNet - XXXXXXXXXXXX</li>
                <li>TestNet - XXXXXXXXXXXX</li>
                <li>MainNet - XXXXXXXXXXXX</li>
                <li>MainNet - XXXXXXXXXXXX</li>
                <li>MainNet - XXXXXXXXXXXX</li>
            </ul>
            <h4><b>Who owns PotOfEther?</b></h4>
            PotOfEther lives in the Ethereum blockchain and has no owners.
            <h4><b>How can I contact the site's manager?</b></h4>
            <a href="mailto:potofether@gmail.com" target="_blank">potofether@gmail.com</a>
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
                <PlayTab />
            </Tab>
            <Tab eventKey={3} title="Games History">
                <PlayTab />
            </Tab>
            <Tab eventKey={4} title="FAQ">
                <FAQ />
            </Tab>
            <Tab eventKey={5} title="Terms of service">
                <TermsOfService />
            </Tab>
        </Tabs>
    }
}


render(<App />, document.getElementById('app'));
