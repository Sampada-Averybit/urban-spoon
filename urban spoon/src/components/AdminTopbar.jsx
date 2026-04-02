import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminBellNotifications from "./AdminBellNotifications";

export default function AdminTopbar({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const storedUserRaw = localStorage.getItem("urbanSpoonUser");
  let firstName = "Manager";
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      firstName = parsed?.name ? String(parsed.name).split(" ")[0] : firstName;
    } catch {
      firstName = "Manager";
    }
  }

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  return (
    <header className="border-b border-[#e6e7ec] bg-white">
      <div className="flex h-[4.5rem] w-full items-center justify-between gap-2 px-4 max-[900px]:px-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.32rem] font-bold text-[#ef2c5b]">Urban Spoon</h1>
          {children}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AdminBellNotifications />

          <button
            onClick={() => navigate("/profile")}
            className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-[#11182f] bg-[#11182f] transition-transform hover:scale-105"
            aria-label="Open profile"
          >
            <img
              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${firstName}&backgroundColor=b6e3f4`}
              alt="Admin avatar"
              className="h-full w-full object-cover"
            />
          </button>

          <button
            onClick={handleLogout}
            className="rounded-full bg-[#ef2c5b] px-3 py-1.5 text-[0.8rem] font-semibold text-white hover:bg-[#db2551]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
