// src/infraestructura/ui/paginas/publicas/PaginaTerminosCondiciones.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaginaTerminosCondiciones: React.FC = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "Términos y Condiciones - NAYARAK TOURS";
    
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 mt-2">Última actualización: 25 de junio de 2025</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <p>
              Bienvenido a NAYARAK TOURS. Estos términos y condiciones rigen el uso de nuestro sitio web y servicios de reservas.
              Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta cumplir con estos términos y condiciones en su totalidad.
              Si no está de acuerdo con estos términos y condiciones, por favor, no utilice nuestro sitio web ni nuestros servicios.
            </p>

            <h2>1. Definiciones</h2>
            <p>
              <strong>"Nosotros", "nos", "nuestro"</strong> se refiere a NAYARAK TOURS, una empresa registrada en Perú.
              <br />
              <strong>"Sitio web"</strong> se refiere a https://reservas.angelproyect.com/ y todos sus subdominios.
              <br />
              <strong>"Servicios"</strong> se refiere a los tours, actividades y experiencias que ofrecemos a través de nuestro sitio web.
              <br />
              <strong>"Usuario", "usted", "su"</strong> se refiere a cualquier persona que acceda al sitio web o utilice nuestros servicios.
              <br />
              <strong>"Reserva"</strong> se refiere a la solicitud y confirmación de uno o más de nuestros servicios.
            </p>

            <h2>2. Servicios de Reserva</h2>
            <p>
              2.1. Nuestro sitio web ofrece un servicio de reserva en línea para tours y actividades en Perú.
            </p>
            <p>
              2.2. Al realizar una reserva, usted está entrando en un acuerdo vinculante con nosotros sujeto a estos términos y condiciones.
            </p>
            <p>
              2.3. Las reservas están sujetas a disponibilidad. No garantizamos la disponibilidad de ningún servicio hasta que se confirme la reserva.
            </p>

            <h2>3. Precios y Pagos</h2>
            <p>
              3.1. Todos los precios mostrados en nuestro sitio web están en Soles Peruanos (S/) e incluyen los impuestos aplicables, a menos que se indique lo contrario.
            </p>
            <p>
              3.2. Para confirmar una reserva, se requiere el pago completo por adelantado.
            </p>
            <p>
              3.3. Aceptamos pagos a través de Mercado Pago, que incluye opciones como tarjetas de crédito/débito, Yape, Plin y otros métodos disponibles.
            </p>
            <p>
              3.4. Al proporcionar sus datos de pago, usted confirma que está autorizado a utilizar el método de pago seleccionado.
            </p>
            <p>
              3.5. Todos los pagos se procesan a través de pasarelas de pago seguras. No almacenamos información completa de tarjetas de crédito en nuestros servidores.
            </p>

            <h2>4. Confirmación de Reserva</h2>
            <p>
              4.1. Después de completar el proceso de reserva y pago, recibirá un correo electrónico de confirmación con los detalles de su reserva.
            </p>
            <p>
              4.2. Si no recibe un correo electrónico de confirmación dentro de las 24 horas posteriores a la realización de la reserva, por favor contáctenos.
            </p>
            <p>
              4.3. Es su responsabilidad verificar que todos los detalles en la confirmación sean correctos y notificarnos inmediatamente de cualquier error.
            </p>
            <p>
              4.4. Debe presentar su confirmación de reserva (impresa o en formato digital) el día de la actividad.
            </p>

            <h2>5. Cancelaciones y Modificaciones</h2>
            <p>
              5.1. Política de cancelación:
            </p>
            <ul>
              <li>Cancelación con más de 7 días de anticipación: reembolso del 100%</li>
              <li>Cancelación entre 3-7 días de anticipación: reembolso del 50%</li>
              <li>Cancelación con menos de 3 días de anticipación: sin reembolso</li>
            </ul>
            <p>
              5.2. Todas las solicitudes de cancelación deben hacerse por escrito a través de nuestro correo electrónico: reservas@oceantours.com
            </p>
            <p>
              5.3. Las modificaciones de reserva están sujetas a disponibilidad y pueden incurrir en cargos adicionales.
            </p>
            <p>
              5.4. Nos reservamos el derecho de cancelar cualquier reserva debido a circunstancias fuera de nuestro control, incluyendo pero no limitado a condiciones climáticas adversas o problemas de seguridad. En estos casos, ofreceremos un reembolso completo o la reprogramación sin costo adicional.
            </p>
            <p>
              5.5. Para tours en embarcaciones marítimas, la cancelación puede ocurrir por condiciones del mar o meteorológicas adversas. La decisión final sobre la viabilidad de la navegación corresponde al capitán de la embarcación.
            </p>

            <h2>6. Responsabilidades del Usuario</h2>
            <p>
              6.1. Usted es responsable de asegurarse de que todos los participantes en su reserva cumplan con los requisitos de salud, documentación y cualquier otro requisito necesario para participar en el tour o actividad.
            </p>
            <p>
              6.2. Usted debe proporcionar información precisa y completa al realizar una reserva.
            </p>
            <p>
              6.3. Es su responsabilidad llegar al punto de encuentro a la hora designada. No podemos garantizar la espera en caso de retraso.
            </p>
            <p>
              6.4. Usted debe seguir todas las instrucciones de seguridad proporcionadas por nuestros guías y personal durante las actividades.
            </p>
            <p>
              6.5. Para actividades acuáticas, usted debe informarnos de antemano si tiene alguna condición médica relevante o si no sabe nadar.
            </p>
            <p>
              6.6. Debe comportarse de manera responsable durante todas las actividades, respetando el medio ambiente, la vida marina y el patrimonio cultural.
            </p>

            <h2>7. Nuestras Responsabilidades</h2>
            <p>
              7.1. Nos comprometemos a proporcionar los servicios reservados con el debido cuidado y habilidad.
            </p>
            <p>
              7.2. En caso de que no podamos proporcionar el servicio reservado, ofreceremos una alternativa comparable o un reembolso.
            </p>
            <p>
              7.3. No nos hacemos responsables de pérdidas, daños o lesiones sufridas por los participantes durante las actividades, excepto en casos de negligencia por nuestra parte.
            </p>
            <p>
              7.4. Proporcionaremos todo el equipo de seguridad necesario para las actividades acuáticas, incluyendo chalecos salvavidas cuando sea aplicable.
            </p>
            <p>
              7.5. Nuestros guías están capacitados en primeros auxilios y procedimientos de rescate acuático.
            </p>

            <h2>8. Propiedad Intelectual</h2>
            <p>
              8.1. Todo el contenido del sitio web, incluyendo textos, gráficos, logotipos, imágenes y software, está protegido por derechos de autor y otras leyes de propiedad intelectual.
            </p>
            <p>
              8.2. No está permitido reproducir, distribuir, modificar o crear trabajos derivados de nuestro contenido sin nuestro permiso expreso por escrito.
            </p>
            <p>
              8.3. Las fotografías tomadas durante nuestros tours pueden ser utilizadas por Ocean Tours con fines promocionales, a menos que usted expresamente solicite lo contrario.
            </p>

            <h2>9. Privacidad</h2>
            <p>
              9.1. Respetamos su privacidad y protegemos sus datos personales de acuerdo con nuestra <Link to="/privacidad" className="text-blue-600 hover:underline">Política de Privacidad</Link>.
            </p>
            <p>
              9.2. Al utilizar nuestro sitio web y servicios, usted acepta el procesamiento de sus datos personales como se describe en nuestra Política de Privacidad.
            </p>

            <h2>10. Cookies</h2>
            <p>
              10.1. Nuestro sitio web utiliza cookies para mejorar su experiencia. Para más información, consulte nuestra <Link to="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
            </p>

            <h2>11. Limitación de Responsabilidad</h2>
            <p>
              11.1. En la medida permitida por la ley, excluimos todas las garantías implícitas relacionadas con nuestro sitio web y servicios.
            </p>
            <p>
              11.2. No seremos responsables por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios.
            </p>
            <p>
              11.3. Nuestra responsabilidad total por cualquier reclamo relacionado con nuestros servicios no excederá el monto pagado por la reserva en cuestión.
            </p>
            <p>
              11.4. Reconocemos que las actividades acuáticas conllevan riesgos inherentes. Mientras tomamos todas las precauciones razonables, los participantes asumen ciertos riesgos al participar en nuestras actividades.
            </p>

            <h2>12. Legislación Aplicable y Jurisdicción</h2>
            <p>
              12.1. Estos términos y condiciones se rigen por las leyes de Perú.
            </p>
            <p>
              12.2. Cualquier disputa que surja de estos términos y condiciones estará sujeta a la jurisdicción exclusiva de los tribunales de Perú.
            </p>

            <h2>13. Modificaciones de los Términos y Condiciones</h2>
            <p>
              13.1. Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
            </p>
            <p>
              13.2. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
            <p>
              13.3. Es su responsabilidad revisar regularmente los términos y condiciones para estar al tanto de cualquier cambio.
            </p>

            <h2>14. Conservación Marina</h2>
            <p>
              14.1. Ocean Tours está comprometido con la conservación del medio ambiente marino y costero.
            </p>
            <p>
              14.2. Durante nuestras actividades, solicitamos a todos los participantes que:
            </p>
            <ul>
              <li>No toquen ni recolecten vida marina</li>
              <li>No arrojen basura al mar o en las playas</li>
              <li>Mantengan una distancia segura de los animales marinos</li>
              <li>Utilicen protector solar biodegradable y respetuoso con los arrecifes</li>
              <li>Sigan todas las indicaciones de nuestros guías respecto a la interacción responsable con el ecosistema</li>
            </ul>
            <p>
              14.3. Una parte de los ingresos de nuestros tours se destina a proyectos de conservación marina local.
            </p>

            <h2>15. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos términos y condiciones, por favor contáctenos a través de:
            </p>
            <p>
              Email: reservas@oceantours.com<br />
              Teléfono: +51 987 654 321<br />
              Dirección: Av. Larco 345, Miraflores, Lima, Perú
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Ocean Tours. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaTerminosCondiciones;