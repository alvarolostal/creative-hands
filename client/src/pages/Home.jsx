import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Palette } from 'lucide-react';
// kept minimal imports for the Home page (no server calls here)

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-light-500 via-primary-50 to-light-500 dark:from-dark-500 dark:via-dark-400 dark:to-dark-600">
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            {/* Logo/Icon */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
                  <Palette className="w-12 h-12 text-white" />
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-primary-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-5xl md:text-7xl font-bold copernicus uppercase text-primary-500">
              CREATIVE
              <span className="block">HANDS</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              Descubre piezas únicas creadas con amor y dedicación.
              <br />
              Arte hecho a mano que cuenta historias.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.035, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  className="px-8 py-4 rounded-full font-medium text-lg shadow-md transition-transform bg-primary-500 dark:bg-primary-600 text-white"
                >
                  <span>Explorar Productos</span>
                </motion.button>
              </Link>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  className="px-8 py-4 glass rounded-full font-medium text-lg text-gray-900 dark:text-white shadow-md transition-transform"
                >
                  Comenzar ahora
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

            {/* Scroll indicator removed per design request */}
        </div>
      </section>

      {/* Featured Products Section (rediseñado): tarjetas que aparecen lateralmente al hacer scroll */}
      <section className="py-24 bg-white dark:bg-dark-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Destacados</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">Lo mejor de nuestro taller — calidad artesanal y diseño único.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                slug: 'Joyería artesanal',
                title: 'Joyería artesanal',
                text: 'Collares, anillos y piezas únicas trabajadas a mano.',
                img: 'https://images.unsplash.com/photo-1697925493572-a8da651b0c12?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670'
              },
              {
                slug: 'Cerámica y arcilla',
                title: 'Cerámica y arcilla',
                text: 'Vajillas y piezas de cerámica con acabados artesanales.',
                img: 'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774'
              },
              {
                slug: 'Arte hecho a mano',
                title: 'Arte hecho a mano',
                text: 'Láminas, ilustraciones y obra original de artistas locales.',
                img: 'https://plus.unsplash.com/premium_photo-1677609898243-63280b6c89a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=766'
              }
            ].map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{c.text}</p>
                    <div className="mt-4">
                      <Link to={`/products?category=${encodeURIComponent(c.slug)}`} className="inline-flex items-center px-3 py-2 rounded-full bg-primary-500 text-white text-sm font-medium hover:opacity-95 transition-opacity">
                        Ver {c.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (fino) */}
      <footer className="mt-12 mb-12" role="contentinfo">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-3 rounded-xl bg-white/8 dark:bg-gray-800/60 backdrop-blur-md text-sm md:text-base text-gray-700 dark:text-gray-100 shadow-md border border-white/6 dark:border-white/10">
            <span className="font-medium">© 2025 Álvaro Lostal</span>
            <span className="opacity-50">·</span>
            <span aria-hidden="true" className="text-red-400">♥</span>
            <span className="opacity-50">·</span>
            <span className="font-medium">Creative Hands</span>
          </div>
        </div>
      </footer>
      
      {/* Helper: featured products component definition (local to page) */}
    </div>
  );
};

const FeaturedProducts = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/products');
        if (!mounted) return;
        setProducts((data.products || []).slice(0, 6));
      } catch (e) {
        console.error('Error fetching featured products', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {products.map((product, i) => (
        <motion.div
          key={product._id || i}
          initial={{ opacity: 0, x: i % 2 === 0 ? -120 : 120 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <ProductCard product={product} isAdmin={isAdmin} />
        </motion.div>
      ))}
    </div>
  );
};

export default Home;