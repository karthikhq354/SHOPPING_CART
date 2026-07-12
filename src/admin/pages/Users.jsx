import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";
import { FaTrash } from "react-icons/fa6";

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [total, setTotal]     = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", { params: { page, limit: 10 } });
      setUsers(res.data.data.users);
      setPages(res.data.data.pages);
      setTotal(res.data.data.total);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      showToast("User deleted ✅");
      setDeleteId(null);
      fetch();
    } catch { showToast("Delete failed"); }
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm">{toast}</div>}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Users</h1>
        <p className="text-gray-400 text-sm mt-0.5">{total} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <Spinner /> : users.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">👥</p><p>No users yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Name", "Username", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{u.username}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isLoggedIn ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {u.isLoggedIn ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setDeleteId(u._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">← Prev</button>
            <span className="text-sm text-gray-400">Page {page} of {pages}</span>
            <button disabled={page === pages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Next →</button>
          </div>
        )}
      </div>

      {deleteId && <ConfirmModal message="Delete this user permanently?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}