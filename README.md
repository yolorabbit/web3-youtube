# Web3 Youtube

This is a decentralized youtube

You can upload and watch descentralized videos!

This project was built with:

- Frontend framework: Next.js
- Smart contracts: Solidity
- Ethereum web client library: Ethers.js
- File storage: IPFS
- Querying data: The Graph
- CSS Framework: TailwindCSS
- Ethereum development environment: Hardhat
- Layer 2 blockchain: Polygon

Front-end

1. npm install

2. Create an `.env` file following .env.example

3. npm run dev

4. Compile the smart contract

```sh
  npx hardhat compile
```

5. Deploy the contract

```sh
  npx hardhat run scripts/deploy.js --network mumbai
```

6. Add your contract address in constants

Obs: If you want to deploy your own subgraph fell free, but I have already deployed one.
