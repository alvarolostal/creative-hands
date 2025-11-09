import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-50 via-white to-transparent dark:from-gray-900 dark:via-gray-900 mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*
          Responsive layout using CSS Grid:
          - mobile (default): grid-cols-2 -> top row: Brand (left) + Information (right); second row: Phrase spanning 2 cols centered
          - md and up: grid-cols-3 -> Brand | Phrase (center) | Information
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-y-6">
          {/* Brand */}
          <div className="col-span-1 text-left md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Creative Hands</h4>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 max-w-sm">Tienda de artesanía y productos hechos a mano. Calidad y cariño en cada pieza.</p>
          </div>

          {/* Phrase: centered on mobile (spans 2 cols) and in the middle column on md+ */}
          <div className="col-span-2 md:col-span-1 flex justify-center md:justify-center">
            <div className="text-center text-sm text-gray-700 dark:text-gray-200">
              <div className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded-xl bg-white/8 dark:bg-gray-800/60 backdrop-blur-md shadow-sm border border-white/6 dark:border-white/10">
                <span className="font-medium">© {new Date().getFullYear()} Álvaro Lostal</span>
                <span className="opacity-50">·</span>
                <span aria-hidden="true" className="text-red-400">♥</span>
                <span className="opacity-50">·</span>
                <span className="font-medium">Creative Hands</span>
              </div>
            </div>
          </div>

          {/* Information: appears to the right on mobile first row and remains right on md+ */}
          <div className="col-span-1 flex md:justify-end justify-end md:col-span-1">
            <div>
              <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Información</h5>
              <ul className="space-y-1 text-sm text-right md:text-left">
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
