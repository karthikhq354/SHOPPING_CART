const User = require("../models/User");
const { success, error } = require("../utils/apiResponse");

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(),
    ]);
    return success(res, { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    return error(res, err.message);
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, user);
  } catch (err) {
    return error(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return success(res, null, "User deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

// Called from frontend after OTP login
const upsert = async (req, res) => {
  try {
    const { name, username } = req.body;
    if (!username) return error(res, "Username required", 400);
    const user = await User.findOneAndUpdate(
      { username },
      { name: name || username, isLoggedIn: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return success(res, user, "User synced", 200);
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getAll, getById, remove, upsert };