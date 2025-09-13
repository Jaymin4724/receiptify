import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  addExpenseValidation,
  updateExpenseValidation,
} from "../controllers/expenseController.js";
import s3Upload from "../utils/s3Upload.js";

const router = express.Router();

// Protected Routes
router.post(
  "/",
  authMiddleware,
  s3Upload.single("receiptImage"),
  addExpenseValidation,
  addExpense
);

// PATCH /api/expenses/:id - Update an expense
// Also use the middleware here to handle an optional new image upload.
router.patch(
  "/:id",
  authMiddleware,
  s3Upload.single("receiptImage"),
  updateExpenseValidation,
  updateExpense
);

router.get("/", authMiddleware, getExpenses); // Get all expenses
router.delete("/:id", authMiddleware, deleteExpense); // Delete expense

export default router;
