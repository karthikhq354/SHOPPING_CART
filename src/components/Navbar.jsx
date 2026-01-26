import { NavLink } from "react-router-dom";
import { useState } from "react";
//import { Link } from "react-router-dom";

import { FaBars,FaXmark,FaFacebookF,FaInstagram,FaTwitter,FaWhatsapp,FaCartShopping,} from "react-icons/fa6";

export default function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass =
    "cursor-pointer text-sm text-purple-700 hover:text-purple-800 transition duration-300";

  return (
    <>
      <nav className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-4 shadow-sm fixed top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-2xl">🎁</span>
            <h1 className="font-bold text-purple-700 text-xl">
              ImpressiveGift
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex gap-8 font-medium">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/products" className={linkClass}>Our Products</NavLink>
              <NavLink to="/about" className={linkClass}>About Us</NavLink>
              <NavLink to="/contact" className={linkClass}>Contact Us</NavLink>
            </ul>

            <div className="flex items-center gap-5 text-gray-600">
              <FaFacebookF className="hover:text-blue-800 cursor-pointer" />
              <FaInstagram className="hover:text-pink-700 cursor-pointer" />
              <FaWhatsapp className="hover:text-green-500 cursor-pointer" />

            {/* CLICKABLE CART ICON */}
            <NavLink to="/cart" className="relative">
                <FaCartShopping className="text-2xl hover:text-blue-800 transition" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}</span>
                    )}
            </NavLink>


              <button className="border-2 border-yellow-400 text-yellow-500 px-5 py-1.5 rounded-xl font-semibold hover:bg-yellow-400 hover:text-white transition">
                Sign In
              </button>
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 md:hidden">
  
          {/* Mobile Cart Icon */}
          <NavLink to="/cart" className="relative">
              <FaCartShopping className="text-2xl text-purple-700" />
                  {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}</span>
                  )}
          </NavLink>

          {/* Hamburger Button */}
          <button className="text-2xl text-purple-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaXmark /> : <FaBars />}
          </button>

        </div>
      </div>
    </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-lg z-40">
          <ul className="flex flex-col gap-6 px-6 py-6 font-medium">
            <NavLink onClick={() => setMenuOpen(false)} to="/" className={linkClass}>Home</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/products" className={linkClass}>Our Products</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/about" className={linkClass}>About Us</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/contact" className={linkClass}>Contact Us</NavLink>
          </ul>

          <div className="flex items-center justify-between px-6 pb-6">
            <div className="flex gap-4 text-gray-600">
              <FaFacebookF className="hover:text-blue-800 cursor-pointer" />
              <FaInstagram className="hover:text-pink-700 cursor-pointer" />
              <FaWhatsapp className="hover:text-green-500 cursor-pointer" />
            </div>

            {/* MOBILE CLICKABLE CART */}
           
          </div>

          <div className="px-6 pb-6">
            <button className="w-full border-2 border-yellow-400 text-yellow-500 py-2 rounded-xl font-semibold hover:bg-yellow-400 hover:text-white transition">
              Sign In
            </button>
          </div>
        </div>
      )}
    </>
  );
}
