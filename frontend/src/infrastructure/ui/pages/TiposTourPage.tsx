 
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TipoTourList from '../features/tipoTour/TipoTourList';
import TipoTourForm from '../features/tipoTour/TipoTourForm';
import TipoTourDetail from '../features/tipoTour/TipoTourDetail';
import NotFoundPage from './NotFoundPage';

const TiposTourPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TipoTourList />} />
      <Route path="/nuevo" element={<TipoTourForm />} />
      <Route path="/editar/:id" element={<TipoTourForm />} />
      <Route path="/:id" element={<TipoTourDetail />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default TiposTourPage;