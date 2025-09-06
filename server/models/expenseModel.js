import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    vendor: { type: String, default: "Unknown" },
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
    receiptImageUrl: { type: String, required: true },

    // Link expense to user
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
