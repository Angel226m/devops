// src/infrastructure/ui/pages/Horario.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { FiClock, FiUser, FiMapPin } from 'react-icons/fi';

const Horario: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiClock className="text-blue-600" />
          Gestión de Horarios
        </h1>
        <p className="text-gray-600">Seleccione el tipo de horarios que desea administrar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tarjeta de Horarios de Tour */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div 
            className="p-6 cursor-pointer flex flex-col items-center text-center"
            onClick={() => navigate('/admin/horarios-tour')}
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FiMapPin className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Horarios de Tour</h2>
            <p className="text-gray-600 mb-4">
              Administre los horarios disponibles para cada tipo de tour, configure días de la semana 
              y horarios para la programación de tours.
            </p>
            <button 
              onClick={() => navigate('/admin/horarios-tour')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Gestionar Horarios de Tour
            </button>
          </div>
        </Card>

        {/* Tarjeta de Horarios de Chofer */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div 
            className="p-6 cursor-pointer flex flex-col items-center text-center"
            onClick={() => navigate('/admin/horarios-chofer')}
          >
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FiUser className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Horarios de Chofer</h2>
            <p className="text-gray-600 mb-4">
              Configure la disponibilidad de los choferes, establezca horarios de trabajo
              y días laborables para optimizar la asignación de tours.
            </p>
            <button 
              onClick={() => navigate('/admin/horarios-chofer')}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Gestionar Horarios de Chofer
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Horario;