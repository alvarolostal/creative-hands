const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Carpeta para uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

// Validación y límites: solo imágenes, max 2MB por archivo
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo de archivo no permitido. Solo JPEG/PNG/WebP/GIF."));
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter,
});

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
// @desc    Crear nuevo producto (acepta imágenes multipart/form-data)
// @access  Private/Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  async (req, res) => {
    try {
      // Construir datos del producto y parsear campos comunes
      const productData = {
        ...req.body,
        createdBy: req.user.id,
      };

      if (productData.price) productData.price = parseFloat(productData.price);
      if (productData.stock) productData.stock = parseInt(productData.stock, 10);

      if (productData.materials && typeof productData.materials === "string") {
        productData.materials = productData.materials
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean);
      }

      if (req.files && req.files.length > 0) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        productData.images = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
      }

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
  }
);

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private/Admin
router.put("/:id", protect, adminOnly, upload.array("images", 5), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // Si vienen archivos nuevos, reemplazamos las imágenes y borramos las anteriores
    // Manejo avanzado de imágenes: el cliente puede enviar keepImages (array de URLs que quiere conservar)
    // y además archivos nuevos en req.files. Eliminamos solo las imágenes que el cliente no quiera conservar.
    let keepImages = [];
    if (req.body.keepImages) {
      try {
        // puede venir como JSON string o como array ya parseado
        keepImages = typeof req.body.keepImages === "string" ? JSON.parse(req.body.keepImages) : req.body.keepImages;
      } catch (err) {
        keepImages = [];
      }
    }

    // Determinar qué imágenes eliminar (las que están en product.images y no en keepImages)
    const toDelete = (product.images || []).filter((img) => !keepImages.includes(img));
    if (toDelete.length > 0) {
      toDelete.forEach((imgPath) => {
        try {
          const filename = path.basename(imgPath);
          const full = path.join(uploadDir, filename);
          if (fs.existsSync(full)) fs.unlinkSync(full);
        } catch (err) {
          console.warn("Warning al borrar imagen antigua:", err.message);
        }
      });
    }

    // Construir la lista final de imágenes teniendo en cuenta un posible 'order' enviado por el cliente.
    // Si el cliente envía `order` (array) puede mezclar URLs existentes y placeholders '__new__' para archivos subidos.
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const newFiles = req.files && req.files.length > 0 ? req.files : [];

    let finalImages = [];
    if (req.body.order) {
      let orderArr = [];
      try {
        orderArr = typeof req.body.order === "string" ? JSON.parse(req.body.order) : req.body.order;
      } catch (err) {
        orderArr = [];
      }

      let newIdx = 0;
      for (const entry of orderArr) {
        if (entry === "__new__") {
          if (newFiles[newIdx]) {
            finalImages.push(`${baseUrl}/uploads/${newFiles[newIdx].filename}`);
            newIdx++;
          }
        } else if (typeof entry === "string") {
          finalImages.push(entry);
        }
      }
    } else {
      const newUploaded = newFiles.length > 0 ? newFiles.map((f) => `${baseUrl}/uploads/${f.filename}`) : [];
      finalImages = [...(Array.isArray(keepImages) ? keepImages : []), ...newUploaded];
    }

    req.body.images = finalImages;

    // parsear campos numéricos y arrays que vengan en body
    if (req.body.price) req.body.price = parseFloat(req.body.price);
    if (req.body.stock) req.body.stock = parseInt(req.body.stock, 10);
    if (req.body.materials && typeof req.body.materials === "string") {
      req.body.materials = req.body.materials
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
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

    // eliminar imágenes asociadas del disco
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        try {
          const filename = path.basename(imgPath);
          const full = path.join(uploadDir, filename);
          if (fs.existsSync(full)) fs.unlinkSync(full);
        } catch (err) {
          console.warn("Warning al borrar imagen en delete:", err.message);
        }
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

// @route DELETE /api/products/:id/images
// @desc  Eliminar una imagen concreta asociada al producto
// @access Private/Admin
router.delete("/:id/images", protect, adminOnly, async (req, res) => {
  try {
    const { image } = req.body; // URL completa de la imagen
    if (!image) {
      return res.status(400).json({ success: false, message: "Falta el parámetro 'image'" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Si la imagen no está en la lista, nada que hacer
    if (!product.images || !product.images.includes(image)) {
      return res.status(400).json({ success: false, message: "Imagen no asociada al producto" });
    }

    // Borrar archivo del disco si existe
    try {
      const filename = path.basename(image);
      const full = path.join(uploadDir, filename);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    } catch (err) {
      console.warn("Warning al borrar imagen (del endpoint):", err.message);
    }

    // Quitar de la lista y guardar
    product.images = product.images.filter((u) => u !== image);
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ success: false, message: "Error al eliminar imagen" });
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
