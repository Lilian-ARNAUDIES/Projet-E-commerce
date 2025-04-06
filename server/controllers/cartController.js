const db = require('../config/db');

// Get all items in the cart
exports.getCart = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.query;

    if (!userId && !sessionId) {
      return res.status(400).json({ message: "User ID or session ID is required" });
    }

    // Construire la requête en fonction du paramètre fourni
    let query = `
      SELECT c.id, c.user_id, c.session_id, c.product_id, c.quantity, 
             p.price, p.name AS productName, (c.quantity * p.price) AS totalPrice
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE `;
    let param;

    if (userId) {
      query += "c.user_id = $1";
      param = userId;
    } else {
      query += "c.session_id = $1";
      param = sessionId;
    }

    const result = await db.query(query, [param]);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur dans getCart :", err);
    next(err);
  }
};

// Add an item to the cart
exports.addToCart = async (req, res, next) => {
  try {
    const { userId, sessionId, productId, quantity } = req.body;

    if ((!userId && !sessionId) || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Vérifier que le produit existe
    const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Insérer dans le panier en mettant soit l'ID utilisateur, soit le session_id
    const result = await db.query(
      `INSERT INTO cart (user_id, session_id, product_id, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId || null, sessionId || null, productId, quantity]
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
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { userId, sessionId } = req.body;
    console.log('[checkoutCart] Reçu :', { userId, sessionId });

    if (!userId && !sessionId) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'User ID or session ID required' });
    }

    let cartItemsResult;
    if (userId) {
      cartItemsResult = await client.query(
        'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
        [userId]
      );
    } else {
      cartItemsResult = await client.query(
        'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.session_id = $1::uuid',
        [sessionId]
      );
    }

    const cartItems = cartItemsResult.rows;
    console.log('[checkoutCart] Panier récupéré :', cartItems.length, 'articles');
    if (cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += item.price * item.quantity;
    }

    for (const item of cartItems) {
      const productResult = await client.query('SELECT stock FROM products WHERE id = $1', [item.product_id]);
      if (productResult.rows.length === 0 || productResult.rows[0].stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
      }
    }

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, session_id, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId || null, sessionId || null, totalPrice, 'pending']
    );
    const orderId = orderResult.rows[0].id;

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

    if (userId) {
      await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    } else {
      await client.query('DELETE FROM cart WHERE session_id = $1::uuid', [sessionId]);
    }

    await client.query('COMMIT');
    res.json({ message: 'Checkout successful', orderId, totalPrice });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur dans checkoutCart:', err);
    next(err);
  } finally {
    client.release();
  }
};