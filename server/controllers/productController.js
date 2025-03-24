const db = require('../config/db');

// Fetch all products
exports.getProducts = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Fetch a single product
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
  const { name, price, stock, description, image, category_id } = req.body;
    if (!name || !price || !description || !image) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }
    const stockInt = stock ? parseInt(stock, 10) : undefined;
    const priceFloat = parseFloat(price);

    const result = await db.query(
      'INSERT INTO products (name, price, stock, description, image, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, priceFloat, stockInt, description, image, category_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, category_id } = req.body;
    const result = await db.query(
      'UPDATE products SET name = $1, price = $2, description = $3, image = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [name, price, description, image, category_id || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};