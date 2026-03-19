import express from "express";
import { createCharity, getCharities } from "../controllers/charity.controller.js";

const router = express.Router();

router.get("/", getCharities);
router.post("/", createCharity);

export default router;