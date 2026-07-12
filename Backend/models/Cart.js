const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  image:     { type: String },
  quantity:  { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  name:       { type: String },
  items:      [cartItemSchema],
  totalItems: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);