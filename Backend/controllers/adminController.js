const jwt     = require("jsonwebtoken");
const Admin   = require("../models/Admin");
const Product = require("../models/Product");
const User    = require("../models/User");
const Cart    = require("../models/Cart");
const Order   = require("../models/Order");
const { success, error } = require("../utils/apiResponse");

// ── Seed admin ──────────────────────────────────────────
const seedAdmin = async () => {
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: "Super Admin",
    });
    console.log("✅ Admin seeded:", process.env.ADMIN_EMAIL);
  }
};

// ── Seed products ───────────────────────────────────────
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: "Custom Name Necklace",   price: 199,    category: "Jewelry",    image: "https://images.unsplash.com/photo-1761210875101-1273b9ae5600?w=600&auto=format&fit=crop&q=60",  description: "Personalized sterling silver necklace with hand-engraved name. Perfect for gifting to someone special.", stock: 50, isFeatured: true },
      { name: "Handcrafted Candle Set", price: 134.99, category: "Home",       image: "https://plus.unsplash.com/premium_photo-1764241715990-5b327f6144c0?w=600&auto=format&fit=crop&q=60", description: "Set of 3 aromatic soy candles hand-poured with essential oils. Burns for 60+ hours.", stock: 30 },
      { name: "Leather Journal",        price: 142.99, category: "Stationery", image: "https://images.unsplash.com/photo-1672256019300-9589d730bedd?w=600&auto=format&fit=crop&q=60",  description: "Premium full-grain leather journal with 200 blank pages. Perfect for writers and travelers.", stock: 40 },
      { name: "Aromatherapy Gift Box",  price: 99.99,  category: "Wellness",   image: "https://images.unsplash.com/photo-1576579406887-161dbdd9afe4?q=80&w=600&auto=format&fit=crop",   description: "A calming collection of essential oils, bath salts, and a bamboo diffuser.", stock: 60, isFeatured: true },
      { name: "Succulent Garden Kit",   price: 129.99, category: "Home",       image: "https://images.unsplash.com/photo-1644419306509-bd379c9ac127?w=600&auto=format&fit=crop&q=60",  description: "Easy-to-grow indoor succulent set with ceramic pots and organic soil.", stock: 35 },
      { name: "Gourmet Chocolate Box",  price: 93.99,  category: "Birthday",   image: "https://images.unsplash.com/photo-1614631016624-cb89bceec02c?w=600&auto=format&fit=crop&q=60",  description: "Luxury assortment of 24 handcrafted Belgian chocolates in a gift box.", stock: 80, isFeatured: true },
      { name: "Silk Scarf Collection",  price: 154.99, category: "Beauty",     image: "https://images.unsplash.com/photo-1693382288218-2ce85aa26974?w=600&auto=format&fit=crop&q=60",  description: "100% pure silk scarves in vibrant prints. Lightweight and versatile.", stock: 25 },
      { name: "Ceramic Mug Set",        price: 144.99, category: "Anniversary", image: "https://plus.unsplash.com/premium_photo-1663013084900-c5036595be6f?w=600&auto=format&fit=crop&q=60", description: "Set of 2 handmade ceramic mugs — perfect for couples. Microwave and dishwasher safe.", stock: 45 },
    ]);
    console.log("✅ Products seeded: 8");
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
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
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

module.exports = { login, dashboard, seedAdmin, seedProducts };