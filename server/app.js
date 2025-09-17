// Package Imports
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// File Imports
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";

// Variables
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Secure HTTP headers
app.set("trust proxy", 1);

const allowedOrigins = process.env.CLIENT_URL || "";
const whitelist = allowedOrigins.split(",").map((url) => url.trim());
console.log("Allowed CORS origins:", whitelist);

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // A standard format for production logs
} else {
  app.use(morgan("dev"));
}

// Rate limit for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per window per IP
  message: { message: "Too many login/signup attempts, try again later" },
});
app.use("/api/auth", authLimiter);

// Routes
app.get("/", (req, res) => {
  res.send("API is working...");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/receipts", receiptRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}/`)
  );
});
