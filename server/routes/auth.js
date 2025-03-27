const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const argon2 = require('argon2');

const router = express.Router();

router.post('/account/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.json({ message: 'Email envoyé' }); // éviter les fuites
    }

    const token = crypto.randomBytes(32).toString('hex');
    const userId = result.rows[0].id;
    const expiresAt = new Date(Date.now() + 3600 * 1000); // expire dans 1h

    await db.query(
      'INSERT INTO reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    const resetUrl = `${process.env.CLIENT_URL}/account/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      auth: {
        user: process.env.MJ_API_KEY,
        pass: process.env.MJ_API_SECRET
      }
    });

    await transporter.sendMail({
      from: '"Support" <arnaudieslilian@gmail.com>',
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html: `<p>Voici votre lien de réinitialisation :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });

    res.json({ message: 'Email envoyé si le compte existe.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/account/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    const userId = result.rows[0].user_id;
    const hashedPassword = await argon2.hash(password);

    await db.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    await db.query('DELETE FROM reset_tokens WHERE token = $1', [token]);

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    console.error('Erreur dans reset-password:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;