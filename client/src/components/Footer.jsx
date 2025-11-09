import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-50 via-white to-transparent dark:from-gray-900 dark:via-gray-900 mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0">
          {/* Brand: always first */}
          <div className="md:flex-1 order-1 md:order-1 text-left">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Creative Hands</h4>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-w-sm">Tienda de artesanía y productos hechos a mano. Calidad y cariño en cada pieza.</p>
          </div>

          {/* Phrase: should appear second on desktop, last on mobile */}
          <div className="md:flex-1 order-3 md:order-2 flex justify-center md:justify-center">
            <div className="text-center md:text-center text-sm text-gray-700 dark:text-gray-200">
              <div className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded-xl bg-white/8 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-white/6 dark:border-white/10">
                <span className="font-medium">© {new Date().getFullYear()} Álvaro Lostal</span>
                <span className="opacity-50">·</span>
                <span aria-hidden="true" className="text-red-400">♥</span>
                <span className="opacity-50">·</span>
                <span className="font-medium">Creative Hands</span>
              </div>
            </div>
          </div>

          {/* Information: should appear second on mobile, third on desktop (right) */}
          <div className="md:flex-1 order-2 md:order-3 flex md:justify-end justify-center">
            <div>
              <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Información</h5>
              <ul className="space-y-1 text-sm text-left md:text-left">
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Quiénes somos</Link>
                </li>
                <li>
                  <Link to="/envios" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Envíos y Devoluciones</Link>
                </li>
                <li>
                  <Link to="/privacidad" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Privacidad & Términos</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
