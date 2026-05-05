import React, { useEffect, useState } from "react";
import { apiUrl } from "../services/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M15 6L9 12L15 18" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminUpdateMenuPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    available: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(apiUrl(`/api/menu/${id}`));
        const raw = await response.text();
        let data = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error("Invalid server response format.");
        }

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load menu item.");
        }

        setFormData({
          name: data?.name || "",
          category: data?.category || "",
          price: data?.price ?? "",
          description: data?.description || "",
          imageUrl: data?.imageUrl || "",
          available: Boolean(data?.available),
        });
      } catch (err) {
        setError(err.message || "Unable to load menu item.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    } else {
      setError("Invalid menu item id.");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      setError("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(apiUrl(`/api/menu/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category.trim(),
          price: Number(formData.price),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl.trim(),
          available: formData.available,
        }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update menu item.");
      }

      setSuccess("Menu item updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update menu item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#11182f]">
      <AdminTopbar />

      <main className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="px-6 py-6 max-[700px]:px-4">
          <button
            onClick={() => navigate("/admin/menu")}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e3e6ee] bg-white px-4 py-2 text-[0.9rem] font-semibold text-[#2b3244] hover:bg-[#f8f9fc]"
          >
            <span className="h-4 w-4">
              <BackIcon />
            </span>
            Back to Menu Management
          </button>

          <div className="rounded-[1.1rem] border border-[#e4e7ee] bg-white p-6">
            <h2 className="text-[1.6rem] font-bold text-[#11182f]">Update Menu Item</h2>
            <p className="mt-1 text-[0.95rem] text-[#5a6377]">Edit details for this menu item.</p>

            {loading ? (
              <p className="mt-6 text-[#6b7280]">Loading item...</p>
            ) : (
              <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
                {error && <p className="rounded-lg bg-[#ffe6ed] px-4 py-2 text-[0.9rem] font-semibold text-[#ef2c5b]">{error}</p>}
                {success && <p className="rounded-lg bg-[#dcfce7] px-4 py-2 text-[0.9rem] font-semibold text-[#166534]">{success}</p>}

                <div className="grid grid-cols-2 gap-4 max-[820px]:grid-cols-1">
                  <label className="grid gap-1.5">
                    <span className="text-[0.86rem] font-semibold text-[#2e374c]">Item Name *</span>
                    <input name="name" value={formData.name} onChange={handleChange} className="h-11 rounded-lg border border-[#dbe1ec] px-3 text-[0.95rem] outline-none focus:border-[#ef2c5b]" />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[0.86rem] font-semibold text-[#2e374c]">Category *</span>
                    <input name="category" value={formData.category} onChange={handleChange} className="h-11 rounded-lg border border-[#dbe1ec] px-3 text-[0.95rem] outline-none focus:border-[#ef2c5b]" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 max-[820px]:grid-cols-1">
                  <label className="grid gap-1.5">
                    <span className="text-[0.86rem] font-semibold text-[#2e374c]">Price *</span>
                    <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="h-11 rounded-lg border border-[#dbe1ec] px-3 text-[0.95rem] outline-none focus:border-[#ef2c5b]" />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[0.86rem] font-semibold text-[#2e374c]">Image URL</span>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="h-11 rounded-lg border border-[#dbe1ec] px-3 text-[0.95rem] outline-none focus:border-[#ef2c5b]" />
                  </label>
                </div>

                <label className="grid gap-1.5">
                  <span className="text-[0.86rem] font-semibold text-[#2e374c]">Description *</span>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="rounded-lg border border-[#dbe1ec] px-3 py-2 text-[0.95rem] outline-none focus:border-[#ef2c5b]" />
                </label>

                <label className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-[#2e374c]">
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="h-4 w-4 accent-[#ef2c5b]" />
                  Available
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center rounded-xl bg-[#ef2c5b] px-6 py-2.5 text-[0.95rem] font-semibold text-white shadow-[0_8px_20px_rgba(239,44,91,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Updating..." : "Update Item"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
