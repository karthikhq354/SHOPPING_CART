import { useState, useEffect } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={data?.totalProducts || 0} icon="📦" color="purple" />
        <StatCard label="Total Users"    value={data?.totalUsers    || 0} icon="👥" color="blue"   />
        <StatCard label="Total Orders"   value={data?.totalOrders   || 0} icon="🛒" color="yellow" />
        <StatCard label="Revenue"        value={`₹${(data?.totalRevenue || 0).toLocaleString("en-IN")}`} icon="💰" color="green" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Recent Orders</h2>
        </div>
        {!data?.recentOrders?.length ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{o.name}</td>
                    <td className="px-6 py-4 font-semibold text-purple-700">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}