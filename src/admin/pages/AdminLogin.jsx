import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import api from "../services/api";

export default function AdminLogin() {
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/admin/login", form);
      loginAdmin({ name: res.data.data.name, email: res.data.data.email }, res.data.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
        <div className="text-center mb-8">
          <span className="text-5xl">🎁</span>
          <h1 className="text-2xl font-black text-gray-900 mt-3">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">ImpressiveGift — Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input type="email" placeholder="admin@impressivegift.com" value={form.email} required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 bg-gray-50 focus:bg-white transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" placeholder="••••••••" value={form.password} required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 bg-gray-50 focus:bg-white transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-12 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition disabled:opacity-60 mt-2">
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-6">
          Default: admin@impressivegift.com / Admin@123
        </p>
      </div>
    </div>
  );
}