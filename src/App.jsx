import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

/* ---------- Components ---------- */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Occasions from "./components/Occasions";
import Testimonials from "./components/Testimonials";

/* ---------- Pages ---------- */
import ProductDetails from "./pages/ProductDetails";
import ProductsListPage from "./pages/ProductsListPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

const STORAGE_KEY = "impressivegift-cart";

/* ---------- Home Page ---------- */
const Home = ({ addToCart }) => (
  <>
    <Hero />
    <Categories />
    <Products addToCart={addToCart} />
    <Occasions />
    <Testimonials />
  </>
);

const About = () => (
  <div className="mt-24 text-center text-2xl min-h-[60vh]">
    About Us
  </div>
);

const Contact = () => (
  <div className="mt-24 text-center text-2xl min-h-[60vh]">
    Contact Us
  </div>
);

export default function App() {
  /* ---------- CART STATE ---------- */
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /* ---------- ADD TO CART ---------- */
  const addToCart = (product) => {
    const quantityToAdd = Number(product.quantity) > 0 ? Number(product.quantity) : 1;

    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prev, { ...product, quantity: quantityToAdd }];
    });
  };

  /* ---------- UPDATE QUANTITY ---------- */
  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  /* ---------- REMOVE FROM CART ---------- */
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /* ---------- CLEAR CART ---------- */
  const clearCart = () => {
    setCartItems([]);
  };

  /* ---------- CART COUNT ---------- */
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* ---------- NAVBAR ---------- */}
      <Navbar cartCount={cartCount} />

      {/* ---------- ROUTES ---------- */}
      <Routes>
       
        <Route
          path="/"
          element={<Home addToCart={addToCart} />}
        />

        <Route
          path="/products"
          element={<ProductsListPage addToCart={addToCart} />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              clearCart={clearCart}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* ---------- FOOTER ---------- */}
      <Footer />
    </BrowserRouter>
  );
}
