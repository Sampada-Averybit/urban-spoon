import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("urbanSpoonToken");
    localStorage.removeItem("urbanSpoonUser");
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-[#fcfafb] font-sans relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(239, 44, 91, 0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(239, 44, 91, 0.03), transparent 40%), #fbf9fa",
      }}
    >
      {/* Header Area representing the back bar */}
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5 max-[760px]:px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-lg font-semibold text-[#12182f] transition-colors hover:text-[#ef2c5b]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef2c5b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          My Profile
        </button>
      </div>

      <main className="relative z-10 mx-auto max-w-[480px] px-4 pb-12 pt-2">
        {loading ? (
          <p className="text-center text-[#64748b]">Loading profile...</p>
        ) : error ? (
          <div className="rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-[0.95rem] font-semibold text-[#ef2c5b]">
            {error}
          </div>
        ) : (
          <div className="grid gap-4">
            {/* User Info Card */}
            <div className="relative mb-1 flex flex-col items-center rounded-[1.2rem] bg-white p-6 shadow-[0_12px_40px_rgba(239,44,91,0.04)]">
              <div className="relative mb-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#1b253b] shadow-md">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                      profile?.name || "Felix"
                    }&backgroundColor=1b253b`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-[#ef2c5b] p-1.5 text-white shadow-sm transition-transform hover:scale-110">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
              </div>

              <h2 className="mb-1 text-2xl font-bold text-[#12182f]">
                {profile?.name}
              </h2>
              <p className="mb-0.5 text-[0.85rem] tracking-wide text-[#6b7280]">
                {profile?.phone}
              </p>
              <p className="mb-5 text-[0.85rem] text-[#6b7280]">
                {profile?.email}
              </p>

              <button className="rounded-full bg-[#ef2c5b] px-8 py-3 text-[0.85rem] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(239,44,91,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-[#d91e4a]">
                Edit Profile
              </button>
            </div>

            {/* My Orders Card */}
            <div
              onClick={() => navigate("/dashboard")}
              className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-[1rem] bg-[#e4efeb] p-4 transition-colors hover:bg-[#d9e9e3]"
            >
              <div className="z-10 rounded-xl bg-white p-2.5 shadow-sm">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#256c54"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="z-10 flex-1">
                <h3 className="text-[1.05rem] font-bold text-[#134d38]">
                  My Orders
                </h3>
                <p className="mt-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-[#256c54]">
                  View your history
                </p>
              </div>
              <div className="z-10 text-[#134d38] transition-transform group-hover:translate-x-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>

              {/* Background watermark */}
              <div className="pointer-events-none absolute right-4 top-1/2 z-0 -translate-y-1/2 text-[#c8e2d8] opacity-60">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 2v9a4 4 0 0 1-4 4v7h-2v-7a4 4 0 0 1-4-4V2h2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2h2zm6 0v11l-3 3v6h-2v-6l-3-3V2c0 2.5 1.5 5 3 6v4h2V8c1.5-1 3-3.5 3-6z" />
                </svg>
              </div>
            </div>

            {/* Change Password */}
            <div className="group flex cursor-pointer items-center gap-4 rounded-[1rem] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors hover:bg-gray-50">
              <div className="p-1">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef2c5b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M12 10v4"></path>
                  <path d="M10 12h4"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[0.95rem] font-bold text-[#12182f]">
                  Change Password
                </h3>
              </div>
              <div className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>

            {/* Logout */}
            <div
              onClick={handleLogout}
              className="group flex cursor-pointer items-center gap-4 rounded-[1rem] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors hover:bg-red-50"
            >
              <div className="p-1">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef2c5b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[0.95rem] font-bold text-[#ef2c5b]">
                  Logout
                </h3>
              </div>
              <div className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
