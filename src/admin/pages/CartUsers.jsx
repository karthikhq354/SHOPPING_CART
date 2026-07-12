import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";
import { FaTrash, FaEye, FaXmark } from "react-icons/fa6";

export default function CartUsers() {
  const [carts, setCarts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [deleteKey, setDeleteKey] = useState(null);
  const [viewCart, setViewCart] = useState(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart", { params: { page, limit: 10 } });
      setCarts(res.data.data.carts);
      setPages(res.data.data.pages);
      setTotal(res.data.data.total);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    try {
      await api.delete(`/cart/${deleteKey}`);
      showToast("Cart deleted ✅");
      setDeleteKey(null);
      fetch();
    } catch { showToast("Delete failed"); }
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm">{toast}</div>}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Cart Users</h1>
        <p className="text-gray-400 text-sm mt-0.5">{total} active carts</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <Spinner /> : carts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">🛒</p><p>No active carts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["User", "Username", "Items", "Cart Value", "Last Updated", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {carts.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 text-xs font-bold flex-shrink-0">
                          {(c.name || c.username)?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-gray-800">{c.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{c.username}</td>
                    <td className="px-5 py-4">
                      <span className="bg-purple-50 text-purple-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                        {c.totalItems} items
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">₹{Number(c.totalValue).toFixed(2)}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(c.updatedAt).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewCart(c)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View Cart">
                          <FaEye size={12} />
                        </button>
                        <button onClick={() => setDeleteKey(c.username)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition" title="Delete Cart">
                          <FaTrash size={12} />
                        </button>
                      </div>
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

      {/* View Cart Modal */}
      {viewCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-7 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-black text-gray-800">{viewCart.name}'s Cart</h3>
                <p className="text-gray-400 text-xs">{viewCart.username}</p>
              </div>
              <button onClick={() => setViewCart(null)} className="text-gray-400 hover:text-gray-700 transition">
                <FaXmark size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {viewCart.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-purple-700 flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-black text-yellow-500">₹{Number(viewCart.totalValue).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {deleteKey && <ConfirmModal message={`Delete cart for ${deleteKey}?`} onConfirm={handleDelete} onCancel={() => setDeleteKey(null)} />}
    </div>
  );
}