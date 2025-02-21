# Jacinto Benavente NFT Contracts

An upgradeable ERC-1155 NFT contract implementation with pause, burn, and supply tracking functionality.

## Deployed Contracts (Base Sepolia)

- Implementation: [0x92035568cA0850f808d40bFa17a9AF47dc380855](https://sepolia.basescan.org/address/0x92035568cA0850f808d40bFa17a9AF47dc380855)
- Proxy: [0xE30A4eEe5b7065E4f1c08292B26fDE87E42BbbD8](https://sepolia.basescan.org/address/0xE30A4eEe5b7065E4f1c08292B26fDE87E42BbbD8)
- ProxyAdmin: [0x949FEAf3ddB7bb6b6DCB52AA774E188c1b4C90F2](https://sepolia.basescan.org/address/0x949FEAf3ddB7bb6b6DCB52AA774E188c1b4C90F2)

## Features

- ERC-1155 token standard
- Upgradeable contract architecture
- Pausable functionality
- Burnable tokens
- Supply tracking
- Owner-controlled minting
- Token naming system (V2)

## Development

### Prerequisites

- Node.js
- npm or yarn
- Hardhat

### Installation

```bash
npm install
```

### Testing

```bash
npx hardhat test
```

### Deployment

1. Set up environment variables in `.env`:
```
OWNER_WALLET_ADDRESS=your_wallet_address
PRIVATE_KEY=your_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

2. Deploy contracts:
```bash
npx hardhat ignition deploy ignition/modules/ProxyModule.js --network base-sepolia
```

3. Verify contracts:
```bash
npx hardhat verify --network base-sepolia CONTRACT_ADDRESS
```

## Contract Architecture

### V1 (Current)
- Basic ERC-1155 functionality
- Pause/Unpause
- Burn
- Supply tracking
- Owner-controlled minting

### V2 (Planned)
- Token naming system
- Version tracking
- Additional metadata functionality

## License

MIT
