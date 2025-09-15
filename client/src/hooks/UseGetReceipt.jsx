import { useState } from "react";
import axios from "../axiosConfig";
import toast from "react-hot-toast";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const UseGetReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(null);

  const fetchReceipt = async (expenseId) => {
    if (!expenseId) {
      toast.error("Expense ID is required");
      return;
    }

    setLoading(true);
    setReceiptUrl(null);
    try {
      const res = await axios.get(`/api/receipts/${expenseId}`);
      setReceiptUrl(res.data.displayUrl || null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { loading, receiptUrl, fetchReceipt };
};

export default UseGetReceipt;
