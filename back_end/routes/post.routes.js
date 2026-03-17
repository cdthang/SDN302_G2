import express from "express";
import {createPost,getPosts,getPostById,updatePost,deletePost,approvePost} from "../controllers/post.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
router.post("/", authMiddleware, upload.array("images", 5), createPost);
router.get("/", authMiddleware, getPosts);
router.get("/:id", authMiddleware, getPostById);
router.put("/:id", authMiddleware, updatePost);
router.patch("/:id/approve", authMiddleware, isAdmin, approvePost);
export default router;