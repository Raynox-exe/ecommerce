const Product = require('../models/Product');
const Category = require('../models/Category');

const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: Category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: Category });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { categoryId: req.params.categoryId }, include: Category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsBySearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: q } },
          { description: { [Op.substring]: q } }
        ]
      },
      include: Category
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
