// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    string public message = "Hello SeferVerse!";

    function setMessage(string calldata _msg) external {
        message = _msg;
    }
}