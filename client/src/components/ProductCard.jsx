import { motion } from 'framer-motion';
import { Edit, Trash2, Package } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, isAdmin }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      // dejar la transición del transform a framer-motion y solo animar la sombra por CSS
      className="glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200 group"
      style={{ willChange: 'transform' }}
    >
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-primary-300 dark:text-gray-600" />
          </div>
        )}
        
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium text-gray-900 dark:text-white rounded-full">
            {product.categoryId?.name}
          </span>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(product)}
              className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-colors text-gray-900 dark:text-white"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(product._id)}
              className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors text-gray-900 dark:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-500">
              {formatPrice(product.price)}
            </p>
            {product.stock > 0 ? (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {product.stock} en stock
              </p>
            ) : (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Agotado
              </p>
            )}
          </div>

          {!isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              // dejar la animación de escala a framer-motion; CSS solo anima colores
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
            >
              Ver detalles
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;