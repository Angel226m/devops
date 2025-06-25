// src/paginas/PoliticaPrivacidad.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PoliticaPrivacidad = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "Política de Privacidad - Sistema de Reservas";
    
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Política de Privacidad</h1>
            <p className="text-sm text-gray-500 mt-2">Última actualización: 25 de junio de 2025</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <p>
              En Angel Tours Peru, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos su información personal cuando utiliza nuestro sitio web y servicios de reserva.
            </p>
            <p>
              Al utilizar nuestro sitio web y servicios, usted acepta las prácticas descritas en esta Política de Privacidad.
            </p>

            <h2>1. Información que Recopilamos</h2>
            <p>
              Podemos recopilar los siguientes tipos de información personal:
            </p>
            <h3>1.1. Información que usted nos proporciona:</h3>
            <ul>
              <li>Información de contacto (nombre, dirección de correo electrónico, número de teléfono)</li>
              <li>Información de identificación (número de documento de identidad, nacionalidad)</li>
              <li>Detalles de pago (información de tarjeta de crédito, detalles de cuenta bancaria)</li>
              <li>Preferencias de viaje y requisitos especiales</li>
              <li>Cualquier otra información que usted decida proporcionarnos</li>
            </ul>

            <h3>1.2. Información recopilada automáticamente:</h3>
            <ul>
              <li>Información de uso (páginas visitadas, tiempo de permanencia, acciones realizadas)</li>
              <li>Información del dispositivo (tipo de dispositivo, sistema operativo, navegador)</li>
              <li>Información de ubicación (país, ciudad)</li>
              <li>Dirección IP</li>
              <li>Cookies y tecnologías similares (como se explica en nuestra <Link to="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>)</li>
            </ul>

            <h2>2. Cómo Utilizamos su Información</h2>
            <p>
              Utilizamos su información personal para los siguientes propósitos:
            </p>
            <ul>
              <li>Procesar y gestionar sus reservas</li>
              <li>Comunicarnos con usted sobre sus reservas y servicios</li>
              <li>Proporcionar atención al cliente y soporte técnico</li>
              <li>Personalizar y mejorar su experiencia en nuestro sitio web</li>
              <li>Enviarle información promocional y de marketing con su consentimiento</li>
              <li>Procesar pagos y prevenir fraudes</li>
              <li>Cumplir con obligaciones legales y resolver disputas</li>
              <li>Analizar y mejorar nuestros servicios, sitio web y operaciones comerciales</li>
            </ul>

            <h2>3. Base Legal para el Procesamiento</h2>
            <p>
              Procesamos su información personal en base a las siguientes bases legales:
            </p>
            <ul>
              <li><strong>Ejecución de un contrato:</strong> cuando es necesario para cumplir con nuestras obligaciones contractuales con usted (por ejemplo, procesar su reserva).</li>
              <li><strong>Consentimiento:</strong> cuando usted ha dado su consentimiento para el procesamiento de sus datos personales (por ejemplo, para enviarle comunicaciones de marketing).</li>
              <li><strong>Intereses legítimos:</strong> cuando es necesario para nuestros intereses legítimos, siempre que estos no prevalezcan sobre sus derechos y libertades fundamentales.</li>
              <li><strong>Obligación legal:</strong> cuando el procesamiento es necesario para cumplir con una obligación legal a la que estamos sujetos.</li>
            </ul>

            <h2>4. Compartir Información</h2>
            <p>
              Podemos compartir su información personal con:
            </p>
            <ul>
              <li><strong>Proveedores de servicios:</strong> terceros que nos ayudan a proporcionar nuestros servicios (procesadores de pago, proveedores de hosting, etc.).</li>
              <li><strong>Socios comerciales:</strong> proveedores de tours y actividades que necesitan la información para proporcionar los servicios reservados.</li>
              <li><strong>Autoridades legales:</strong> cuando sea requerido por ley, orden judicial o solicitud gubernamental.</li>
              <li><strong>Sucesores corporativos:</strong> en caso de fusión, adquisición o venta de activos.</li>
            </ul>
            <p>
              No venderemos ni alquilaremos su información personal a terceros para fines de marketing sin su consentimiento explícito.
            </p>

            <h2>5. Transferencias Internacionales de Datos</h2>
            <p>
              Su información personal puede ser transferida y procesada en países diferentes a su país de residencia, incluyendo países que pueden no tener las mismas leyes de protección de datos.
            </p>
            <p>
              Cuando transferimos su información personal fuera de su país, tomamos medidas para garantizar que se proporcionen salvaguardas adecuadas de acuerdo con las leyes de protección de datos aplicables.
            </p>

            <h2>6. Seguridad de la Información</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger su información personal contra acceso no autorizado, pérdida, mal uso, alteración o destrucción.
            </p>
            <p>
              A pesar de nuestros esfuerzos, ninguna transmisión de datos por Internet o sistema de almacenamiento electrónico puede garantizarse como 100% seguro. Si tiene razones para creer que su interacción con nosotros ya no es segura, por favor notifíquenos inmediatamente.
            </p>

            <h2>7. Retención de Datos</h2>
            <p>
              Conservaremos su información personal sólo durante el tiempo necesario para cumplir con los propósitos para los que fue recopilada, incluido el cumplimiento de requisitos legales, contables o de informes.
            </p>
            <p>
              Los períodos de retención específicos dependerán del tipo de información y los requisitos legales aplicables.
            </p>

            <h2>8. Sus Derechos</h2>
            <p>
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluidos:
            </p>
            <ul>
              <li>Derecho de acceso a su información personal</li>
              <li>Derecho a rectificar información inexacta o incompleta</li>
              <li>Derecho a borrar su información personal</li>
              <li>Derecho a restringir el procesamiento de su información personal</li>
              <li>Derecho a la portabilidad de los datos</li>
              <li>Derecho a oponerse al procesamiento</li>
              <li>Derecho a retirar el consentimiento</li>
              <li>Derecho a presentar una queja ante una autoridad de protección de datos</li>
            </ul>
            <p>
              Para ejercer estos derechos, por favor contáctenos utilizando los datos proporcionados en la sección "Contacto" a continuación.
            </p>

            <h2>9. Niños y Privacidad</h2>
            <p>
              Nuestro sitio web y servicios no están dirigidos a personas menores de 18 años. No recopilamos intencionalmente información personal de niños menores de 18 años. Si descubrimos que hemos recopilado información personal de un niño menor de 18 años, tomaremos medidas para eliminar esa información lo antes posible.
            </p>

            <h2>10. Enlaces a Sitios Web de Terceros</h2>
            <p>
              Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables de las prácticas de privacidad o el contenido de estos sitios web. Le recomendamos que revise las políticas de privacidad de cualquier sitio web que visite.
            </p>

            <h2>11. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para recopilar información sobre su actividad en nuestro sitio web. Para más información, consulte nuestra <Link to="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
            </p>

            <h2>12. Cambios a Esta Política de Privacidad</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas de información o para cumplir con requisitos legales. La versión actualizada se publicará en esta página con una fecha de "última actualización" revisada.
            </p>
            <p>
              Le recomendamos que revise esta Política de Privacidad periódicamente para mantenerse informado sobre cómo protegemos su información.
            </p>

            <h2>13. Contacto</h2>
            <p>
              Si tiene preguntas, comentarios o solicitudes relacionadas con esta Política de Privacidad o el procesamiento de su información personal, por favor contáctenos:
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

export default PoliticaPrivacidad;