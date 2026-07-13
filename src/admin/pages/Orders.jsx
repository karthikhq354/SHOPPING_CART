import { useState, useEffect, useCallback } from "react";
import { orderAPI } from "../../services/api";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";
import { FaTrash, FaMagnifyingGlass } from "react-icons/fa6";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatus] = useState("");
  const [userSearch, setUser] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const res = await orderAPI.getAll(page, 10, statusFilter);

      setOrders(res.data.data.orders);
      setPages(res.data.data.pages);
      setTotal(res.data.data.total);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      showToast("Status updated ✅");
      fetchOrders();
    } catch {
      showToast("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await orderAPI.delete(deleteId);
      showToast("Order deleted ✅");
      setDeleteId(null);
      fetchOrders();
    } catch {
      showToast("Delete failed");
    }
  };

  const displayed = userSearch
    ? orders.filter(
        (o) =>
          o.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
          o.name?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : orders;

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Orders</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {total} total orders
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          {/* Search */}
          <div className="relative">
            <FaMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"
            />

            <input
              value={userSearch}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Search user..."
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 w-44"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="">All Statuses</option>

            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

        {loading ? (
          <Spinner />
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📋</p>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Amount",
                    "Payment",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayed.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {order.name}
                      </p>

                      <p className="text-xs text-gray-400 truncate max-w-[130px]">
                        {order.username}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {order.items?.length || 0}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 uppercase text-xs font-semibold text-gray-500">
                      {order.paymentMethod}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer capitalize ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDeleteId(order._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                      >
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
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ← Prev
            </button>

            <span className="text-sm text-gray-400">
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this order permanently?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}