pragma solidity ^0.4.11;
contract PotOfGold {

    struct Pot {
        string name;
        uint buyIn;

        address[] players;
        
        uint lastPlayerBlockNumber; // uint8(uint256(sha3(block.blockhash(lastPlayerBlockNumber+1)))) % 3 == loser index 
        
        address loser;
    }
    
    address public owner;
    
    Pot[] allPots;
    mapping(string => Pot) nameToPot;
    
    event newPot(string name, uint buyIn, address creatorPlayer);
    event potJoin(string name, address newPlayer);
    event potFull(string name);
    event potExpired(string name);
    event potClosed(string name, address loser);
    event playerWon(address player, uint amount); 

    function PotOfGold() {
        owner = msg.sender;
    }

    function ownerWithdraw(){
        require(msg.sender == owner);

        int toWithdraw = int(this.balance - 100 finney); // leave 0.1 ether for gas (?) 
        require(toWithdraw > 0);

        owner.transfer(uint(toWithdraw));
    }

    function createPot(string name) payable {
        require(msg.value > 0); // must bet something
        require(bytes(name).length > 0); // name mustn't be empty 
        require(nameToPot[name].buyIn == 0); // there isn't already a pot with this name 

        Pot pot = nameToPot[name];
        pot.name = name;
        pot.buyIn = msg.value;
        pot.players.push(msg.sender);

        allPots.push(pot);

        newPot(name, msg.value, msg.sender);
    }

    function joinPot(string name) payable {
        Pot pot = nameToPot[name];
        require(pot.buyIn > 0); // pot exists
        require(pot.loser == 0); // pot isn't over
        require(pot.players.length < 3); // pot isn't full
        require(msg.value == pot.buyIn); // must pay buyIn amount
        require(pot.players[0] != msg.sender && pot.players[1] != msg.sender);

        pot.players.push(msg.sender);
        if(pot.players.length == 3){
            pot.lastPlayerBlockNumber = block.number;
            potFull(name);
        }

        potJoin(name, msg.sender);
    }

    function solvePot(string name){
        Pot pot = nameToPot[name];
        require(pot.loser == 0); // pot isn't over
        require(pot.players.length == 3); // pot full
        require(block.number > pot.lastPlayerBlockNumber);
        
        bytes32 blockHash = block.blockhash(pot.lastPlayerBlockNumber + 1);
        if(blockHash == 0) { // pot expired due to hash storage limits - players didn't solve pot
            require(pot.loser == 0); // need this?
            pot.loser = msg.sender; // doesn't matter, everybody loses a fee
            
            for(uint i = 0; i < pot.players.length; i++){
                pot.players[i].transfer((pot.buyIn * 99) / 100); // return money minus 1% fee
            }

            potExpired(name);
            return;
        }

        bytes32 potShaResult = sha3(msg.sender, blockHash);
        uint8 loserIndex = uint8(uint256(potShaResult) % 3);

        require(pot.loser == 0); // need this?
        pot.loser = pot.players[loserIndex];

        address winner1 = pot.players[(loserIndex + 1) % 3];
        address winner2 = pot.players[(loserIndex + 2) % 3];

        uint winAmount = ((pot.buyIn / 2) * 99) / 100;
        uint returnAmount = pot.buyIn + winAmount;

        winner1.transfer(returnAmount);
        playerWon(winner1, winAmount);

        winner2.transfer(returnAmount);
        playerWon(winner2, winAmount);

        potClosed(name, pot.loser);
    }
}
