const Product = require("../models/Product");
const { success, error } = require("../utils/apiResponse");

// GET /api/products
const getAll = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 8, featured } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (category && category !== "All") query.category = category;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (featured === "true") query.isFeatured = true;

    const sortOptions = {
      "price_asc":  { price: 1 },
      "price_desc": { price: -1 },
      "newest":     { createdAt: -1 },
      "rating":     { ratings: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return success(res, {
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    return error(res, err.message);
  }
};

// GET /api/products/:id
const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return error(res, "Product not found", 404);
    return success(res, product);
  } catch (err) {
    return error(res, err.message);
  }
};

// POST /api/products  (admin)
const create = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    if (!name || !description || !price || !image || !category)
      return error(res, "All fields required", 400);
    const product = await Product.create({ name, description, price, image, category, stock });
    return success(res, product, "Product created", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

// PUT /api/products/:id  (admin)
const update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return error(res, "Product not found", 404);
    return success(res, product, "Product updated");
  } catch (err) {
    return error(res, err.message);
  }
};

// DELETE /api/products/:id  (admin)
const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return error(res, "Product not found", 404);
    return success(res, null, "Product deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { getAll, getById, create, update, remove };