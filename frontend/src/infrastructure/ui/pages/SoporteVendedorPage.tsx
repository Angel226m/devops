import React from 'react';
import Card from '../components/Card';
import { FaHeadset, FaBook, FaQuestion, FaExclamationTriangle, FaFileAlt, FaVideo } from 'react-icons/fa';

const SoporteVendedorPage: React.FC = () => {
  const faqItems = [
    {
      question: '¿Cómo puedo cancelar una reserva?',
      answer: 'Para cancelar una reserva, dirígete a la sección de Reservas, busca la reserva que deseas cancelar y haz clic en el botón de "Cancelar". Sigue las instrucciones en pantalla para completar el proceso.'
    },
    {
      question: '¿Cómo registro un pago parcial?',
      answer: 'Para registrar un pago parcial, ve a la sección de Pagos, selecciona "Registrar Pago", busca la reserva correspondiente y en el campo de monto ingresa el valor parcial que el cliente está pagando. Asegúrate de seleccionar "Pago Parcial" en el tipo de pago.'
    },
    {
      question: '¿Qué hago si un cliente quiere cambiar la fecha de su tour?',
      answer: 'Si un cliente desea cambiar la fecha de su tour, debes ir a la sección de Reservas, buscar la reserva específica y seleccionar la opción "Modificar". Allí podrás cambiar la fecha y/o hora según disponibilidad.'
    },
    {
      question: '¿Cómo imprimo un comprobante de pago?',
      answer: 'Para imprimir un comprobante, ve a la sección de Pagos, busca el pago realizado y haz clic en el ícono de impresora. Se abrirá una vista previa del comprobante que puedes imprimir o guardar como PDF.'
    }
  ];

  const guideItems = [
    { title: 'Guía de Inicio Rápido', icon: <FaFileAlt className="text-blue-500" />, description: 'Aprende lo básico para empezar a usar el sistema.' },
    { title: 'Manual de Reservas', icon: <FaBook className="text-green-500" />, description: 'Guía completa para gestionar reservas.' },
    { title: 'Procesamiento de Pagos', icon: <FaFileAlt className="text-yellow-500" />, description: 'Cómo registrar y procesar diferentes tipos de pagos.' },
    { title: 'Tutoriales en Video', icon: <FaVideo className="text-red-500" />, description: 'Aprende visualmente con nuestros tutoriales paso a paso.' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Centro de Soporte</h1>
      </div>
      
      {/* Banner de contacto */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white shadow-md">
        <div className="flex items-center">
          <div className="mr-6">
            <FaHeadset className="text-4xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">¿Necesitas ayuda?</h2>
            <p className="mt-1">Nuestro equipo de soporte está disponible de Lunes a Viernes de 8:00 AM a 6:00 PM</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium">Teléfono de Soporte:</p>
                <p className="font-bold">(01) 234-5678</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email de Soporte:</p>
                <p className="font-bold">soporte@toursnauticos.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preguntas frecuentes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <FaQuestion className="text-blue-500 mr-2" />
          Preguntas Frecuentes
        </h2>
        
        <div className="divide-y">
          {faqItems.map((item, index) => (
            <div key={index} className="py-4">
              <h3 className="font-medium text-gray-800">{item.question}</h3>
              <p className="mt-2 text-gray-600 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Guías y recursos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <FaBook className="text-blue-500 mr-2" />
          Guías y Recursos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guideItems.map((item, index) => (
            <Card key={index} className="border hover:shadow-md transition-shadow p-4 cursor-pointer">
              <div className="flex">
                <div className="mr-3">{item.icon}</div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Reportar problemas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 mr-2" />
          Reportar un Problema
        </h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de problema</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccione un tipo de problema</option>
              <option value="error">Error del sistema</option>
              <option value="funcionality">Problema de funcionalidad</option>
              <option value="question">Pregunta técnica</option>
              <option value="suggestion">Sugerencia de mejora</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describa el problema</label>
            <textarea 
              rows={4} 
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Proporcione detalles sobre el problema que está experimentando..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico de contacto</label>
            <input 
              type="email" 
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="su@email.com"
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoporteVendedorPage;