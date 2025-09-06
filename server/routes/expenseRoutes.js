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

const router = express.Router();

// Protected Routes
router.post("/", authMiddleware, addExpenseValidation, addExpense); // Add expense
router.get("/", authMiddleware, getExpenses); // Get all expenses
router.patch("/:id", authMiddleware, updateExpenseValidation, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense); // Delete expense

export default router;
