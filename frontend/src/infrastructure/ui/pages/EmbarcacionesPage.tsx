import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmbarcacionList from '../features/embarcacion/EmbarcacionList';
import EmbarcacionForm from '../features/embarcacion/EmbarcacionForm';
import EmbarcacionDetail from '../features/embarcacion/EmbarcacionDetail';

const EmbarcacionesPage: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<EmbarcacionList />} />
      <Route path="nueva" element={<EmbarcacionForm />} />
      <Route path="editar/:id" element={<EmbarcacionForm />} />
      <Route path=":id" element={<EmbarcacionDetail />} />
    </Routes>
  );
};

export default EmbarcacionesPage;