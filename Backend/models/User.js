const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  username:   { type: String, required: true, unique: true, trim: true, index: true },
  isLoggedIn: { type: Boolean, default: false },
  cartCount:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);