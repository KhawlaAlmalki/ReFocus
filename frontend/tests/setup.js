// tests/setup.js
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  // Create mock file buffer
  createMockImageBuffer: (size = 1000) => {
    return Buffer.alloc(size, 'test-image-data');
  },

  // Create mock JWT token
  createMockToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '1h'
    });
  },

  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Clean database collection
  cleanCollection: async (Model) => {
    await Model.deleteMany({});
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

// Cleanup after all tests
afterAll(async () => {
  // Close any open handles
  await new Promise(resolve => setTimeout(resolve, 500));
});
