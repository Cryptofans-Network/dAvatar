const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAvatar", function () {
  it("Should return correct data passed to constructor", async function () {
    const DAvatar = await ethers.getContractFactory("DAvatar");
    const dAvatar = await DAvatar.deploy();
    await dAvatar.deployed();

    expect(await dAvatar.name()).to.equal("dAvatar");
    expect(await dAvatar.symbol()).to.equal("dA");
  });
});
