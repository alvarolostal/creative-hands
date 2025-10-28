import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.98 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { y: 20, opacity: 0, scale: 0.995, transition: { duration: 0.18 } },
};

const ProductModal = ({ product, onClose }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [prevIndex, setPrevIndex] = useState(null);
  const containerRef = useRef(null);
  const isFirstMount = useRef(true);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setPrevIndex(index);
        setDirection(1);
        setIndex((i) => (i + 1) % (product.images?.length || 1));
      }
      if (e.key === "ArrowLeft") {
        setPrevIndex(index);
        setDirection(-1);
        setIndex((i) => (i - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
      }
    };
    document.addEventListener("keydown", handleKey);
    // focus the modal for accessibility
    const prevActive = document.activeElement;
    setTimeout(() => containerRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prevActive?.focus?.();
    };
  }, [onClose, product.images, index]);

  useEffect(() => {
    // mark that the modal has mounted at least once; used to prevent image entry animation on first open
    isFirstMount.current = false;
  }, []);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];

  // touch/swipe handlers for mobile
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const prevImage = () => {
    setPrevIndex(index);
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setPrevIndex(index);
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 50; // swipe threshold px
    if (dx > threshold) {
      // swipe left -> next
      nextImage();
    } else if (dx < -threshold) {
      // swipe right -> prev
      prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <motion.div
      key={product._id}
      className="fixed inset-0 z-50 flex items-center justify-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      style={{ backdropFilter: "blur(6px)" }}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <motion.div
        className="relative w-[95%] max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
        tabIndex={-1}
      >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left: Gallery */}
            <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 flex flex-col items-center justify-center">
              <div
                className="relative w-full flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Contenedor con altura razonable y estable para evitar estirados y saltos */}
                <div className="w-full rounded-xl overflow-hidden flex items-center justify-center bg-white h-72 md:h-96 relative">
                  {/* Prev image (exiting) */}
                  {prevIndex !== null && (
                    <motion.img
                      src={images[prevIndex]}
                      key={`prev-${prevIndex}`}
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                      transition={{ type: "tween", duration: 0.28 }}
                      className="absolute inset-0 w-full h-full object-cover"
                      onAnimationComplete={() => setPrevIndex(null)}
                    />
                  )}

                  {/* Current image (entering) */}
                  <motion.img
                    src={images[index]}
                    key={`cur-${index}`}
                    initial={isFirstMount.current && prevIndex === null ? { x: 0, opacity: 1 } : { x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "tween", duration: 0.28 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow z-40 focus:outline-none transform-gpu will-change-transform active:scale-95 transition-transform duration-100"
                      aria-label="Anterior imagen"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow z-40 focus:outline-none transform-gpu will-change-transform active:scale-95 transition-transform duration-100"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="mt-4 w-full flex gap-3 overflow-x-auto items-center justify-start">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i === index) return;
                      setPrevIndex(index);
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 ${i === index ? "border-primary-500" : "border-transparent"}`}
                  >
                    <img src={img} alt={`${product.name} thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-6 overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
              <p className="text-primary-500 text-2xl font-extrabold mb-4">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}</p>

              <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                <strong>Categoría: </strong>
                <span>{product.categoryId?.name || '—'}</span>
              </div>

              <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                <strong>Estado: </strong>
                {product.stock > 0 ? (
                  <span className="text-green-600 dark:text-green-400">{product.stock} en stock</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Agotado</span>
                )}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-6">
                <p>{product.description}</p>
              </div>

              {/* Extra details area: propiedades, tags, seller info, etc. (si existen) */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Características</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                    {product.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex items-center gap-4">
                <button className="px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl">Añadir al carrito</button>
                <button onClick={onClose} className="px-4 py-3 border rounded-full text-gray-700 dark:text-gray-200">Cerrar</button>
              </div>

              <div className="mt-6 text-xs text-gray-400">ID del producto: {product._id}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default ProductModal;
