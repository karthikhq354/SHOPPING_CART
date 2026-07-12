import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useState } from "react";
import {
  FaGauge, FaBox, FaUsers, FaCartShopping, FaClipboardList,
  FaBars, FaXmark, FaRightFromBracket, FaGift,
} from "react-icons/fa6";

const navItems = [
  { to: "/admin/dashboard", icon: <FaGauge />, label: "Dashboard" },
  { to: "/admin/products",  icon: <FaBox />,   label: "Products" },
  { to: "/admin/users",     icon: <FaUsers />,  label: "Users" },
  { to: "/admin/carts",     icon: <FaCartShopping />, label: "Cart Users" },
  { to: "/admin/orders",    icon: <FaClipboardList />, label: "Orders" },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logoutAdmin(); navigate("/admin/login"); };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
      isActive ? "bg-purple-700 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-gray-900 flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <FaGift className="text-yellow-400 text-xl flex-shrink-0" />
          {sidebarOpen && <span className="text-white font-bold text-base tracking-tight">ImpressiveGift</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} title={item.label}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: admin info + logout */}
        <div className="p-3 border-t border-gray-800">
          {sidebarOpen && (
            <div className="px-3 py-2 mb-2">
              <p className="text-white text-sm font-semibold truncate">{admin?.name}</p>
              <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-900/20 hover:text-red-300 transition text-sm"
            title="Logout">
            <FaRightFromBracket className="flex-shrink-0" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800 transition">
            {sidebarOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">{admin?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}