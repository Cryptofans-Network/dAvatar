// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC721Base.sol";

/**
 * @dev a lot of stuff was copied from ERC721PresetMinterPauserAutoId
 * which is used a starting base.
 *
 */
contract DAvatar is ERC721Base {
    /**
     * @dev since libraries can't be inherited, we need this line
     * even though we have it in ERC721Base contract
     */
    using Counters for Counters.Counter;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _baseURI
    ) ERC721Base(_tokenName, _tokenSymbol, _baseURI) {}
}
