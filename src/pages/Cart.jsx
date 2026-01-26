import { FaTrash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

export default function Cart({ cartItems, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="bg-[#faf7f5] py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10">

        {/* ---------------- LEFT : CART ITEMS ---------------- */}
        <div className="lg:flex-1">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            Your Cart <span className="text-pink-500">♥</span>
          </h2>
          <p className="text-gray-500 mb-5">
            {cartItems.length} items selected
          </p>

          {cartItems.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <Link
                to="/products"
                className="text-yellow-500 font-medium hover:text-yellow-600"
              >
                Continue Shopping →
              </Link>
            </div>
          ) : (
            /* ✅ ONLY THIS PART SCROLLS */
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-center justify-between p-5 mb-6 rounded-2xl shadow-sm ${
                    index % 2 === 0 ? "bg-[#f5f0ff]" : "bg-[#fff1f3]"
                  }`}
                >
                  {/* Product */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-purple-700">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        In Stock
                      </p>
                    </div>
                  </div>

                  {/* Price + Qty */}
                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <p className="font-bold text-yellow-500">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center border rounded-lg bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                        className="px-3 py-1 text-purple-700 disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="px-3 font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-purple-700"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          {cartItems.length > 0 && (
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 w-full mt-4 
                         border-2 border-purple-500 text-purple-600
                         font-medium py-3 rounded-xl
                         hover:bg-purple-50 transition">
              ← Continue Shopping
            </Link>
          )}
        </div>

        {/* ---------------- RIGHT : ORDER SUMMARY ---------------- */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 lg:h-[60vh] flex-shrink-0 mt-0 lg:mt-14">
            <h3 className="text-lg font-bold text-purple-700 mb-6">
              Order Summary ✨
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Standard Delivery</span>
                <span className="text-green-600 font-medium">
                  FREE
                </span>
              </div>
            </div>

            <div className="border-t mt-6 pt-6 flex justify-between items-center">
              <span className="font-bold text-purple-700">
                Total
              </span>
              <span className="text-xl font-bold text-yellow-500">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition"
            >
              Proceed to Checkout →
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Secure checkout • 30-day returns • Express delivery
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
