import { body, validationResult } from "express-validator";
import Expense from "../models/expenseModel.js";
import { deleteS3Object } from "../utils/s3Upload.js";

const allowedCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

export const addExpenseValidation = [
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("vendor").notEmpty().withMessage("Vendor is required"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage("Invalid category"),
];

export const updateExpenseValidation = [
  body("amount").optional().isNumeric().withMessage("Amount must be a number"),
  body("vendor").optional().isString(),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage("Invalid category"),
];

export const addExpense = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      await deleteS3Object(req.file.key);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { vendor, amount, date, category } = req.body;
    const receiptImageKey = req.file ? req.file.key : null;
    const expense = new Expense({
      vendor,
      amount,
      date: date || new Date(),
      category: category || "Other",
      receiptImageUrl: receiptImageKey,
      owner: req.user._id,
    });
    const savedExpense = await expense.save();
    res
      .status(201)
      .json({ message: "Expense added successfully", expense: savedExpense });
  } catch (error) {
    if (req.file) {
      await deleteS3Object(req.file.key);
    }
    next(error); // Pass the original error to the global error handler.
  }
};

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

export const updateExpense = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      await deleteS3Object(req.file.key);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!expense) {
      if (req.file) {
        await deleteS3Object(req.file.key);
      }
      return res.status(404).json({
        message: "Expense not found or you do not have permission to edit it.",
      });
    }

    const oldImageKey = expense.receiptImageUrl; // Keep track of the old key

    if (req.file) {
      expense.receiptImageUrl = req.file.key;
    }

    const { vendor, amount, date, category } = req.body;
    if (vendor !== undefined) expense.vendor = vendor;
    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = date;
    if (category !== undefined) expense.category = category;

    const updatedExpense = await expense.save();

    if (req.file) {
      await deleteS3Object(oldImageKey);
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    if (req.file) {
      await deleteS3Object(req.file.key);
    }
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.receiptImageUrl) {
      await deleteS3Object(expense.receiptImageUrl);
    }
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};
