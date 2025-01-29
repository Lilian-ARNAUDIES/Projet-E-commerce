const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  checkoutCart,
} = require('../controllers/cartController');

// GET all items in the cart
router.get('/', getCart);

// POST add an item to the cart
router.post('/', addToCart);

// PUT update the quantity of a cart item
router.put('/:id', updateCartItem);

// DELETE an item from the cart
router.delete('/:id', removeCartItem);

// POST checkout the cart
router.post('/checkout', checkoutCart);

module.exports = router;