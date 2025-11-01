import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Reviews from "./Reviews";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
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
        setIndex(
          (i) =>
            (i - 1 + (product.images?.length || 1)) %
            (product.images?.length || 1)
        );
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

  const { user, isAuthenticated } = useAuth();

  // detailedProduct: fetched product with reviews
  const [detailedProduct, setDetailedProduct] = useState(product);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];
  const [selectedTab, setSelectedTab] = useState("details");

  // Fetch detailed product (with reviews) when modal opens or product changes
  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (mounted && data?.product) setDetailedProduct(data.product);
      } catch (err) {
        console.warn("No se pudo cargar detalles del producto:", err.message);
      } finally {
        if (mounted) setLoadingDetails(false);
      }
    };

    fetchDetails();

    return () => {
      mounted = false;
    };
  }, [product._id]);

  // review handling moved to ReviewSection

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

  // helper: render stars for display (rating may be decimal)
  const renderStars = (rating, size = "text-sm") => {
    const r = parseFloat(rating) || 0;
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= full)
        stars.push(
          <span key={i} className={`${size} text-yellow-400`}>
            ★
          </span>
        );
      else if (i === full + 1 && half)
        stars.push(
          <span key={i} className={`${size} text-yellow-400`}>
            ☆
          </span>
        );
      else
        stars.push(
          <span key={i} className={`${size} text-gray-300 dark:text-gray-600`}>
            ★
          </span>
        );
    }
    return (
      <span className="inline-flex gap-1" aria-hidden>
        {stars}
      </span>
    );
  };

  return (
    <motion.div
      key={product._id}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-0"
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
        className="relative w-full h-full sm:h-auto sm:w-[95%] lg:w-[90%] sm:max-w-3xl lg:max-w-[1100px] rounded-none sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
        style={{ maxHeight: "100vh" }}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
        tabIndex={-1}
      >
        {/* Note: moved close button into the right column header to avoid overlapping the title */}

        <div className="flex flex-col md:flex-row h-full items-stretch min-h-0 overflow-y-auto md:overflow-y-hidden">
          {/* Left: Gallery */}
          <div className="md:w-1/2 lg:w-[60%] bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 md:p-6 flex flex-col items-start justify-start min-h-0 h-auto md:h-full lg:rounded-l-2xl overflow-hidden">
            <div
              className="relative w-full flex items-center justify-center lg:flex-none lg:min-h-0"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Contenedor con altura razonable y estable para evitar estirados y saltos */}
              <div className="w-full rounded-none sm:rounded-xl overflow-hidden flex items-center justify-center bg-white h-64 sm:h-72 md:h-96 lg:h-full relative product-modal__image-wrapper">
                {/* Prev image (exiting) */}
                {prevIndex !== null && (
                  <motion.img
                    src={images[prevIndex]}
                    key={`prev-${prevIndex}`}
                    initial={{ x: 0, opacity: 1 }}
                    animate={{
                      x: direction > 0 ? "-100%" : "100%",
                      opacity: 0,
                    }}
                    transition={{ type: "tween", duration: 0.28 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    onAnimationComplete={() => setPrevIndex(null)}
                  />
                )}

                {/* Current image (entering) */}
                <motion.img
                  src={images[index]}
                  key={`cur-${index}`}
                  initial={
                    isFirstMount.current && prevIndex === null
                      ? { x: 0, opacity: 1 }
                      : { x: direction > 0 ? "100%" : "-100%", opacity: 0 }
                  }
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "tween", duration: 0.28 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow z-40 focus:outline-none transform-gpu will-change-transform active:scale-95 transition-transform duration-100 min-w-[40px] min-h-[40px]"
                    aria-label="Anterior imagen"
                  >
                    <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow z-40 focus:outline-none transform-gpu will-change-transform active:scale-95 transition-transform duration-100 min-w-[40px] min-h-[40px]"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 text-gray-900 dark:text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-2 sm:mt-3 w-full flex gap-2 sm:gap-3 overflow-x-auto items-center justify-start px-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  aria-label={`Seleccionar imagen ${i + 1}`}
                  onClick={() => {
                    if (i === index) return;
                    setPrevIndex(index);
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 ${
                    i === index ? "border-primary-500" : "border-transparent"
                  } min-w-[64px] min-h-[64px]`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                    width="80"
                    height="80"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 lg:w-[40%] p-4 sm:p-5 md:p-6 overflow-y-auto min-h-0">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 pr-2">
                {product.name}
              </h2>
              <button
                onClick={onClose}
                className="ml-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow flex-shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-800 dark:text-white" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <p className="text-primary-500 text-xl sm:text-2xl font-extrabold">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                }).format(product.price)}
              </p>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detailedProduct?.avgRating ?? 0}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({detailedProduct?.reviewsCount ?? 0})
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs to separate details and reviews to avoid long scroll */}
            <div className="mt-3 sm:mt-4 border-b border-gray-100 dark:border-gray-800 mb-3 sm:mb-4">
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setSelectedTab("details")}
                  className={`py-2 sm:py-2.5 px-3 sm:px-4 -mb-px text-sm sm:text-base min-h-[44px] flex items-center ${
                    selectedTab === "details"
                      ? "border-b-2 border-primary-500 text-primary-600 font-medium"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Detalles
                </button>
                <button
                  onClick={() => setSelectedTab("reviews")}
                  className={`py-2 sm:py-2.5 px-3 sm:px-4 -mb-px text-sm sm:text-base min-h-[44px] flex items-center ${
                    selectedTab === "reviews"
                      ? "border-b-2 border-primary-500 text-primary-600 font-medium"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Valoraciones ({detailedProduct?.reviewsCount ?? 0})
                </button>
              </div>
            </div>

            {selectedTab === "details" && (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Categoría: </strong>
                  <span>{product.categoryId?.name || "—"}</span>
                </div>

                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <strong>Estado: </strong>
                  {product.stock > 0 ? (
                    <span className="text-green-600 dark:text-green-400">
                      {product.stock} en stock
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      Agotado
                    </span>
                  )}
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-6">
                  <p>{product.description}</p>
                </div>

                {/* Extra details area: propiedades, tags, seller info, etc. (si existen) */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Características
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                      {product.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <button className="px-4 sm:px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl text-base min-h-[44px] flex items-center justify-center">
                    Añadir al carrito
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-3 border rounded-full text-gray-700 dark:text-gray-200 text-base min-h-[44px] flex items-center justify-center"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="mt-4 sm:mt-6 text-xs text-gray-400">
                  ID del producto: {product._id}
                </div>
              </>
            )}

            {selectedTab === "reviews" && (
              <div className="mt-4 sm:mt-6">
                <Reviews
                  productId={product._id}
                  initialProduct={detailedProduct}
                  onProductUpdate={(p) => setDetailedProduct(p)}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;
