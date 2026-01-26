import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white ">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Logo & Brand */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className="text-yellow-400 text-2xl">🎁</span>
            <h2 className="text-2xl font-bold">ImpressiveGift</h2>
          </div>
          <p className="text-sm text-purple-100 max-w-xs mx-auto md:mx-0">
            Your one-stop destination for unique and memorable gifts for every occasion.
          </p>
        </div>

        {/* Get in Touch */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
          <ul className="text-sm space-y-2 text-purple-100">
            <li>Email: impressivegift@gmail.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Chennai, Tamil Nadu, India</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2 text-purple-100">
            <li className="hover:text-yellow-400 cursor-pointer">Home</li>
            <li className="hover:text-yellow-400 cursor-pointer">Products</li>
            <li className="hover:text-yellow-400 cursor-pointer">Categories</li>
            <li className="hover:text-yellow-400 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-5 text-yellow-400 text-lg">
            <FaFacebookF className="cursor-pointer hover:text-white transition" />
            <FaInstagram className="cursor-pointer hover:text-white transition" />
            <FaTwitter className="cursor-pointer hover:text-white transition" />
            <FaLinkedinIn className="cursor-pointer hover:text-white transition" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-purple-500 text-center py-4 text-xs sm:text-sm text-purple-100 px-4">
        © 2026 ImpressiveGift. Developed by RK Software Solutions.
      </div>
    </footer>
  );
}
