// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";

/// @title BaronNFT (non-upgradeable)
contract BaronNFT is ERC721, ERC721URIStorage, ERC2981, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _id;

    bool public baseURIFrozen;
    string private _baseTokenURI;

    bool public royaltyFrozen;

    event BaseURISet(string newBaseURI);
    event BaseURIFrozen();
    event RoyaltySet(address indexed receiver, uint96 feeNumerator);
    event RoyaltyFrozen();

    constructor(address admin) ERC721("Baron NFT", "BRN") {
        require(admin != address(0), "admin=0");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _id = 1;
        _setDefaultRoyalty(admin, 0); // default 0, admin güncelleyebilir
    }

    function mint(address to, string memory tokenURI_) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 id = _id++;
        _safeMint(to, id);
        _setTokenURI(id, tokenURI_);
        return id;
    }

    function setBaseURI(string calldata newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!baseURIFrozen, "frozen");
        _baseTokenURI = newBaseURI;
        emit BaseURISet(newBaseURI);
    }

    function freezeBaseURI() external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURIFrozen = true;
        emit BaseURIFrozen();
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!royaltyFrozen, "royalty-frozen");
        _setDefaultRoyalty(receiver, feeNumerator);
        emit RoyaltySet(receiver, feeNumerator);
    }

    function freezeRoyalty() external onlyRole(DEFAULT_ADMIN_ROLE) {
        royaltyFrozen = true;
        emit RoyaltyFrozen();
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
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
        public view override(ERC721, ERC721URIStorage, ERC2981, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


