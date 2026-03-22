import express from "express";
import {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
} from "../controllers/transaction.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { createTransactionSchema, transactionsQuerySchema } from "../validators/transaction.validator.js";

const router = express.Router();

router.post("/", authMiddleware, validateBody(createTransactionSchema), createTransaction);
router.get("/me", authMiddleware, getMyTransactions);
router.get("/", authMiddleware, isAdmin, validateQuery(transactionsQuerySchema), getAllTransactions);

export default router;
