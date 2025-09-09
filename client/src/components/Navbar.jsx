import { useState } from "react";
import { LogOut, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_4.png";
import useLogout from "../hooks/UseLogout";

export default function Navbar() {
  const { loading, logout } = useLogout();
  const [showModal, setShowModal] = useState(false);

  const handleConfirmLogout = async () => {
    await logout();
    setShowModal(false);
  };

  return (
    <>
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
          <Link to="/upload" className="btn btn-primary btn-sm md:btn-md">
            <Upload size={18} />
            Upload Expense
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-accent btn-sm md:btn-md flex items-center gap-2"
            disabled={loading}
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
              <Link to="/upload" className="flex items-center gap-2">
                <Upload size={16} /> Upload
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2"
                disabled={loading}
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
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-accent"
                onClick={handleConfirmLogout}
                disabled={loading}
              >
                {loading ? (
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
