const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Obtener todos los productos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort = '-createdAt' } = req.query;
    
    let query = {};
    
    // Filtrar por categoría
    if (category) {
      query.category = category;
    }
    
    // Filtrar destacados
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Búsqueda por texto
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .sort(sort)
      .populate('createdBy', 'name');
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto'
    });
  }
});

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto'
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Obtener lista de categorías
// @access  Public
router.get('/categories/list', (req, res) => {
  const categories = [
    'Joyería artesanal',
    'Velas y aromáticos',
    'Textiles y ropa',
    'Cerámica y arcilla',
    'Arte hecho a mano'
  ];
  
  res.json({
    success: true,
    categories
  });
});

module.exports = router;