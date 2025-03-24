const express = require('express');
const router = express.Router();
const { getOrders, 
        getOrderById,
        createOrder, 
        updateOrder, 
        deleteOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderItems,
} = require('../controllers/orderController');

// GET all orders
router.get('/', getOrders);

// GET order items by order ID
router.get('/:id/items', getOrderItems);

// GET a single order by ID
router.get('/:id', getOrderById);

// POST a new order
router.post('/', createOrder);

// PUT update an order
router.put('/:id', updateOrder);

// DELETE an order
router.delete('/:id', deleteOrder);


// PUT update the status of an order
router.put('/:id/status', updateOrderStatus);

// DELETE cancel an order
router.delete('/:id', cancelOrder);

module.exports = router;