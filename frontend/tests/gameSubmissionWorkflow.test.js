// tests/gameSubmissionWorkflow.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Game from '../src/models/Game.js';
import GameVersion from '../src/models/GameVersion.js';
import GameReview from '../src/models/GameReview.js';
import License from '../src/models/License.js';
import User from '../src/models/User.js';
import fs from 'fs';
import path from 'path';

// Test data
let developerToken;
let adminToken;
let developerId;
let adminId;
let testGameId;
let testVersionId;
let testLicenseId;

// Test files paths
const testImagesDir = path.join(__dirname, 'fixtures', 'images');
const validCoverImage = path.join(testImagesDir, 'cover-1920x1080.jpg');
const validScreenshot1 = path.join(testImagesDir, 'screenshot1-1920x1080.jpg');
const validScreenshot2 = path.join(testImagesDir, 'screenshot2-1920x1080.jpg');
const invalidImage = path.join(testImagesDir, 'invalid-800x600.jpg');

// ============================================
// SETUP AND TEARDOWN
// ============================================

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/refocus-test');

  // Create test users
  const developer = await User.create({
    name: 'Test Developer',
    email: 'developer@test.com',
    password: 'password123',
    role: 'developer',
    isActive: true,
    emailVerified: true
  });

  const admin = await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    isActive: true,
    emailVerified: true
  });

  developerId = developer._id;
  adminId = admin._id;

  // Get authentication tokens
  const devLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'developer@test.com', password: 'password123' });
  developerToken = devLogin.body.token;

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  adminToken = adminLogin.body.token;

  // Create test game
  const game = await Game.create({
    title: 'Test Memory Game',
    description: 'A test game for memory training',
    category: 'memory',
    difficulty: 'medium',
    gameUrl: '/uploads/games/test-game/index.html',
    developerId,
    developerName: 'Test Developer',
    version: '1.0.0'
  });

  testGameId = game._id;

  // Create test license
  const license = await License.create({
    gameId: testGameId,
    developerId,
    engine: {
      name: 'Phaser',
      licenseType: 'Free/Open Source'
    },
    intellectualProperty: {
      ownershipStatus: 'Sole Owner',
      copyrightHolder: 'Test Developer',
      copyrightYear: 2025
    },
    declarations: {
      ownershipConfirmed: true,
      noInfringement: true,
      accurateInformation: true,
      agreementAccepted: true
    }
  });

  testLicenseId = license._id;

  // Create test image files if they don't exist
  if (!fs.existsSync(testImagesDir)) {
    fs.mkdirSync(testImagesDir, { recursive: true });
  }

  // Create dummy image files for testing
  createTestImages();
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({ email: { $in: ['developer@test.com', 'admin@test.com'] } });
  await Game.deleteMany({ developerId });
  await GameVersion.deleteMany({});
  await GameReview.deleteMany({});
  await License.deleteMany({ developerId });

  // Clean up uploaded files
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (fs.existsSync(uploadsDir)) {
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  }

  // Close database connection
  await mongoose.connection.close();
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function createTestImages() {
  // Create simple test images using Buffer
  // In real tests, you'd use actual image files
  const imageBuffer = Buffer.from('fake-image-data');

  if (!fs.existsSync(validCoverImage)) {
    fs.writeFileSync(validCoverImage, imageBuffer);
  }
  if (!fs.existsSync(validScreenshot1)) {
    fs.writeFileSync(validScreenshot1, imageBuffer);
  }
  if (!fs.existsSync(validScreenshot2)) {
    fs.writeFileSync(validScreenshot2, imageBuffer);
  }
  if (!fs.existsSync(invalidImage)) {
    fs.writeFileSync(invalidImage, imageBuffer);
  }
}

// ============================================
// MEDIA UPLOAD TESTS
// ============================================

describe('Game Media Upload', () => {
  describe('GET /api/dev/media/requirements', () => {
    test('should get media requirements', async () => {
      const response = await request(app)
        .get('/api/dev/media/requirements')
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.requirements).toHaveProperty('coverImage');
      expect(response.body.requirements).toHaveProperty('screenshots');
      expect(response.body.requirements.coverImage.acceptableAspectRatios).toContain('16:9');
    });
  });

  describe('POST /api/dev/games/:gameId/media/cover', () => {
    test('should upload valid cover image', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/media/cover`)
        .set('Authorization', `Bearer ${developerToken}`)
        .attach('coverImage', validCoverImage);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Cover image uploaded successfully');
      expect(response.body.coverImage).toHaveProperty('url');
      expect(response.body.coverImage).toHaveProperty('dimensions');
    });

    test('should reject upload without file', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/media/cover`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No cover image uploaded');
    });

    test('should reject upload for non-existent game', async () => {
      const fakeGameId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/dev/games/${fakeGameId}/media/cover`)
        .set('Authorization', `Bearer ${developerToken}`)
        .attach('coverImage', validCoverImage);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Game not found");
    });

    test('should reject upload without authentication', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/media/cover`)
        .attach('coverImage', validCoverImage);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/dev/games/:gameId/media/screenshots', () => {
    test('should upload multiple valid screenshots', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/media/screenshots`)
        .set('Authorization', `Bearer ${developerToken}`)
        .attach('screenshots', validScreenshot1)
        .attach('screenshots', validScreenshot2);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.screenshots).toHaveLength(2);
      expect(response.body.totalScreenshots).toBe(2);
    });

    test('should reject if total screenshots exceed 5', async () => {
      // First, add 5 screenshots
      await Game.findByIdAndUpdate(testGameId, {
        screenshots: Array(5).fill({
          url: '/test.jpg',
          fileName: 'test.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        })
      });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/media/screenshots`)
        .set('Authorization', `Bearer ${developerToken}`)
        .attach('screenshots', validScreenshot1);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Maximum is 5 total');

      // Clean up
      await Game.findByIdAndUpdate(testGameId, { screenshots: [] });
    });

    test('should reject upload without files', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/media/screenshots`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('No screenshots uploaded');
    });
  });

  describe('DELETE /api/dev/games/:gameId/media/screenshots/:screenshotId', () => {
    test('should delete a screenshot', async () => {
      // First add screenshots
      const game = await Game.findById(testGameId);
      game.screenshots = [
        {
          url: '/test1.jpg',
          fileName: 'test1.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        },
        {
          url: '/test2.jpg',
          fileName: 'test2.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        },
        {
          url: '/test3.jpg',
          fileName: 'test3.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        }
      ];
      await game.save();

      const screenshotId = game.screenshots[0]._id;

      const response = await request(app)
        .delete(`/api/dev/games/${testGameId}/media/screenshots/${screenshotId}`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.remainingScreenshots).toBe(2);
    });

    test('should not delete if only 2 screenshots remain', async () => {
      const game = await Game.findById(testGameId);
      const screenshotId = game.screenshots[0]._id;

      const response = await request(app)
        .delete(`/api/dev/games/${testGameId}/media/screenshots/${screenshotId}`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('must have at least 2 screenshots');
    });
  });

  describe('GET /api/dev/games/:gameId/media', () => {
    test('should get game media', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/media`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.media).toHaveProperty('screenshots');
      expect(response.body.media).toHaveProperty('screenshotCount');
    });
  });
});

// ============================================
// GAME SUBMISSION TESTS
// ============================================

describe('Game Submission', () => {
  beforeEach(async () => {
    // Ensure game has required media and license
    await Game.findByIdAndUpdate(testGameId, {
      coverImageUrl: '/uploads/cover.jpg',
      screenshots: [
        {
          url: '/screenshot1.jpg',
          fileName: 'screenshot1.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        },
        {
          url: '/screenshot2.jpg',
          fileName: 'screenshot2.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        }
      ],
      submissionStatus: 'Draft',
      isLocked: false
    });
  });

  describe('POST /api/dev/games/:gameId/submit', () => {
    test('should submit game for review successfully', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/submit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({
          changeLog: 'Initial submission for review',
          changes: [
            { type: 'Feature', description: 'Core gameplay mechanics' }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.submission.status).toBe('In Review');
      expect(response.body.submission.isLocked).toBe(true);
      expect(response.body.submission).toHaveProperty('versionId');
      expect(response.body.submission).toHaveProperty('estimatedReviewTime');

      // Verify game status updated
      const game = await Game.findById(testGameId);
      expect(game.submissionStatus).toBe('In Review');
      expect(game.isLocked).toBe(true);

      // Verify version created
      const version = await GameVersion.findById(response.body.submission.versionId);
      expect(version).toBeDefined();
      expect(version.status).toBe('In Review');
      expect(version.isCurrentVersion).toBe(true);
    });

    test('should reject submission without cover image', async () => {
      await Game.findByIdAndUpdate(testGameId, { coverImageUrl: null });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/submit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ changeLog: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Cover image is required');

      // Restore cover image
      await Game.findByIdAndUpdate(testGameId, { coverImageUrl: '/uploads/cover.jpg' });
    });

    test('should reject submission with less than 2 screenshots', async () => {
      await Game.findByIdAndUpdate(testGameId, { screenshots: [] });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/submit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ changeLog: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('At least 2 screenshots are required');
    });

    test('should reject submission if already in review', async () => {
      await Game.findByIdAndUpdate(testGameId, { submissionStatus: 'In Review' });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/submit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ changeLog: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already in review');

      // Restore status
      await Game.findByIdAndUpdate(testGameId, { submissionStatus: 'Draft' });
    });
  });

  describe('POST /api/dev/games/:gameId/resubmit', () => {
    beforeEach(async () => {
      // Set game to Changes Requested status
      await Game.findByIdAndUpdate(testGameId, {
        submissionStatus: 'Changes Requested',
        isLocked: false,
        requestedChanges: [
          {
            change: 'Fix bug',
            priority: 'High',
            category: 'Functionality',
            resolved: true
          }
        ]
      });
    });

    test('should resubmit game after changes', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/resubmit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ changeLog: 'Fixed all requested issues' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.submission.status).toBe('In Review');
      expect(response.body.submission.isLocked).toBe(true);
    });

    test('should reject resubmit with unresolved critical changes', async () => {
      await Game.findByIdAndUpdate(testGameId, {
        requestedChanges: [
          {
            change: 'Critical bug',
            priority: 'Critical',
            category: 'Functionality',
            resolved: false
          }
        ]
      });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/resubmit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ changeLog: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('critical changes must be resolved');
    });

    test('should reject resubmit if not in correct status', async () => {
      await Game.findByIdAndUpdate(testGameId, { submissionStatus: 'Draft' });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/resubmit`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ changeLog: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('can only be resubmitted if changes were requested');
    });
  });
});

// ============================================
// SUBMISSION STATUS TRACKING TESTS
// ============================================

describe('Submission Status Tracking', () => {
  beforeEach(async () => {
    await Game.findByIdAndUpdate(testGameId, {
      submissionStatus: 'Changes Requested',
      submittedForReviewAt: new Date('2025-12-01'),
      lastReviewedAt: new Date('2025-12-02'),
      reviewerComments: 'Good game, minor fixes needed',
      requestedChanges: [
        {
          change: 'Fix loading bug',
          priority: 'High',
          category: 'Functionality',
          resolved: false
        },
        {
          change: 'Improve UI',
          priority: 'Medium',
          category: 'UI/UX',
          resolved: true,
          resolvedAt: new Date()
        }
      ]
    });
  });

  describe('GET /api/dev/games/:gameId/submission', () => {
    test('should get submission status with timeline', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/submission`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.submission.currentStatus).toBe('Changes Requested');
      expect(response.body.submission.timeline).toBeInstanceOf(Array);
      expect(response.body.submission.requestedChanges).toHaveLength(2);
      expect(response.body.submission.reviewerComments).toBeDefined();
    });

    test('should show timeline with all statuses', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/submission`)
        .set('Authorization', `Bearer ${developerToken}`);

      const timeline = response.body.submission.timeline;
      expect(timeline.find(t => t.status === 'Draft')).toBeDefined();
      expect(timeline.find(t => t.status === 'In Review')).toBeDefined();
      expect(timeline.find(t => t.status === 'Changes Requested')).toBeDefined();
    });
  });

  describe('PUT /api/dev/games/:gameId/changes/:changeId/resolve', () => {
    test('should mark change as resolved', async () => {
      const game = await Game.findById(testGameId);
      const changeId = game.requestedChanges[0]._id;

      const response = await request(app)
        .put(`/api/dev/games/${testGameId}/changes/${changeId}/resolve`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.allChangesResolved).toBe(true);
      expect(response.body.remainingChanges).toBe(0);

      // Verify change marked as resolved
      const updatedGame = await Game.findById(testGameId);
      const resolvedChange = updatedGame.requestedChanges.id(changeId);
      expect(resolvedChange.resolved).toBe(true);
      expect(resolvedChange.resolvedAt).toBeDefined();
    });

    test('should return 404 for non-existent change', async () => {
      const fakeChangeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/dev/games/${testGameId}/changes/${fakeChangeId}/resolve`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Requested change not found');
    });
  });

  describe('GET /api/dev/submissions', () => {
    test('should get all developer submissions', async () => {
      const response = await request(app)
        .get('/api/dev/submissions')
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.submissions).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });

    test('should filter submissions by status', async () => {
      const response = await request(app)
        .get('/api/dev/submissions?status=Changes Requested')
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.submissions.every(s => s.status === 'Changes Requested')).toBe(true);
    });
  });
});

// ============================================
// VERSION CONTROL TESTS
// ============================================

describe('Version Control', () => {
  let version1Id, version2Id;

  beforeEach(async () => {
    // Create test versions
    const version1 = await GameVersion.create({
      gameId: testGameId,
      versionNumber: '1.0.0',
      versionTag: 'stable',
      status: 'Approved',
      isApproved: true,
      isCurrentVersion: false,
      approvedAt: new Date('2025-12-01'),
      approvedBy: adminId,
      snapshot: {
        title: 'Test Game v1.0.0',
        description: 'Original version',
        gameUrl: '/game.html',
        screenshots: []
      },
      changeLog: 'Initial release',
      createdBy: developerId
    });

    const version2 = await GameVersion.create({
      gameId: testGameId,
      versionNumber: '1.0.1',
      versionTag: 'stable',
      status: 'Approved',
      isApproved: true,
      isCurrentVersion: true,
      approvedAt: new Date('2025-12-05'),
      approvedBy: adminId,
      snapshot: {
        title: 'Test Game v1.0.1',
        description: 'Updated version',
        gameUrl: '/game.html',
        screenshots: []
      },
      changeLog: 'Bug fixes',
      createdBy: developerId
    });

    version1Id = version1._id;
    version2Id = version2._id;

    await Game.findByIdAndUpdate(testGameId, {
      version: '1.0.1',
      submissionStatus: 'Approved',
      isLocked: false
    });
  });

  afterEach(async () => {
    await GameVersion.deleteMany({ gameId: testGameId });
  });

  describe('GET /api/dev/games/:gameId/versions', () => {
    test('should get all versions for a game', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
      expect(response.body.currentVersion).toBe('1.0.1');
      expect(response.body.versions).toBeInstanceOf(Array);
    });

    test('should show canRevertTo status correctly', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions`)
        .set('Authorization', `Bearer ${developerToken}`);

      const versions = response.body.versions;
      const approvedVersion = versions.find(v => v.versionNumber === '1.0.0');
      expect(approvedVersion.canRevertTo).toBe(true);
    });
  });

  describe('GET /api/dev/games/:gameId/versions/:versionId', () => {
    test('should get version details', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions/${version1Id}`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.version.versionNumber).toBe('1.0.0');
      expect(response.body.version.snapshot).toBeDefined();
      expect(response.body.version.changeLog).toBeDefined();
    });

    test('should return 404 for non-existent version', async () => {
      const fakeVersionId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions/${fakeVersionId}`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Version not found');
    });
  });

  describe('POST /api/dev/games/:gameId/versions/:versionId/revert', () => {
    test('should revert to previous version successfully', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/versions/${version1Id}/revert`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ confirmation: 'Test Memory Game' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.revert.revertedToVersion).toBe('1.0.0');
      expect(response.body.revert.newStatus).toBe('Draft');
      expect(response.body.revert.isLocked).toBe(false);

      // Verify game updated
      const game = await Game.findById(testGameId);
      expect(game.submissionStatus).toBe('Draft');
      expect(game.title).toBe('Test Game v1.0.0');

      // Verify new version created
      const newVersion = await GameVersion.findOne({
        gameId: testGameId,
        isRevert: true
      });
      expect(newVersion).toBeDefined();
      expect(newVersion.revertedTo.toString()).toBe(version1Id.toString());
    });

    test('should reject revert without confirmation', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/versions/${version1Id}/revert`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('confirm');
    });

    test('should reject revert with wrong confirmation', async () => {
      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/versions/${version1Id}/revert`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ confirmation: 'Wrong Title' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('exact game title');
    });

    test('should reject revert when game is locked', async () => {
      await Game.findByIdAndUpdate(testGameId, { isLocked: true });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/versions/${version1Id}/revert`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ confirmation: 'Test Memory Game' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('locked during review');

      // Restore
      await Game.findByIdAndUpdate(testGameId, { isLocked: false });
    });

    test('should reject revert to rejected version', async () => {
      await GameVersion.findByIdAndUpdate(version1Id, {
        status: 'Rejected',
        isApproved: false
      });

      const response = await request(app)
        .post(`/api/dev/games/${testGameId}/versions/${version1Id}/revert`)
        .set('Authorization', `Bearer ${developerToken}`)
        .send({ confirmation: 'Test Memory Game' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('cannot be reverted to');
    });
  });

  describe('GET /api/dev/games/:gameId/versions/compare', () => {
    test('should compare two versions', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions/compare`)
        .query({ versionId1: version1Id, versionId2: version2Id })
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.comparison).toHaveProperty('version1');
      expect(response.body.comparison).toHaveProperty('version2');
      expect(response.body.comparison).toHaveProperty('differences');
      expect(response.body.comparison.hasChanges).toBeDefined();
    });

    test('should require both version IDs', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions/compare`)
        .query({ versionId1: version1Id })
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Both versionId1 and versionId2');
    });
  });

  describe('GET /api/dev/games/:gameId/versions/approval-history', () => {
    test('should get approval history', async () => {
      const response = await request(app)
        .get(`/api/dev/games/${testGameId}/versions/approval-history`)
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
      expect(response.body.approvalHistory).toBeInstanceOf(Array);

      const history = response.body.approvalHistory;
      expect(history.every(h => h.approvedAt)).toBe(true);
    });
  });
});

// ============================================
// ADMIN REVIEW TESTS
// ============================================

describe('Admin Review Management', () => {
  beforeEach(async () => {
    await Game.findByIdAndUpdate(testGameId, {
      submissionStatus: 'In Review',
      isLocked: true,
      submittedForReviewAt: new Date()
    });

    await GameVersion.create({
      gameId: testGameId,
      versionNumber: '1.0.0',
      status: 'In Review',
      isCurrentVersion: true,
      snapshot: {
        title: 'Test Game',
        description: 'Test',
        gameUrl: '/game.html'
      },
      createdBy: developerId
    });
  });

  describe('GET /api/admin/reviews/pending', () => {
    test('should get pending reviews (admin only)', async () => {
      const response = await request(app)
        .get('/api/admin/reviews/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.games).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });

    test('should reject access for non-admin users', async () => {
      const response = await request(app)
        .get('/api/admin/reviews/pending')
        .set('Authorization', `Bearer ${developerToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/admin/reviews/games/:gameId/start', () => {
    test('should start game review', async () => {
      const response = await request(app)
        .post(`/api/admin/reviews/games/${testGameId}/start`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.review).toHaveProperty('id');
      expect(response.body.review.gameTitle).toBeDefined();

      // Verify review created
      const review = await GameReview.findById(response.body.review.id);
      expect(review).toBeDefined();
      expect(review.gameId.toString()).toBe(testGameId.toString());
    });

    test('should reject if game not in review status', async () => {
      await Game.findByIdAndUpdate(testGameId, { submissionStatus: 'Draft' });

      const response = await request(app)
        .post(`/api/admin/reviews/games/${testGameId}/start`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('not in review status');

      // Restore
      await Game.findByIdAndUpdate(testGameId, { submissionStatus: 'In Review' });
    });
  });

  describe('POST /api/admin/reviews/games/:gameId/decision', () => {
    test('should approve game', async () => {
      const response = await request(app)
        .post(`/api/admin/reviews/games/${testGameId}/decision`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Approved',
          overallComments: 'Excellent game! No issues found.',
          functionalityTest: { passed: true },
          policyCompliance: { passed: true },
          contentReview: { appropriate: true },
          performanceTest: { passed: true },
          uiuxEvaluation: { passed: true }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('approved');
      expect(response.body.game.submissionStatus).toBe('Approved');
      expect(response.body.game.isLocked).toBe(false);

      // Verify game updated
      const game = await Game.findById(testGameId);
      expect(game.submissionStatus).toBe('Approved');
      expect(game.approvedAt).toBeDefined();
      expect(game.approvedBy.toString()).toBe(adminId.toString());
    });

    test('should request changes', async () => {
      const response = await request(app)
        .post(`/api/admin/reviews/games/${testGameId}/decision`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Changes Requested',
          overallComments: 'Good game but needs improvements',
          functionalityTest: {
            passed: false,
            issues: [{ description: 'Bug on level 3', severity: 'Critical' }]
          },
          requestedChanges: [
            {
              change: 'Fix crash on level 3',
              priority: 'Critical',
              category: 'Functionality',
              mustFix: true
            },
            {
              change: 'Improve loading speed',
              priority: 'High',
              category: 'Performance',
              mustFix: true
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.game.submissionStatus).toBe('Changes Requested');
      expect(response.body.game.isLocked).toBe(false);

      // Verify changes added to game
      const game = await Game.findById(testGameId);
      expect(game.requestedChanges).toHaveLength(2);
      expect(game.requestedChanges[0].priority).toBe('Critical');
    });

    test('should reject game', async () => {
      const response = await request(app)
        .post(`/api/admin/reviews/games/${testGameId}/decision`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Rejected',
          overallComments: 'Game does not meet platform standards',
          rejectionReason: 'Violates content policy',
          policyCompliance: {
            passed: false,
            violations: [{
              policy: 'Content Guidelines',
              description: 'Inappropriate content',
              severity: 'Critical'
            }]
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.game.submissionStatus).toBe('Rejected');

      // Verify rejection recorded
      const game = await Game.findById(testGameId);
      expect(game.rejectedAt).toBeDefined();
      expect(game.rejectionReason).toBeDefined();
    });
  });
});

// ============================================
// AUTHORIZATION TESTS
// ============================================

describe('Authorization', () => {
  test('should reject requests without token', async () => {
    const response = await request(app)
      .get(`/api/dev/games/${testGameId}/media`);

    expect(response.status).toBe(401);
  });

  test('should reject requests with invalid token', async () => {
    const response = await request(app)
      .get(`/api/dev/games/${testGameId}/media`)
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  test('should reject developer access to admin endpoints', async () => {
    const response = await request(app)
      .get('/api/admin/reviews/pending')
      .set('Authorization', `Bearer ${developerToken}`);

    expect(response.status).toBe(403);
  });

  test('should prevent access to other developers games', async () => {
    // Create another developer
    const otherDev = await User.create({
      name: 'Other Developer',
      email: 'other@test.com',
      password: 'password123',
      role: 'developer',
      isActive: true,
      emailVerified: true
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'other@test.com', password: 'password123' });

    const otherToken = loginRes.body.token;

    const response = await request(app)
      .get(`/api/dev/games/${testGameId}/media`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("don't have access");

    // Cleanup
    await User.findByIdAndDelete(otherDev._id);
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe('Full Workflow Integration', () => {
  let integrationGameId;

  test('complete game submission workflow', async () => {
    // Step 1: Create game
    const game = await Game.create({
      title: 'Integration Test Game',
      description: 'Full workflow test',
      category: 'puzzle',
      difficulty: 'easy',
      gameUrl: '/game.html',
      developerId,
      developerName: 'Test Developer',
      version: '1.0.0'
    });
    integrationGameId = game._id;

    // Step 2: Create license
    await License.create({
      gameId: integrationGameId,
      developerId,
      engine: { name: 'Unity', licenseType: 'Personal License' },
      intellectualProperty: {
        ownershipStatus: 'Sole Owner',
        copyrightHolder: 'Test Dev',
        copyrightYear: 2025
      },
      declarations: {
        ownershipConfirmed: true,
        noInfringement: true,
        accurateInformation: true,
        agreementAccepted: true
      }
    });

    // Step 3: Upload cover image (mocked)
    await Game.findByIdAndUpdate(integrationGameId, {
      coverImageUrl: '/uploads/cover.jpg'
    });

    // Step 4: Upload screenshots (mocked)
    await Game.findByIdAndUpdate(integrationGameId, {
      screenshots: [
        {
          url: '/screenshot1.jpg',
          fileName: 'screenshot1.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        },
        {
          url: '/screenshot2.jpg',
          fileName: 'screenshot2.jpg',
          fileSize: 1000,
          dimensions: { width: 1920, height: 1080 },
          aspectRatio: '16:9'
        }
      ]
    });

    // Step 5: Submit for review
    const submitRes = await request(app)
      .post(`/api/dev/games/${integrationGameId}/submit`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({ changeLog: 'Initial submission' });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.submission.status).toBe('In Review');

    // Step 6: Admin reviews and requests changes
    const reviewRes = await request(app)
      .post(`/api/admin/reviews/games/${integrationGameId}/decision`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Changes Requested',
        overallComments: 'Minor issues',
        requestedChanges: [
          {
            change: 'Fix UI bug',
            priority: 'Medium',
            category: 'UI/UX',
            mustFix: false
          }
        ]
      });

    expect(reviewRes.status).toBe(200);

    // Step 7: Developer marks change as resolved
    const updatedGame = await Game.findById(integrationGameId);
    const changeId = updatedGame.requestedChanges[0]._id;

    const resolveRes = await request(app)
      .put(`/api/dev/games/${integrationGameId}/changes/${changeId}/resolve`)
      .set('Authorization', `Bearer ${developerToken}`);

    expect(resolveRes.status).toBe(200);

    // Step 8: Developer resubmits
    const resubmitRes = await request(app)
      .post(`/api/dev/games/${integrationGameId}/resubmit`)
      .set('Authorization', `Bearer ${developerToken}`)
      .send({ changeLog: 'Fixed UI bug' });

    expect(resubmitRes.status).toBe(200);

    // Step 9: Admin approves
    const approveRes = await request(app)
      .post(`/api/admin/reviews/games/${integrationGameId}/decision`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Approved',
        overallComments: 'Great job!',
        functionalityTest: { passed: true },
        policyCompliance: { passed: true },
        contentReview: { appropriate: true }
      });

    expect(approveRes.status).toBe(200);

    // Step 10: Verify final state
    const finalGame = await Game.findById(integrationGameId);
    expect(finalGame.submissionStatus).toBe('Approved');
    expect(finalGame.isLocked).toBe(false);
    expect(finalGame.approvedAt).toBeDefined();

    // Step 11: Check versions created
    const versions = await GameVersion.find({ gameId: integrationGameId });
    expect(versions.length).toBeGreaterThanOrEqual(2); // Initial + resubmission

    // Cleanup
    await Game.findByIdAndDelete(integrationGameId);
    await License.deleteOne({ gameId: integrationGameId });
    await GameVersion.deleteMany({ gameId: integrationGameId });
    await GameReview.deleteMany({ gameId: integrationGameId });
  });
});
