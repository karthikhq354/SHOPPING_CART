const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { success, error } = require("../utils/apiResponse");

// ── Seed admin on first run ──────────────────────────────
const seedAdmin = async () => {
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: "Super Admin" });
    console.log("✅ Admin seeded:", process.env.ADMIN_EMAIL);
  }
};

// POST /api/admin/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, "Email and password required", 400);
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return error(res, "Invalid credentials", 401);
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return success(res, { token, name: admin.name, email: admin.email }, "Login successful");
  } catch (err) {
    return error(res, err.message);
  }
};

// GET /api/admin/dashboard
const dashboard = async (req, res) => {
  try {
    const [totalProducts, totalUsers, totalOrders, totalCarts] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Cart.countDocuments(),
    ]);
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    return success(res, { totalProducts, totalUsers, totalOrders, totalCarts, totalRevenue, recentOrders });
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Seed products on first run ──────────────────────────────
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const products = [
      { name: "Custom Name Necklace", description: "Personalized necklace with your name", price: 199, category: "Jewelry", image: "/necklace.jpg", stock: 50 },
      { name: "Handcrafted Candle Set", description: "Set of 3 aromatic handcrafted candles", price: 134.99, category: "Home", image: "/candles.jpg", stock: 30 },
      { name: "Leather Journal", description: "Premium leather bound journal with 200 pages", price: 142.99, category: "Stationery", image: "/journal.jpg", stock: 40 },
      { name: "Aromatherapy Gift Box", description: "Essential oils and diffuser starter pack", price: 99.99, category: "Wellness", image: "/aroma.jpg", stock: 60 },
      { name: "Personalized Photo Frame", description: "Custom photo frame with your memories", price: 89.99, category: "Decor", image: "/frame.jpg", stock: 45 },
      { name: "Luxury Perfume Set", description: "Collection of 3 premium perfumes", price: 249.99, category: "Beauty", image: "/perfume.jpg", stock: 25 },
    ];
    await Product.insertMany(products);
    console.log("✅ Products seeded:", products.length);
  }
};

module.exports = { login, dashboard, seedAdmin, seedProducts };