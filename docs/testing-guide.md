# WayFair Testing Guide

## Test Structure

```
tests/
├── unit/
│   ├── auth.test.js
│   ├── rides.test.js
│   ├── payment.test.js
│   └── ...
├── integration/
│   ├── booking.test.js
│   ├── payment-flow.test.js
│   └── ...
├── e2e/
│   ├── passenger-flow.spec.js
│   ├── driver-flow.spec.js
│   └── admin-flow.spec.js
└── contracts/
    ├── WayFair.test.js
    └── WayFairToken.test.js
```

## Running Tests

### Unit Tests
```bash
npm test -- --watch
npm test -- unit/
```

### Integration Tests
```bash
npm test -- integration/
```

### E2E Tests
```bash
npm run test:e2e
```

### Contract Tests
```bash
hardhat test
```

## Test Coverage

Target coverage: 80%+ across all modules

```bash
npm test -- --coverage
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main
- Before deployments

## Test Data

Use `tests/fixtures/` for test data:
- `users.json` - Test users
- `rides.json` - Test rides
- `payments.json` - Test transactions

## Mocking

- Mock API calls with MSW
- Mock blockchain with hardhat local network
- Mock email service with nodemailer

## Performance Testing

```bash
npm run test:performance
```

Benchmark critical paths:
- User registration: <500ms
- Ride search: <1s
- Payment processing: <2s
- Live tracking updates: <100ms

## Load Testing

```bash
npm run test:load
```

Test with concurrent users:
- 100 users
- 1000 rides per hour
- Peak traffic scenarios

## Debugging Tests

```bash
# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Specific test
npm test -- rides.test.js

# Watch mode
npm test -- --watch
```

## Test Best Practices

1. Write tests before code (TDD)
2. Keep tests isolated and independent
3. Use meaningful test names
4. Mock external dependencies
5. Test error scenarios
6. Clean up after tests
7. Maintain test data
8. Review test coverage
