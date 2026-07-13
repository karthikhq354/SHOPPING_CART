import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/api";
import { FaSearch, FaCartPlus, FaCheckCircle, FaSlidersH } from "react-icons/fa";

const CATEGORIES = ["All", "Birthday", "Anniversary", "Valentine", "Festival", "Corporate", "Jewelry", "Home", "Wellness", "Beauty", "Decor", "Stationery"];
const SORTS = [
  { value: "", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded-xl mt-3" />
      </div>
    </div>
  );
}

export default function ProductsListPage() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [addedId, setAddedId]   = useState(null);

  // Filters
  const [search, setSearch]         = useState(searchParams.get("search") || "");
  const [category, setCategory]     = useState(searchParams.get("category") || "All");
  const [sort, setSort]             = useState("");
  const [minPrice, setMinPrice]     = useState("");
  const [maxPrice, setMaxPrice]     = useState("");
  const [page, setPage]             = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const searchTimer = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await productAPI.getAll(
        search, category === "All" ? "" : category,
        minPrice, maxPrice, sort, page, 8
      );
      setProducts(res.data.data.products);
      setTotal(res.data.data.total);
      setPages(res.data.data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounced search
  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setPage(1), 400);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchParams(cat !== "All" ? { category: cat } : {});
  };

  const handleAddToCart = (e, p) => {
    e.preventDefault();
    addToCart({ id: p._id, name: p.name, price: p.price, img: p.image, quantity: 1 });
    setAddedId(p._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const resetFilters = () => {
    setSearch(""); setCategory("All"); setSort("");
    setMinPrice(""); setMaxPrice(""); setPage(1);
    setSearchParams({});
  };

  return (
    <section className="bg-[#faf7f5] py-14 pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-purple-700">
              Our Products <span className="text-pink-500">♥</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? "Loading…" : `${total} gifts found`}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type="text"
                placeholder="Search gifts…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm w-56"
              />
            </div>

            {/* Sort */}
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-200">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${showFilters ? "bg-purple-700 text-white border-purple-700" : "border-gray-200 text-gray-600 hover:border-purple-300"}`}>
              <FaSlidersH /> Filters
            </button>
          </div>
        </div>

        {/* ── Category pills ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${category === cat ? "bg-purple-600 text-white shadow-md" : "border border-purple-200 text-purple-600 hover:bg-purple-50"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* ── Price filter panel ── */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Min Price (₹)</label>
              <input type="number" min="0" value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                placeholder="0"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-32 outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Max Price (₹)</label>
              <input type="number" min="0" value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                placeholder="9999"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-32 outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
            <button onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition">
              Reset All
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="group">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition h-full flex flex-col">
                  <div className="overflow-hidden relative">
                    <img src={p.image} alt={p.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=60"; }}
                    />
                    <span className="absolute top-2 left-2 bg-white/90 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-purple-700 font-semibold mb-1 line-clamp-2">{p.name}</h3>
                    <p className="text-yellow-500 font-bold mb-1">₹{Number(p.price).toFixed(2)}</p>
                    <p className="text-yellow-400 text-xs mb-3">★★★★★</p>
                    <button
                      onClick={(e) => handleAddToCart(e, p)}
                      className={`mt-auto w-full py-2 rounded-xl font-medium transition flex items-center justify-center gap-2 text-sm ${addedId === p._id ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"}`}>
                      {addedId === p._id ? <><FaCheckCircle /> Added!</> : <><FaCartPlus /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>

        {/* ── Empty state ── */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold">No products found</p>
            <p className="text-sm mt-1 mb-6">Try a different search or filter</p>
            <button onClick={resetFilters}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition">
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">
              ← Prev
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition ${p === page ? "bg-purple-600 text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                {p}
              </button>
            ))}
            <button disabled={page === pages} onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}