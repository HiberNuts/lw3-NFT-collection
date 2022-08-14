// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    string _baseTokenURI;

    uint256 public _price = 0.01 ether;

    //pause the contract in emergency mode
    bool public _paused;

    uint256 public maxTokensIds = 20;

    uint256 public tokenIds;

    bool public presaleStarted;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract is currently paused");
        _;
    }

    //constructor to initiase the erc721 token

    constructor(string memory baseURI) ERC721("Crypto Devs", "CD") {
        _baseTokenURI = baseURI;
    }

    function mint() public payable onlyWhenNotPaused {
        require(tokenIds < maxTokensIds, "Exceeded max token limit");
        require(msg.value >= _price, "not enough ether sent");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            tokenIds,
            msg.sender
        );
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    //set the pause r not only by owner
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send ether to owner");
    }

    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
