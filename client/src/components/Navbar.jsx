import { useState } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_4.png";
import useLogout from "../hooks/UseLogout";

export default function Navbar() {
  const { loading: logoutLoading, logout } = useLogout();
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
              className="h-12 md:h-15 cursor-pointer"
            />
          </Link>
        </div>

        {/* Right: Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-circle btn-accent btn-md flex items-center gap-2"
            disabled={logoutLoading}
          >
            <LogOut size={15} />
          </button>
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
