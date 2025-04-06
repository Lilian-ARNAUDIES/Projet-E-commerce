const db = require('../config/db');

exports.getCategories = async (req, res) => {
  const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
  res.json(result.rows);
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom requis' });
  
    const result = await db.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur createCategory :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la catégorie.' });
  }
};
 
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Nom requis' });
 
  try {
    const result = await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur updateCategory :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
 
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur deleteCategory :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};