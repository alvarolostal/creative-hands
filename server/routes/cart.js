const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// Obtener el carrito del usuario
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
});

// Añadir producto al carrito
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ID de producto requerido" });
    }

    // Verificar que el producto existe y tiene stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({ message: "Stock insuficiente" });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Añadir nuevo item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("Error al añadir al carrito:", error);
    res.status(500).json({ message: "Error al añadir al carrito" });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/update/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res
        .status(400)
        .json({ message: "La cantidad debe ser al menos 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito" });
    }

    // Verificar stock
    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ message: "Error al actualizar el carrito" });
  }
});

// Eliminar producto del carrito
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({ message: "Error al eliminar del carrito" });
  }
});

// Vaciar el carrito
router.delete("/clear", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    res.status(500).json({ message: "Error al vaciar el carrito" });
  }
});

module.exports = router;
