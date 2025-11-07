import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Package, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pendiente",
      processing: "En proceso",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-500 flex items-center justify-center">
        <Loader className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-500 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Mis Pedidos
        </h1>

        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tienes pedidos
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Cuando realices un pedido, aparecerá aquí
            </p>
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Ver productos
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order._id ? null : order._id)
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Pedido #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Realizado el {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-500">
                          {formatPrice(order.totalPrice)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.items.length} artículo
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {expandedOrder === order._id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalles expandibles */}
                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-6 space-y-6">
                        {/* Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Artículos
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <img
                                  src={item.image || "/placeholder.png"}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Cantidad: {item.quantity}
                                  </p>
                                  <p className="text-sm font-semibold text-primary-500">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dirección de envío */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Dirección de envío
                          </h4>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {order.shippingAddress.fullName}
                            </p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.province}{" "}
                              {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-1">Tel: {order.shippingAddress.phone}</p>
                          </div>
                        </div>

                        {/* Resumen de precios */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Subtotal
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {formatPrice(order.itemsPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Envío
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {order.shippingPrice === 0
                                  ? "GRATIS"
                                  : formatPrice(order.shippingPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                IVA (21%)
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {formatPrice(order.taxPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                Total
                              </span>
                              <span className="font-bold text-primary-500 text-lg">
                                {formatPrice(order.totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
