const db = require('../config/db');

// Fetch all orders
exports.getOrders = async (req, res, next) => {
  try {
    const result = await db.query('SELECT orders.*, users.firstname, users.lastname FROM orders JOIN users ON orders.user_id = users.id');
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

    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
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

// Récupère les items d'une commande
exports.getOrderItems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT oi.*, p.name, p.price 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Checkout cart
exports.checkoutCart = async (req, res, next) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { userId, totalPrice } = req.body; // 🔥 On récupère `totalPrice` envoyé par le frontend

    if (!userId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (totalPrice === undefined || isNaN(totalPrice)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Total price is required and must be a number' });
    }

    // 1. Récupérer tous les items du panier de l'utilisateur
    const cartItemsResult = await client.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    const cartItems = cartItemsResult.rows;

    if (cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Vérifier le stock pour chaque produit
    for (const item of cartItems) {
      const productResult = await client.query('SELECT stock FROM products WHERE id = $1', [item.product_id]);
      if (productResult.rows.length === 0 || productResult.rows[0].stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
      }
    }

    // 3. Créer une nouvelle commande avec `totalPrice`
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalPrice, 'pending']
    );
    const orderId = orderResult.rows[0].id;

    // 4. Insérer les items du panier dans order_items et mettre à jour le stock
    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.product_id, item.quantity]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 5. Vider le panier
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');
    res.json({ message: 'Checkout successful', orderId, totalPrice }); // 🔥 On retourne `totalPrice`
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};