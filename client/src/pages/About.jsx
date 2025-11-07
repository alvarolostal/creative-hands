import { motion } from "framer-motion";
import { Heart, Target, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Sobre Nosotros
          </h1>

          <div className="glass rounded-2xl p-8 mb-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Bienvenido a <span className="font-bold text-primary-500">Creative Hands</span>,
                tu tienda de confianza para productos artesanales únicos y hechos a mano.
              </p>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Nos especializamos en ofrecer productos de alta calidad, creados con pasión
                y dedicación por artesanos locales. Cada pieza cuenta una historia y refleja
                el talento y la creatividad de quienes las elaboran.
              </p>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                En Creative Hands creemos en el valor del trabajo manual, la sostenibilidad
                y el apoyo a los pequeños productores. Por eso, seleccionamos cuidadosamente
                cada producto que ofrecemos, asegurándonos de que cumpla con nuestros estándares
                de calidad y originalidad.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Heart className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pasión
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Cada producto está hecho con amor y dedicación, reflejando la pasión
                de nuestros artesanos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Award className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Calidad
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Seleccionamos solo los mejores materiales y técnicas para garantizar
                productos duraderos y excepcionales.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Comunidad
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Apoyamos a artesanos locales y fomentamos el comercio justo y sostenible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Target className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Originalidad
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Cada pieza es única y especial, diseñada para destacar y expresar
                tu personalidad.
              </p>
            </motion.div>
          </div>

          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Conectar a artesanos talentosos con personas que valoran el arte, la creatividad
              y la autenticidad. Queremos ser el puente que une el trabajo artesanal con quienes
              buscan productos únicos que cuenten historias y transmitan emociones.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
