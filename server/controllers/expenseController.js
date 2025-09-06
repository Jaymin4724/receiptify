import { body, validationResult } from "express-validator";
import Expense from "../models/expenseModel.js";

// Validation rules
export const addExpenseValidation = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than 0"),
  body("receiptImageUrl")
    .notEmpty()
    .withMessage("Receipt image URL is required"),
  body("vendor").optional().isString().withMessage("Vendor must be a string"),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
];

// Validation rules for updating expense
export const updateExpenseValidation = [
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than 0"),
  body("receiptImageUrl")
    .optional()
    .notEmpty()
    .withMessage("Receipt image URL is required"),
  body("vendor").optional().isString().withMessage("Vendor must be a string"),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
];

// Add Expense
export const addExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { vendor, amount, date, receiptImageUrl } = req.body;

    const expense = new Expense({
      vendor: vendor || "Unknown",
      amount,
      date: date || Date.now(),
      receiptImageUrl,
      owner: req.user._id, // from authMiddleware
    });

    const savedExpense = await expense.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense: savedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Get all expenses of logged-in user
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

// Update an expense
export const updateExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { vendor, amount, date, receiptImageUrl } = req.body;

    // Find the expense by id and owner
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update fields if provided
    if (vendor !== undefined) expense.vendor = vendor;
    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = date;
    if (receiptImageUrl !== undefined)
      expense.receiptImageUrl = receiptImageUrl;

    const updatedExpense = await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an expense
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
