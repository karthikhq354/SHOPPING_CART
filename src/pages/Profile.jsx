import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaRightFromBracket, FaCartShopping } from "react-icons/fa6";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="bg-[#faf7f5] py-24 min-h-screen pt-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto flex items-center justify-center mb-4">
              <span className="text-5xl font-bold text-white">{user?.name?.[0]?.toUpperCase() || "U"}</span>
            </div>
            <h1 className="text-3xl font-bold text-purple-700 mb-2">{user?.name || user?.username}</h1>
            <p className="text-gray-500">{user?.username}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-purple-700 mb-2">Account Email</h3>
              <p className="text-gray-700">{user?.username}</p>
            </div>
            <div className="bg-pink-50 rounded-2xl p-6">
              <h3 className="font-semibold text-pink-700 mb-2">Member Since</h3>
              <p className="text-gray-700">Active User</p>
            </div>
          </div>

          <div className="border-t pt-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            
            <Link
              to="/orders"
              className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
            >
              <FaCartShopping /> View My Orders
            </Link>

            <Link
              to="/products"
              className="w-full flex items-center justify-center gap-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-xl transition"
            >
              Continue Shopping
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl transition"
            >
              <FaRightFromBracket /> Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
