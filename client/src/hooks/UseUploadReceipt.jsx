import { useState } from "react";
import axios from "../axiosConfig";
import toast from "react-hot-toast";
const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

const useUploadReceipt = () => {
  const [loading, setLoading] = useState(false);
  const uploadReceipt = async (file) => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("receipt", file);

    try {
      await axios.post("/api/receipts/upload", formData);
      toast.success("Receipt uploaded successfully!");
      window.location.reload();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return { loading, uploadReceipt };
};

export default useUploadReceipt;
