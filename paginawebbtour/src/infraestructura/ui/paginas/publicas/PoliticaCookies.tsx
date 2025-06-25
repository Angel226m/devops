// src/paginas/PoliticaCookies.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PoliticaCookies = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "Política de Cookies - Sistema de Reservas";
    
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Política de Cookies</h1>
            <p className="text-sm text-gray-500 mt-2">Última actualización: 25 de junio de 2025</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <p>
              Esta Política de Cookies explica cómo Angel Tours Peru ("nosotros", "nos", "nuestro") utiliza cookies y tecnologías similares en nuestro sitio web https://reservas.angelproyect.com/ y cualquier otro sitio web operado por nosotros (colectivamente, el "Sitio").
            </p>
            <p>
              Le recomendamos que lea esta política junto con nuestra <Link to="/privacidad" className="text-blue-600 hover:underline">Política de Privacidad</Link>, que explica cómo utilizamos la información personal.
            </p>

            <h2>1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, tableta o teléfono móvil) cuando visita un sitio web. Las cookies son ampliamente utilizadas para hacer que los sitios web funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
            </p>
            <p>
              Las cookies permiten que el sitio web reconozca su dispositivo y recuerde información sobre su visita, como sus preferencias de idioma, tamaño de fuente y otras configuraciones. Esto puede hacer que su próxima visita sea más fácil y que el sitio sea más útil para usted.
            </p>

            <h2>2. Tipos de Cookies que Utilizamos</h2>
            <p>
              Utilizamos los siguientes tipos de cookies en nuestro sitio web:
            </p>

            <h3>2.1. Cookies Esenciales</h3>
            <p>
              Estas cookies son necesarias para el funcionamiento de nuestro sitio web. Le permiten navegar por el sitio y utilizar sus funciones. Sin estas cookies, no podríamos proporcionar los servicios que ha solicitado, como procesar reservas o recordar los elementos en su carrito.
            </p>
            <table className="min-w-full divide-y divide-gray-200 my-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propósito</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">session_id</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Gestiona su sesión durante la visita</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sesión</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">csrf_token</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Previene ataques de falsificación de solicitudes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sesión</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">auth_token</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Mantiene su estado de autenticación</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 días</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2. Cookies de Preferencias</h3>
            <p>
              Estas cookies permiten que nuestro sitio web recuerde las elecciones que ha realizado y proporcione funciones mejoradas y más personales. Por ejemplo, pueden recordar su nombre de usuario, idioma o región.
            </p>
            <table className="min-w-full divide-y divide-gray-200 my-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propósito</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">language_preference</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Guarda su preferencia de idioma</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 año</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ui_theme</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Recuerda su preferencia de tema (claro/oscuro)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 año</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">recently_viewed</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Guarda los tours que ha visto recientemente</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 días</td>
                </tr>
              </tbody>
            </table>

            <h3>2.3. Cookies Analíticas</h3>
            <p>
              Estas cookies nos permiten reconocer y contar el número de visitantes y ver cómo los visitantes se mueven por nuestro sitio web cuando lo están usando. Esto nos ayuda a mejorar la forma en que funciona nuestro sitio web, por ejemplo, asegurándonos de que los usuarios encuentren fácilmente lo que están buscando.
            </p>
            <table className="min-w-full divide-y divide-gray-200 my-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propósito</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_ga</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - Distingue usuarios únicos</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 años</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_gid</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - Distingue usuarios</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24 horas</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_gat</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - Limita la tasa de solicitudes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 minuto</td>
                </tr>
              </tbody>
            </table>

            <h3>2.4. Cookies de Marketing</h3>
            <p>
              Estas cookies registran su visita a nuestro sitio web, las páginas que ha visitado y los enlaces que ha seguido. Utilizamos esta información para hacer que nuestro sitio web y la publicidad que se muestra en él sean más relevantes para sus intereses.
            </p>
            <table className="min-w-full divide-y divide-gray-200 my-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propósito</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_fbp</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Facebook Pixel - Seguimiento de conversiones</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 meses</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_gcl_au</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Google AdSense - Medir eficacia de publicidad</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 meses</td>
                </tr>
              </tbody>
            </table>

            <h2>3. Cookies de Terceros</h2>
            <p>
              Algunos de nuestros socios (por ejemplo, redes publicitarias y proveedores de servicios externos como servicios de análisis de tráfico web) también utilizan cookies en nuestro sitio web. Estas cookies son similares a las que usamos, pero no podemos controlarlas.
            </p>
            <p>
              Estos terceros pueden incluir:
            </p>
            <ul>
              <li>Google Analytics (análisis)</li>
              <li>Google AdSense (publicidad)</li>
              <li>Facebook (redes sociales y publicidad)</li>
              <li>Mercado Pago (procesamiento de pagos)</li>
            </ul>

            <h2>4. Cómo Gestionar las Cookies</h2>
            <p>
              La mayoría de los navegadores web permiten cierto control de la mayoría de las cookies a través de la configuración del navegador. Para obtener más información sobre las cookies, incluido cómo ver qué cookies se han establecido y cómo administrarlas y eliminarlas, visite <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
            </p>
            <p>
              Para optar por no ser rastreado por Google Analytics en todos los sitios web, visite <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
            </p>

            <h3>4.1. Desactivar Cookies</h3>
            <p>
              Puede desactivar las cookies ajustando la configuración de su navegador. Tenga en cuenta que si desactiva las cookies, es posible que no pueda acceder a ciertas partes de nuestro sitio web o que algunas funcionalidades no estén disponibles.
            </p>
            <p>
              A continuación, se proporcionan enlaces para gestionar las configuraciones de cookies en navegadores comunes:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Internet Explorer</a></li>
              <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
            </ul>

            <h2>5. Cambios en Esta Política de Cookies</h2>
            <p>
              Podemos actualizar esta Política de Cookies periódicamente para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o regulatorias. Por lo tanto, visite esta Política de Cookies regularmente para mantenerse informado sobre nuestro uso de cookies y tecnologías relacionadas.
            </p>
            <p>
              La fecha en la parte superior de esta Política de Cookies indica cuándo se actualizó por última vez.
            </p>

            <h2>6. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre nuestra política de cookies o la forma en que utilizamos las cookies, por favor contáctenos:
            </p>
            <p>
              Email: privacidad@tours-peru.com<br />
              Teléfono: +51 987 654 321<br />
              Dirección: Av. Larco 345, Miraflores, Lima, Perú
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2025 Angel Tours Peru. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;