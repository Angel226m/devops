import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UsuarioList from '../features/usuario/UsuarioList';
import UsuarioForm from '../features/usuario/UsuarioForm';
import UsuarioDetail from '../features/usuario/UsuarioDetail';

const UsuariosPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<UsuarioList />} />
      <Route path="nuevo" element={<UsuarioForm />} />
      {/* IMPORTANTE: La ruta más específica debe ir ANTES que la genérica */}
      <Route path=":id/editar" element={<UsuarioForm />} />
      <Route path=":id" element={<UsuarioDetail />} />
      <Route path="*" element={<Navigate to="/admin/usuarios" replace />} />
    </Routes>
  );
};

export default UsuariosPage;