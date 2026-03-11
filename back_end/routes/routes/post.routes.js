import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  approvePost
} from "../controllers/post.controller.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();
router.post("/", upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/approve", approvePost);
export default router;