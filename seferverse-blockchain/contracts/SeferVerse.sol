// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SeferVerse {
    string public name;
    address public owner;

    constructor(string memory _name) {
        name = _name;
        owner = msg.sender;
    }
}
