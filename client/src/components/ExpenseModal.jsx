import { useState, useEffect } from "react";
import InputField from "./InputField";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];

const INITIAL_STATE = {
  vendor: "",
  amount: "",
  date: new Date().toISOString().split("T")[0], // Defaults to today
  category: "Other",
  receiptImage: null,
};

export default function ExpenseModal({
  isOpen,
  onClose,
  expenseToEdit,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState(INITIAL_STATE);

  useEffect(() => {
    if (expenseToEdit) {
      setForm({
        vendor: expenseToEdit.vendor || "",
        amount: expenseToEdit.amount || "",
        date: new Date(expenseToEdit.date).toISOString().split("T")[0],
        category: expenseToEdit.category || "Other",
        receiptImage: null,
      });
    } else {
      setForm(INITIAL_STATE);
    }
  }, [expenseToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, receiptImage: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">
          {expenseToEdit ? "Edit Expense" : "Add New Expense"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Vendor"
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            required
          />
          <InputField
            label="Amount (₹)"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <InputField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="label text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="select select-bordered"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="receiptImage" className="label text-sm font-medium">
              Receipt (Optional)
            </label>
            <input
              id="receiptImage"
              name="receiptImage"
              type="file"
              className="file-input file-input-bordered"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
