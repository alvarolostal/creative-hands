import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader, Package } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = [
    'Todas',
    'Joyería artesanal',
    'Velas y aromáticos',
    'Textiles y ropa',
    'Cerámica y arcilla',
    'Arte hecho a mano'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'Todas') {
        params.category = selectedCategory;
      }
      
      const { data } = await axios.get('/api/products', { params });
      setProducts(data.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const filteredProducts = products.filter(product =>
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
              className="w-full pl-12 pr-4 py-3 glass dark:glass-dark rounded-full text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category === 'Todas' ? '' : category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  (selectedCategory === category) || (selectedCategory === '' && category === 'Todas')
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'glass dark:glass-dark text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                {category}
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
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Aún no hay productos en esta categoría'}
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
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;