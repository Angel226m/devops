// src/infrastructure/ui/pages/HorariosTourPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HorarioTourList from '../features/horarioTour/HorarioTourList';
import { FiArrowLeft, FiClock } from 'react-icons/fi';

const HorariosTourPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FiClock className="text-blue-600" />
            Horarios de Tour
          </h1>
          <p className="text-gray-600">Gestione los horarios disponibles para cada tipo de tour</p>
        </div>
        <button 
          onClick={() => navigate('/admin/horarios')}
          className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
        >
          <FiArrowLeft />
          Volver a Horarios
        </button>
      </div>
      
      <HorarioTourList />
    </div>
  );
};

export default HorariosTourPage;