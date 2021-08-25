pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract DAvatar is ERC721PresetMinterPauserAutoId {
  constructor(string memory _baseUri) ERC721PresetMinterPauserAutoId("dAvatar", "dA", _baseUri) {}

}
