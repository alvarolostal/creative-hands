import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Package,
  X,
  Save,
  Loader,
  Upload,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import AdminChat from "../components/AdminChat";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    materials: "",
  });
  const [saving, setSaving] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryData, setEditingCategoryData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingFromList, setEditingFromList] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/products");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/products");
      setProducts(data.products);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId
          ? product.categoryId._id || product.categoryId
          : "",
        stock: product.stock,
        materials: product.materials?.join(", ") || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        stock: "",
        materials: "",
      });
    }
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "categoryId") {
      // when selecting a category by id, keep the selected id only
      setFormData({
        ...formData,
        categoryId: value,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        materials: formData.materials
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
      };

      if (editingProduct) {
        const { data } = await axios.put(
          `/api/products/${editingProduct._id}`,
          productData
        );
        setProducts(
          products.map((p) => (p._id === editingProduct._id ? data.product : p))
        );
      } else {
        const { data } = await axios.post("/api/products", productData);
        setProducts([data.product, ...products]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  const handleOpenCategoryModal = () => {
    setNewCategory({ name: "", slug: "", description: "" });
    setShowCategoryModal(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newCategory };
      const { data } = await axios.post("/api/categories", payload);
      // refresh categories
      fetchCategories();
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert(error.response?.data?.message || "Error al crear categoría");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "¿Eliminar esta categoría? Los productos pueden quedarse con category legacy."
      )
    )
      return;
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert(error.response?.data?.message || "Error al eliminar categoría");
    }
  };

  const startEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setEditingCategoryData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
    });
    // If the list modal is open, close it first so the edit modal doesn't appear behind due
    // to stacking contexts/animations. Re-open the list when editing finishes if needed.
    if (showCategoryModal) {
      setEditingFromList(true);
      setShowCategoryModal(false);
      // wait a short moment to let the exit animation start/stacking contexts settle
      setTimeout(() => setShowEditCategoryModal(true), 120);
    } else {
      setShowEditCategoryModal(true);
    }
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryData({ name: "", slug: "", description: "" });
    setShowEditCategoryModal(false);
    if (editingFromList) {
      // restore the categories modal that the user came from
      setShowCategoryModal(true);
      setEditingFromList(false);
    }
  };

  const saveEditCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/categories/${editingCategoryId}`,
        editingCategoryData
      );
      fetchCategories();
      cancelEditCategory();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      alert(error.response?.data?.message || "Error al actualizar categoría");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategoriesList(data.categories || []);
    } catch (error) {
      console.error(
        "Error cargando categorías en admin, usando lista por defecto:",
        error
      );
      setCategoriesList([
        { _id: "", name: "Joyería artesanal", slug: "joyeria-artesanal" },
        { _id: "", name: "Velas y aromáticos", slug: "velas-y-aromaticos" },
        { _id: "", name: "Textiles y ropa", slug: "textiles-y-ropa" },
        { _id: "", name: "Cerámica y arcilla", slug: "ceramica-y-arcilla" },
        { _id: "", name: "Arte hecho a mano", slug: "arte-hecho-a-mano" },
      ]);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-light-500 via-primary-50 to-light-500 dark:from-dark-500 dark:via-dark-400 dark:to-dark-600">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de <span className="gradient-text">Administración</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona productos y conversaciones con clientes
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-4 mb-8"
        >
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 ${
              activeTab === "products"
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                : "glass text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Productos</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                : "glass text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Conversaciones</span>
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Add Product Button */}
              <div className="mb-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOpenModal()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
                  style={{ willChange: "transform" }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Producto</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenCategoryModal}
                  className="ml-4 flex items-center space-x-2 px-4 py-3 glass rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Gestionar categorías</span>
                </motion.button>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader className="w-12 h-12 text-primary-500 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isAdmin={true}
                      onEdit={handleOpenModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AdminChat />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Category Modal */}
        <AnimatePresence>
          {showEditCategoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => cancelEditCategory()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-3xl p-6 max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editar categoría
                  </h3>
                  <button
                    onClick={() => cancelEditCategory()}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <form onSubmit={saveEditCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre
                    </label>
                    <input
                      value={editingCategoryData.name}
                      onChange={(e) =>
                        setEditingCategoryData({
                          ...editingCategoryData,
                          name: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug
                    </label>
                    <input
                      value={editingCategoryData.slug}
                      onChange={(e) =>
                        setEditingCategoryData({
                          ...editingCategoryData,
                          slug: e.target.value,
                        })
                      }
                      placeholder="auto"
                      className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descripción
                    </label>
                    <textarea
                      value={editingCategoryData.description}
                      onChange={(e) =>
                        setEditingCategoryData({
                          ...editingCategoryData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => cancelEditCategory()}
                      className="px-4 py-2 rounded-xl glass text-gray-700 dark:text-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-primary-500 text-white"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del producto
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Precio (€)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    >
                      <option value="">-- Seleccionar categoría --</option>
                      {categoriesList.map((cat) => (
                        <option
                          key={cat._id || cat.slug || cat.name}
                          value={cat._id || cat.slug || cat.name}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Materiales (separados por coma)
                    </label>
                    <input
                      type="text"
                      name="materials"
                      value={formData.materials}
                      onChange={handleChange}
                      placeholder="Ej: Cerámica, Arcilla, Esmalte"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center">
                    {/* Campo 'Producto destacado' eliminado — el control de admin queda centralizado en la pestaña Admin principal */}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      style={{ willChange: "transform" }}
                    >
                      {saving ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>{editingProduct ? "Actualizar" : "Crear"}</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 glass rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow duration-200"
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Modal */}
        <AnimatePresence>
          {showCategoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowCategoryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-3xl p-6 max-w-lg w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Crear categoría
                  </h3>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      Categorías existentes
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categoriesList.map((cat) => (
                        <div
                          key={cat._id || cat.slug || cat.name}
                          className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 flex items-center justify-between gap-4 overflow-hidden"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {cat.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {cat.slug}
                            </div>
                            {cat.description ? (
                              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                                {cat.description}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="px-3 py-1 glass rounded-md text-gray-700 dark:text-gray-300"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-md"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre
                      </label>
                      <input
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug (opcional)
                      </label>
                      <input
                        value={newCategory.slug}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            slug: e.target.value,
                          })
                        }
                        placeholder="auto"
                        className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción (opcional)
                      </label>
                      <textarea
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(false)}
                        className="px-4 py-2 rounded-xl glass text-gray-700 dark:text-gray-300"
                      >
                        Cerrar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-primary-500 text-white"
                      >
                        Crear
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
