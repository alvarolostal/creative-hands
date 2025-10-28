import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader, Package } from "lucide-react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Products = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [nameToSlug, setNameToSlug] = useState({});
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // categoriesList will be fetched from the API; we keep a 'Todas' pseudo-category at the start

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategorySlug]);

  // Initialize selectedCategorySlug: prefer path param /products/category/:slug, fallback to query param
  useEffect(() => {
    const { slug } = params || {};
    if (slug) {
      setSelectedCategorySlug(slug);
      return;
    }

    const query = new URLSearchParams(location.search);
    const cat = query.get("category");
    if (cat) {
      if (cat === "Todas") {
        setSelectedCategorySlug("");
      } else if (nameToSlug[cat]) {
        // map known category name -> slug provided by server
        setSelectedCategorySlug(nameToSlug[cat]);
      } else {
        // if it's already a slug-like value, use it as-is
        setSelectedCategorySlug(cat);
      }
    }
    // only run on mount / when search changes
  }, [location.search, params?.slug, nameToSlug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data;

      if (selectedCategorySlug) {
        const res = await axios.get(
          `/api/products/category/${selectedCategorySlug}`
        );
        data = res.data;
      } else {
        const res = await axios.get("/api/products");
        data = res.data;
      }

      setProducts(data.products);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      // build name->slug map for robust mapping from legacy name queries
      const map = {};
      data.categories.forEach((c) => {
        map[c.name] = c.slug;
      });
      setNameToSlug(map);
      // prepend 'Todas' as a pseudo-category
      setCategoriesList([
        { name: "Todas", slug: "" },
        ...data.categories.map((c) => ({ name: c.name, slug: c.slug })),
      ]);
    } catch (error) {
      console.error(
        "Error cargando categorías, usando lista por defecto:",
        error
      );
      setNameToSlug({
        "Joyería artesanal": "joyeria-artesanal",
        "Velas y aromáticos": "velas-y-aromaticos",
        "Textiles y ropa": "textiles-y-ropa",
        "Cerámica y arcilla": "ceramica-y-arcilla",
        "Arte hecho a mano": "arte-hecho-a-mano",
      });
      setCategoriesList([
        { name: "Todas", slug: "" },
        { name: "Joyería artesanal", slug: "joyeria-artesanal" },
        { name: "Velas y aromáticos", slug: "velas-y-aromaticos" },
        { name: "Textiles y ropa", slug: "textiles-y-ropa" },
        { name: "Cerámica y arcilla", slug: "ceramica-y-arcilla" },
        { name: "Arte hecho a mano", slug: "arte-hecho-a-mano" },
      ]);
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

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => setSelectedProduct(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-light-500 via-primary-50 to-light-500 dark:from-dark-500 dark:via-dark-400 dark:to-dark-600">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros <span className="gradient-text">Productos</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Descubre piezas únicas hechas con amor y dedicación
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-full text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesList.map((category) => (
              <motion.button
                key={category.slug || category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const val = category.slug || "";
                  setSelectedCategorySlug(val);
                  // update URL using slug path (preferred)
                  if (val) {
                    navigate(`/products/category/${val}`);
                  } else {
                    navigate("/products");
                  }
                }}
                className={`px-4 py-2 rounded-full font-medium transition-shadow duration-200 ${
                  selectedCategorySlug === category.slug ||
                  (selectedCategorySlug === "" && category.name === "Todas")
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "glass text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-12 h-12 text-primary-500 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : "Aún no hay productos en esta categoría"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                  onEdit={(p) => navigate(`/products/${p._id}/edit`)}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            key={selectedProduct._id}
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
