const express = require("express");
const cors    = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use("/api/admin",      require("./routes/adminRoutes"));
app.use("/api/products",   require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/users",      require("./routes/userRoutes"));
app.use("/api/cart",       require("./routes/cartRoutes"));
app.use("/api/orders",     require("./routes/orderRoutes"));

app.get("/api/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date(), env: process.env.NODE_ENV })
);

app.use(notFound);
app.use(errorHandler);

module.exports = app;