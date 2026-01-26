import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Custom Name Necklace",
    price: 199.0,
    img: "https://images.unsplash.com/photo-1761210875101-1273b9ae5600?w=600&auto=format&fit=crop&q=60",
    description:
      "Each necklace is carefully handcrafted with love and attention to detail. Personalize it with a name that matters most, creating a timeless treasure that celebrates your unique bond. Perfect for birthdays, anniversaries, or just because moments.",
  },
  {
    id: 2,
    name: "Handcrafted Candle Set",
    price: 134.99,
    img: "https://plus.unsplash.com/premium_photo-1764241715990-5b327f6144c0?w=600&auto=format&fit=crop&q=60",
    description:
      "Hand-poured scented candles that bring warmth and relaxation to any space.",
  },
  {
    id: 3,
    name: "Leather Journal",
    price: 142.99,
    img: "https://images.unsplash.com/photo-1672256019300-9589d730bedd?w=600&auto=format&fit=crop&q=60",
    description:
      "Crafted from premium leather, this journal is perfect for capturing thoughts, dreams, and daily moments. A timeless companion for writers, travelers, and creatives who appreciate elegance and durability.",
  },
  {
    id: 4,
    name: "Aromatherapy Gift Box",
    price: 99.99,
    img: "https://images.unsplash.com/photo-1576579406887-161dbdd9afe4?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0",
    description:
      "A soothing collection designed to relax the mind and body. Filled with calming aromas, this gift box creates a peaceful atmosphere—perfect for unwinding, self-care moments, or thoughtful gifting.",
  },
  {
    id: 5,
    name: "Succulent Garden Kit",
    price: 129.99,
    img: "https://images.unsplash.com/photo-1644419306509-bd379c9ac127?w=600&auto=format&fit=crop&q=60",
    description:
      "An easy-to-grow garden kit that brings a touch of nature indoors. Ideal for plant lovers and beginners alike, it adds freshness, beauty, and life to any space.",
  },
  {
    id: 6,
    name: "Gourmet Chocolate Box",
    price: 93.99,
    img: "https://images.unsplash.com/photo-1614631016624-cb89bceec02c?w=600&auto=format&fit=crop&q=60",
    description:
      "A luxurious assortment of rich, handcrafted chocolates made to delight every bite. Perfect for celebrations, sweet surprises, or simply indulging your chocolate cravings.",
  },
  {
    id: 7,
    name: "Silk Scarf Collection",
    price: 154.99,
    img: "https://images.unsplash.com/photo-1693382288218-2ce85aa26974?w=600&auto=format&fit=crop&q=60",
    description:
      "Elegant silk scarves designed to elevate any outfit. Soft, lightweight, and stylish, this collection makes a graceful gift for fashion lovers and special occasions.",
  },
  {
    id: 8,
    name: "Ceramic Mug Set",
    price: 144.99,
    img: "https://plus.unsplash.com/premium_photo-1663013084900-c5036595be6f?w=600&auto=format&fit=crop&q=60",
    description:
      "Beautifully crafted ceramic mugs perfect for coffee, tea, or cozy moments. A charming addition to any kitchen and a thoughtful gift for everyday comfort.",
  },
];

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [name] = useState("");
  const [message] = useState("");

  if (!product) {
    return (
      <div className="mt-24 text-center text-xl text-gray-500">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      personalization: { name, message },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <section className="bg-[#faf7f5] min-h-screen py-10 sm:py-14 mt-10 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover"
            />
          </div>

          {/* <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.img}
                alt={`${product.name} ${i}`}
                className="w-20 h-20 object-cover rounded-xl cursor-pointer border-2 border-transparent hover:border-yellow-400 transition"
              />
            ))}
          </div> */}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-start">
          <span className="inline-block  text-pink-600 text-xs font-semibold uppercase rounded-full px-3 py-1 mb-2">
            Bestseller
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-purple-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center space-x-2 mb-2">
            <p className="text-yellow-500 font-extrabold text-2xl sm:text-3xl">
              ★★★★★
            </p>
            <p className="text-gray-500 text-sm">(2,847 reviews)</p>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <p className="text-gray-400 line-through text-lg">
              ₹{(product.price).toFixed(2)}
            </p>
            <p className="text-yellow-500 font-extrabold text-3xl">
              ₹{product.price}
            </p>
            <span className="bg-pink-100 text-pink-600 font-semibold text-xs px-3 py-1 rounded-md">
              30% OFF
            </span>
          </div>

          <div className="bg-pink-100 text-pink-800 rounded-xl p-4 sm:p-6 mb-4 text-sm leading-relaxed font-medium shadow-md">
            <p>{product.description}</p>
          </div>

          {/* Personalize Section */}
          {/* <div className="space-y-4 mb-6">
            <h2 className="text-purple-900 font-semibold text-lg mb-2">
              Personalize Your Gift <span className="text-yellow-500">✨</span>
            </h2>

            <div>
              <label
                className="block text-purple-800 font-medium mb-1"
                htmlFor="name"
              >
                Name to Engrave
              </label>
              <input
                type="text"
                id="name"
                maxLength={12}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name (max 12 characters)"
                className="w-full border border-purple-200 rounded-lg px-3 py-2 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <p className="text-yellow-400 mt-1 text-sm">Preview: Sara</p>
            </div>

            <div>
              <label
                className="block text-purple-800 font-medium mb-1"
                htmlFor="message"
              >
                Add Gift Message (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message here..."
                className="w-full border border-purple-200 rounded-lg px-3 py-2 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div> */}

          {/* Quantity selector */}
          <div className="mb-6 flex items-center gap-4 text-purple-900 font-semibold">
            <p>Quantity</p>
            <div className="flex items-center border border-purple-300 rounded-xl overflow-hidden select-none">
              <button
                className="px-4 py-2 hover:bg-purple-100"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="px-6 py-2 bg-purple-50">{quantity}</span>
              <button
                className="px-4 py-2 hover:bg-purple-100"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h18l-1.68 9.39a3 3 0 01-3 2.61H7a3 3 0 01-3-2.61L3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 13a4 4 0 11-8 0"
                />
              </svg>
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-purple-900 py-3 rounded-xl font-semibold shadow-md transition"
            >
              Buy Now &rarr;
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-between gap-6 text-purple-900 text-sm font-semibold">
            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M12 11c0-1.1.9-2 2-2"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <p>Secure Payment</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Easy Returns</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M12 21h.01"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <p>Handcrafted with Love</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
