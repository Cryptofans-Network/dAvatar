// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contracts to deploy
  const DAvatar = await hre.ethers.getContractFactory("DAvatar");
  const dAvatar = await DAvatar.deploy("dAvatar", "dA", "ipfs://");

  await dAvatar.deployed();
  console.log("DAvatar deployed to:", dAvatar.address);

  const Minter = await hre.ethers.getContractFactory("Minter");
  const minter = await Minter.deploy(dAvatar.address);

  await minter.deployed();
  console.log("Minter deployed to:", minter.address);

  // We have to add minter role to our Minter contract in order for it
  // to be able to mint dAvatars
  await dAvatar.grantRole(dAvatar.MINTER_ROLE(), minter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
