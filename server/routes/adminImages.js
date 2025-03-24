const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
// const sharp = require('sharp');

const adminAuth = (req, res, next) => {
  next();
};

/**
 * Endpoint pour uploader une image
 */
router.post('/images', adminAuth, async (req, res) => {
  try {
    // Vérifier que le fichier a bien été envoyé
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'Aucun fichier envoyé.' });
    }

    const file = req.files.image;
    // Générer un nom unique pour le fichier
    const ext = path.extname(file.name);
    const filename = crypto.randomBytes(16).toString('hex') + ext;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const uploadPath = path.join(uploadDir, filename);

    // Déplacer le fichier depuis la mémoire vers le système de fichiers
    await file.mv(uploadPath);

    // Définir un nouveau nom pour la version optimisée
    const optimizedFilename = 'opt-' + filename;
    const optimizedPath = path.join(uploadDir, optimizedFilename);

    // Redimensionner l'image avec Sharp (largeur maximale 800px tout en conservant le ratio)
    // await sharp(uploadPath)
    //   .resize(800, null, {
    //     withoutEnlargement: true
    //   })
    //   .toFile(optimizedPath);

    // Supprimer le fichier original si vous souhaitez conserver uniquement la version optimisée
    // fs.unlinkSync(uploadPath);

    // Enregistrer les métadonnées en BDD si besoin (exemple commenté)
    // const imageRecord = await Image.create({ productId: req.body.productId, filename: optimizedFilename, filepath: optimizedPath, alt: req.body.alt || '', mimetype: file.mimetype });

    res.status(201).json({
      success: true,
      data: {
        filename: optimizedFilename,
        filepath: optimizedPath,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

/**
 * Endpoint pour supprimer une image
 */
router.delete('/images/:filename', adminAuth, async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'uploads', filename);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      // Supprimer l'enregistrement en BDD si nécessaire
      // await Image.deleteOne({ filename });
      return res.json({ success: true, message: 'Image supprimée.' });
    } else {
      return res.status(404).json({ success: false, message: 'Fichier non trouvé.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

/**
 * Endpoint pour mettre à jour une image (changement de métadonnées ou remplacement)
 */
router.put('/images/:filename', adminAuth, async (req, res) => {
  try {
    const { filename } = req.params;
    const imageDir = path.join(__dirname, '..', 'uploads');
    const existingImagePath = path.join(imageDir, filename);

    // Si un nouveau fichier est envoyé, remplacer l'ancien fichier
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Supprimer l'ancien fichier s'il existe
      if (fs.existsSync(existingImagePath)) {
        fs.unlinkSync(existingImagePath);
      }

      // Générer un nom unique pour le nouveau fichier
      const ext = path.extname(file.name);
      const newFilename = crypto.randomBytes(16).toString('hex') + ext;
      const newUploadPath = path.join(imageDir, newFilename);

      // Déplacer le fichier uploadé
      await file.mv(newUploadPath);

      // Redimensionner le nouveau fichier
      const optimizedFilename = 'opt-' + newFilename;
      const optimizedPath = path.join(imageDir, optimizedFilename);

      // await sharp(newUploadPath)
      //   .resize(800, null, { withoutEnlargement: true })
      //   .toFile(optimizedPath);

      // Supprimer le fichier temporaire
      fs.unlinkSync(newUploadPath);

      // Mettez à jour les métadonnées en BDD si besoin
      return res.json({ success: true, data: { filename: optimizedFilename } });
    }

    // Sinon, mise à jour uniquement des métadonnées (ex : alt text)
    // Exemple en BDD :
    // const imageRecord = await Image.findOne({ filename });
    // imageRecord.alt = req.body.alt || imageRecord.alt;
    // await imageRecord.save();
    return res.json({ success: true, data: { filename, alt: req.body.alt || '' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;