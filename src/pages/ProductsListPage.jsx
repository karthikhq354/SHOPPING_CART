import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductsListPage({ addToCart }) {
  const products = [
    { id: 1, name: "Custom Name Necklace", price: "199.00", category: "Valentine", img: "https://images.unsplash.com/photo-1761210875101-1273b9ae5600?w=600&auto=format&fit=crop&q=60" },
    { id: 2, name: "Handcrafted Candle Set", price: "134.99", category: "Birthday", img: "https://plus.unsplash.com/premium_photo-1764241715990-5b327f6144c0?w=600&auto=format&fit=crop&q=60" },
    { id: 3, name: "Leather Journal", price: "142.99", category: "Anniversary", img: "https://images.unsplash.com/photo-1672256019300-9589d730bedd?w=600&auto=format&fit=crop&q=60" },
    { id: 4, name: "Aromatherapy Gift Box", price: "99.99", category: "Birthday", img: "https://images.unsplash.com/photo-1576579406887-161dbdd9afe4?q=80&w=1334&auto=format&fit=crop" },
    { id: 5, name: "Succulent Garden Kit", price: "129.99", category: "Anniversary", img: "https://images.unsplash.com/photo-1644419306509-bd379c9ac127?w=600&auto=format&fit=crop&q=60" },
    { id: 6, name: "Gourmet Chocolate Box", price: "93.99", category: "Valentine", img: "https://images.unsplash.com/photo-1614631016624-cb89bceec02c?w=600&auto=format&fit=crop&q=60" },
    { id: 7, name: "Silk Scarf Collection", price: "154.99", category: "Birthday", img: "https://images.unsplash.com/photo-1693382288218-2ce85aa26974?w=600&auto=format&fit=crop&q=60" },
    { id: 8, name: "Ceramic Mug Set", price: "144.99", category: "Valentine", img: "https://plus.unsplash.com/premium_photo-1663013084900-c5036595be6f?w=600&auto=format&fit=crop&q=60" },
  ];

  // const categories = ["All", "Birthday", "Anniversary", "Valentine"];

  // const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  /* FILTER LOGIC (NOT CHANGED – JUST EXTENDED) */
  const filteredProducts = products.filter((p) => {
    // const matchCategory =
    //   activeCategory === "All" || p.category === activeCategory;

    const matchSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchSearch; // matchCategory
  });

  return (
    <section className="bg-[#faf7f5] py-14 pt-32 min-h-screen">

      {/* ================= HEADER SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

          {/* LEFT : TITLE + CATEGORY */}
          <div>
            <h1 className="text-4xl font-bold text-purple-700">
              Our Products <span className="text-pink-500">♥</span>
            </h1>

            <p className="text-gray-500 mt-2 mb-4">
              Discover gifts made with love
            </p>

            {/* CATEGORY FILTER — SAME DESIGN */}
            {/* <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition
                    ${
                      activeCategory === cat
                        ? "bg-purple-500 text-white"
                        : "border border-purple-500 text-purple-600 hover:bg-purple-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div> */}
          </div>

          {/* RIGHT : SEARCH (TOP RIGHT) */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            />
          </div>

        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {filteredProducts.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`} className="group">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
              <img
                src={p.img}
                alt={p.name}
                className="h-48 w-full object-cover group-hover:scale-105 transition"
              />

              <div className="p-4">
                <h3 className="text-purple-700 font-semibold mb-1">
                  {p.name}
                </h3>

                <p className="text-yellow-500 font-bold">
                  ₹{p.price}
                </p>

                <p className="text-yellow-400 text-sm">★★★★★</p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(p);
                  }}
                  className="mt-4 w-full bg-purple-500 text-white py-2 rounded-xl font-medium hover:bg-purple-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

       {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          No products found.
        </p>
      )}

    </section>
  );
}
