const db = require('../config/db');

// Get all items in the cart
exports.getCart = async (req, res, next) => {
  try {
    const { userId } = req.query; // Assumes `userId` is passed as a query param
    const result = await db.query(
      'SELECT * FROM cart WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Add an item to the cart
exports.addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Vérifie si le produit existe
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const result = await db.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update the quantity of a cart item
exports.updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const result = await db.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM cart WHERE id = $1', [id]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

// Checkout the cart
exports.checkoutCart = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // 1. Fetch all items in the user's cart
    const cartItems = await db.query(
      'SELECT * FROM cart WHERE user_id = $1',
      [userId]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Create a new order
    const order = await db.query(
      'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *',
      [userId, 'pending']
    );

    const orderId = order.rows[0].id;

    // 3. Move items from cart to order_items
    for (const item of cartItems.rows) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.product_id, item.quantity]
      );
      const product = await db.query('SELECT stock FROM products WHERE id = $1', [item.product_id]);
      if (product.rows[0].stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
      }
      await db.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    // 4. Clear the cart
    await db.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.json({ message: 'Checkout successful', orderId });
  } catch (err) {
    next(err);
  }
};