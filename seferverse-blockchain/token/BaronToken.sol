// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaronToken {
    string public name = 'BaronToken';
    string public symbol = 'BRT';
    uint8 public decimals = 18;
    uint public totalSupply = 1000000 * 10**18;

    mapping(address => uint) public balanceOf;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
}
