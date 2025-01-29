const db = require('../config/db');

// Fetch all orders
exports.getOrders = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Fetch a single order
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Get all orders for a user
exports.getOrdersByUser = async (req, res, next) => {
  try {
    const { userId } = req.query;

    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { userId, totalPrice, status } = req.body;
    const result = await db.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalPrice, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update an order
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, totalPrice, status } = req.body;
    const result = await db.query(
      'UPDATE orders SET user_id = $1, total_price = $2, status = $3 WHERE id = $4 RETURNING *',
      [userId, totalPrice, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'completed', 'canceled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete an order
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Cancel an order (only if it's still pending)
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM orders WHERE id = $1 AND status = $2 RETURNING *',
      [id, 'pending']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found or cannot be canceled' });
    }

    res.json({ message: 'Order canceled', order: result.rows[0] });
  } catch (err) {
    next(err);
  }
};