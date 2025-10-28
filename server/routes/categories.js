const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

const generateSlug = (str = '') => {
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// @route GET /api/categories
// @desc  Obtener todas las categorías
// @access Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías' });
  }
});

// @route POST /api/categories
// @desc  Crear categoría (admin)
// @access Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });

    const finalSlug = slug && slug.trim() ? slug.trim() : generateSlug(name);

    const exists = await Category.findOne({ $or: [{ name: name.trim() }, { slug: finalSlug }] });
    if (exists) return res.status(400).json({ success: false, message: 'Categoría ya existe' });

    const category = await Category.create({ name: name.trim(), slug: finalSlug, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ success: false, message: 'Error al crear categoría' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Actualizar categoría (admin)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

    // If slug not provided but name is updated, regenerate slug
    if ((!updates.slug || !updates.slug.trim()) && updates.name) {
      updates.slug = updates.name.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar categoría' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Eliminar categoría (admin)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

    await category.deleteOne();
    // Opcional: podríamos limpiar categoryId en productos, pero lo dejamos para una migración explícita
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar categoría' });
  }
});

module.exports = router;
