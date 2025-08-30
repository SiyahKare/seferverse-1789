// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

/// @title RefundVaultEIP712
/// @notice EIP-712 imzalı, non-replay ve timelock kontrollü refund kasası
contract RefundVaultEIP712 is EIP712, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;

    address public immutable timelock;
    address public signer; // imzaları doğrulayacak yetkili

    mapping(address => uint256) public nonces; // beneficiary => next nonce

    error NotTimelock();
    error ExpiredSig(uint256 nowTs, uint256 expiry);
    error InvalidSig();
    error InvalidNonce(uint256 expected, uint256 provided);
    error TransferFailed();

    event SignerUpdated(address indexed newSigner);
    event Refunded(address indexed beneficiary, uint256 amount, uint256 nonce);

    bytes32 private constant _REFUND_TYPEHASH =
        keccak256("Refund(address beneficiary,uint256 amount,uint256 nonce,uint256 expiry)");

    constructor(address _timelock, address _signer)
        EIP712("SeferVerseRefund", "1")
    {
        require(_timelock != address(0), "timelock=0");
        require(_signer != address(0), "signer=0");
        timelock = _timelock;
        signer = _signer;
    }

    modifier onlyTimelock() {
        if (msg.sender != timelock) revert NotTimelock();
        _;
    }

    function setSigner(address _signer) external onlyTimelock {
        require(_signer != address(0), "signer=0");
        signer = _signer;
        emit SignerUpdated(_signer);
    }

    function pause() external onlyTimelock { _pause(); }
    function unpause() external onlyTimelock { _unpause(); }

    function claim(
        address beneficiary,
        uint256 amount,
        uint256 nonce,
        uint256 expiry,
        bytes calldata sig
    ) external nonReentrant whenNotPaused {
        if (block.timestamp > expiry) revert ExpiredSig(block.timestamp, expiry);
        uint256 expected = nonces[beneficiary];
        if (nonce != expected) revert InvalidNonce(expected, nonce);

        bytes32 structHash = keccak256(abi.encode(
            _REFUND_TYPEHASH,
            beneficiary,
            amount,
            nonce,
            expiry
        ));
        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(digest, sig);
        if (recovered != signer) revert InvalidSig();

        // effects
        nonces[beneficiary] = expected + 1;

        // interactions
        (bool ok, ) = payable(beneficiary).call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit Refunded(beneficiary, amount, nonce);
    }

    receive() external payable {}
}




