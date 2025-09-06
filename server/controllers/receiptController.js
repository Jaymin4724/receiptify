import Expense from "../models/expenseModel.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { s3Client } from "../utils/s3Upload.js";

// Initialize the clients for Google Cloud Vision (OCR) and Gemini (LLM).
const visionClient = new ImageAnnotatorClient();

/**
 * Uses the Gemini LLM to intelligently extract structured data from raw receipt text.
 * @param {string} text The raw text from the receipt OCR.
 * @returns {Promise<object>} A promise that resolves to the structured expense data.
 */
const extractExpenseDataWithGemini = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  // This is the prompt that instructs the LLM how to behave and what to do.
  const prompt = `
    You are an expert expense tracking assistant. Analyze the following raw text from a receipt 
    and extract the vendor name, the total amount, and the transaction date. 
    If you cannot determine a value, use a sensible default like "Unknown" for the vendor or null for the amount/date.
    Receipt Text:
    ---
    ${text}
    ---
  `;

  // This schema defines the exact JSON structure we want the LLM to return.
  const schema = {
    type: "OBJECT",
    properties: {
      vendor: { type: "STRING" },
      totalAmount: { type: "NUMBER" },
      transactionDate: {
        type: "STRING",
        description: "The date in YYYY-MM-DD format, or null if not found.",
      },
    },
    required: ["vendor", "totalAmount", "transactionDate"],
  };

  // Construct the full API payload.
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const jsonText = result.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return a default object on failure so the app doesn't crash.
    return {
      vendor: "Parsing Error",
      totalAmount: 0,
      transactionDate: new Date(),
    };
  }
};

/**
 * Processes an uploaded receipt image, sends it to the Vision and Gemini APIs,
 * and creates a new expense record.
 */
export const processReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No receipt image was uploaded." });
    }
    const s3Key = req.file.key;

    // 1. Generate a temporary URL for Google Vision to perform OCR.
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    });

    // 2. Get the raw text from the receipt.
    const [result] = await visionClient.textDetection(presignedUrl);
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return res
        .status(400)
        .json({ message: "Could not read text from the receipt." });
    }
    const receiptText = detections[0].description;

    // 3. (THE UPGRADE) Use the Gemini LLM to parse the raw text into structured data.
    const { vendor, totalAmount, transactionDate } =
      await extractExpenseDataWithGemini(receiptText);

    // 4. Create the new expense document with the intelligent data.
    const newExpense = new Expense({
      vendor: vendor || "Unknown",
      amount: totalAmount || 0,
      date: transactionDate ? new Date(transactionDate) : new Date(),
      receiptImageUrl: s3Key,
      owner: req.user._id,
    });
    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: "Expense successfully created from receipt!",
      expense: savedExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generates a secure, temporary, and DISPLAYABLE URL for a single receipt image.
 */
export const getDisplayableReceiptUrl = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: expense.receiptImageUrl,
      ResponseContentDisposition: "inline",
      ResponseContentType: "image/jpeg",
    });
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
    res.status(200).json({ displayUrl: presignedUrl });
  } catch (error) {
    next(error);
  }
};
