// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IModule {
    /// @dev opsiyonel: modül adı/sürümü
    function moduleId() external pure returns (bytes32);
    function moduleVersion() external pure returns (uint64);
}
