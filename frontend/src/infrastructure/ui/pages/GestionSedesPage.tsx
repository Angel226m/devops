 import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import SedeList from '../features/sede/SedeList';
import { FiArrowLeft } from 'react-icons/fi';

const GestionSedesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToSelection = () => {
    navigate('/seleccionar-sede');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Sedes</h1>
            <p className="text-gray-600">Administre las sedes de la organización</p>
          </div>

          <Button 
            variant="secondary"
            onClick={handleBackToSelection}
            className="flex items-center gap-2"
          >
            <FiArrowLeft /> Volver a Selección
          </Button>
        </div>

        {/* Usamos el componente SedeList existente */}
        <SedeList isGestionPage={true} />
      </div>
    </div>
  );
};

export default GestionSedesPage;