const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    console.log("🔍 Headers reçus :", req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("🚨 Aucun token reçu ! Headers :", req.headers);
      return res.status(401).json({ message: 'Accès refusé : aucun token fourni' });
    }

    const token = authHeader.split(' ')[1];
    console.log("🔍 Token reçu :", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("✅ Token bien reçu et décodé :", decoded);
      next();
    } catch (err) {
      console.log("🚨 Token invalide :", err.message);
      return res.status(403).json({ message: 'Token invalide' });
    }
};