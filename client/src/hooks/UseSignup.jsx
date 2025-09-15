import { useContext, useState } from "react";
import axios from "../axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const UseSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleInputErrors = (formData) => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      toast.error("Please fill in all fields !");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long !");
      return false;
    }
    return true;
  };

  const signup = async (formData) => {
    const validation = handleInputErrors(formData);
    if (!validation) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", formData);
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      setCurrentUser(userData);
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default UseSignup;
