import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Términos y Condiciones
          </h1>

          <div className="glass rounded-2xl p-8 space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Aceptación de los Términos
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Al acceder y utilizar Creative Hands, aceptas cumplir con estos términos
                  y condiciones. Si no estás de acuerdo con alguna parte de estos términos,
                  no debes utilizar nuestro sitio web.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Uso del Sitio
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Te comprometes a utilizar el sitio únicamente para fines legales y de
                  manera que no infrinja los derechos de terceros ni restrinja o inhiba
                  el uso y disfrute del sitio por parte de otros usuarios.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Está prohibido:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                  <li>Utilizar el sitio de manera fraudulenta o ilegal</li>
                  <li>Acceder sin autorización a áreas restringidas</li>
                  <li>Transmitir material ofensivo o dañino</li>
                  <li>Interferir con el funcionamiento del sitio</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Productos y Precios
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Todos los precios mostrados incluyen IVA (21%) y están expresados en euros (€).
                  Nos reservamos el derecho de modificar los precios sin previo aviso, aunque
                  respetaremos el precio vigente en el momento de realizar tu pedido.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Las fotografías y descripciones de los productos son lo más precisas posible,
                  pero pueden existir pequeñas variaciones debido a la naturaleza artesanal de
                  nuestros productos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Pedidos y Pagos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Al realizar un pedido, estás haciendo una oferta de compra. Nos reservamos
                  el derecho de aceptar o rechazar cualquier pedido por razones justificadas
                  (falta de stock, errores de precio, etc.).
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Los métodos de pago aceptados se indican en el proceso de compra. Todos
                  los pagos se procesan de forma segura.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Envíos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Realizamos envíos a toda España peninsular. Los gastos de envío son:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>GRATIS para pedidos superiores a 50€</li>
                  <li>5,95€ para pedidos inferiores a 50€</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-3">
                  El plazo de entrega estimado es de 3-5 días laborables desde la confirmación
                  del pago.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Devoluciones y Garantía
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Dispones de 14 días desde la recepción del pedido para ejercer tu derecho
                  de desistimiento. Los productos deben devolverse en perfecto estado, sin
                  usar y en su embalaje original.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Los gastos de devolución correrán a cargo del cliente, salvo que el producto
                  sea defectuoso o haya sido enviado por error.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Propiedad Intelectual
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Todos los contenidos del sitio (textos, imágenes, logotipos, diseños, etc.)
                  son propiedad de Creative Hands o de sus proveedores de contenido y están
                  protegidos por las leyes de propiedad intelectual.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Limitación de Responsabilidad
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  No nos hacemos responsables de daños indirectos, incidentales o consecuentes
                  que puedan derivarse del uso del sitio o de la compra de productos, excepto
                  en los casos previstos por la ley.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Modificaciones
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Nos reservamos el derecho de modificar estos términos y condiciones en
                  cualquier momento. Los cambios entrarán en vigor inmediatamente después
                  de su publicación en el sitio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Contacto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Para cualquier pregunta sobre estos términos y condiciones, puedes contactarnos:
                </p>
                <ul className="list-none pl-0 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Email: info@creativehands.com</li>
                  <li>Teléfono: +34 123 456 789</li>
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

export default Terms;
