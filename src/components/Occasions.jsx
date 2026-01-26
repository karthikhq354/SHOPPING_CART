import { Link } from "react-router-dom";

export default function Occasions() {
  const occasions = [
    {
      title: "Birthday",
      img: "https://plus.unsplash.com/premium_photo-1677221924410-0d27f4940396?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QmlydGhkYXl8ZW58MHx8MHx8fDA%3D",
    },
    {
      title: "Anniversary",
      img: "https://images.unsplash.com/photo-1627935817583-a8d4531ccc62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8QW5uaXZlcnNhcnl8ZW58MHx8MHx8fDA%3D",
    },
    {
      title: "Festival",
      img: "https://media.istockphoto.com/id/1276785715/photo/close-up-of-brother-hands-giving-gift-to-sister-during-during-raksha-bandhan-bhai-dooj-or.webp?a=1&b=1&s=612x612&w=0&k=20&c=fJIA9chg88r2NRXF6w1juEH6pMX5hf57p4UHmcaAb_0=",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-pink-100 to-purple-200 py-16">
      <h2 className="text-center text-3xl font-bold text-purple-700 mb-12 px-4">
        Gifts for Every Occasion
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
        {occasions.map((o) => (
          <div
            key={o.title}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition text-center">
            <img
              src={o.img}
              alt={o.title}
              className="h-52 w-full object-cover transition-transform duration-300 hover:scale-105"/>

            <div className="p-6">
              <h3 className="text-purple-700 font-semibold text-lg mb-2">
                {o.title}
              </h3>

              <Link
                to="/products"
                className="text-yellow-500 font-medium cursor-pointer hover:text-yellow-600">
                Shop Now →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
