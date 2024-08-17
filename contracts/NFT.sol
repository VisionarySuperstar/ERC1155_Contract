// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CustomNFT is ERC1155, Ownable {
    uint256 public constant Gold = 0;
    uint256 public constant Silver = 1;
    uint256 public constant Bronze = 2;
    uint256 public price;
    address constant MAINNET_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e; // USDC address in Base Sepolia Testnet
    IERC20 usdc = IERC20(MAINNET_USDC); // USDC contract address

    constructor(string memory _uri) ERC1155(_uri) Ownable(msg.sender){
        _mint(msg.sender, Gold, 100, "");
        _mint(msg.sender, Silver, 100, "");
        _mint(msg.sender, Bronze, 100, "");
        price = 1000 * 10 ** 6;
    }

    function buyWithUSDC(uint256[] memory _type, uint256[] memory _number) external {
        uint256 totalBuyingNumber = 0;
        for(uint256 i = 0 ; i < _number.length ; i ++){
            totalBuyingNumber += _number[i];
        }
        usdc.transferFrom(msg.sender, owner(), price * totalBuyingNumber);
        _safeBatchTransferFrom(owner(), msg.sender, _type, _number, "");
    }

    function setPrice(uint256 _newPrice) external onlyOwner{
        price = _newPrice;
    }

    function setUSDC(address _USDCaddress) external onlyOwner{
        usdc = IERC20(_USDCaddress);
    }
}