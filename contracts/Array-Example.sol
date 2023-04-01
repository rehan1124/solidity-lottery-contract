// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

contract ArrayExample {
    uint[] public myArray;

    constructor() {
        myArray.push(1);
        myArray.push(10);
        myArray.push(30);
    }

    function getArrayLength() public view returns (uint) {
        return myArray.length;
    }

    function getElement(uint index) public view returns (uint) {
        return myArray[index];
    }

    function getCompleteArray() public view returns (uint[] memory) {
        return myArray;
    }
}