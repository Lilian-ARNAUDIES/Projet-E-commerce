const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  loginUser,
  getUserAccount
} = require('../controllers/userController');

// GET all users
router.get('/', getUsers);

// GET current user account 
router.get('/account', getUserAccount);

// GET a single user by ID
router.get('/:id', getUserById);

// POST a new user
router.post('/', createUser);

// POST login user
router.post('/login', loginUser);

// PUT update a user
router.put('/:id', updateUser);

// DELETE a user
router.delete('/:id', deleteUser);

module.exports = router;