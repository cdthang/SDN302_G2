import express from "express";
import { createCharity } from "../controllers/charity.controller.js";
const router = express.Router();

router.post("/", createCharity);

export default router;