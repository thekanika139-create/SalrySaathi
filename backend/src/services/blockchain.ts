import { ethers } from "ethers";
import PayStreamABI from "../../PayStream.json";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.HELA_RPC_URL);
const wallet = new ethers.Wallet(process.env.HELA_PRIVATE_KEY!, provider);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  PayStreamABI.abi,
  wallet
);

export async function createStream(employee: string, amount: string, start: number, end: number) {
  const tx = await contract.createStream(employee, ethers.parseEther(amount), start, end);
  await tx.wait();
  return tx.hash;
}

export async function withdrawStream(id: number) {
  const tx = await contract.withdraw(id);
  await tx.wait();
  return tx.hash;
}

export async function getStream(id: number) {
  return await contract.streams(id);
}

