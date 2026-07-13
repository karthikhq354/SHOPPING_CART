import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { cartAPI } from "../services/api";

const CartContext = createContext(null);

function getCartKey(user) {
  return user?.isLoggedIn ? `user_cart_${user.username}` : "guest_cart";
}

function loadCart(key) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const cartKey = getCartKey(user);

  const [cartItems, setCartItems] = useState(() => loadCart(cartKey));

  // Switch cart when auth state changes
  useEffect(() => {
    setCartItems(loadCart(cartKey));
  }, [cartKey]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  // Sync to backend when logged-in user's cart changes
  useEffect(() => {
    if (user?.isLoggedIn && cartItems.length >= 0) {
      cartAPI.sync(user.username, user.name, cartItems).catch(() => {});
    }
  }, [cartItems, user]);

  const addToCart = useCallback((product) => {
    const qty = Number(product.quantity) > 0 ? Number(product.quantity) : 1;
    setCartItems((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((item) => (item._id || item.id) === id);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, id, price: Number(product.price), quantity: qty }];
    });
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id || item.id) === id ? { ...item, quantity: qty } : item)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal  = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}