import { ethers } from "ethers";
import PayStreamABI from "./Contract/PayStream.json"; // Ensure path is correct

const contractAddress = "0xAB2c09a9c9A0DD62BE013671ea536827488D57dc"; // Ensure this is your DEPLOYED contract address

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // Creating the instance using the ABI and Address
  return new ethers.Contract(contractAddress, PayStreamABI.abi, signer);
};