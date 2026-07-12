const Order = require("../models/Order");
const { success, error } = require("../utils/apiResponse");

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
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

// Get orders by username (user's own orders)
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

const create = async (req, res) => {
  try {
    const { username, name, items, totalAmount, shippingInfo, paymentMethod } = req.body;
    if (!username || !name || !items || !totalAmount || !shippingInfo) {
      return error(res, "Missing required fields", 400);
    }
    const order = await Order.create({ username, name, items, totalAmount, shippingInfo, paymentMethod });
    return success(res, order, "Order placed", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const updateStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return error(res, "Order not found", 404);
    return success(res, order, "Status updated");
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getAll, getByUsername, create, updateStatus };