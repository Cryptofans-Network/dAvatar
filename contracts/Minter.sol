// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./DAvatar.sol";

contract Minter is Ownable, AccessControlEnumerable {
    uint public fee = 0.01 ether;
    DAvatar dAvatar;

    bytes32 public constant MINTER_ADMIN_ROLE = keccak256("MINTER_ADMIN_ROLE");

    event PaymentReceived(address indexed from, uint amount, uint indexed forTokenId);
    event Withdraw(address indexed to, uint amount);

    /**
     * @dev DEFAULT_ADMIN_ROLE is more general than MINTER_ADMIN_ROLE
     * as it can grant or revoke any role. MINTER_ADMIN_ROLE is
     * set as an only role who can grant or revoke the same role.
     */
    constructor(DAvatar _dAvatar) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ADMIN_ROLE, _msgSender());
        _setRoleAdmin(MINTER_ADMIN_ROLE, MINTER_ADMIN_ROLE);

        dAvatar = _dAvatar;
    }

    /**
     * @dev We must be sure that MINTER_ADMIN_ROLE role can't
     * be revoked from contract owner which acts as super admin
     */
    function revokeRole(bytes32 _role, address _account) public override onlyRole(MINTER_ADMIN_ROLE) {
        require(_role == MINTER_ADMIN_ROLE, "Minter: Not allowed");
        require(_account != owner(), "Minter: Remove MINTER_ADMIN_ROLE for owner is not allowed");

        super.revokeRole(_role, _account);
    }

    /**
     * @dev We must be sure that MINTER_ADMIN_ROLE role can't
     * be renounced from contract owner which acts as super admin
     */
    function renounceRole(bytes32 _role, address _account) public override onlyRole(MINTER_ADMIN_ROLE) {
        require(_role == MINTER_ADMIN_ROLE, "Minter: Not allowed");
        require(_account != owner(), "Minter: Remove MINTER_ADMIN_ROLE for owner is not allowed");

        super.renounceRole(_role, _account);
    }

    /**
     * @dev Sets new dAvatar fee.
     *
     * Requirements:
     *
     * - the caller must be owner
     */
    function setNewFee(uint _newFee) public onlyRole(MINTER_ADMIN_ROLE) {
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
    function withdraw(address payable _to) public onlyRole(MINTER_ADMIN_ROLE) {
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
    function withdraw(address payable _to, uint _amount) public onlyRole(MINTER_ADMIN_ROLE) {
        require(_amount <= address(this).balance, "Minter: There are not enough funds stored in the smart contract");

        _to.transfer(_amount);
        emit Withdraw(_to, _amount);
    }
}
