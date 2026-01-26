import { useState } from "react";
import { Link } from "react-router-dom";

export default function Products({ addToCart }) {
  const allProducts = [
    { id: 1, name: "Custom Name Necklace", price: "199.00", img: "https://images.unsplash.com/photo-1761210875101-1273b9ae5600?w=600&auto=format&fit=crop&q=60" },
    { id: 2, name: "Handcrafted Candle Set", price: "134.99", img: "https://plus.unsplash.com/premium_photo-1764241715990-5b327f6144c0?w=600&auto=format&fit=crop&q=60" },
    { id: 3, name: "Leather Journal", price: "142.99", img: "https://images.unsplash.com/photo-1672256019300-9589d730bedd?w=600&auto=format&fit=crop&q=60" },
    { id: 4, name: "Aromatherapy Gift Box", price: "99.99", img: "https://images.unsplash.com/photo-1576579406887-161dbdd9afe4?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 5, name: "Succulent Garden Kit", price: "129.99", img: "https://images.unsplash.com/photo-1644419306509-bd379c9ac127?w=600&auto=format&fit=crop&q=60" },
    { id: 6, name: "Gourmet Chocolate Box", price: "93.99", img: "https://images.unsplash.com/photo-1614631016624-cb89bceec02c?w=600&auto=format&fit=crop&q=60" },
    { id: 7, name: "Silk Scarf Collection", price: "154.99", img: "https://images.unsplash.com/photo-1693382288218-2ce85aa26974?w=600&auto=format&fit=crop&q=60" },
    { id: 8, name: "Ceramic Mug Set", price: "144.99", img: "https://plus.unsplash.com/premium_photo-1663013084900-c5036595be6f?w=600&auto=format&fit=crop&q=60" },
  ];

  const [visibleCount] = useState(4);

  return (
    <section className="bg-white py-16">
      <h2 className="text-center text-3xl font-bold text-purple-700">
        Our Best Sellers <span className="text-pink-500">♥</span>
      </h2>
      <p className="text-center text-gray-500 mt-2 mb-12">
        Customers' favorite picks
      </p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {allProducts.slice(0, visibleCount).map((p) => (
          <Link key={p.id} to={`/products/${p.id}`} className="group">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
              <img
                src={p.img}
                alt={p.name}
                className="h-48 w-full object-cover group-hover:scale-105 transition"
              />

              <div className="p-4">
                <h3 className="text-purple-700 font-semibold mb-1">{p.name}</h3>
                <p className="text-yellow-500 font-bold">₹{p.price}</p>
                <p className="text-yellow-400 text-sm">★★★★★</p>

                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation
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

      {visibleCount < allProducts.length && (
        <div className="flex justify-center mt-8">
          <Link
            to="/products"
            className="text-yellow-500 font-medium cursor-pointer hover:text-yellow-600"
          >
            Explore More Gifts →
          </Link>
        </div>
      )}
    </section>
  );
}
