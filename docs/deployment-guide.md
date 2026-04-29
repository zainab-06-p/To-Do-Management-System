# WayFair Deployment Guide

## Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- Solidity compiler for smart contracts

## Frontend Setup

### 1. Clone Repository
```bash
git clone https://github.com/zainab-06-p/Wayfair_SPM.git
cd Wayfair_SPM
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configuration
Create `.env` file:
```
REACT_APP_API_URL=https://api.wayfair.com
REACT_APP_STRIPE_KEY=pk_live_...
REACT_APP_INFURA_KEY=...
REACT_APP_CONTRACT_ADDRESS=0x...
```

### 4. Run Development Server
```bash
npm start
```
Server runs on http://localhost:3000

### 5. Build for Production
```bash
npm run build
```

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Update `config/database.js` with your database credentials

### 3. Deploy Smart Contract
```bash
npx hardhat compile
npx hardhat deploy --network mainnet
```

### 4. Start Server
```bash
npm start
```
Server runs on http://localhost:5000

## Smart Contract Deployment

### 1. Compile Contract
```bash
solc --version
solcjs contracts/WayFair.sol -o ./compiled/
```

### 2. Deploy to Ethereum Mainnet
```bash
truffle migrate --network mainnet
```

### 3. Verify Contract
```bash
truffle run verify WayFair --network mainnet
```

## Database Migration

```bash
npm run migrate
npm run seed
```

## Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Smart Contract Tests
```bash
hardhat test
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Smart contract deployed
- [ ] API endpoints tested
- [ ] Frontend built
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Monitoring setup
- [ ] Backup configured
- [ ] Load balancer configured

## Monitoring

Monitor application at:
- App Health: https://api.wayfair.com/health
- Smart Contract: Etherscan
- Performance: New Relic

## Support

For issues:
1. Check logs: `docker logs wayfair-app`
2. Check status: `npm run health-check`
3. Contact: support@wayfair.com
