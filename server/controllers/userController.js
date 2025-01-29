const db = require('../config/db');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

// Fetch all users
exports.getUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Fetch a single user
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('Creating user:', { name, email, password });

    const hashedPassword = await argon2.hash(password);
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    console.log('User created:', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in createUser:', err);
    next(err);
  }
};

// Update a user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Requête de connexion reçue - Email:', email, 'Mot de passe:', password);

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.error('Utilisateur non trouvé:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      console.error('Mot de passe invalide pour l\'email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erreur serveur dans loginUser:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserAccount = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log('Token décodé:', decoded);

    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur dans getUserAccount:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};