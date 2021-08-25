const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAvatar", function () {
  it("Should return correct data passed to constructor", async function () {
    const baseTokenUri = "testuri.com";

    const DAvatar = await ethers.getContractFactory("DAvatar");
    const dAvatar = await DAvatar.deploy(baseTokenUri);
    await dAvatar.deployed();

    expect(await dAvatar.name()).to.equal("dAvatar");
    expect(await dAvatar.symbol()).to.equal("dA");
  });
});
