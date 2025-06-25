import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ClienteList from '../features/cliente_ven/ClienteList';
import ClienteForm from '../features/cliente_ven/ClienteForm';
import ClienteDetail from '../features/cliente_ven/ClienteDetail';

const ClientesVendedorPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ClienteList title="Clientes Registrados" />} />
      <Route path="nuevo" element={<ClienteForm />} />
      {/* IMPORTANTE: La ruta más específica debe ir ANTES que la genérica */}
      <Route path="editar/:id" element={<ClienteForm />} />
      <Route path=":id" element={<ClienteDetail />} />
      <Route path="*" element={<Navigate to="/vendedor/clientes" replace />} />
    </Routes>
  );
};

export default ClientesVendedorPage;