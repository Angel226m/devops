/*import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { FiTag, FiPackage } from 'react-icons/fi';

const Pasajes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiTag className="text-blue-600" />
          Gestión de Pasajes
        </h1>
        <p className="text-gray-600">Seleccione el tipo de pasajes que desea administrar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tarjeta de Tipos de Pasaje *//*}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div 
            className="p-6 cursor-pointer flex flex-col items-center text-center"
            onClick={() => navigate('/admin/tipos-pasaje')}
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FiTag className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Tipos de Pasaje</h2>
            <p className="text-gray-600 mb-4">
              Administre los diferentes tipos de pasajes disponibles para cada tour, 
              configure precios, edades aplicables y otras características.
            </p>
            <button 
              onClick={() => navigate('/admin/tipos-pasaje')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Gestionar Tipos de Pasaje
            </button>
          </div>
        </Card>

        {/* Tarjeta de Paquetes de Pasajes *//*}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div 
            className="p-6 cursor-pointer flex flex-col items-center text-center"
            onClick={() => navigate('/admin/paquetes-pasajes')}
          >
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FiPackage className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Paquetes de Pasajes</h2>
            <p className="text-gray-600 mb-4">
              Configure paquetes de pasajes que incluyen múltiples tipos,
              establezca precios especiales y promociones para grupos.
            </p>
            <button 
              onClick={() => navigate('/admin/paquetes-pasajes')}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Gestionar Paquetes de Pasajes
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Pasajes;*/



import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { FiTag, FiPackage } from 'react-icons/fi';

const Pasajes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiTag className="text-blue-600" />
          Gestión de Pasajes
        </h1>
        <p className="text-gray-600">Seleccione el tipo de pasajes que desea administrar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tarjeta de Tipos de Pasaje */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div 
            className="p-6 cursor-pointer flex flex-col items-center text-center"
            onClick={() => navigate('/admin/tipos-pasaje')}
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FiTag className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Tipos de Pasaje</h2>
            <p className="text-gray-600 mb-4">
              Administre los diferentes tipos de pasajes disponibles para cada tour, 
              configure precios, edades aplicables y otras características.
            </p>
            <button 
              onClick={() => navigate('/admin/tipos-pasaje')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Gestionar Tipos de Pasaje
            </button>
          </div>
        </Card>

        {/* Tarjeta de Paquetes de Pasajes */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div 
            className="p-6 cursor-pointer flex flex-col items-center text-center"
            onClick={() => navigate('/admin/paquetes-pasajes')}
          >
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FiPackage className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Paquetes de Pasajes</h2>
            <p className="text-gray-600 mb-4">
              Configure paquetes de pasajes que incluyen múltiples tipos,
              establezca precios especiales y promociones para grupos.
            </p>
            <button 
              onClick={() => navigate('/admin/paquetes-pasajes')}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Gestionar Paquetes de Pasajes
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Pasajes;