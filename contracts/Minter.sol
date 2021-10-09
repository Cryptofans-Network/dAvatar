// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./DAvatar.sol";

contract Minter is Ownable {
  DAvatar internal dAvatar;
  AggregatorV3Interface internal priceFeed;

  uint256 public usdFee = 90000000;

  event PaymentReceived(
    address indexed from,
    uint256 amount,
    uint256 indexed forTokenId
  );
  event Withdraw(address indexed to, uint256 amount);

  constructor(DAvatar _dAvatar) {
    dAvatar = _dAvatar;

    // ETH/USD
    priceFeed = AggregatorV3Interface(
      0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    );
  }

  /**
   * @dev Sets new dAvatar fee.
   *
   * Requirements:
   *
   * - the caller must be owner
   */
  function setNewFee(uint256 _newFee) public onlyOwner {
    usdFee = _newFee;
  }

  function getPrice() public view returns (uint256) {
    (, int256 price, , , ) = priceFeed.latestRoundData();

    return SafeCast.toUint256(price);
  }

  /**
   * @dev Should initiate mint function from dAvatar contract
   *
   * Requirements:
   *
   * - caller must pay minting fee defined is storage variable `fee`
   */
  function initiateMinting(string memory _metadataCid)
    public
    payable
    returns (uint256)
  {
    uint256 ethPrice = getPrice();
    // TODO: Check if this will fail for big values
    uint256 usdInput = msg.value * ethPrice / 1e18;

    require(usdInput > usdFee, "Minter: Fee Required");

    // uint price = 9;
    // uint256 usdInput = 50000;
    // uint ethPrice = 3500;
    // uint toPayInEth = 1e18 * usdInput / ethPrice;
    // uint toRecive = (usdInput * 100)/ price;

    uint256 tokenId = dAvatar.mint(msg.sender, _metadataCid);
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
    uint256 amount = address(this).balance;
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
  function withdraw(address payable _to, uint256 _amount) public onlyOwner {
    require(
      _amount <= address(this).balance,
      "Minter: There are not enough funds stored in the smart contract"
    );

    _to.transfer(_amount);
    emit Withdraw(_to, _amount);
  }
}
