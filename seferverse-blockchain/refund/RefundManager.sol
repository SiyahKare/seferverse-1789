// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

/// @title RefundManager (iskele)
/// @notice NonReentrant + Pausable ile korunan temel iskelet.
contract RefundManager is ReentrancyGuard, Pausable {
    event RefundClaimed(address indexed beneficiary, uint256 amount, bytes32 indexed claimId);

    mapping(bytes32 => bool) public claimed; // claimId => used

    function pause() external /* onlyTimelock */ { _pause(); }
    function unpause() external /* onlyTimelock */ { _unpause(); }

    function _markClaimed(bytes32 claimId) internal {
        require(!claimed[claimId], "claimed");
        claimed[claimId] = true;
    }

    // örnek API: gerçek iş mantığı PR'da tamamlanacak (EIP-712/Merkle seçimine göre)
    function claim(address beneficiary, uint256 amount, bytes32 claimId) external nonReentrant whenNotPaused {
        _markClaimed(claimId);
        (bool ok, ) = payable(beneficiary).call{value: amount}("");
        require(ok, "transfer-failed");
        emit RefundClaimed(beneficiary, amount, claimId);
    }
}
