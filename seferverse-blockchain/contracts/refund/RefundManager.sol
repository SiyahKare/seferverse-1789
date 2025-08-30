// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @title RefundManager (Merkle + bitmap, Timelock kontrollü)
contract RefundManager is ReentrancyGuard, Pausable {
    address public immutable timelock;

    // Merkle root for index,account,amount
    bytes32 public merkleRoot;

    // Bitmap to prevent double-claims: wordIndex => bitmap
    mapping(uint256 => uint256) private claimedBits;

    error NotTimelock();
    error AlreadyClaimed();
    error BadProof();
    error TransferFailed();

    event MerkleRootUpdated(bytes32 indexed root);
    event Refunded(uint256 indexed index, address indexed account, uint256 amount);
    // Pausable already emits Paused(address account) and Unpaused(address account)

    constructor(address _timelock, bytes32 _root) {
        require(_timelock != address(0), "timelock=0");
        timelock = _timelock;
        merkleRoot = _root;
    }

    modifier onlyTimelock() {
        if (msg.sender != timelock) revert NotTimelock();
        _;
    }

    function pause() external onlyTimelock { _pause(); emit Paused(msg.sender); }
    function unpause() external onlyTimelock { _unpause(); emit Unpaused(msg.sender); }
    function setMerkleRoot(bytes32 _root) external onlyTimelock { merkleRoot = _root; emit MerkleRootUpdated(_root); }

    function isClaimed(uint256 index) public view returns (bool) {
        uint256 word = claimedBits[index >> 8];
        uint256 mask = 1 << (index & 255);
        return (word & mask) != 0;
    }

    function _setClaimed(uint256 index) internal {
        uint256 wordIndex = index >> 8;
        uint256 mask = 1 << (index & 255);
        claimedBits[wordIndex] |= mask;
    }

    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata proof)
        external
        nonReentrant
        whenNotPaused
    {
        if (isClaimed(index)) revert AlreadyClaimed();
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        if (!MerkleProof.verify(proof, merkleRoot, node)) revert BadProof();
        _setClaimed(index);
        (bool ok, ) = payable(account).call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit Refunded(index, account, amount);
    }

    // allow receiving ETH for refunds
    receive() external payable {}
}


