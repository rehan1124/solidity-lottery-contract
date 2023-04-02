// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value >= .00005 ether, "To enter lottery, send more than .00005 ETH.");
        players.push(msg.sender);
    }

    function getPlayerList() public view returns (address[] memory) {
        return players;
    }
}