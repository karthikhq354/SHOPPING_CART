const Order = require("../models/Order");
const Cart  = require("../models/Cart");
const { success, error } = require("../utils/apiResponse");

// GET /api/orders  (admin)
const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, username, startDate, endDate } = req.query;
    const query = {};
    if (status)    query.status   = status;
    if (username)  query.username = { $regex: username, $options: "i" };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate)   query.createdAt.$lte = new Date(endDate);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    return success(res, { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    return error(res, err.message);
  }
};

// GET /api/orders/user/:username  (user's own orders)
const getByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find({ username }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments({ username }),
    ]);
    return success(res, { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    return error(res, err.message);
  }
};

// POST /api/orders
const create = async (req, res) => {
  try {
    const { username, name, items, totalAmount, shippingInfo, paymentMethod } = req.body;
    if (!username || !name || !items?.length || !totalAmount || !shippingInfo)
      return error(res, "Missing required fields", 400);

    const order = await Order.create({
      username, name, items, totalAmount, shippingInfo,
      paymentMethod: paymentMethod || "cod",
    });

    // Clear the user's cart in DB after order
    await Cart.findOneAndUpdate(
      { username },
      { items: [], totalItems: 0, totalValue: 0 },
      { upsert: false }
    );

    return success(res, order, "Order placed successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

// PUT /api/orders/:id/status  (admin)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending","processing","shipped","delivered","cancelled"];
    if (!validStatuses.includes(status)) return error(res, "Invalid status", 400);
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return error(res, "Order not found", 404);
    return success(res, order, "Status updated");
  } catch (err) {
    return error(res, err.message);
  }
};

// DELETE /api/orders/:id  (admin)
const remove = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return error(res, "Order not found", 404);
    return success(res, null, "Order deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getAll, getByUsername, create, updateStatus, remove };