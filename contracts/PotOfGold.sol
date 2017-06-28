pragma solidity ^0.4.0;
contract PotOfGold {

    struct Pot {
        string name;
        uint buyIn;

        address[] players;
        
        uint lastPlayerBlockNumber; // uint8(uint256(sha3(block.blockhash(lastJoinerBlockNumber+1)))) % 3 == loser index 
        
        address loser;
    }
    
    address owner;
    
    Pot[] allPots;
    mapping(address => Pot[]) playerToPots;
    mapping(string => Pot) nameToPot;
    
    function PotOfGold() {
        owner = msg.sender;
    }

    function ownerWithdraw(){
        if(msg.sender != owner) throw;

        int toWithdraw = this.balance - 100 finney; // leave 0.1 ether for gas (?) 
        if(toWithdraw < 0) throw;

        owner.send(toWithdraw);
    }

    function getMyPots() constant returns (Pot[]){
        return playerToPots(msg.sender);
    }

    function getAllPots() constant returns (Pot[]){
        return allPots;
    }

    function getPot(string name) constant returns (Pot){
        return nameToPot[name];
    }

    function createPot(string name, uint buyIn) {
        if(buyIn == 0) throw; // must bet something
        if(bytes(name).length == 0) throw; // name mustn't be empty 
        if(nameToPot[name].buyIn != 0) throw; // there's already a pot with this name 

        Pot pot = nameToPot[name];
        pot.name = name;
        pot.buyIn = buyIn;
        pot.players.push(msg.sender);
        pot.buyIn = buyIn;

        allPots.push(pot);
        playerToPots[msg.sender].push(pot);
    }

    function joinPot(string name) {
        Pot pot = nameToPot[name];
        if(pot.buyIn == 0) throw; // no pot
        if(pot.loser != 0) throw; // pot is over
        if(pot.players.length == 3) throw; // pot is full but waiting for a loser
        if(msg.value != pot.buyIn) throw; // must bet buyin amount
       
        pot.players.push(msg.sender);
        if(pot.players.length == 3){
           pot.lastPlayerBlockNumber = block.number;
        }
    }

    function solvePot(string name){
        Pot pot = nameToPot[name];
        if(pot.loser != 0) throw; // pot is over
        if(pot.players.length < 3) throw; // pot not full
        if(block.number - 256 > pot.lastPlayerBlockNumber) throw; // pot expired - players didn't solve pot - money stays (this is due to hash storage limits - http://solidity.readthedocs.io/en/latest/units-and-global-variables.html#block-and-transaction-properties)
        if(block.number <= pot.lastPlayerBlockNumber) throw;

uint8(uint256(sha3(block.blockhash(lastJoinerBlockNumber+1)))) % 3 == loser index
    }
}
