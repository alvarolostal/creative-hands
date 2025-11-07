import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post("/cart/add", { productId, quantity });
      setCart(response.data);
      setIsCartOpen(true);
      return { success: true };
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al añadir al carrito",
      };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(`/cart/update/${productId}`, {
        quantity,
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al actualizar el carrito",
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al eliminar del carrito",
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete("/cart/clear");
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al vaciar el carrito",
      };
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cart,
    loading,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    toggleCart,
    closeCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
