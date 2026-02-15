import { ethers } from "ethers";
import contractABI from "../contracts/MyContract.json";

const contractAddress = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

export const getContract = async () => {
  if (!window.ethereum) return null;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    contractABI.abi,
    signer
  );

  return contract;
};
