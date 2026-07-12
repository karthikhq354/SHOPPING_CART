import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, ...(statusFilter && { status: statusFilter }) };
      const res = await api.get("/orders", { params });
      setOrders(res.data.data.orders);
      setPages(res.data.data.pages);
      setTotal(res.data.data.total);
    } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      showToast("Status updated ✅");
      fetch();
    } catch { showToast("Update failed"); }
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total orders</p>
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <Spinner /> : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📋</p><p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{o.name}</p>
                      <p className="text-xs text-gray-400">{o.username}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{o.items?.length || 0} items</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">₹{o.totalAmount?.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span className="uppercase text-xs font-semibold text-gray-500">{o.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer capitalize ${STATUS_COLORS[o.status]}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
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
    </div>
  );
}