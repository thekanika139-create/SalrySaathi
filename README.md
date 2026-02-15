### SalrySaathi  
The app  
# PayStream: Revolutionizing the Future of Payroll  

  
PayStream is a new payroll streaming protocol built on the HeLa Network. It changes traditional payment cycles into a seamless, real-time earning experience. By using HeLa’s stablecoin-native gas architecture (HLUSD), PayStream removes the obstacle of unpredictable transaction fees. This makes detailed "Money Streaming" practical for today’s workforce. Our solution gives HR administrators a strong dashboard to manage automatic salary flows, include tax withholding, and handle performance bonuses. At the same time, it offers employees a clear portal to track and access their earned income right away. Designed with security and efficiency in mind, PayStream is more than just a tool—it represents the next step in financial freedom within the decentralized economy.  
# Specific Features Included:  
Real-Time Streaming: Calculates per-second value transfer with high precision.  
Automated Tax Vault: A built-in logic gate that automatically redirects a percentage (e.g., 10%) of the stream to a tax treasury.  
Performance Bonuses: Ability for admins to trigger "one-time" spikes for performance rewards outside the stream.  
Administrative Security: Role-based access control allowing only HR/Admins to manage streams.  
Batch Operations: Efficient management of multiple employee streams in a single transaction to optimize workflow.  
Emergency Stop: A contract-wide circuit breaker to freeze operations during security events or network maintenance.  
On/Off Ramp: wap HLUSD to flat via third party provider

# Quick Start
### 1. Prerequisites
* **Node.js (v18+) & npm**
* **MetaMask wallet** configured for HeLa Testnet
* **HLUSD Tokens**: Ensure you have testnet HLUSD for gas and streaming
```text
2. Installation
   write this code in your terminal
   **#Clone the repository**
   git clone https://github.com/your-username/PayStream.git
   cd PayStream
   #Install dependencies
   npm install

 3. Environment Configuration
    Create a `.env` file in the root directory:
    PRIVATE_KEY=your_private_key
    HELA_RPC_URL=[https://testnet-rpc.helalabs.com](https://testnet-rpc.helalabs.com)
    HLUSD_ADDRESS=0x... # HeLa HLUSD Token Address
   TAX_VAULT=0x... # Address to receive automated tax deductions

4. Deployment & Launch
   #Deploy Smart Contract
   npx hardhat run scripts/deploy.js --network hela_testnet
   #Start Frontend
   cd client && npm run dev

 
