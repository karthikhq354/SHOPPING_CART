const Category = require("../models/Category");
const { success, error } = require("../utils/apiResponse");

const getAll = async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" }).sort({ name: 1 });
    return success(res, categories);
  } catch (err) { return error(res, err.message); }
};

const create = async (req, res) => {
  try {
    const { name, image, status } = req.body;
    if (!name) return error(res, "Category name required", 400);
    const cat = await Category.create({ name, image, status });
    return success(res, cat, "Category created", 201);
  } catch (err) { return error(res, err.message); }
};

const update = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return error(res, "Category not found", 404);
    return success(res, cat, "Category updated");
  } catch (err) { return error(res, err.message); }
};

const remove = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return success(res, null, "Category deleted");
  } catch (err) { return error(res, err.message); }
};

module.exports = { getAll, create, update, remove };