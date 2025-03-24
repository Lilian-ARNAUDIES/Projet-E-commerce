const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { getUsers, createUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { getOrders, getOrderItems, updateOrderStatus } = require('../controllers/orderController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = express.Router();

// Vérifie que toutes les fonctions existent
console.log("🔍 Vérification des contrôleurs:", {
  getUsers, updateUserRole, deleteUser, getOrders, updateOrderStatus,
  getProducts, createProduct, updateProduct, deleteProduct
});

// Gestion des utilisateurs
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.post('/users', authMiddleware, adminMiddleware, createUser);
router.put('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

// Gestion des commandes
router.get('/orders', authMiddleware, adminMiddleware, getOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.get('/orders/:id/items', authMiddleware, adminMiddleware, getOrderItems);

// Gestion des produits
router.get('/products', authMiddleware, adminMiddleware, getProducts);
router.post('/products', authMiddleware, adminMiddleware, createProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

// Gestion des catégories
router.get('/categories', authMiddleware, adminMiddleware, getCategories);
router.post('/categories', authMiddleware, adminMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, deleteCategory);

// Gestion des images
router.post('/images', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'Aucun fichier envoyé.' });
    }

    const file = req.files.image;
    const ext = path.extname(file.name);
    const filename = crypto.randomBytes(16).toString('hex') + ext;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const uploadPath = path.join(uploadDir, filename);

    await file.mv(uploadPath);

    res.status(201).json({
      success: true,
      data: {
        filename: filename,
        filepath: uploadPath,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.delete('/images/:filename', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'uploads', filename);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      return res.json({ success: true, message: 'Image supprimée.' });
    } else {
      return res.status(404).json({ success: false, message: 'Fichier non trouvé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

router.put('/images/:filename', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const imageDir = path.join(__dirname, '..', 'uploads');
    const existingImagePath = path.join(imageDir, filename);

    if (req.files && req.files.image) {
      const file = req.files.image;

      if (fs.existsSync(existingImagePath)) {
        fs.unlinkSync(existingImagePath);
      }

      const ext = path.extname(file.name);
      const newFilename = crypto.randomBytes(16).toString('hex') + ext;
      const newUploadPath = path.join(imageDir, newFilename);

      await file.mv(newUploadPath);

      res.status(201).json({
        success: true,
        data: {
          filename: filename,
          filepath: uploadPath,
          mimetype: file.mimetype
        }
      });

      fs.unlinkSync(newUploadPath);

      return res.json({ success: true, data: { filename: optimizedFilename } });
    }

    return res.json({ success: true, data: { filename, alt: req.body.alt || '' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;