// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DAvatar.sol";

contract Minter is Ownable {
    uint public fee = 0.01 ether;
    DAvatar dAvatar;

    event PaymentReceived(address indexed from, uint amount, uint indexed forTokenId);
    event Withdraw(address indexed to, uint amount);

    constructor(DAvatar _dAvatar) {
        dAvatar = _dAvatar;
    }

    /**
     * @dev Sets new dAvatar fee.
     *
     * Requirements:
     *
     * - the caller must be owner
     */
    function setNewFee(uint _newFee) public onlyOwner {
        fee = _newFee;
    }

    /**
     * @dev Should initiate mint function from dAvatar contract
     *
     * Requirements:
     *
     * - caller must pay minting fee defined is storage variable `fee`
     */
    function initiateMinting(string memory metadataCid) public payable returns(uint) {
        require(msg.value == fee, "Minter: please send exact fee amount");

        uint tokenId = dAvatar.mint(msg.sender, metadataCid);
        emit PaymentReceived(msg.sender, msg.value, tokenId);

        return tokenId;
    }

    /**
     * @dev Will withdraw the entire contract balance to
     * the specified receiver passed as an argument `to`.
     *
     * Requirements:
     *
     * - the caller must be owner
     */
    function withdraw(address payable _to) public onlyOwner {
        uint amount = address(this).balance;
        _to.transfer(amount);
        emit Withdraw(_to, amount);
    }

    /**
     * @dev Will withdraw specified amount from contract balance
     * to the specified receiver passed as an argument `to`.
     *
     * Requirements:
     *
     * - the caller must be owner
     */
    function withdraw(address payable _to, uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Minter: There are not enough funds stored in the smart contract");

        _to.transfer(_amount);
        emit Withdraw(_to, _amount);
    }
}
