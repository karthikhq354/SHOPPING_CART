import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderAPI, userAPI } from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems, clearCart, subtotal } = useCart();

  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", zip: "", payment: "card",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }

    // Guest user → show login modal
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // Logged-in user → place order
    setLoading(true);
    setError("");
    try {
      // Sync user with backend
      await userAPI.sync(user.name, user.username);

      // Create order
      const orderData = {
        username: user.username,
        name: user.name,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.img
        })),
        totalAmount: subtotal,
        shippingInfo: {
          address: form.address,
          city: form.city,
          zip: form.zip,
          email: form.email,
        },
        paymentMethod: form.payment,
      };

      await orderAPI.create(orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <section className="bg-[#faf7f5] py-24 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md mx-auto">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-purple-700 mb-3">Order Placed!</h2>
          <p className="text-gray-400 mb-8">Thank you! Your gift is on its way.</p>
          <Link to="/orders" className="inline-block bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition">
            View My Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#faf7f5] py-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">Checkout ✨</h2>
        <p className="text-gray-500 mb-5">Complete your order securely</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT – FORM */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-purple-700 mb-4">Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none text-sm" />
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none text-sm" />
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none text-sm" />
              <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none text-sm" />
            </div>
            <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required
              className="mt-4 w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none text-sm" rows="3" />

            <h3 className="text-lg font-bold text-purple-700 mt-6 mb-3">Payment Method</h3>
            <div className="space-y-3">
              {[{ value: "card", label: "💳  Credit / Debit Card" }, { value: "upi", label: "📱  UPI Payment" }, { value: "cod", label: "💵  Cash on Delivery" }].map((opt) => (
                <label key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${form.payment === opt.value ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-200"}`}>
                  <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={handleChange} className="accent-purple-600" disabled={loading} />
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* RIGHT – SUMMARY */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-fit sticky top-28">
            <h3 className="text-lg font-bold text-purple-700 mb-5">Order Summary 🧾</h3>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500">
                  <span className="truncate max-w-[140px]">{item.name} × {item.quantity}</span>
                  <span>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className="text-green-600 font-medium">FREE</span></div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between">
              <span className="font-bold text-purple-700">Total</span>
              <span className="text-xl font-bold text-yellow-500">₹{subtotal.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition shadow-md disabled:opacity-60">
              {loading ? "Processing..." : "Place Order →"}
            </button>
            <Link to="/cart" className="block text-center mt-3 text-sm text-purple-500 hover:underline">← Back to Cart</Link>
          </div>
        </form>
      </div>

      {/* Auth Modal for guests */}
      {showLoginModal && <AuthModal onClose={() => setShowLoginModal(false)} />}
    </section>
  );
}