// src/infraestructura/ui/paginas/publicas/PoliticaCookies.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PoliticaCookies: React.FC = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "Política de Cookies - NAYARAK TOURS";
    
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
              Esta Política de Cookies explica cómo NAYARAK TOURS ("nosotros", "nos", "nuestro") utiliza cookies y tecnologías similares en nuestro sitio web https://reservas.angelproyect.com/ y cualquier otro sitio web operado por nosotros (colectivamente, el "Sitio").
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
            <p>
              Además de las cookies, podemos utilizar otras tecnologías similares, como web beacons (pequeñas imágenes transparentes), pixeles de seguimiento y almacenamiento local, que también pueden recopilar información sobre su navegación.
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">cart_id</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Recuerda los tours seleccionados en su carrito</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7 días</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">reservation_progress</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Guarda el progreso durante el proceso de reserva</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hora</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">currency_preference</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Guarda su moneda preferida para precios</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 año</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">recently_viewed</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Guarda los tours que ha visto recientemente</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 días</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">search_history</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Recuerda sus búsquedas recientes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14 días</td>
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_hjid</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Hotjar - Análisis de comportamiento del usuario</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 año</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_hjAbsoluteSessionInProgress</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Hotjar - Detecta la primera sesión de un usuario</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 minutos</td>
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ads_prefs</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Preferencias para publicidad personalizada</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6 meses</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_pinterest_sess</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Pinterest - Seguimiento de conversiones</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 año</td>
                </tr>
              </tbody>
            </table>

            <h2>3. Cookies de Terceros</h2>
            <p>
              Algunos de nuestros socios utilizan cookies en nuestro sitio web. Estas cookies son similares a las que usamos, pero no podemos controlarlas directamente. Estos terceros pueden incluir:
            </p>
            <ul>
              <li><strong>Proveedores de análisis:</strong> Como Google Analytics, Hotjar</li>
              <li><strong>Plataformas de publicidad:</strong> Como Google AdSense, Facebook</li>
              <li><strong>Redes sociales:</strong> Como Facebook, Instagram, Pinterest, TripAdvisor</li>
              <li><strong>Proveedores de servicios:</strong> Como Mercado Pago, Zendesk, Mailchimp</li>
              <li><strong>Herramientas de mapas:</strong> Como Google Maps</li>
              <li><strong>Plataformas de videos:</strong> Como YouTube, Vimeo</li>
            </ul>
            <p>
              Estos terceros pueden utilizar cookies, web beacons y tecnologías similares para recopilar información sobre su uso de nuestro sitio web y otros sitios web. Esta información puede ser utilizada para proporcionar mediciones de publicidad y análisis, reconocer sus preferencias y personalizar el contenido o la publicidad que se le muestra.
            </p>

            <h2>4. Cómo Gestionar las Cookies</h2>
            <p>
              Puede controlar y gestionar las cookies de varias maneras. Tenga en cuenta que eliminar o bloquear las cookies puede afectar su experiencia de usuario y es posible que algunas partes de nuestro sitio web no funcionen correctamente.
            </p>

            <h3>4.1. Controles del Navegador</h3>
            <p>
              La mayoría de los navegadores web permiten cierto control de la mayoría de las cookies a través de la configuración del navegador. Para obtener más información sobre cómo gestionar las cookies a través de su navegador, haga clic en los enlaces a continuación:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Internet Explorer</a></li>
              <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
            </ul>

            <h3>4.2. Desactivación de Cookies Específicas</h3>
            <p>
              Para excluirse de las cookies analíticas específicas:
            </p>
            <ul>
              <li>Google Analytics: Puede instalar el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">complemento de inhabilitación de Google Analytics</a></li>
              <li>Facebook: Puede ajustar sus preferencias de publicidad a través de la <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">configuración de Facebook</a></li>
              <li>Hotjar: Puede optar por no participar en Hotjar visitando la <a href="https://www.hotjar.com/legal/compliance/opt-out" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">página de exclusión de Hotjar</a></li>
            </ul>

            <h3>4.3. Banner de Consentimiento de Cookies</h3>
            <p>
              Cuando visita nuestro sitio web por primera vez, se le mostrará un banner de cookies que le permitirá aceptar o rechazar diferentes categorías de cookies. Puede cambiar sus preferencias en cualquier momento haciendo clic en el enlace "Preferencias de cookies" en el pie de página de nuestro sitio web.
            </p>

            <h3>4.4. No Rastrear</h3>
            <p>
              Algunos navegadores tienen la función "No rastrear" que puede enviar una señal a los sitios web que visita indicando que no desea ser rastreado. Debido a que no hay un estándar común para interpretar estas señales, actualmente nuestro sitio web no responde a las señales de "No rastrear" del navegador.
            </p>

            <h2>5. Impacto del Rechazo de Cookies</h2>
            <p>
              Si decide rechazar ciertas cookies, tenga en cuenta que:
            </p>
            <ul>
              <li>Las cookies esenciales no pueden ser rechazadas, ya que son necesarias para el funcionamiento básico del sitio.</li>
              <li>Rechazar las cookies de preferencias puede hacer que algunas funciones personalizadas no estén disponibles.</li>
              <li>Rechazar las cookies analíticas no afectará su capacidad para usar nuestro sitio, pero significa que no podremos optimizar su experiencia basándonos en datos de uso.</li>
              <li>Rechazar las cookies de marketing hará que vea anuncios menos relevantes para sus intereses.</li>
            </ul>

            <h2>6. Cookies y Privacidad de Datos</h2>
            <p>
              Algunas cookies pueden recopilar datos personales, como su dirección IP o un identificador único. Tratamos esta información de acuerdo con nuestra <Link to="/privacidad" className="text-blue-600 hover:underline">Política de Privacidad</Link>.
            </p>
            <p>
              Cuando utilizamos cookies que procesan datos personales, nos aseguramos de tener una base legal adecuada para dicho procesamiento, como su consentimiento o nuestros intereses legítimos.
            </p>

            <h2>7. Actualizaciones de la Política de Cookies</h2>
            <p>
              Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies que utilizamos o para cumplir con requisitos legales o regulatorios. La versión actualizada se publicará en esta página con una fecha de "última actualización" revisada.
            </p>
            <p>
              Le animamos a revisar esta Política de Cookies regularmente para mantenerse informado sobre cómo utilizamos las cookies.
            </p>

            <h2>8. Información Específica para Dispositivos Móviles</h2>
            <p>
              Cuando accede a nuestro sitio web a través de un dispositivo móvil, podemos utilizar identificadores específicos de dispositivos móviles y tecnologías similares a las cookies. Estas tecnologías funcionan de manera similar a las cookies y están sujetas a las mismas opciones y controles descritos en esta política.
            </p>
            <p>
              Para controlar el uso de identificadores publicitarios en dispositivos móviles, puede cambiar la configuración de su dispositivo. Por ejemplo:
            </p>
           <ul>
  <li>En iOS: Configuración &gt; Privacidad &gt; Publicidad &gt; Limitar seguimiento de anuncios</li>
  <li>En Android: Configuración &gt; Google &gt; Anuncios &gt; Inhabilitar personalización de anuncios</li>
</ul>

            <h2>9. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre nuestra política de cookies o la forma en que utilizamos las cookies, por favor contáctenos:
            </p>
            <p>
              Email: privacidad@oceantours.com<br />
              Teléfono: +51 987 654 321<br />
              Dirección: Av. Larco 345, Miraflores, Lima, Perú
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} NAYARAK TOURS. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies;