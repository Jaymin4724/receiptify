import Expense from "../models/expenseModel.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { s3Client } from "../utils/s3Upload.js";

// Initialize the Google Vision Client.
// It automatically uses the credentials file specified in your .env file.
const visionClient = new ImageAnnotatorClient();

/**
 * A helper function to parse raw text from a receipt.
 * @param {string} text The full text extracted by the Vision API.
 * @returns {{amount: number, vendor: string}} The parsed expense data.
 */
const parseReceiptText = (text) => {
  let amount = 0;
  let vendor = "Unknown";

  // A basic regex to find a line with a keyword like "TOTAL" or "AMOUNT"
  // followed by a number in the format XX.XX.
  const totalMatch = text.match(
    /TOTAL|Total|AMOUNT|Amount|Charge|CHARGETO.*?\b(\d+\.\d{2})\b/im
  );
  if (totalMatch && totalMatch[1]) {
    amount = parseFloat(totalMatch[1]);
  }

  // Assume the first line of the receipt is the vendor's name.
  if (text) {
    vendor = text.split("\n")[0].trim();
  }

  return { amount, vendor };
};

/**
 * Processes an uploaded receipt image, sends it to the Vision API,
 * parses the result, and creates a new expense record.
 */
export const processReceipt = async (req, res, next) => {
  try {
    // 1. Confirm that the s3Upload middleware has successfully uploaded a file.
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No receipt image was uploaded." });
    }
    const s3Key = req.file.key; // The unique private key for the object in S3.

    // 2. Generate a temporary, secure URL (a presigned URL) for the private S3 object.
    // This allows a trusted service like Google Vision to access the file for a short time.
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    }); // URL is valid for 10 minutes.

    // 3. Send the presigned URL to the Google Vision API for text detection (OCR).
    const [result] = await visionClient.textDetection(presignedUrl);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return res
        .status(400)
        .json({ message: "Could not read text from the receipt." });
    }
    const receiptText = detections[0].description; // The full text extracted from the image.

    // 4. Use our helper function to parse the raw text into structured data.
    const { amount, vendor } = parseReceiptText(receiptText);

    // 5. Create a new expense document in the database.
    const newExpense = new Expense({
      vendor,
      amount,
      date: new Date(),
      receiptImageUrl: s3Key, // Store the private S3 key, NOT a public URL.
      owner: req.user._id, // Associate with the authenticated user.
    });
    const savedExpense = await newExpense.save();

    // 6. Send a success response with the newly created expense data.
    res.status(201).json({
      message: "Expense successfully created from receipt!",
      expense: savedExpense,
    });
  } catch (error) {
    next(error); // Pass any errors to the global error handler.
  }
};

/**
 * Generates a secure, temporary, and DISPLAYABLE URL for a single receipt image.
 * This is used for on-demand viewing of private S3 objects.
 */
export const getDisplayableReceiptUrl = async (req, res, next) => {
  try {
    // 1. Find the expense and verify that it belongs to the logged-in user.
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // 2. Create the command to generate a presigned URL.
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: expense.receiptImageUrl,
      // **Crucially**, override the response headers to ensure the browser
      // displays the image instead of downloading it.
      ResponseContentDisposition: "inline",
      ResponseContentType: "image/jpeg",
    });

    // 3. Generate the secure URL, valid for 5 minutes.
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    // 4. Send the temporary, displayable URL back to the client.
    res.status(200).json({ displayUrl: presignedUrl });
  } catch (error) {
    next(error);
  }
};
