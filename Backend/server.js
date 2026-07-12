require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { seedAdmin, seedProducts } = require("./controllers/adminController");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedAdmin();
  await seedProducts();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  });
};

start();