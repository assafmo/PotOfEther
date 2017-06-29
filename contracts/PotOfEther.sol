pragma solidity ^0.4.11;
contract PotOfEther {

    struct Pot {
        string name;
        uint buyIn;

        address[] players;
        
        uint lastPlayerBlockNumber;
        
        bool isOpen;
    }
    
    address public owner;
    
    mapping(string => Pot) nameToPot;
    mapping(address => uint) refunds;
    uint totalRefunds;
    
    
    event newPot(string name, uint buyIn, address creatorPlayer);
    event potJoin(string name, address newPlayer);
    event potFull(string name);
    event potExpired(string name);
    event potClosed(string name, address winner1, address winner2, address loser);

    function PotOfGold() {
        owner = msg.sender;
    }

    function getTotal() constant returns (uint){
        require(msg.sender == owner);

        return this.balance - totalRefunds;
    }

    function ownerWithdraw(){
        require(msg.sender == owner);

        int toWithdraw = int(this.balance) - int(100 finney) - int(totalRefunds); // leave 0.1 ether for gas (?) 
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
        pot.isOpen = true;

        newPot(name, msg.value, msg.sender);
    }

    function joinPot(string name) payable {
        Pot pot = nameToPot[name];
        require(pot.isOpen); // pot exists and isn't over
        require(pot.players.length < 3); // pot isn't full
        require(msg.value == pot.buyIn); // must pay buyIn amount
        for(uint i = 0; i < pot.players.length; i++){
            require(pot.players[i] != msg.sender); //must be new to this pot
        }

        pot.players.push(msg.sender);
        potJoin(name, msg.sender);
        
        if(pot.players.length == 3){
            pot.lastPlayerBlockNumber = block.number;
            potFull(name);
        }
    }

    function canClosePot(string name) constant returns (bool){
        Pot pot = nameToPot[name];
        return  pot.isOpen &&
                pot.players.length == 3 &&
                block.number > pot.lastPlayerBlockNumber + 1;
    }

    function closePot(string name){
        Pot pot = nameToPot[name];
        require(pot.isOpen); // pot isn't over
        require(pot.players.length == 3); // pot full
        require(block.number > pot.lastPlayerBlockNumber + 1);
        
        pot.isOpen = false;
        
        bytes32 blockHash = block.blockhash(pot.lastPlayerBlockNumber + 1);
        if(blockHash == 0) { // pot expired due to hash storage limits - players didn't solve pot
            
            for(uint i = 0; i < pot.players.length; i++){
                refunds[pot.players[i]] += ((pot.buyIn * 99) / 100); // return money minus 1% fee
                totalRefunds += ((pot.buyIn * 99) / 100); // return money minus 1% fee
            }

            potExpired(name);
            return;
        }

        bytes32 potShaResult = sha3(blockHash);
        uint8 loserIndex = uint8(uint256(potShaResult) % 3);

        address loser = pot.players[loserIndex];
        address winner1 = pot.players[(loserIndex + 1) % 3];
        address winner2 = pot.players[(loserIndex + 2) % 3];

        uint winAmount = ((pot.buyIn / 2) * 99) / 100; // split the buy-in and take 1% fee
        uint refundAmount = pot.buyIn + winAmount;

        refunds[winner1] += refundAmount;
        refunds[winner2] += refundAmount;
        totalRefunds += refundAmount * 2;

        potClosed(name, winner1, winner2, loser);
    }

    function withdrawRefund() {
        uint refund = refunds[msg.sender];
        refunds[msg.sender] = 0;
        totalRefunds -= refund;

        msg.sender.transfer(refund); // this'll throw and restore state on failure
    }
}
