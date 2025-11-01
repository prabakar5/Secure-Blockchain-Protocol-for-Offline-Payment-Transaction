// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract OfflineTransaction {
    struct Transaction {
        address payer;
        address payee;
        uint256 amount;
        bool confirmed;
    }

    mapping(bytes32 => Transaction) public transactions;
    address public owner;

    event TransactionSubmitted(bytes32 indexed txId, address indexed payer, address indexed payee, uint256 amount);
    event TransactionConfirmed(bytes32 indexed txId, address indexed payer, address indexed payee, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can confirm transactions");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function sendEther(address payable _payee) public payable {
        require(msg.value > 0, "Transaction must have a valid amount");

        // Transfer ETH directly to the payee
        (bool success, ) = _payee.call{value: msg.value}("");
        require(success, "ETH transfer failed");

       
    }

    function confirmTransaction(bytes32 _txId) public  {
        Transaction storage txData = transactions[_txId];

       // require(txData.amount > 0, "Transaction not found");
      //  require(!txData.confirmed, "Transaction already confirmed");

        // Send ETH from contract to payee
        (bool success, ) = payable(txData.payee).call{value: txData.amount}("");
        require(success, "ETH transfer failed");

        txData.confirmed = true;

        emit TransactionConfirmed(_txId, txData.payer, txData.payee, txData.amount);
    }

    function getTransaction(bytes32 _txId) public view returns (Transaction memory) {
        return transactions[_txId];
    }
}
