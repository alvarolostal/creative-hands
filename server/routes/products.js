const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const Category = require("../models/Category");

// @route   GET /api/products
// @desc    Obtener todos los productos
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search, sort = "-createdAt" } = req.query;

    const query = {};

    // Búsqueda por texto
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .sort(sort)
      .populate("createdBy", "name")
      .populate("categoryId", "name slug");

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
    });
  }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto por ID
// @access  Public
// NOTE: category-specific route must be declared before the generic '/:id' route
// @route   GET /api/products/category/:slug
// @desc    Obtener productos por slug de categoría
// @access  Public
router.get("/category/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    // Buscar por categoryId (ya no usamos el campo legacy `category`)
    const query = { categoryId: category._id };

    const products = await Product.find(query)
      .populate("createdBy", "name")
      .populate("categoryId", "name slug");

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener productos por categoría",
      });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("categoryId", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener producto",
    });
  }
});

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private/Admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.id,
    };

    let product = await Product.create(productData);
    product = await Product.findById(product._id)
      .populate("createdBy", "name")
      .populate("categoryId", "name slug");

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      error: error.message,
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private/Admin
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    product = await Product.findById(product._id)
      .populate("createdBy", "name")
      .populate("categoryId", "name slug");

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto",
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto",
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Obtener lista de categorías (legacy path) - lee desde DB si está disponible
// @access  Public
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error al obtener lista de categorías:", error);
    // fallback a lista hardcodeada si algo falla
    const fallback = [
      "Joyería artesanal",
      "Velas y aromáticos",
      "Textiles y ropa",
      "Cerámica y arcilla",
      "Arte hecho a mano",
    ];
    res.json({ success: true, categories: fallback });
  }
});

module.exports = router;
