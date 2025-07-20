// src/infraestructura/ui/paginas/publicas/PoliticaPrivacidad.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PoliticaPrivacidad: React.FC = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "Política de Privacidad - NAYARAK TOURS";
    
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
              En NAYARAK TOURS, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos su información personal cuando utiliza nuestro sitio web y servicios de reserva.
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
              <li>Información demográfica (edad, género)</li>
              <li>Preferencias de viaje y requisitos especiales</li>
              <li>Información médica relevante para la seguridad durante actividades acuáticas</li>
              <li>Fotografías proporcionadas durante o después de los tours</li>
              <li>Comentarios, reseñas y testimonios que usted proporcione</li>
              <li>Cualquier otra información que usted decida proporcionarnos</li>
            </ul>

            <h3>1.2. Información recopilada automáticamente:</h3>
            <ul>
              <li>Información de uso (páginas visitadas, tiempo de permanencia, acciones realizadas)</li>
              <li>Información del dispositivo (tipo de dispositivo, sistema operativo, navegador)</li>
              <li>Información de ubicación (país, ciudad, ubicación GPS si lo autoriza)</li>
              <li>Dirección IP</li>
              <li>Información de la sesión y patrones de navegación</li>
              <li>Datos de rendimiento del sitio web y errores de la aplicación</li>
              <li>Cookies y tecnologías similares (como se explica en nuestra <Link to="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>)</li>
            </ul>

            <h3>1.3. Información de terceros:</h3>
            <ul>
              <li>Información de perfiles de redes sociales si se registra o conecta a través de ellas</li>
              <li>Información de proveedores de servicios de pago (estado de transacciones)</li>
              <li>Información de socios comerciales relacionada con reservas</li>
              <li>Referencias o recomendaciones de otros usuarios</li>
            </ul>

            <h2>2. Cómo Utilizamos su Información</h2>
            <p>
              Utilizamos su información personal para los siguientes propósitos:
            </p>
            <ul>
              <li>Procesar y gestionar sus reservas de tours y actividades</li>
              <li>Comunicarnos con usted sobre sus reservas, cambios en el itinerario o condiciones climáticas</li>
              <li>Proporcionar atención al cliente y soporte técnico</li>
              <li>Personalizar y mejorar su experiencia en nuestro sitio web</li>
              <li>Adaptar nuestras recomendaciones a sus intereses y preferencias</li>
              <li>Enviarle información promocional y de marketing con su consentimiento</li>
              <li>Informarle sobre ofertas especiales, nuevos tours o actividades</li>
              <li>Procesar pagos y prevenir fraudes</li>
              <li>Verificar su identidad y confirmar requisitos para actividades específicas</li>
              <li>Gestionar programas de fidelización y recompensas</li>
              <li>Realizar encuestas de satisfacción y análisis de mercado</li>
              <li>Cumplir con obligaciones legales y resolver disputas</li>
              <li>Garantizar su seguridad durante las actividades acuáticas</li>
              <li>Mejorar nuestros productos, servicios y operaciones comerciales</li>
              <li>Monitorear y analizar tendencias, uso y actividades en relación con nuestros servicios</li>
            </ul>

            <h2>3. Base Legal para el Procesamiento</h2>
            <p>
              Procesamos su información personal en base a las siguientes bases legales:
            </p>
            <ul>
              <li><strong>Ejecución de un contrato:</strong> cuando es necesario para cumplir con nuestras obligaciones contractuales con usted (por ejemplo, procesar su reserva y proporcionar el servicio de tour solicitado).</li>
              <li><strong>Consentimiento:</strong> cuando usted ha dado su consentimiento específico para el procesamiento de sus datos personales (por ejemplo, para enviarle comunicaciones de marketing o para el uso de cookies no esenciales).</li>
              <li><strong>Intereses legítimos:</strong> cuando es necesario para nuestros intereses legítimos, como mejorar nuestros servicios, prevenir fraudes, o garantizar la seguridad de nuestros sistemas, siempre que estos intereses no prevalezcan sobre sus derechos y libertades fundamentales.</li>
              <li><strong>Obligación legal:</strong> cuando el procesamiento es necesario para cumplir con una obligación legal a la que estamos sujetos (por ejemplo, mantener registros para fines fiscales o cumplir con regulaciones de turismo).</li>
              <li><strong>Protección de intereses vitales:</strong> en situaciones excepcionales, como emergencias médicas durante tours, podemos procesar información para proteger intereses vitales.</li>
            </ul>

            <h2>4. Compartir Información</h2>
            <p>
              Podemos compartir su información personal con:
            </p>
            <ul>
              <li><strong>Proveedores de servicios:</strong> terceros que nos ayudan a proporcionar nuestros servicios, como:
                <ul>
                  <li>Procesadores de pago (Mercado Pago, entidades bancarias)</li>
                  <li>Proveedores de servicios de alojamiento web y almacenamiento en la nube</li>
                  <li>Servicios de correo electrónico y comunicaciones</li>
                  <li>Servicios de análisis y optimización del sitio web</li>
                  <li>Servicios de atención al cliente</li>
                </ul>
              </li>
              <li><strong>Socios comerciales:</strong> operadores de tours, guías, capitanes de embarcaciones y otros proveedores que necesitan la información para proporcionar los servicios reservados.</li>
              <li><strong>Autoridades reguladoras:</strong> entidades gubernamentales que supervisan actividades turísticas y marítimas.</li>
              <li><strong>Autoridades legales:</strong> cuando sea requerido por ley, orden judicial o solicitud gubernamental válida.</li>
              <li><strong>Asesores profesionales:</strong> como abogados, auditores y aseguradores cuando sea necesario para el funcionamiento de nuestro negocio.</li>
              <li><strong>Sucesores corporativos:</strong> en caso de fusión, adquisición, reorganización o venta de activos.</li>
            </ul>
            <p>
              En todos los casos, exigimos que los terceros que manejan su información cumplan con estándares adecuados de seguridad y confidencialidad.
            </p>
            <p>
              No venderemos ni alquilaremos su información personal a terceros para fines de marketing sin su consentimiento explícito.
            </p>

            <h2>5. Transferencias Internacionales de Datos</h2>
            <p>
              Su información personal puede ser transferida y procesada en países diferentes a su país de residencia, incluyendo países que pueden no tener las mismas leyes de protección de datos.
            </p>
            <p>
              Cuando transferimos su información personal fuera de su país, tomamos medidas para garantizar que se proporcionen salvaguardas adecuadas de acuerdo con las leyes de protección de datos aplicables, como:
            </p>
            <ul>
              <li>Utilizar cláusulas contractuales aprobadas</li>
              <li>Verificar certificaciones de privacidad de los destinatarios</li>
              <li>Implementar mecanismos de transferencia reconocidos por autoridades de protección de datos</li>
              <li>Obtener su consentimiento explícito cuando sea necesario</li>
            </ul>

            <h2>6. Seguridad de la Información</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger su información personal, incluyendo:
            </p>
            <ul>
              <li>Encriptación de datos sensibles</li>
              <li>Protocolos seguros de transmisión de datos (SSL/TLS)</li>
              <li>Acceso restringido a información personal basado en necesidad de conocer</li>
              <li>Sistemas de monitoreo para detectar intentos de acceso no autorizados</li>
              <li>Evaluaciones regulares de seguridad y pruebas de penetración</li>
              <li>Programas de capacitación de empleados en protección de datos</li>
              <li>Planes de respuesta a incidentes de seguridad</li>
            </ul>
            <p>
              A pesar de nuestros esfuerzos, ninguna transmisión de datos por Internet o sistema de almacenamiento electrónico puede garantizarse como 100% seguro. Si tiene razones para creer que su interacción con nosotros ya no es segura, por favor notifíquenos inmediatamente.
            </p>

            <h2>7. Retención de Datos</h2>
            <p>
              Conservaremos su información personal sólo durante el tiempo necesario para cumplir con los propósitos para los que fue recopilada, incluido el cumplimiento de requisitos legales, contables o de informes.
            </p>
            <p>
              Para determinar el período de retención adecuado, consideramos:
            </p>
            <ul>
              <li>La cantidad, naturaleza y sensibilidad de los datos personales</li>
              <li>El riesgo potencial de daño por uso o divulgación no autorizados</li>
              <li>Los propósitos para los que procesamos los datos</li>
              <li>Si podemos lograr esos propósitos a través de otros medios</li>
              <li>Requisitos legales y regulatorios aplicables</li>
            </ul>
            <p>
              En general, conservamos:
            </p>
            <ul>
              <li>Datos de reserva y transacciones financieras: 7 años (requisitos fiscales)</li>
              <li>Información de marketing: hasta 2 años después de su última interacción con nosotros</li>
              <li>Registros de soporte al cliente: 3 años</li>
              <li>Fotografías y testimonios: mientras se utilicen con fines promocionales (con su consentimiento)</li>
            </ul>

            <h2>8. Sus Derechos</h2>
            <p>
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluidos:
            </p>
            <ul>
              <li><strong>Derecho de acceso:</strong> Obtener confirmación sobre si procesamos sus datos y solicitar copia de los mismos.</li>
              <li><strong>Derecho a rectificación:</strong> Corregir información inexacta o incompleta sobre usted.</li>
              <li><strong>Derecho a supresión ("derecho al olvido"):</strong> Solicitar la eliminación de sus datos personales en determinadas circunstancias.</li>
              <li><strong>Derecho a restricción del tratamiento:</strong> Solicitar la limitación del procesamiento de sus datos en ciertas situaciones.</li>
              <li><strong>Derecho a la portabilidad:</strong> Recibir sus datos en un formato estructurado, de uso común y legible por máquina.</li>
              <li><strong>Derecho de oposición:</strong> Oponerse al procesamiento basado en intereses legítimos o para marketing directo.</li>
              <li><strong>Derecho a retirar el consentimiento:</strong> Retirar cualquier consentimiento previamente otorgado para el procesamiento.</li>
              <li><strong>Derecho a no ser objeto de decisiones automatizadas:</strong> No ser sometido a decisiones basadas únicamente en procesamiento automatizado que produzcan efectos jurídicos o significativos.</li>
              <li><strong>Derecho a presentar una reclamación:</strong> Presentar una queja ante una autoridad de protección de datos.</li>
            </ul>
            <p>
              Para ejercer estos derechos, por favor contáctenos utilizando los datos proporcionados en la sección "Contacto" a continuación. Intentaremos responder a todas las solicitudes legítimas dentro de 30 días.
            </p>

            <h2>9. Niños y Privacidad</h2>
            <p>
              Nuestro sitio web y servicios no están dirigidos a personas menores de 18 años, aunque los niños pueden participar en nuestros tours acompañados por adultos responsables.
            </p>
            <p>
              No recopilamos intencionalmente información personal de niños menores de 18 años sin el consentimiento verificable de un padre o tutor legal. Si es padre o tutor y cree que su hijo nos ha proporcionado información personal sin su consentimiento, contáctenos para que podamos tomar las medidas necesarias para eliminar dicha información.
            </p>
            <p>
              Para las reservas que incluyen menores, solicitamos únicamente la información mínima necesaria para garantizar su seguridad durante las actividades (como edad o condiciones médicas relevantes).
            </p>

            <h2>10. Enlaces a Sitios Web de Terceros</h2>
            <p>
              Nuestro sitio web puede contener enlaces a sitios web de terceros, como redes sociales, blogs de viaje, o sitios de reseñas. Estos sitios tienen sus propias políticas de privacidad independientes.
            </p>
            <p>
              No somos responsables de las prácticas de privacidad o el contenido de estos sitios web. Le recomendamos que revise las políticas de privacidad de cualquier sitio web que visite desde nuestro sitio.
            </p>
            <p>
              La inclusión de cualquier enlace no implica respaldo o aprobación del sitio vinculado por parte de NAYARAK TOURS.
            </p>

            <h2>11. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para recopilar información sobre su actividad en nuestro sitio web, recordar sus preferencias y mejorar su experiencia de navegación.
            </p>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Pueden ser cookies de sesión (temporales) o persistentes (permanecen hasta que caducan o las elimina).
            </p>
            <p>
              Para más información sobre las cookies que utilizamos, cómo las utilizamos y cómo puede controlarlas, consulte nuestra <Link to="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
            </p>

            <h2>12. Cambios a Esta Política de Privacidad</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas de información, servicios o requisitos legales aplicables.
            </p>
            <p>
              La versión actualizada se publicará en esta página con una fecha de "última actualización" revisada. Si realizamos cambios materiales, le notificaremos a través de un aviso prominente en nuestro sitio web, por correo electrónico, o por otros medios según lo requiera la ley.
            </p>
            <p>
              Le recomendamos que revise esta Política de Privacidad periódicamente para mantenerse informado sobre cómo protegemos su información.
            </p>
            <p>
              Su uso continuado de nuestros servicios después de la publicación de cambios constituye su aceptación de dichos cambios.
            </p>

            <h2>13. Contacto</h2>
            <p>
              Si tiene preguntas, comentarios o solicitudes relacionadas con esta Política de Privacidad o el procesamiento de su información personal, por favor contáctenos:
            </p>
            <p>
              Responsable de Protección de Datos<br />
              Email: privacidad@oceantours.com<br />
              Teléfono: +51 987 654 321<br />
              Dirección: Av. Larco 345, Miraflores, Lima, Perú
            </p>
            <p>
              Nos comprometemos a trabajar con usted para resolver cualquier queja o preocupación que pueda tener sobre nuestra Política de Privacidad o el uso de su información personal.
            </p>
            <p>
              Si no está satisfecho con nuestra respuesta, puede tener derecho a presentar una reclamación ante la autoridad de protección de datos correspondiente.
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

export default PoliticaPrivacidad;