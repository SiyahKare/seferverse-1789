// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SeferVerse DAO v1 (Governor/Timelock kontrollü)
/// @notice Timelock tarafından yürütülen yönetişim teklifleri ile yönetilir.
contract SeferVerseDAO {
    string public name;
    address public immutable timelock; // GovernorTimelockControl üzerinden yürütücü

    event NameChanged(string oldName, string newName);

    constructor(string memory _name, address _timelock) {
        require(_timelock != address(0), "timelock=0");
        name = _name;
        timelock = _timelock;
    }

    modifier onlyTimelock() {
        require(msg.sender == timelock, "Not timelock");
        _;
    }

    /// @notice DAO adını güncelle (sadece Timelock çağırabilir)
    function setName(string calldata _name) external onlyTimelock {
        emit NameChanged(name, _name);
        name = _name;
    }
}
