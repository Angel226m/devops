import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import {
  fetchClientes,
  eliminarCliente,
  clearErrors,
} from '../../../store/slices/clienteSlice';
import { BusquedaClienteParams } from '../../../../domain/entities/Cliente';
import Table from '../../components/Table';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import {
  FaUserPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';

interface ClienteListProps {
  title?: string;
}

const ClienteList: React.FC<ClienteListProps> = ({
  title = 'Gestión de Clientes',
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clientes, loading, error, success } = useSelector(
    (state: RootState) => state.cliente
  );

  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchClientes());
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success && selectedClienteId) {
      toast.success('✅ Cliente eliminado con éxito');
      setShowDeleteModal(false);
      setSelectedClienteId(null);
    }

    if (error) {
      toast.error(`❌ ${error}`);
    }
  }, [success, error, selectedClienteId]);

  const handleSearch = () => {
    const params: BusquedaClienteParams = {};
    if (search) {
      if (/^[0-9]+$/.test(search)) {
        params.search = search;
        params.type = 'doc';
      } else {
        params.search = search;
        params.type = 'nombre';
      }
    }
    dispatch(fetchClientes(params));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleEdit = (id: number) => {
    navigate(`/vendedor/clientes/editar/${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedClienteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedClienteId) dispatch(eliminarCliente(selectedClienteId));
  };

  const handleView = (id: number) => {
    navigate(`/vendedor/clientes/${id}`);
  };

  const getNombreCliente = (cliente: any) => {
    if (cliente.tipo_documento === 'RUC') {
      return cliente.razon_social || 'Sin nombre';
    }
    return `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Sin nombre';
  };

  const columns = [
    {
      header: 'Tipo',
      accessor: 'tipo_documento',
    },
    {
      header: 'Documento',
      accessor: 'numero_documento',
    },
    {
      header: 'Nombre / Razón Social',
      accessor: getNombreCliente,
    },
    {
      header: 'Correo',
      accessor: 'correo',
    },
    {
      header: 'Celular',
      accessor: 'numero_celular',
    },
    {
      header: 'Acciones',
      accessor: (cliente: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            title="Ver"
            onClick={() => handleView(cliente.id_cliente)}
          >
            <FaEye />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            title="Editar"
            onClick={() => handleEdit(cliente.id_cliente)}
          >
            <FaEdit />
          </Button>
          <Button
            size="sm"
            variant="danger"
            title="Eliminar"
            onClick={() => handleDelete(cliente.id_cliente)}
          >
            <FaTrashAlt />
          </Button>
        </div>
      ),
    },
  ];

  const clientesData = Array.isArray(clientes) ? clientes : [];

  return (
    <>
      <Card>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaUserPlus className="text-blue-500 mr-2" /> {title}
          </h2>
          <Button
            onClick={() => navigate('/vendedor/clientes/nuevo')}
            variant="primary"
          >
            <FaUserPlus className="mr-2" /> Registrar Cliente
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex items-center w-full md:w-1/2 mb-4 md:mb-0">
            <div className="relative flex-grow mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <FormInput
                placeholder="Buscar por nombre o documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              Buscar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : clientesData.length > 0 ? (
          <Table columns={columns} data={clientesData} emptyMessage="No hay clientes registrados" />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500 text-lg mb-4">😕 No se encontraron clientes</p>
            <Button variant="primary" onClick={() => navigate('/vendedor/clientes/nuevo')}>
              <FaUserPlus className="mr-2" /> Crear Primer Cliente
            </Button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="¿Eliminar Cliente?"
      >
        <div className="p-6 text-center">
          <p className="text-gray-700 text-sm mb-4">
            ¿Estás seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={loading}>
              <FaTrashAlt className="mr-2" /> Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClienteList;
