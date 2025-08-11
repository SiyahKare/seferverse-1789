// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title BaronNFT (non-upgradeable)
contract BaronNFT is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _id;

    constructor(address admin) ERC721("Baron NFT", "BRN") {
        require(admin != address(0), "admin=0");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _id = 1;
    }

    function mint(address to, string memory tokenURI_) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 id = _id++;
        _safeMint(to, id);
        _setTokenURI(id, tokenURI_);
        return id;
    }

    // --- Overrides ---
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    { return super.tokenURI(tokenId); }

    function _burn(uint256 tokenId)
        internal override(ERC721, ERC721URIStorage)
    { super._burn(tokenId); }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


