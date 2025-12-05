# Game Submission Workflow Tests

## Overview

Comprehensive test suite for the game submission workflow including media upload, submission management, status tracking, version control, and admin review functionality.

## Test Coverage

### 1. Game Media Upload (22 tests)
- ✅ Get media requirements
- ✅ Upload valid cover image
- ✅ Upload multiple screenshots
- ✅ Delete screenshots
- ✅ Image dimension validation
- ✅ Aspect ratio validation
- ✅ File size validation
- ✅ Minimum/maximum screenshot enforcement
- ✅ Game lock prevention during review
- ✅ Authentication and authorization

### 2. Game Submission (8 tests)
- ✅ Submit game for review
- ✅ Validation before submission
- ✅ Version snapshot creation
- ✅ Game locking during review
- ✅ Resubmit after changes
- ✅ Critical change resolution enforcement
- ✅ Status transition validation

### 3. Submission Status Tracking (6 tests)
- ✅ Get submission status with timeline
- ✅ Display reviewer comments
- ✅ Show requested changes
- ✅ Mark changes as resolved
- ✅ Filter submissions by status
- ✅ Track resolution progress

### 4. Version Control (12 tests)
- ✅ Get all versions
- ✅ Get version details
- ✅ Revert to previous version
- ✅ Version comparison
- ✅ Approval history tracking
- ✅ Revert confirmation validation
- ✅ Lock prevention during revert
- ✅ Rejected version protection
- ✅ Version snapshot integrity

### 5. Admin Review Management (8 tests)
- ✅ Get pending reviews
- ✅ Start game review
- ✅ Approve games
- ✅ Request changes
- ✅ Reject games
- ✅ Review record creation
- ✅ Admin-only access enforcement

### 6. Authorization & Security (5 tests)
- ✅ Token validation
- ✅ Role-based access control
- ✅ Game ownership verification
- ✅ Cross-developer access prevention

### 7. Full Integration (1 test)
- ✅ Complete submission workflow from creation to approval

**Total: 62+ comprehensive tests**

## Prerequisites

### Required Dependencies

```bash
npm install --save-dev jest supertest @babel/preset-env
```

### Environment Setup

1. Create a test database:
```bash
# MongoDB test database
mongodb://localhost:27017/refocus-test
```

2. Set environment variables:
```bash
# .env.test
MONGODB_TEST_URI=mongodb://localhost:27017/refocus-test
NODE_ENV=test
JWT_SECRET=test-secret-key
```

### Test Image Fixtures

Create test image files in `tests/fixtures/images/`:
- `cover-1920x1080.jpg` (valid cover image)
- `screenshot1-1920x1080.jpg` (valid screenshot)
- `screenshot2-1920x1080.jpg` (valid screenshot)
- `invalid-800x600.jpg` (invalid dimensions)

Or the test will create dummy image files automatically.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Media upload tests only
npm test -- --testNamePattern="Game Media Upload"

# Submission tests only
npm test -- --testNamePattern="Game Submission"

# Version control tests only
npm test -- --testNamePattern="Version Control"

# Admin review tests only
npm test -- --testNamePattern="Admin Review"
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Run in Watch Mode
```bash
npm test -- --watch
```

### Run Verbose
```bash
npm test -- --verbose
```

## Test Structure

```
tests/
├── gameSubmissionWorkflow.test.js  # Main test file
├── fixtures/
│   └── images/                      # Test image files
│       ├── cover-1920x1080.jpg
│       ├── screenshot1-1920x1080.jpg
│       ├── screenshot2-1920x1080.jpg
│       └── invalid-800x600.jpg
└── README.md                        # This file
```

## Key Test Scenarios

### 1. Happy Path - Complete Workflow
```
Create Game → Upload Media → Submit for Review →
Admin Reviews → Request Changes → Developer Fixes →
Resubmit → Admin Approves → Success
```

### 2. Validation Scenarios
- Missing required fields
- Invalid image dimensions
- Invalid aspect ratios
- Insufficient screenshots
- Missing license information

### 3. Authorization Scenarios
- Unauthenticated access
- Wrong role access
- Cross-developer access
- Admin-only endpoints

### 4. Version Control Scenarios
- Create version snapshots
- Revert to approved version
- Compare versions
- Track approval history

### 5. Edge Cases
- Game locked during review
- Multiple screenshots management
- Critical changes enforcement
- Revert confirmation safety

## Test Data

### Test Users
- **Developer**: `developer@test.com` / `password123`
- **Admin**: `admin@test.com` / `password123`

### Test Game
- **Title**: Test Memory Game
- **Category**: memory
- **Difficulty**: medium

### Test License
- **Engine**: Phaser (Free/Open Source)
- **Ownership**: Sole Owner
- **Copyright Year**: 2025

## Assertions

Tests verify:
- ✅ HTTP status codes
- ✅ Response structure
- ✅ Database state changes
- ✅ File system operations
- ✅ Version snapshots
- ✅ Timeline accuracy
- ✅ Authorization enforcement
- ✅ Validation rules
- ✅ Business logic

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
        env:
          MONGODB_TEST_URI: mongodb://localhost:27017/refocus-test
          NODE_ENV: test

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Troubleshooting

### Tests Failing to Connect to Database
```bash
# Ensure MongoDB is running
mongod --dbpath /path/to/test/db

# Or use Docker
docker run -d -p 27017:27017 mongo:6
```

### Image Validation Tests Failing
```bash
# Install sharp for image processing
npm install sharp

# Create test fixtures
mkdir -p tests/fixtures/images
# Add valid image files
```

### Authentication Tests Failing
```bash
# Check JWT_SECRET is set
echo $JWT_SECRET

# Verify bcrypt is installed
npm install bcrypt
```

### Port Already in Use
```bash
# Change test port in tests
const PORT = process.env.TEST_PORT || 3001;
```

## Code Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Best Practices

1. **Isolation**: Each test is independent
2. **Cleanup**: Tests clean up after themselves
3. **Mocking**: External dependencies are mocked
4. **Data**: Test data is created in beforeEach/beforeAll
5. **Assertions**: Clear, specific assertions
6. **Naming**: Descriptive test names
7. **Organization**: Grouped by feature

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain coverage above 80%
4. Add integration test for full workflow
5. Update this README

## Support

For issues or questions:
- Check test output for detailed error messages
- Verify environment variables are set
- Ensure MongoDB is running
- Check fixture files exist
- Review test logs

---

**Last Updated**: 2025-12-04
**Test Framework**: Jest 29.x
**Total Tests**: 62+
**Coverage Target**: 80%+
