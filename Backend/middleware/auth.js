const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return error(res, "No token. Unauthorized.", 401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return error(res, "Invalid token.", 401);
  }
};

module.exports = { adminAuth };