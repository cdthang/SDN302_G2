import express from "express";
import {createPost,getPosts,getPostById,updatePost,deletePost,approvePost} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
router.post("/", authMiddleware, upload.array("images", 5), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.patch("/:id/approve", authMiddleware, approvePost);
export default router;