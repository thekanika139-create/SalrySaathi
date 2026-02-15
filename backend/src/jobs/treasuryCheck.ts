import { getBalance } from "../services/blockchain";

async function checkTreasury() {
  const balance = await getBalance(process.env.CONTRACT_ADDRESS!);
  console.log(`Treasury balance: ${balance} ETH`);
}

setInterval(checkTreasury, 60 * 1000); // every minute
