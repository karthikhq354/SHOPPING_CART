import { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const a = localStorage.getItem("admin_info");
      return a ? JSON.parse(a) : null;
    } catch { return null; }
  });

  const loginAdmin = (data, token) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_info", JSON.stringify(data));
    setAdmin(data);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin, isAdmin: !!admin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be inside AdminProvider");
  return ctx;
};