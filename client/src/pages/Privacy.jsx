import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-500 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Shield className="w-12 h-12 text-primary-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Política de Privacidad
          </h1>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            En Creative Hands, tu privacidad es nuestra prioridad. Esta política explica
            cómo recopilamos, usamos y protegemos tu información personal.
          </p>

          <div className="glass rounded-2xl p-8 space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Información que Recopilamos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Recopilamos información que nos proporcionas directamente:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Datos de registro: nombre, email y contraseña</li>
                  <li>Datos de envío: dirección completa y teléfono de contacto</li>
                  <li>Datos de pago: procesados de forma segura por nuestros proveedores</li>
                  <li>Comunicaciones: mensajes que nos envíes a través del chat o formularios</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Cómo Utilizamos tu Información
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Procesar y gestionar tus pedidos</li>
                  <li>Enviarte actualizaciones sobre el estado de tu pedido</li>
                  <li>Responder a tus consultas y proporcionar soporte</li>
                  <li>Mejorar nuestros productos y servicios</li>
                  <li>Cumplir con obligaciones legales y fiscales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Compartir Información
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  No vendemos, alquilamos ni compartimos tu información personal con terceros,
                  excepto en los siguientes casos:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Empresas de mensajería para realizar los envíos</li>
                  <li>Procesadores de pago para gestionar transacciones</li>
                  <li>Cuando sea requerido por ley o autoridades competentes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Seguridad de los Datos
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger
                  tu información personal contra acceso no autorizado, pérdida, destrucción
                  o alteración. Utilizamos:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-3">
                  <li>Encriptación SSL/TLS para todas las comunicaciones</li>
                  <li>Contraseñas hasheadas y seguras</li>
                  <li>Servidores seguros y actualizados</li>
                  <li>Acceso limitado a datos personales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Cookies y Tecnologías Similares
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia
                  en el sitio. Las cookies nos ayudan a:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-3">
                  <li>Recordar tus preferencias (tema oscuro/claro)</li>
                  <li>Mantener tu sesión activa</li>
                  <li>Analizar el uso del sitio para mejorarlo</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  Puedes configurar tu navegador para rechazar cookies, aunque esto puede
                  afectar algunas funcionalidades del sitio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Tus Derechos (RGPD)
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  De acuerdo con el Reglamento General de Protección de Datos (RGPD),
                  tienes derecho a:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Acceder a tus datos personales</li>
                  <li>Rectificar datos incorrectos o incompletos</li>
                  <li>Eliminar tus datos (derecho al olvido)</li>
                  <li>Oponerte al tratamiento de tus datos</li>
                  <li>Portabilidad de tus datos</li>
                  <li>Limitar el tratamiento de tus datos</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  Para ejercer cualquiera de estos derechos, contacta con nosotros en
                  privacidad@creativehands.com
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Retención de Datos
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Conservamos tu información personal durante el tiempo necesario para
                  cumplir con los fines descritos en esta política, a menos que la ley
                  requiera un período de retención más largo. Los datos de facturación
                  se conservan durante 6 años por obligación fiscal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Menores de Edad
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Nuestros servicios están dirigidos a personas mayores de 18 años. No
                  recopilamos intencionadamente información personal de menores. Si eres
                  padre/madre y crees que tu hijo nos ha proporcionado información,
                  contáctanos inmediatamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Cambios en esta Política
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Podemos actualizar esta política de privacidad ocasionalmente. Te
                  notificaremos cualquier cambio significativo por email o mediante
                  un aviso destacado en nuestro sitio web.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Contacto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Si tienes preguntas sobre esta política de privacidad o sobre cómo
                  tratamos tus datos, puedes contactarnos:
                </p>
                <ul className="list-none pl-0 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Email: privacidad@creativehands.com</li>
                  <li>Teléfono: +34 123 456 789</li>
                  <li>Dirección: Madrid, España</li>
                </ul>
              </section>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Última actualización: {new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
