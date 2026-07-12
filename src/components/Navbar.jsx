import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import AuthModal from "./AuthModal";
import {
  FaBars, FaXmark, FaFacebookF, FaInstagram, FaWhatsapp,
  FaCartShopping, FaRightFromBracket, FaChevronDown,
} from "react-icons/fa6";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const linkClass = "cursor-pointer text-sm text-purple-700 hover:text-purple-900 font-medium transition duration-200";

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMenuOpen(false);
  };

  const displayName = user?.name
    ? user.name.split(" ")[0]
    : user?.username?.split("@")[0];

  const avatarLetter = displayName?.[0]?.toUpperCase() || "U";

  return (
    <>
      <nav className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-4 shadow-sm fixed top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-yellow-500 text-2xl">🎁</span>
            <h1 className="font-bold text-purple-700 text-xl">ImpressiveGift</h1>
          </NavLink>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex gap-8">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/products" className={linkClass}>Our Products</NavLink>
              <NavLink to="/about" className={linkClass}>About Us</NavLink>
              <NavLink to="/contact" className={linkClass}>Contact Us</NavLink>
            </ul>

            <div className="flex items-center gap-5 text-gray-500">
              <FaFacebookF className="hover:text-blue-800 cursor-pointer transition" />
              <FaInstagram className="hover:text-pink-700 cursor-pointer transition" />
              <FaWhatsapp className="hover:text-green-500 cursor-pointer transition" />

              {/* Cart */}
              <NavLink to="/cart" className="relative">
                <FaCartShopping className="text-2xl hover:text-purple-700 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Auth */}
              {isLoggedIn ? (
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-white text-xs font-bold">
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-semibold text-purple-700 max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <FaChevronDown className={`text-xs text-purple-400 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-2xl shadow-xl w-52 py-2 z-50"
                      style={{ animation: "dropIn 0.15s ease" }}>
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                        <p className="text-sm font-bold text-purple-700">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.username}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <FaRightFromBracket /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="border-2 border-yellow-400 text-yellow-500 px-5 py-1.5 rounded-xl font-semibold hover:bg-yellow-400 hover:text-white transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 md:hidden">
            <NavLink to="/cart" className="relative">
              <FaCartShopping className="text-2xl text-purple-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button className="text-2xl text-purple-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-lg z-40">
          <ul className="flex flex-col gap-5 px-6 py-6 font-medium">
            <NavLink onClick={() => setMenuOpen(false)} to="/" className={linkClass}>Home</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/products" className={linkClass}>Our Products</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/about" className={linkClass}>About Us</NavLink>
            <NavLink onClick={() => setMenuOpen(false)} to="/contact" className={linkClass}>Contact Us</NavLink>
          </ul>

          {isLoggedIn ? (
            <div className="px-6 pb-6 border-t pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
                  {avatarLetter}
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-700">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[200px]">{user.username}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="w-full text-left text-sm text-red-500 flex items-center gap-2 py-2">
                <FaRightFromBracket /> Logout
              </button>
            </div>
          ) : (
            <div className="px-6 pb-6">
              <button
                onClick={() => { setShowAuth(true); setMenuOpen(false); }}
                className="w-full border-2 border-yellow-400 text-yellow-500 py-2 rounded-xl font-semibold hover:bg-yellow-400 hover:text-white transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}