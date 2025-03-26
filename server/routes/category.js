const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// GET all categories
router.get('/', getCategories);

// POST create a new category
router.post('/', createCategory);

// PUT update a category
router.put('/:id', updateCategory);

// DELETE a category
router.delete('/:id', deleteCategory);

module.exports = router;
