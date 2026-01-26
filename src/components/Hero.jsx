import giftbanner from "../assets/images/giftbanner.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
   const navigate = useNavigate();

  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 flex items-center pt-20">
      {/* pt-20 to offset fixed Navbar height */}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Content */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-800 leading-snug sm:leading-tight">
            Make Every Moment <br /> Memorable
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">
            Discover unique gifts that spark joy and celebrate life&apos;s
            precious moments
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start">
            <button onClick={() => navigate("/products")} className="bg-yellow-400 text-white px-6 sm:px-8 py-3 rounded-2xl font-semibold shadow-md hover:bg-yellow-500 transition">
              Shop Now
            </button>

            <button onClick={() => navigate("/products")} className="border-2 border-purple-400 text-purple-600 px-6 sm:px-8 py-3 rounded-2xl font-semibold hover:bg-purple-400 hover:text-white transition">
              Explore Gifts
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center lg:justify-end w-full lg:w-auto px-4 lg:px-0">
          <img
            src={giftbanner}
            alt="Gift Boxes"
            className="w-full lg:w-[520px] rounded-3xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}
