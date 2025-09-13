import { useRef } from "react";
import { Upload } from "lucide-react";
import useUploadReceipt from "../hooks/UseUploadReceipt";

export default function ActionBar({ onAddClick }) {
  const { loading: uploadLoading, uploadReceipt } = useUploadReceipt();
  const fileInputRef = useRef(null);

  // This function is triggered when the user selects a file for AI processing
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadReceipt(file);
      event.target.value = null;
    }
  };
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {/* Hidden file input for uploading receipts */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/webp"
      />

      <div className="flex justify-between items-center mb-4">
        {/* Left Button: Manual Add */}
        <button
          className="btn btn-primary btn-md btn-outline border-dashed"
          onClick={onAddClick}
        >
          + Add Expense
        </button>

        {/* Right Button: AI Upload */}
        <button
          onClick={handleUploadClick}
          className="btn btn-info btn-md"
          disabled={uploadLoading}
        >
          {uploadLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Upload size={18} />
          )}
          {uploadLoading ? "Uploading..." : "Upload with AI"}
        </button>
      </div>
    </>
  );
}
