import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/api";
import { FaCartPlus, FaCheckCircle, FaHeart, FaShieldAlt, FaUndo } from "react-icons/fa";

function Skeleton() {
  return (
    <section className="bg-[#faf7f5] min-h-screen py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="bg-gray-200 rounded-3xl h-96" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    </section>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await productAPI.getById(id);
        const p = res.data.data;
        setProduct(p);
        // Fetch related (same category, different id)
        const rel = await productAPI.getAll("", p.category, "", "", "", 1, 5);
        setRelated(rel.data.data.products.filter((r) => r._id !== p._id).slice(0, 4));
      } catch (err) {
        setError(err.response?.status === 404 ? "Product not found." : "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Skeleton />;

  if (error) return (
    <section className="bg-[#faf7f5] min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
      <p className="text-6xl">😕</p>
      <p className="text-xl font-semibold">{error}</p>
      <Link to="/products" className="text-purple-600 hover:underline font-medium">← Back to Products</Link>
    </section>
  );

  const originalPrice = (product.price * 1.3).toFixed(2);

  const handleAddToCart = () => {
    addToCart({ id: product._id, name: product.name, price: product.price, img: product.image, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart({ id: product._id, name: product.name, price: product.price, img: product.image, quantity });
    navigate("/checkout");
  };

  return (
    <section className="bg-[#faf7f5] min-h-screen py-10 sm:py-14 mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-purple-600 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-purple-600 transition">Products</Link>
          <span>/</span>
          <span className="text-purple-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=60"; }}
              />
            </div>
            <button onClick={() => setWishlist(!wishlist)}
              className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-md transition">
              <FaHeart className={wishlist ? "text-red-500" : "text-gray-300"} />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <span className="text-pink-600 text-xs font-semibold uppercase tracking-widest mb-2">✦ Bestseller</span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-purple-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-gray-400 text-sm">(2,847 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-5">
              <p className="text-gray-400 line-through text-lg">₹{originalPrice}</p>
              <p className="text-yellow-500 font-extrabold text-3xl">₹{Number(product.price).toFixed(2)}</p>
              <span className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-1 rounded-md">30% OFF</span>
            </div>

            <div className="bg-purple-50 text-purple-900 rounded-xl p-4 mb-5 text-sm leading-relaxed border border-purple-100">
              {product.description}
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                🏷️ {product.category}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-4 text-purple-900 font-semibold">
              <p>Quantity</p>
              <div className="flex items-center border border-purple-300 rounded-xl overflow-hidden select-none">
                <button className="px-4 py-2 hover:bg-purple-100 disabled:opacity-40 transition"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity === 1}>−</button>
                <span className="px-6 py-2 bg-purple-50 font-bold">{quantity}</span>
                <button className="px-4 py-2 hover:bg-purple-100 disabled:opacity-40 transition"
                  onClick={() => setQuantity((q) => q + 1)} disabled={quantity >= product.stock}>+</button>
              </div>
              <span className="text-sm text-gray-400 font-normal">
                Total: ₹{(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2 ${added ? "bg-green-500 text-white" : "bg-purple-700 hover:bg-purple-800 text-white disabled:opacity-50"}`}>
                {added ? <><FaCheckCircle /> Added!</> : <><FaCartPlus /> Add to Cart</>}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-purple-900 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50">
                Buy Now →
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 text-purple-800 text-sm font-medium border-t pt-5">
              <div className="flex items-center gap-2"><FaShieldAlt className="text-yellow-500" /> Secure Payment</div>
              <div className="flex items-center gap-2"><FaUndo className="text-yellow-500" /> Easy Returns</div>
              <div className="flex items-center gap-2"><FaHeart className="text-yellow-500" /> Handcrafted with Love</div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
                    <img src={p.image} alt={p.name}
                      className="h-36 w-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=60"; }}
                    />
                    <div className="p-3">
                      <h3 className="text-purple-700 font-semibold text-sm truncate">{p.name}</h3>
                      <p className="text-yellow-500 font-bold text-sm">₹{Number(p.price).toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}