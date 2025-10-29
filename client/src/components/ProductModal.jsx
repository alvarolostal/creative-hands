import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

  const { user, isAuthenticated } = useAuth();

  // detailedProduct: fetched product with reviews
  const [detailedProduct, setDetailedProduct] = useState(product);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // review form
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError(null);
    if (!isAuthenticated) {
      setReviewError("Debes estar logueado para dejar una valoración");
      return;
    }
    if (user?.role === "admin") {
      setReviewError("Los administradores no pueden dejar valoraciones");
      return;
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      setReviewError("Rellena el título y el comentario");
      return;
    }

    try {
      setSubmittingReview(true);
      let res;
      if (editingReviewId) {
        // editar
        res = await axios.put(`/api/products/${product._id}/reviews/${editingReviewId}`, {
          title: reviewTitle,
          comment: reviewComment,
          rating: reviewRating,
        });
      } else {
        // crear
        res = await axios.post(`/api/products/${product._id}/reviews`, {
          title: reviewTitle,
          comment: reviewComment,
          rating: reviewRating,
        });
      }

      if (res.data?.product) {
        setDetailedProduct(res.data.product);
        // limpiar formulario
        setReviewTitle("");
        setReviewComment("");
        setReviewRating(5);
        setEditingReviewId(null);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Error al enviar la valoración");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id || review.id || null);
    setReviewTitle(review.title || "");
    setReviewComment(review.comment || "");
    setReviewRating(review.rating || 5);
    // scroll to form or focus? keep simple
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("¿Eliminar tu valoración?")) return;
    try {
      const id = review._id || review.id;
      const res = await axios.delete(`/api/products/${product._id}/reviews/${id}`);
      if (res.data?.product) setDetailedProduct(res.data.product);
    } catch (err) {
      console.error("Error al borrar review:", err);
      alert(err.response?.data?.message || "Error al eliminar valoración");
    }
  };

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
        className="relative w-[95%] max-w-6xl max-h-[95vh] overflow-auto rounded-3xl bg-white dark:bg-gray-900 shadow-2xl"
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
            <div className="p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
              <div className="flex items-center gap-4 mb-2">
                <p className="text-primary-500 text-2xl font-extrabold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}</p>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div>Valoración: <span className="font-semibold text-gray-900 dark:text-white">{detailedProduct?.avgRating ?? detailedProduct?.avgRating === 0 ? detailedProduct.avgRating : '-'}</span> <span className="text-xs text-gray-500">({detailedProduct?.reviewsCount ?? 0})</span></div>
                </div>
              </div>

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

              {/* Reviews */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Valoraciones</h3>

                {loadingDetails ? (
                  <div className="text-sm text-gray-500">Cargando opiniones...</div>
                ) : (
                  <div className="space-y-4">
                    {(detailedProduct?.reviews || []).length === 0 ? (
                      <div className="text-sm text-gray-500">Aún no hay valoraciones. Sé el primero en opinar.</div>
                    ) : (
                      (detailedProduct.reviews || []).slice().reverse().map((r) => {
                        const isMine = (user && (user._id === r.user?._id || user.id === r.user?._id || user._id === r.user?._id)) || (r.user?._id === user?._id);
                        return (
                        <div key={r._id || r.createdAt} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm text-gray-900 dark:text-white">{r.user?.name || 'Usuario'}</div>
                            <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="mt-1 text-sm text-yellow-500">{'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}</div>
                          <div className="mt-2 font-medium">{r.title}</div>
                          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{r.comment}</div>
                          {isMine && (
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => handleEditClick(r)} className="text-sm text-primary-500">Editar</button>
                              <button onClick={() => handleDeleteReview(r)} className="text-sm text-red-500">Eliminar</button>
                            </div>
                          )}
                        </div>
                        )
                      })
                    )}
                  </div>
                )}

                {/* Formulario para añadir review */}
                <div className="mt-5">
                  <h4 className="text-sm font-medium mb-2">Deja tu valoración</h4>
                  {!isAuthenticated ? (
                    <div className="text-sm text-gray-500">Debes estar <a href="/login" className="text-primary-500">logueado</a> para dejar una opinión.</div>
                  ) : user?.role === 'admin' ? (
                    <div className="text-sm text-gray-500">Los administradores no pueden dejar opiniones.</div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      {reviewError && <div className="text-sm text-red-500">{reviewError}</div>}
                      <input type="text" placeholder="Título" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-900 text-sm" />
                      <textarea placeholder="Comentario" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-900 text-sm" rows={3} />
                      <div className="flex items-center gap-3">
                        <label className="text-sm">Puntuación:</label>
                        <select value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value,10))} className="px-3 py-2 rounded border bg-white dark:bg-gray-900 text-sm">
                          <option value={5}>5 - Excelente</option>
                          <option value={4}>4 - Muy bueno</option>
                          <option value={3}>3 - Bien</option>
                          <option value={2}>2 - Regular</option>
                          <option value={1}>1 - Malo</option>
                        </select>
                        <button type="submit" disabled={submittingReview} className="ml-auto px-4 py-2 bg-primary-500 text-white rounded">
                          {submittingReview ? 'Enviando...' : 'Enviar opinión'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default ProductModal;
