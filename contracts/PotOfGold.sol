pragma solidity ^0.4.0;
contract PotOfGold {

    struct Pot {
        string name;
        uint buyIn;

        address[] players;
        
        uint lastPlayerBlockNumber; // uint8(uint256(sha3(block.blockhash(lastPlayerBlockNumber+1)))) % 3 == loser index 
        
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

    /*function leavePot(string name) {
        Pot pot = nameToPot[name];
        if(pot.buyIn == 0) throw; // no pot
        if(pot.loser != 0) throw; // pot is over
        if(pot.players.length == 3) throw; // pot is full but waiting for a loser

        if(pot.players[0] != msg.sender && pot.players[1] != msg.sender) throw; // no such player in pot
        
        address[] newPlayers;
        for(uint i = 0; i < pot.players.length; i++){
            if(pot.players[i] != msg.sender){
                newPlayers.push(pot.players[i]);
            }
        }
       
        pot.players = newPlayers;

        msg.sender.send((pot.buyIn * 99) / 100); // leaving fee 1%
    }*/

    function solvePot(string name){
        Pot pot = nameToPot[name];
        if(pot.loser != 0) throw; // pot is over
        if(pot.players.length < 3) throw; // pot not full
        if(block.number <= pot.lastPlayerBlockNumber) throw;
        
        bytes32 blockHash = block.blockhash(pot.lastPlayerBlockNumber + 1);
        if(blockHash == 0) { // pot expired due to hash storage limits - players didn't solve pot
            pot.loser = msg.sender; // doesn't matter, everybody loses a fee
            
            for(uint i = 0; i < pot.players.length; i++){
                pot.players[i].send((pot.buyIn * 99) / 100); // return money minus 1% fee
            }

            return;
        }

        bytes32 potShaResult = sha3(msg.sender, blockHash);
        uint8 loserIndex = uint8(uint256(potShaResult) % 3);

        address winner1 = pot.players[(loserIndex + 1) % 3];
        address winner2 = pot.players[(loserIndex + 2) % 3];

        uint winAmount = ((pot.buyIn * / 2) * 99) / 100;
        uint returnAmount = pot.buyIn + winAmount;

        winner1.send(returnAmount);
        winner2.send(returnAmount);
    }
}
