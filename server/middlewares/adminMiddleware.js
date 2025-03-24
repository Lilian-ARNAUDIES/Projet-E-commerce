module.exports = (req, res, next) => {
    console.log("🔍 Vérification rôle admin :", req.user);

    if (!req.user || req.user.role !== 'admin') {
      console.log("🚨 Accès refusé : rôle actuel :", req.user ? req.user.role : "Aucun utilisateur");
      return res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs' });
    }

    next();
};