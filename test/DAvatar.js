const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAvatar", function () {
  let DAvatar;
  let dAvatar;

  beforeEach(async () => {
    DAvatar = await ethers.getContractFactory("DAvatar");
    dAvatar = await DAvatar.deploy("dAvatar", "dA", "ipfs://");
    await dAvatar.deployed();
  });

  it("Should return correct data passed to constructor", async function () {
    expect(await dAvatar.name()).to.equal("dAvatar");
    expect(await dAvatar.symbol()).to.equal("dA");
  });

  it("Should mint new NFT token with correct metadata and assign to correct owner", async function () {
    const [defaultAccount, account1] = await ethers.getSigners();
    const tokenId = Number(
      await dAvatar.callStatic.mint(defaultAccount.address, "testMetadaCid")
    );

    const mintTx = await dAvatar.mint(defaultAccount.address, "testMetadaCid");
    await mintTx.wait();

    expect(await dAvatar.ownerOf(tokenId)).to.equal(defaultAccount.address);

    // @dev From should be zero when minting
    //
    // See {ERC721-_beforeTokenTransfer}.
    //
    await expect(dAvatar.mint(account1.address, "testMetadaCid"))
      .to.emit(dAvatar, "Transfer")
      .withArgs(ethers.constants.AddressZero, account1.address, tokenId + 1);

    expect(await dAvatar.ownerOf(2)).to.equal(account1.address);
  });

  it("Should revert if mint is called by caller that doesn't have MINT_ROLE", async function () {
    const [defaultAccount, account1] = await ethers.getSigners();

    await expect(
      dAvatar.connect(account1).mint(defaultAccount.address, "testMetadaCid")
    ).to.be.revertedWith("ERC721Base: must have minter role to mint");
  });
});
