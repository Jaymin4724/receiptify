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
  const fetchExpenses = async () => {
    if (!currentUser.id) {
      toast.error("User not found!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/expenses`);
      console.log(res);
      setExpenses(res.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.id) {
      fetchExpenses();
    }
  }, [currentUser]);

  return { loading, expenses };
};

export default UseGetExpense;
