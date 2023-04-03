// SPDX-License-Identifier: GPL-3.0
// https://ethereum.stackexchange.com/questions/63121/version-compatibility-issues-in-solidity-0-5-0-and-0-4-0

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function _random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    function enter() public payable {
        require(msg.value >= .00005 ether, "To enter lottery, send more than .00005 ETH.");
        players.push(msg.sender);
    }

    function getPlayerList() public view returns (address[] memory) {
        return players;
    }

    function pickWinner() public payable {
        require(msg.sender == manager, "Only manager can pick winner.");
        uint index = _random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }
}