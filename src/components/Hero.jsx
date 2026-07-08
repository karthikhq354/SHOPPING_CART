import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/videos/hero.mp4";
import heroPoster from "../assets/images/giftbanner.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/65" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-start justify-center px-6 pt-36 sm:px-8 lg:px-10 lg:pt-40">
        <div className="w-full max-w-[760px] text-center">

          {/* Premium Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3 text-xs font-semibold uppercase tracking-[5px] text-white backdrop-blur-xl shadow-lg">
              🎁 Premium Gift Collection
            </span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-[700px] text-white font-black leading-[1.05] tracking-[-2px]
              text-[44px]
              sm:text-[56px]
              lg:text-[64px]">

            <span className="block">Find the Perfect Gift</span>
            <span className="block">for Every</span>
            <span className="block">Special Moment</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-[620px] text-lg leading-9 text-white/80 lg:text-xl">
            Discover unique, personalized, and premium gifts carefully
            selected for birthdays, anniversaries, weddings, festivals,
            and every unforgettable celebration.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

            <button
              onClick={() => navigate("/products")}
              className="h-14 rounded-full bg-white px-10 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Shop Now
            </button>

            <button
              onClick={() => navigate("/products")}
              className="h-14 rounded-full border border-white/70 bg-transparent px-10 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black"
            >
              Explore Collection
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}