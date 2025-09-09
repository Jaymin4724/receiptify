import { body, validationResult } from "express-validator";
import Expense from "../models/expenseModel.js";

// A constant for our allowed categories to avoid repetition and typos.
const allowedCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

// --- VALIDATION RULES (UPDATED & FIXED) ---
export const addExpenseValidation = [
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("receiptImageUrl")
    .notEmpty()
    .withMessage("Receipt image key is required"),
  body("vendor").optional().isString(),
  // TYPO FIX: Changed to the correct isISO8601 function.
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  // Add validation for the new category field.
  body("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage("Invalid category"),
];

export const updateExpenseValidation = [
  body("amount").optional().isNumeric().withMessage("Amount must be a number"),
  body("vendor").optional().isString(),
  // TYPO FIX: Changed to the correct isISO8601 function.
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("receiptImageUrl").optional().notEmpty(),
  // Add validation for the category field on update.
  body("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage("Invalid category"),
];

// --- CONTROLLERS (UPDATED) ---

// Add a new expense manually.
export const addExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the new category field from the request body.
    const { vendor, amount, date, receiptImageUrl, category } = req.body;

    const expense = new Expense({
      vendor: vendor || "Unknown",
      amount,
      date: date || new Date(),
      receiptImageUrl,
      category: category || "Other", // Add the category to the new document.
      owner: req.user._id,
    });
    const savedExpense = await expense.save();

    res
      .status(201)
      .json({ message: "Expense added successfully", expense: savedExpense });
  } catch (error) {
    next(error);
  }
};

// Get all expenses for the logged-in user.
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

// Update an existing expense.
export const updateExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { vendor, amount, date, receiptImageUrl, category } = req.body;
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update fields only if they are provided in the request.
    if (vendor !== undefined) expense.vendor = vendor;
    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = date;
    if (receiptImageUrl !== undefined)
      expense.receiptImageUrl = receiptImageUrl;
    if (category !== undefined) expense.category = category; // Update the category.

    const updatedExpense = await expense.save();
    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an expense.
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};
