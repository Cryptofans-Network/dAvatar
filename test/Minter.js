const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Minter", function () {
  let Minter;
  let minter;

  // Current order of `it` assumptions matters, don't change it
  // without changing this `before` hook to `beforeEach`.
  // This would require slight changes in `it` blocks too.
  before(async () => {
    const DAvatar = await ethers.getContractFactory("DAvatar");
    const dAvatar = await DAvatar.deploy("dAvatar", "dA", "ipfs://");
    await dAvatar.deployed();
    Minter = await ethers.getContractFactory("Minter");
    minter = await Minter.deploy(dAvatar.address);
    await minter.deployed();
    await dAvatar.grantRole(dAvatar.MINTER_ROLE(), minter.address);
  });

  it("Should return the correct fee", async function () {
    const expectedFee = ethers.utils.parseEther("0.01");

    const fee = await minter.fee();

    expect(fee).to.equal(expectedFee);
  });

  it("Should set new fee price", async function () {
    const newFee = ethers.utils.parseEther("2");
    const oldFee = await minter.fee();

    await minter.setNewFee(newFee);

    const fee = await minter.fee();

    expect(fee).to.not.equal(oldFee);
    expect(fee).to.equal(newFee);
  });

  it("Should call initiate minting", async function () {
    const accounts = await ethers.getSigners();
    const metadataCid = "test.json";
    const fee = await minter.fee();

    await minter
      .connect(accounts[1])
      .initiateMinting(metadataCid, { value: fee });
    expect(await ethers.provider.getBalance(minter.address)).to.equal(fee);
  });

  it("Should emmit PaymentReceived event on initiateMinting", async function () {
    const [owner] = await ethers.getSigners();
    const fee = await minter.fee();

    await expect(minter.initiateMinting("metadataCid.json", { value: fee }))
      .to.emit(minter, "PaymentReceived")
      .withArgs(owner.address, fee, "2");
  });

  it("Should throw an error if withdraw is called by the account that doesn't have a MINTER_ADMIN_ROLE role", async function () {
    const accounts = await ethers.getSigners();

    await expect(
      minter["withdraw(address)"](accounts[1].address, {
        from: accounts[1].address,
      })
    ).to.be.reverted;
  });

  it("Should throw an error when trying to revoke MINTER_ADMIN_ROLE for contract owner", async function () {
    const [owner, accountOne] = await ethers.getSigners();
    const MINTER_ADMIN_ROLE = await minter.MINTER_ADMIN_ROLE();

    await minter.grantRole(MINTER_ADMIN_ROLE, accountOne.address);
    expect(await minter.hasRole(MINTER_ADMIN_ROLE, owner.address)).to.be.true;
    expect(await minter.hasRole(MINTER_ADMIN_ROLE, accountOne.address)).to.be.true;
    expect(await minter.getRoleMemberCount(MINTER_ADMIN_ROLE)).to.equal(2);

    await expect(
      minter.revokeRole(MINTER_ADMIN_ROLE, owner.address)
    ).to.be.reverted;
  });

  it("Should throw an error when trying to renounce MINTER_ADMIN_ROLE for contract owner", async function () {
    const [owner] = await ethers.getSigners();
    const MINTER_ADMIN_ROLE = await minter.MINTER_ADMIN_ROLE();

    await expect(
      minter.renounceRole(MINTER_ADMIN_ROLE, owner.address)
    ).to.be.reverted;
    expect(await minter.hasRole(MINTER_ADMIN_ROLE, owner.address)).to.be.true;
  });

  it("Accounts with MINTER_ADMIN_ROLE should be able to assign the same role to other accounts", async function () {
    const [owner, minterAdmin, newMinterAdmin] = await ethers.getSigners();
    const MINTER_ADMIN_ROLE = await minter.MINTER_ADMIN_ROLE();

    expect(await minter.getRoleMemberCount(MINTER_ADMIN_ROLE)).to.equal(2);
    expect(await minter.hasRole(MINTER_ADMIN_ROLE, minterAdmin.address)).to.be.true;

    await minter.connect(minterAdmin).grantRole(MINTER_ADMIN_ROLE, newMinterAdmin.address);

    expect(await minter.getRoleMemberCount(MINTER_ADMIN_ROLE)).to.equal(3);
    expect(await minter.hasRole(MINTER_ADMIN_ROLE, newMinterAdmin.address)).to.be.true;
  });

  it("Should withdraw entire contract balance if no amount is specified", async function () {
    const [owner] = await ethers.getSigners();
    const ownerBalanceBeforeWithdraw = await owner.getBalance();

    await minter["withdraw(address)"](owner.address);

    expect(await ethers.provider.getBalance(minter.address)).to.equal(0);
    expect(Number(await owner.getBalance())).to.be.above(
      Number(ownerBalanceBeforeWithdraw)
    );
  });

  it("Should withdraw specified amount", async function () {
    const accounts = await ethers.getSigners();
    const fee = await minter.fee();

    await minter.initiateMinting("metadata.json", {
      value: fee,
    });
    const balanceBeforeWithdraw = await ethers.provider.getBalance(
      minter.address
    );
    const amountToWithdraw = ethers.utils.parseEther("0.1");

    await expect(() =>
      minter["withdraw(address,uint256)"](accounts[1].address, amountToWithdraw)
    ).to.changeBalance(accounts[1], amountToWithdraw);
    expect(balanceBeforeWithdraw).to.equal(fee);
    expect(await ethers.provider.getBalance(minter.address)).to.equal(
      balanceBeforeWithdraw.sub(amountToWithdraw)
    );
  });

  it("Should emmit Withdraw event on withdraw", async function () {
    const [owner] = await ethers.getSigners();
    const fee = await minter.fee();

    await minter.initiateMinting("metadata.json", {
      value: fee,
    });

    await expect(minter["withdraw(address,uint256)"](owner.address, fee))
      .to.emit(minter, "Withdraw")
      .withArgs(owner.address, fee);
  });
});
