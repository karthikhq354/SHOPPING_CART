const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  image:       { type: String, required: true },
  category:    { type: String, required: true },
  stock:       { type: Number, default: 100, min: 0 },
  ratings:     { type: Number, default: 5, min: 0, max: 5 },
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);