const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// Crear un nuevo pedido
router.post("/", protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Obtener el carrito del usuario
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Verificar stock de todos los productos
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({
          message: `Producto ${item.product.name} no encontrado`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}`,
        });
      }
    }

    // Preparar los items del pedido
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images?.[0] || "",
    }));

    // Calcular precios
    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 50 ? 0 : 5.95; // Envío gratis para pedidos > 50€
    const taxPrice = Number((itemsPrice * 0.21).toFixed(2)); // IVA 21%
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Crear el pedido
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod || "stripe",
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    await order.save();

    // Reducir el stock de los productos
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Vaciar el carrito
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
});

// Obtener pedidos del usuario
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
});

// Obtener un pedido específico
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name images"
    );

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar que el pedido pertenece al usuario o es admin
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
});

// Obtener todos los pedidos (solo admin)
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ message: "Error al obtener los pedidos" });
  }
});

// Actualizar estado del pedido (solo admin)
router.put("/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const { status } = req.body;
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "delivered" && { deliveredAt: Date.now() }),
      },
      { new: true }
    ).populate("items.product", "name images");

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    res.status(500).json({ message: "Error al actualizar el pedido" });
  }
});

// Webhook de Stripe (para confirmar pagos)
router.post("/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  // Esta ruta se implementará cuando integremos Stripe
  // Por ahora solo devolvemos OK
  res.json({ received: true });
});

module.exports = router;
