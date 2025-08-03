// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SeferVerse DAO v1
/// @notice İlk sürüm, sadece name & owner ile başlıyor. İleride token, NFT ve DAO modülleri eklenecek.
contract SeferVerseDAO {
    string public name;
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event NameChanged(string oldName, string newName);

    constructor(string memory _name) {
        name = _name;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice DAO adını güncelle
    function setName(string calldata _name) external onlyOwner {
        emit NameChanged(name, _name);
        name = _name;
    }

    /// @notice Owner değiştirme (ileride multi-sig eklenebilir)
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero addr");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
