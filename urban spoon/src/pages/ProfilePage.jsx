import React, { useState, useEffect } from "react";
import { apiUrl } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";
import {
  getFieldClass,
  validateEmail,
  validatePhone,
  validatePassword,
  VALIDATION_ERROR_TEXT_CLASS,
} from "../utils/validation";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { token: authToken, isLoggedIn, login, logout, user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [profileFieldErrors, setProfileFieldErrors] = useState({
    email: "",
    phone: "",
  });
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({
    newPassword: "",
  });

  useEffect(() => {
    const storedUserStr = localStorage.getItem("urbanSpoonUser");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        setProfile(storedUser);
        setFormData({
          name: storedUser?.name || "",
          email: storedUser?.email || "",
          phone: storedUser?.phone || "",
        });
      } catch (parseError) {
        console.error("Failed to parse local user data:", parseError);
      }
    }

    const token = authToken || localStorage.getItem("urbanSpoonToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(apiUrl("/api/users/profile"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const raw = await res.text();
        let data = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          if (raw.trim().startsWith("<!DOCTYPE")) {
            throw new Error("Received HTML instead of JSON. Please verify the backend API URL/server.");
          }
          throw new Error("Invalid server response format.");
        }

        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
        return data;
      })
      .then((data) => {
        setProfile(data);
        setFormData({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [authToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setProfileFieldErrors((prev) => ({ ...prev, email: value.trim() ? validateEmail(value) : "" }));
    }

    if (name === "phone") {
      setProfileFieldErrors((prev) => ({ ...prev, phone: value.trim() ? validatePhone(value) : "" }));
    }
  };

  const handleEditClick = () => {
    setSuccessMessage("");
    setUpdateError("");
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });
    setProfileFieldErrors({ email: "", phone: "" });
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });
    setIsEditMode(false);
    setSuccessMessage("");
    setUpdateError("");
    setProfileFieldErrors({ email: "", phone: "" });
  };

  const handleSaveChanges = async () => {
    setSuccessMessage("");
    setUpdateError("");

    const nextProfileFieldErrors = {
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
    };
    setProfileFieldErrors(nextProfileFieldErrors);

    if (nextProfileFieldErrors.email || nextProfileFieldErrors.phone) {
      setUpdateError("Please fix the highlighted fields.");
      return;
    }

    setIsSaving(true);

    try {
      const token = authToken || localStorage.getItem("urbanSpoonToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(apiUrl("/api/users/update-profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        if (raw.trim().startsWith("<!DOCTYPE")) {
          throw new Error("Received HTML instead of JSON. Please verify the backend API URL/server.");
        }
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data);
      setFormData({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
      });
      setIsEditMode(false);
      setSuccessMessage("Profile updated successfully.");

      const existingUserStr = localStorage.getItem("urbanSpoonUser");
      const existingUser = existingUserStr ? JSON.parse(existingUserStr) : {};
      const updatedUser = { ...existingUser, ...data, token };
      login(token, updatedUser);
    } catch (err) {
      setUpdateError(err.message || "Something went wrong while updating profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  const handlePasswordToggle = () => {
    setIsPasswordMode((prev) => !prev);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    setPasswordError("");
    setPasswordSuccessMessage("");
    setPasswordFieldErrors({ newPassword: "" });
  };

  const handlePasswordCancel = () => {
    setIsPasswordMode(false);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    setPasswordError("");
    setPasswordSuccessMessage("");
    setPasswordFieldErrors({ newPassword: "" });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      setPasswordFieldErrors((prev) => ({
        ...prev,
        newPassword: value ? validatePassword(value) : "",
      }));
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    setPasswordSuccessMessage("");
    setPasswordFieldErrors({ newPassword: "" });

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Please enter current and new password.");
      return;
    }

    const newPasswordError = validatePassword(passwordForm.newPassword);
    if (newPasswordError) {
      setPasswordFieldErrors({ newPassword: newPasswordError });
      setPasswordError("Please fix the highlighted fields.");
      return;
    }

    const token = authToken || localStorage.getItem("urbanSpoonToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsPasswordSaving(true);
    try {
      const response = await fetch(apiUrl("/api/user/change-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        if (raw.trim().startsWith("<!DOCTYPE")) {
          throw new Error("Received HTML instead of JSON. Please verify the backend API URL/server.");
        }
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordSuccessMessage(data.message || "Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setIsPasswordMode(false);
    } catch (err) {
      setPasswordError(err.message || "Unable to change password.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const roleFromContext = String(authUser?.role || "").toLowerCase();
  const roleFromStorage = String(profile?.role || "").toLowerCase();
  const isAdminUser = roleFromContext === "admin" || roleFromStorage === "admin";
  const dashboardTarget = isAdminUser ? "/admin" : "/dashboard";
  const ordersTarget = isAdminUser ? "/admin/orders" : "/my-orders";
  const profileContainerClass = isAdminUser
    ? "h-[100dvh] bg-[#fcfafb] font-sans relative overflow-hidden"
    : "h-[calc(100dvh-4.5rem)] bg-[#fcfafb] font-sans relative overflow-hidden";

  return (
    <div
      className={profileContainerClass}
      style={{
        background:
          "radial-gradient(circle at top right, rgba(239, 44, 91, 0.08), transparent 40%), radial-gradient(circle at bottom left, rgba(17, 24, 39, 0.04), transparent 45%), #fbf9fa",
      }}
    >
      {isAdminUser && <AdminTopbar />}

      <div className={isAdminUser ? "mx-auto grid h-[calc(100dvh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1" : ""}>
        {isAdminUser && <Sidebar />}
        <div className={isAdminUser ? "h-full overflow-hidden" : ""}>
      {/* Header Area representing the back bar */}
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-3 max-[760px]:px-4">
        <button
          onClick={() => navigate(isLoggedIn ? dashboardTarget : "/login", { replace: true })}
          className="flex items-center gap-3 rounded-full px-2 py-1 text-lg font-semibold text-[#12182f] transition-colors hover:text-[#ef2c5b]"
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
        <p className="text-[0.85rem] font-medium text-[#64748b] max-[760px]:hidden">
          Manage your account details and security settings
        </p>
      </div>

      <main className="relative z-10 mx-auto h-[calc(100%-4.25rem)] max-w-[1100px] px-4 pb-4 pt-1 max-[760px]:overflow-y-auto">
        {loading ? (
          <p className="text-center text-[#64748b]">Loading profile...</p>
        ) : error ? (
          <div className="rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-[0.95rem] font-semibold text-[#ef2c5b]">
            {error}
          </div>
        ) : (
          <div className="grid h-full gap-4 md:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
            <div className="min-h-0">
              {/* User Info Card */}
              <div className="relative mb-1 flex h-full flex-col justify-between rounded-[1.2rem] border border-[rgba(15,23,42,0.06)] bg-white p-5 shadow-[0_12px_40px_rgba(239,44,91,0.05)]">
              <div>
              <div className="relative mb-4 mx-auto w-fit">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#1b253b] shadow-md">
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

              <h2 className="mb-1 text-center text-2xl font-bold text-[#12182f]">
                {isEditMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full rounded-[0.75rem] border border-[#dbe2ee] px-3 py-2 text-center text-[1.25rem] font-bold text-[#12182f] outline-none focus:border-[#ef2c5b]"
                    required
                  />
                ) : (
                  profile?.name
                )}
              </h2>
              <p className="mb-4 text-center text-[0.84rem] text-[#64748b]">Keep your contact details up to date for bookings and notifications.</p>

              <div className="mb-5 grid gap-3 rounded-[0.9rem] bg-[#f8fafc] p-3">
                <div className="grid gap-1">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#64748b]">Email</p>
                  {isEditMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSaving}
                      className={getFieldClass("w-full rounded-[0.65rem] border border-[#dbe2ee] bg-white px-3 py-2 text-[0.9rem] text-[#0f172a] outline-none focus:border-[#ef2c5b]", profileFieldErrors.email)}
                      required
                    />
                  ) : (
                    <p className="rounded-[0.65rem] border border-[#e2e8f0] bg-white px-3 py-2 text-[0.9rem] font-medium text-[#0f172a]">{profile?.email || "Not set"}</p>
                  )}
                  {isEditMode && profileFieldErrors.email && <p className={VALIDATION_ERROR_TEXT_CLASS}>{profileFieldErrors.email}</p>}
                </div>

                <div className="grid gap-1">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#64748b]">Phone</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSaving}
                      className={getFieldClass("w-full rounded-[0.65rem] border border-[#dbe2ee] bg-white px-3 py-2 text-[0.9rem] text-[#0f172a] outline-none focus:border-[#ef2c5b]", profileFieldErrors.phone)}
                      required
                    />
                  ) : (
                    <p className="rounded-[0.65rem] border border-[#e2e8f0] bg-white px-3 py-2 text-[0.9rem] font-medium text-[#0f172a]">{profile?.phone || "Not set"}</p>
                  )}
                  {isEditMode && profileFieldErrors.phone && <p className={VALIDATION_ERROR_TEXT_CLASS}>{profileFieldErrors.phone}</p>}
                </div>
              </div>
              </div>

              {isEditMode ? (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="rounded-full bg-[#ef2c5b] px-6 py-3 text-[0.8rem] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(239,44,91,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-[#d91e4a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="rounded-full border border-[#dbe2ee] bg-white px-6 py-3 text-[0.8rem] font-bold uppercase tracking-wide text-[#475569] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="mx-auto rounded-full bg-[#ef2c5b] px-8 py-3 text-[0.85rem] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(239,44,91,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-[#d91e4a]"
                >
                  Edit Profile
                </button>
              )}

              {successMessage && (
                <div className="mt-4 w-full rounded-[0.5rem] bg-[#dcfce7] px-4 py-3 text-center text-[0.9rem] font-semibold text-[#166534]">
                  {successMessage}
                </div>
              )}

              {!loading && updateError && (
                <div className="mt-4 w-full rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-center text-[0.9rem] font-semibold text-[#ef2c5b]">
                  {updateError}
                </div>
              )}
              </div>
            </div>

            <div className="grid content-start gap-4">
              <p className="px-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                Quick Actions
              </p>

              {!isAdminUser && (
                <div
                  onClick={() => navigate(ordersTarget)}
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
              )}

              {/* Change Password */}
              <div className="rounded-[1rem] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4">
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
                {!isPasswordMode && (
                  <button
                    onClick={handlePasswordToggle}
                    disabled={isPasswordSaving}
                    className="rounded-full bg-[#ef2c5b] px-4 py-2 text-[0.75rem] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#d91e4a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isPasswordMode && (
                <div className="mt-4 grid gap-3">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Current Password"
                    disabled={isPasswordSaving}
                    className="w-full rounded-[0.75rem] border border-[#dbe2ee] px-3 py-2 text-[0.9rem] text-[#1f2937] outline-none focus:border-[#ef2c5b]"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="New Password"
                    disabled={isPasswordSaving}
                    className={getFieldClass("w-full rounded-[0.75rem] border border-[#dbe2ee] px-3 py-2 text-[0.9rem] text-[#1f2937] outline-none focus:border-[#ef2c5b]", passwordFieldErrors.newPassword)}
                  />
                  {passwordFieldErrors.newPassword && <p className={VALIDATION_ERROR_TEXT_CLASS}>{passwordFieldErrors.newPassword}</p>}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePasswordSave}
                      disabled={isPasswordSaving}
                      className="rounded-full bg-[#ef2c5b] px-5 py-2 text-[0.75rem] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#d91e4a] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isPasswordSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handlePasswordCancel}
                      disabled={isPasswordSaving}
                      className="rounded-full border border-[#dbe2ee] bg-white px-5 py-2 text-[0.75rem] font-bold uppercase tracking-wide text-[#475569] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {passwordSuccessMessage && (
                <div className="mt-3 rounded-[0.5rem] bg-[#dcfce7] px-4 py-3 text-[0.9rem] font-semibold text-[#166534]">
                  {passwordSuccessMessage}
                </div>
              )}

              {passwordError && (
                <div className="mt-3 rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-[0.9rem] font-semibold text-[#ef2c5b]">
                  {passwordError}
                </div>
              )}
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
          </div>
        )}
      </main>
        </div>
      </div>
    </div>
  );
}
