import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ── User Contexts ── */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

/* ── Admin Context ── */
import { AdminProvider } from "./admin/context/AdminContext";

/* ── User Layout (eager — always needed) ── */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Occasions from "./components/Occasions";
import Testimonials from "./components/Testimonials";

/* ── User Pages ── */
import ProductDetails from "./pages/ProductDetails";
import ProductsListPage from "./pages/ProductsListPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/AuthPage";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

/* ── Admin Pages (Lazy Loaded) ── */
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const AdminProtectedRoute = lazy(() =>
  import("./admin/components/AdminProtectedRoute")
);
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("./admin/pages/Products"));
const AdminUsers = lazy(() => import("./admin/pages/Users"));
const CartUsers = lazy(() => import("./admin/pages/CartUsers"));
const AdminOrders = lazy(() => import("./admin/pages/Orders"));

/* ── Loading Spinner ── */
const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="w-10 h-10 rounded-full border-4 border-purple-400 border-t-transparent animate-spin"></div>
  </div>
);

/* ── Home Page ── */
const Home = () => (
  <>
    <Hero />
    <Categories />
    <Products />
    <Occasions />
    <Testimonials />
  </>
);

/* ── About Page ── */
const About = () => (
  <div className="mt-24 min-h-[60vh] flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold text-purple-700">
      About ImpressiveGift
    </h1>

    <p className="mt-4 max-w-xl text-center text-gray-600">
      We craft meaningful gifts that celebrate life's most memorable moments.
    </p>
  </div>
);

/* ── Contact Page ── */
const Contact = () => (
  <div className="mt-24 min-h-[60vh] flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold text-purple-700">Contact Us</h1>

    <p className="mt-4 text-lg text-gray-600">
      impressivegift@gmail.com
    </p>
  </div>
);

/* ── User Layout ── */
function UserShell() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductsListPage />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

/* ── Main App ── */
export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProvider>
                <AdminLogin />
              </AdminProvider>
            </Suspense>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProvider>
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              </AdminProvider>
            </Suspense>
          }
        >
          <Route
            index
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="carts"
            element={<CartUsers />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />
        </Route>

        {/* User Website */}
        <Route path="/*" element={<UserShell />} />

      </Routes>

    </BrowserRouter>
  );
}