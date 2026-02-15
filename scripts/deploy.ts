import { ethers } from "hardhat";

async function main() {
  // Replace these with actual values
  const HLUSD_ADDRESS = "0xD3b7d26cD9EEEfc3aC370574DDEecd4093334A71"; // HLUSD token contract address on HeLa Testnet
  const TAX_VAULT = "0x1A24DC3D5c08166Ca3ef08C56a6463d2A16ef1E9";     // your wallet address (to collect tax)
  const TAX_RATE = 10;            // fixed tax percentage

  const [deployer] = await ethers.getSigners();
const PayStream = await ethers.getContractFactory("PayStream", deployer);
const contract = await PayStream.deploy(HLUSD_ADDRESS, TAX_VAULT, TAX_RATE);
await contract.waitForDeployment();
console.log(" PayStream deployed to:", contract.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
