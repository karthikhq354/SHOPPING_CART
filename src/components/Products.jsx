import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/api";
import { FaCartPlus, FaCheckCircle } from "react-icons/fa";

function Skeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [addedId, setAddedId]   = useState(null);

  useEffect(() => {
    productAPI.getAll("", "", "", "", "newest", 1, 4)
      .then((res) => setProducts(res.data.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (e, p) => {
    e.preventDefault();
    addToCart({ id: p._id, name: p.name, price: p.price, img: p.image, quantity: 1 });
    setAddedId(p._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="bg-white py-16">
      <h2 className="text-center text-3xl font-bold text-purple-700">
        Our Best Sellers <span className="text-pink-500">♥</span>
      </h2>
      <p className="text-center text-gray-400 mt-2 mb-12">Customers' favourite picks</p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
          : products.map((p) => (
            <Link key={p._id} to={`/products/${p._id}`} className="group">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition h-full flex flex-col">
                <div className="overflow-hidden">
                  <img src={p.image} alt={p.name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=60"; }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-purple-700 font-semibold mb-1 line-clamp-2">{p.name}</h3>
                  <p className="text-yellow-500 font-bold">₹{Number(p.price).toFixed(2)}</p>
                  <p className="text-yellow-400 text-sm mb-3">★★★★★</p>
                  <button onClick={(e) => handleAdd(e, p)}
                    className={`mt-auto w-full py-2 rounded-xl font-medium transition flex items-center justify-center gap-2 text-sm ${addedId === p._id ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"}`}>
                    {addedId === p._id ? <><FaCheckCircle /> Added!</> : <><FaCartPlus /> Add to Cart</>}
                  </button>
                </div>
              </div>
            </Link>
          ))
        }
      </div>

      <div className="flex justify-center mt-10">
        <Link to="/products"
          className="border-2 border-purple-400 text-purple-600 px-8 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition">
          Explore All Products →
        </Link>
      </div>
    </section>
  );
}