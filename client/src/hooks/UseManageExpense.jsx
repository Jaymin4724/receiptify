import { useState } from "react";
import axios from "./axiosConfig";
import toast from "react-hot-toast";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const useManageExpense = () => {
  const [loading, setLoading] = useState(false);

  const handleRequest = async (requestFunc, successMessage) => {
    setLoading(true);
    try {
      await requestFunc();
      toast.success(successMessage);
      window.location.reload();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (formData) => {
    await handleRequest(
      () => axios.post("/api/expenses", formData),
      "Expense added successfully!"
    );
  };

  const updateExpense = async (id, formData) => {
    await handleRequest(
      () => axios.patch(`/api/expenses/${id}`, formData),
      "Expense updated successfully!"
    );
  };

  const deleteExpense = async (id) => {
    await handleRequest(
      () => axios.delete(`/api/expenses/${id}`),
      "Expense deleted successfully!"
    );
  };

  return { loading, addExpense, updateExpense, deleteExpense };
};

export default useManageExpense;
