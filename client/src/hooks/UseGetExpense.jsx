import { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const UseGetExpense = () => {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!currentUser?.id) {
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`/api/expenses`);
        setExpenses(res.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
        setExpenses([]); // Clear expenses on error
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [currentUser]);

  return { loading, expenses };
};

export default UseGetExpense;
