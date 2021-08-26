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
});
