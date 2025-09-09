import useLogout from "../hooks/UseLogout";
import { LogOut } from "lucide-react"; // logout icon

export default function Dashboard() {
  const { loading, logout } = useLogout();
  const handleLogout = () => {
    console.log("User logged out");
    logout();
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm px-4">
        {/* Left: Logo */}
        <div className="flex-1">
          <img
            src="../src/assets/logo_4.png"
            alt="Receiptify logo"
            className="h-10 w-auto md:h-13"
          />
        </div>

        {/* Right: Logout */}
        <div className="flex-none">
          <button
            onClick={handleLogout}
            className="btn btn-sm md:btn-md btn-soft flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <LogOut size={18}></LogOut>
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
