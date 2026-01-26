import { Link } from "react-router-dom";

export default function Categories() {
  const categories = [
    { title: "Personalized Gifts", icon: "🎁", color: "text-pink-500" },
    { title: "Handmade Treasures", icon: "💜", color: "text-purple-500" },
    { title: "Corporate Gifts", icon: "💼", color: "text-yellow-400" },
    { title: "Surprise Boxes", icon: "✨", color: "text-pink-400" },
  ];

  return (
    <section className="bg-[#FFF9F4] py-16">
      <h2 className="text-center text-3xl font-bold text-purple-700 mb-12">
        Shop by Category
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg transition"
          >
            <div className={`text-5xl mb-4 ${cat.color}`}>{cat.icon}</div>
            <h3 className="text-purple-700 font-semibold text-lg mb-2">
              {cat.title}
            </h3>
            <Link to="/products" className="text-yellow-500 font-medium cursor-pointer hover:text-yellow-600">
               View Collection →
               </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

