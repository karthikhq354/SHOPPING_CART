const Cart = require("../models/Cart");
const { success, error } = require("../utils/apiResponse");

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [carts, total] = await Promise.all([
      Cart.find().sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
      Cart.countDocuments(),
    ]);
    return success(res, { carts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    return error(res, err.message);
  }
};

const getByUsername = async (req, res) => {
  try {
    const cart = await Cart.findOne({ username: req.params.username });
    if (!cart) return success(res, { items: [], totalItems: 0, totalValue: 0 });
    return success(res, cart);
  } catch (err) {
    return error(res, err.message);
  }
};

const sync = async (req, res) => {
  try {
    const { username, name, items } = req.body;
    if (!username) return error(res, "Username required", 400);
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const totalValue = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const cart = await Cart.findOneAndUpdate(
      { username },
      { name, items, totalItems, totalValue },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return success(res, cart, "Cart synced");
  } catch (err) {
    return error(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const { username } = req.params;
    await Cart.findOneAndDelete({ username });
    return success(res, null, "Cart deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getAll, getByUsername, sync, remove };