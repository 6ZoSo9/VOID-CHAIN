// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {Strings} from "openzeppelin-contracts/utils/Strings.sol";

contract DeadSpaceNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 public nextTokenId;
    string public baseURI;
    uint256 public maxSupply = 6666;

    constructor(string memory _name, string memory _symbol, string memory _baseURI, address owner_)
        ERC721(_name, _symbol)
    {
        baseURI = _baseURI;
        _transferOwnership(owner_);
    }

    function setBaseURI(string memory u) external onlyOwner { baseURI = u; }
    function setMaxSupply(uint256 m) external onlyOwner { require(m >= nextTokenId, "below minted"); maxSupply = m; }

    function mint(address to, uint256 qty) external onlyOwner {
        require(nextTokenId + qty <= maxSupply, "max");
        for(uint256 i=0;i<qty;i++){
            _mint(to, nextTokenId++);
        }
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_ownerOf(id) != address(0), "NF");
        return string(abi.encodePacked(baseURI, id.toString()));
    }
}
