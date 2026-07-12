const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed }, // Accept both numeric IDs and ObjectIds
  name:      String,
  price:     Number,
  quantity:  Number,
  image:     String,
});

const orderSchema = new mongoose.Schema({
  username:      { type: String, required: true },
  name:          { type: String, required: true },
  items:         [orderItemSchema],
  totalAmount:   { type: Number, required: true },
  shippingInfo:  {
    address: String, city: String, zip: String, email: String,
  },
  paymentMethod: { type: String, enum: ["card","upi","cod"], default: "cod" },
  status:        { type: String, enum: ["pending","processing","shipped","delivered","cancelled"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);