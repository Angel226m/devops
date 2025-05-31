 
// src/infrastructure/ui/pages/ChoferesHorarioPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChoferHorarioList from '../features/choferHorario/ChoferHorarioList';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

const ChoferesHorarioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FiUser className="text-green-600" />
            Horarios de Chofer
          </h1>
          <p className="text-gray-600">Gestione la disponibilidad y horarios de trabajo de los choferes</p>
        </div>
        <button 
          onClick={() => navigate('/admin/horarios')}
          className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md"
        >
          <FiArrowLeft />
          Volver a Horarios
        </button>
      </div>
      
      <ChoferHorarioList />
    </div>
  );
};

export default ChoferesHorarioPage;