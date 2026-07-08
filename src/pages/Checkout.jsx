import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    payment: "card",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    alert("Order placed successfully 🎉");
    clearCart();
    navigate("/");
  };

  return (
    <section className="bg-[#faf7f5] py-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <h2 className="text-3xl font-bold text-purple-700 mb-2">
          Checkout ✨
        </h2>
        <p className="text-gray-500 mb-5">
          Complete your order securely
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >

          {/* LEFT – FORM */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-purple-700 mb-2 ">
              Shipping Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
              />

              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
              />

              <input
                name="zip"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={handleChange}
                required
                className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-6 w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none"
              rows="4"
            />

            <h3 className="text-lg font-bold text-purple-700 mt-4 mb-2">
              Payment Method
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={form.payment === "card"}
                  onChange={handleChange}
                />
                Credit / Debit Card
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* RIGHT – SUMMARY */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-fit">
            <h3 className="text-lg font-bold text-purple-700 mb-6">
              Order Summary 🧾
            </h3>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>

            <div className="border-t mt-6 pt-6 flex justify-between">
              <span className="font-bold text-purple-700">Total</span>
              <span className="text-xl font-bold text-yellow-500">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition"
            >
              Place Order →
            </button>

            <Link
              to="/cart"
              className="block text-center mt-4 text-sm text-purple-600 hover:underline"
            >
              ← Back to Cart
            </Link>
          </div>

        </form>
      </div>
    </section>
  );
}
