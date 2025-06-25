// src/infraestructura/ui/paginas/publicas/PaginaTerminosCondiciones.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaginaTerminosCondiciones: React.FC = () => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = "Términos y Condiciones - Sistema de Reservas";
    
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 mt-2">Última actualización: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <p>
              Bienvenido a Angel Tours Peru. Estos términos y condiciones rigen el uso de nuestro sitio web y servicios de reservas.
              Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta cumplir con estos términos y condiciones en su totalidad.
              Si no está de acuerdo con estos términos y condiciones, por favor, no utilice nuestro sitio web ni nuestros servicios.
            </p>

            {/* Contenido de los términos y condiciones */}
            {/* ... */}

            <h2>1. Definiciones</h2>
            <p>
              <strong>"Nosotros", "nos", "nuestro"</strong> se refiere a Angel Tours Peru, una empresa registrada en Perú.
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

            {/* Más contenido... */}

            <h2>14. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos términos y condiciones, por favor contáctenos a través de:
            </p>
            <p>
              Email: reservas@tours-peru.com<br />
              Teléfono: +51 987 654 321<br />
              Dirección: Av. Larco 345, Miraflores, Lima, Perú
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Angel Tours Peru. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaTerminosCondiciones;