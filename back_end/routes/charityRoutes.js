import express from "express";
import { createCharity } from "../controllers/charityController.js";
const router = express.Router();

router.post("/", createCharity);

export default router;