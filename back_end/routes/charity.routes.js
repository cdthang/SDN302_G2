import express from "express";
import { createCharity, getAllCharities, getCharityStats, getCharityWithDonations, donateToCharity, updateCharity, deleteCharity, generateAIContent } from "../controllers/charity.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", getCharityStats);
router.get("/", getAllCharities);
router.get("/:id", getCharityWithDonations);
router.post("/:id/donate", donateToCharity);
router.post("/generate-ai-content", authMiddleware, generateAIContent);

// Admin only routes
router.post("/", authMiddleware, isAdmin, createCharity);
router.put("/:id", authMiddleware, isAdmin, updateCharity);
router.delete("/:id", authMiddleware, isAdmin, deleteCharity);

export default router;