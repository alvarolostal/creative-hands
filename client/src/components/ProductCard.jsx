import { motion } from "framer-motion";
import { Edit, Trash2, Package, Star } from "lucide-react";

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  isAdmin,
  onViewDetails,
  hideDetails,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      // dejar la transición del transform a framer-motion y solo animar la sombra por CSS
      className="glass rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200 group"
      style={{ willChange: "transform" }}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-primary-300 dark:text-gray-600" />
          </div>
        )}

        {/* Badge de categoría */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className="px-2 sm:px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium text-gray-900 dark:text-white rounded-full">
            {product.categoryId?.name}
          </span>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(product)}
              aria-label="Editar producto"
              className="p-2 sm:p-2.5 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-colors text-gray-900 dark:text-white min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(product._id)}
              aria-label="Eliminar producto"
              className="p-2 sm:p-2.5 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors text-gray-900 dark:text-white min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1 min-w-0 text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mr-3">
            {product.name}
          </h3>

          {/* Media compacta: icono hueco (Star) + número (solo si hay valoraciones) */}
          {(product.reviewsCount ??
            (product.reviews ? product.reviews.length : 0)) > 0 ? (
            <div className="flex items-center flex-shrink-0 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-yellow-400 mr-1" />
              <span className="font-medium">
                {product.avgRating ??
                  (product.reviews && product.reviews.length
                    ? Math.round(
                        (product.reviews.reduce(
                          (s, r) => s + (r.rating || 0),
                          0
                        ) /
                          product.reviews.length) *
                          10
                      ) / 10
                    : "")}
              </span>
            </div>
          ) : null}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-primary-500">
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

          {!hideDetails && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              // dejar la animación de escala a framer-motion; CSS solo anima colores
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-h-[40px] sm:min-h-[44px]"
              disabled={product.stock === 0}
              onClick={() => onViewDetails && onViewDetails(product)}
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
