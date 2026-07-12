const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ 
  origin: function(origin, callback) {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin",    require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users",    require("./routes/userRoutes"));
app.use("/api/cart",     require("./routes/cartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));

app.get("/api/health", (req, res) => res.json({ status: "OK", timestamp: new Date() }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;