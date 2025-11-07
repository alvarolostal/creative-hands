import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-400 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Creative Hands */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Creative Hands
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Productos artesanales únicos hechos con pasión y dedicación.
              Cada pieza cuenta una historia.
            </p>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" />
              <span>en España</span>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Política de Envíos
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Política de Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-4 h-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@creativehands.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  info@creativehands.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <a
                  href="tel:+34123456789"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  +34 123 456 789
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Madrid, España
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Creative Hands. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
