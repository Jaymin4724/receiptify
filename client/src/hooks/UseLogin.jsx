import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const UseLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleInputErrors = (formData) => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Please fill in all fields !");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long !");
      return false;
    }
    return true;
  };
  const login = async (formData) => {
    const validation = handleInputErrors(formData);
    if (!validation) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", formData);
      toast.success("Login successful!");
      const userData = res.data.user;
      console.log(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setCurrentUser(userData);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  return { loading, login };
};

export default UseLogin;
