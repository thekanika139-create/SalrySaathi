import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    helaTestnet: {
      url: process.env.HELA_RPC_URL || "https://testnet-rpc.helachain.com",
      accounts: process.env.HELA_PRIVATE_KEY ? [process.env.HELA_PRIVATE_KEY] : [],
    },
  },
};

export default config;

