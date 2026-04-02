import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16 16L21 21" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M12 5V19M5 12H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M4 20L8.2 19.1L18.8 8.5L15.5 5.2L4.9 15.8L4 20Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M5 7H19M9 7V5.5H15V7M8.3 7V18.3M12 7V18.3M15.7 7V18.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "N/A";
  return `₹${n}`;
}

export default function AdminMenuManagementPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:3000/api/menu");
        const raw = await response.text();
        let data = [];
        try {
          data = raw ? JSON.parse(raw) : [];
        } catch {
          throw new Error("Invalid server response format.");
        }

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch menu items.");
        }

        if (!Array.isArray(data)) {
          throw new Error("Unexpected menu response format.");
        }

        setItems(data);
      } catch (err) {
        setError(err.message || "Unable to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(
        items
          .map((item) => String(item?.category || "").trim())
          .filter(Boolean)
      )
    );
    return ["All", ...list];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const category = String(item?.category || "");
      if (selectedCategory !== "All" && category !== selectedCategory) {
        return false;
      }

      if (!q) return true;
      const haystack = `${item?.name || ""} ${item?.description || ""} ${category}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, selectedCategory, searchQuery]);

  const handleDelete = async (itemId, itemName) => {
    if (!itemId) return;
    setActionError("");

    const confirmed = window.confirm(`Delete "${itemName || "this item"}" from menu?`);
    if (!confirmed) return;

    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setActionError("Please login as admin.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/menu/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete menu item.");
      }

      setItems((prev) => prev.filter((row) => String(row?._id || row?.id) !== String(itemId)));
    } catch (err) {
      setActionError(err.message || "Unable to delete menu item.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#11182f]">
      <AdminTopbar>
        <label className="flex h-11 w-[20rem] items-center gap-2 rounded-full border border-[#eceff5] bg-[#f4f4f7] px-4 max-[980px]:hidden">
          <span className="h-5 w-5 text-[#8b93a4]">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-0 bg-transparent text-[0.95rem] text-[#2e374c] outline-none placeholder:text-[#939aae]"
            placeholder="Search menu item..."
          />
        </label>
      </AdminTopbar>

      <main className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="px-6 py-6 max-[700px]:px-4">
          <div className="mb-6 flex items-end justify-between gap-4 max-[820px]:flex-col max-[820px]:items-start">
            <div>
              <h2 className="text-[1.9rem] font-bold text-[#11182f] max-[920px]:text-[1.6rem]">Menu Management</h2>
              <p className="mt-1 text-[0.95rem] text-[#52627a]">Update, organize, and manage your restaurant&apos;s offerings.</p>
            </div>
            <button
              onClick={() => navigate("/admin/menu/add")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ef2c5b] px-5 py-2.5 text-[0.92rem] font-semibold text-white shadow-[0_8px_20px_rgba(239,44,91,0.26)]"
            >
              <span className="h-5 w-5">
                <AddIcon />
              </span>
              Add New Item
            </button>
          </div>

          <div className="rounded-[1.3rem] border border-[#e5e8ee] bg-white p-5">
            <div className="flex items-center justify-between gap-3 max-[980px]:flex-col max-[980px]:items-stretch">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-2 text-[0.95rem] font-semibold ${
                      selectedCategory === category ? "bg-[#d3e8e4] text-[#1e4f47]" : "bg-[#f1f3f7] text-[#5d6679] hover:bg-[#e7ecf4]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <label className="flex h-11 min-w-[18rem] items-center gap-2 rounded-xl border border-[#eceff5] bg-[#f7f7fa] px-3 max-[980px]:min-w-0">
                <span className="h-5 w-5 text-[#8b93a4]">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter items..."
                  className="w-full border-0 bg-transparent text-[0.92rem] text-[#2e374c] outline-none placeholder:text-[#939aae]"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.1rem] border border-[#e4e7ee] bg-white">
            <div className="overflow-x-hidden">
              <table className="w-full table-fixed">
                <thead className="border-b border-[#edf0f6] bg-[#fbfbfd]">
                  <tr className="text-left text-[0.86rem] uppercase tracking-[0.04em] text-[#425774]">
                    <th className="w-[10%] px-3 py-3">Image</th>
                    <th className="w-[20%] px-3 py-3">Name</th>
                    <th className="w-[10%] px-3 py-3">Price</th>
                    <th className="w-[38%] px-3 py-3">Description</th>
                    <th className="w-[14%] px-3 py-3">Availability</th>
                    <th className="w-[8%] px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actionError && (
                    <tr>
                      <td colSpan={6} className="px-3 py-3 text-center text-[0.9rem] font-semibold text-[#ef2c5b]">
                        {actionError}
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-[#6d7588]">
                        Loading menu items...
                      </td>
                    </tr>
                  )}
                  {!loading && error && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-[#ef2c5b]">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-[#6d7588]">
                        No matching items found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    filteredItems.map((item) => {
                      const isAvailable = Boolean(item?.available);
                      return (
                        <tr key={item?._id || item?.id || item?.name} className="border-b border-[#edf0f6] last:border-b-0">
                          <td className="px-3 py-3">
                            <div className="h-11 w-11 overflow-hidden rounded-lg bg-[#eff2f7]">
                              <img
                                src={item?.imageUrl || "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=200&q=80"}
                                alt={item?.name || "Menu item"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[0.96rem] font-semibold text-[#1c2437]">{item?.name || "N/A"}</td>
                          <td className="px-3 py-3 text-[1.05rem] font-bold text-[#ef2c5b]">{formatPrice(item?.price)}</td>
                          <td className="px-3 py-3 text-[0.9rem] text-[#4f617d] truncate">{item?.description || "-"}</td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[0.8rem] font-semibold ${
                                isAvailable ? "bg-[#d6f0de] text-[#1f7f40]" : "bg-[#ffe0e8] text-[#c62854]"
                              }`}
                            >
                              {isAvailable ? "Available" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3 text-[#8b93a4]">
                              <button
                                onClick={() => navigate(`/admin/menu/edit/${item?._id || item?.id}`)}
                                disabled={!item?._id && !item?.id}
                                className="h-5 w-5 hover:text-[#ef2c5b] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <PencilIcon />
                              </button>
                              <button
                                onClick={() => handleDelete(item?._id || item?.id, item?.name)}
                                disabled={!item?._id && !item?.id}
                                className="h-5 w-5 hover:text-[#ef2c5b] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
