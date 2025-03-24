const db = require('../config/db');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

// Fetch all users
exports.getUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
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
    const { lastname, firstname, email, password, role } = req.body;
    console.log('Creating user:', { lastname, firstname, email, password });

    const hashedPassword = await argon2.hash(password);
    const result = await db.query(
      'INSERT INTO users (lastname, firstname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [lastname, firstname, email, hashedPassword, role]
    );

    const user = result.rows[0];

    // Génération du token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (err) {
    console.error('Error in createUser:', err);
    next(err);
  }
};

// Update a user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lastname, firstname, email, password, role} = req.body;
    const result = await db.query(
      'UPDATE users SET lastname = $1, firstname = $2, firstname = $3, password = $4 WHERE id = $4 RETURNING *',
      [lastname, firstname, email, password, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Vérification du rôle fourni
    const allowedRoles = ['admin', 'client'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

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
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // ✅ Ajout du rôle
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Erreur dans loginUser:', err);
    res.status(500).json({ message: 'Erreur serveur' });
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