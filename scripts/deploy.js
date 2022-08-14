require("dotenv").config({ path: ".env" });
const { METADATA_URL } = require("../constants");
const hre = require("hardhat");

async function main() {
  // URL from where we can extract the metadata for a Crypto Dev NFT
  const metadataURL = METADATA_URL;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so cryptoDevsContract here is a factory for instances of our CryptoDevs contract.
  */
  const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs");

  // deploy the contract
  const deployedCryptoDevsContract = await cryptoDevsContract.deploy(metadataURL);

  // print the address of the deployed contract
  console.log("Crypto Devs Contract Address:", deployedCryptoDevsContract.address);
  let txn = await deployedCryptoDevsContract.mint({ value: hre.ethers.utils.parseEther("0.05") });
  await txn.wait();

  console.log("Minted NFT #1 ", txn);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
