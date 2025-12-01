// src/routes/community.js
import express from "express";
import {
  createCommunity,
  getCommunities,
  joinCommunity,
  leaveCommunity,
  createPost,
  getCommunityPosts,
  toggleLikePost,
  addComment,
} from "../controllers/communityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Communities
router.post("/", authMiddleware, createCommunity);
router.get("/", authMiddleware, getCommunities);
router.post("/:communityId/join", authMiddleware, joinCommunity);
router.post("/:communityId/leave", authMiddleware, leaveCommunity);

// Posts
router.post("/:communityId/posts", authMiddleware, createPost);
router.get("/:communityId/posts", authMiddleware, getCommunityPosts);
router.post("/posts/:postId/like", authMiddleware, toggleLikePost);
router.post("/posts/:postId/comments", authMiddleware, addComment);

export default router;
