import { useState, useRef } from "react"; // Import useRef
import { LogOut, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_4.png";
import useLogout from "../hooks/UseLogout";
import useUploadReceipt from "../hooks/UseUploadReceipt";

export default function Navbar() {
  const { loading: logoutLoading, logout } = useLogout();
  const { loading: uploadLoading, uploadReceipt } = useUploadReceipt();
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleConfirmLogout = async () => {
    await logout();
    setShowModal(false);
  };

  // This function is triggered when the user selects a file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadReceipt(file);
      // Clear the input value to allow uploading the same file again
      event.target.value = null;
    }
  };

  // This function programmatically clicks the hidden file input
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
        accept="image/png, image/jpeg, image/webp" // Specify accepted file types
      />

      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm px-4">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Receiptify logo"
              className="h-12 w-auto md:h-13 cursor-pointer"
            />
          </Link>
        </div>

        {/* Right: Buttons */}
        <div className="flex-none hidden md:flex gap-3">
          <button
            onClick={handleUploadClick}
            className="btn btn-primary btn-sm md:btn-md"
            disabled={uploadLoading} // Disable button while uploading
          >
            {uploadLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Upload size={18} />
            )}
            {uploadLoading ? "Uploading..." : "Upload Expense"}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-accent btn-sm md:btn-md flex items-center gap-2"
            disabled={logoutLoading}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            ☰
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              {/* Changed from Link to a button to trigger the same upload logic */}
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2"
                disabled={uploadLoading}
              >
                <Upload size={16} /> Upload
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2"
                disabled={logoutLoading}
              >
                <LogOut size={16} /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
            <p className="py-2">Are you sure you want to log out?</p>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowModal(false)}
                disabled={logoutLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-accent"
                onClick={handleConfirmLogout}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
