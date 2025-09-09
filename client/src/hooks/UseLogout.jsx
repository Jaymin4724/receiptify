import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("user");
      setCurrentUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
