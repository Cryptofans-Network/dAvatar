const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Minter", function () {
  let Minter;
  let minter;

  const getPrice = async () => {
    const price = await minter.getPrice();
    return Number(price.toString()) / 100000000;
  };

  // Current order of it assumptions matters, don't change it
  // without changing this before hook to before each.
  // This would require slight changes in it blocks too.
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
    const expectedFee = 90000000;

    const fee = await minter.usdFee();

    expect(fee).to.equal(expectedFee);
  });

  it("Should set new fee price", async function () {
    const newFee = 99000000;
    const oldFee = await minter.usdFee();

    await minter.setNewFee(newFee);

    const fee = await minter.usdFee();

    expect(fee).to.not.equal(oldFee);
    expect(fee).to.equal(newFee);
  });

  it("Should call initiate minting", async function () {
    const accounts = await ethers.getSigners();
    const metadataCid = "test.json";
    const usdPrice = await getPrice();
    const fee = ethers.utils.parseEther(
      (1 / usdPrice).toString().substr(0, 20)
    );
    console.log(fee.toString());
    console.log((0.1 / usdPrice).toString().substr(0, 19));

    await minter
      .connect(accounts[1])
      .initiateMinting(metadataCid, { value: fee });
    expect(await ethers.provider.getBalance(minter.address)).to.equal(fee);
  });

  it("Should emit PaymentReceived event on initiateMinting", async function () {
    const [owner] = await ethers.getSigners();
    const usdPrice = await getPrice();
    const fee = ethers.utils.parseEther(
      (1 / usdPrice).toString().substr(0, 20)
    );

    await expect(minter.initiateMinting("metadataCid.json", { value: fee }))
      .to.emit(minter, "PaymentReceived")
      .withArgs(owner.address, fee, "2");
  });

  it("Should throw an error if withdraw is not called by the contract owner", async function () {
    const accounts = await ethers.getSigners();

    await expect(
      minter["withdraw(address)"](accounts[1].address, {
        from: accounts[1].address,
      })
    ).to.be.reverted;
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
    const fee = await minter.usdFee();

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
    const fee = await minter.usdFee();

    await minter.initiateMinting("metadata.json", {
      value: fee,
    });

    await expect(minter["withdraw(address,uint256)"](owner.address, fee))
      .to.emit(minter, "Withdraw")
      .withArgs(owner.address, fee);
  });
});
