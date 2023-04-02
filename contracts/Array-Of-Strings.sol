// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

contract ArrayOfStrings {
    string[] public myArray;

    constructor() {
        myArray.push("Hi");
        myArray.push("Hello");
    }

    function getArrayLength() public view returns (uint) {
        return myArray.length;
    }

    function getElement(uint index) public view returns (string memory) {
        return myArray[index];
    }

    function getCompleteArray() public view returns (string[] memory) {
        return myArray;
    }
}