import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import s3Upload from "../utils/s3Upload.js";
import {
  processReceipt,
  getDisplayableReceiptUrl,
} from "../controllers/receiptController.js";

const router = express.Router();

/**
 * @route   POST /api/receipts/upload
 * @desc    Uploads a receipt image, processes it with Vision AI, and creates an expense.
 * @access  Private
 *
 * Middleware Chain:
 * 1. authMiddleware: Ensures the user is logged in.
 * 2. s3Upload.single('receipt'): Handles the file upload to S3.
 * 3. processReceipt: The main controller that orchestrates the AI processing and database save.
 */
router.post(
  "/upload",
  authMiddleware,
  s3Upload.single("receipt"),
  processReceipt
);

/**
 * @route   GET /api/receipts/:id
 * @desc    Generates a temporary, secure URL to view a specific receipt image.
 * @access  Private
 */
router.get("/:id", authMiddleware, getDisplayableReceiptUrl);

export default router;
