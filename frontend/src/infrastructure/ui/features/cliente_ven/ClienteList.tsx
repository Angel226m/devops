/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchClientes, eliminarCliente, clearErrors } from '../../../store/slices/clienteSlice';
import { BusquedaClienteParams } from '../../../../domain/entities/Cliente';
import Table from '../../components/Table';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { FaUserPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface ClienteListProps {
  title?: string;
}

const ClienteList: React.FC<ClienteListProps> = ({ title = "Gestión de Clientes" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clientes, loading, error, success } = useSelector((state: RootState) => state.cliente);
  
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  
  useEffect(() => {
    console.log("Cargando clientes...");
    dispatch(fetchClientes());
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (success && selectedClienteId) {
      toast.success('Cliente eliminado con éxito');
      setShowDeleteModal(false);
      setSelectedClienteId(null);
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, selectedClienteId]);
  
  const handleSearch = () => {
    const params: BusquedaClienteParams = {};
    
    if (search) {
      if (search.match(/^[0-9]+$/)) {
        // Si es solo números, buscar por documento
        params.search = search;
        params.type = 'doc';
      } else {
        // Si tiene letras, buscar por nombre
        params.search = search;
        params.type = 'nombre';
      }
    }
    
    dispatch(fetchClientes(params));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleEdit = (id: number) => {
    navigate(`/vendedor/clientes/editar/${id}`);
  };
  
  const handleDelete = (id: number) => {
    setSelectedClienteId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (selectedClienteId) {
      dispatch(eliminarCliente(selectedClienteId));
    }
  };
  
  const handleView = (id: number) => {
    navigate(`/vendedor/clientes/${id}`);
  };
  
  // Función para obtener el nombre del cliente dependiendo de si es persona o empresa
  const getNombreCliente = (cliente: any) => {
    if (cliente.tipo_documento === 'RUC') {
      return cliente.razon_social || 'Sin nombre';
    } else {
      return `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Sin nombre';
    }
  };
  
  const columns = [
    { 
      header: 'Tipo', 
      accessor: 'tipo_documento'
    },
    { 
      header: 'Documento', 
      accessor: 'numero_documento'
    },
    { 
      header: 'Nombre / Razón Social', 
      accessor: getNombreCliente
    },
    { 
      header: 'Correo', 
      accessor: 'correo'
    },
    { 
      header: 'Celular', 
      accessor: 'numero_celular'
    },
    {
      header: 'Acciones',
      accessor: (cliente: any) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => handleView(cliente.id_cliente)}
          >
            <FaEye className="mr-1" /> Ver
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => handleEdit(cliente.id_cliente)}
          >
            <FaEdit className="mr-1" /> Editar
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => handleDelete(cliente.id_cliente)}
          >
            <FaTrash className="mr-1" /> Eliminar
          </Button>
        </div>
      )
    }
  ];
  
  // Depuración para verificar que clientes está llegando
  console.log("Clientes en el componente:", clientes);
  
  return (
    <>
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex items-center w-full md:w-1/2 mb-4 md:mb-0">
            <div className="relative flex-grow mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <FormInput 
                placeholder="Buscar por documento o nombre..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              variant="secondary"
            >
              Buscar
            </Button>
          </div>
          
          <Button 
            onClick={() => navigate('/vendedor/clientes/nuevo')}
            variant="primary"
          >
            <FaUserPlus className="mr-2" /> Nuevo Cliente
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : Array.isArray(clientes) && clientes.length > 0 ? (
          <Table 
            columns={columns} 
            data={clientes} 
            emptyMessage="No hay clientes registrados"
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500 mb-4">No se encontraron clientes</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate('/vendedor/clientes/nuevo')}
            >
              <FaUserPlus className="mr-2" /> Crear Primer Cliente
            </Button>
          </div>
        )}
      </Card>
      
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            ¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.
          </p>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete} 
              disabled={loading}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClienteList;*/


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchClientes, eliminarCliente, clearErrors } from '../../../store/slices/clienteSlice';
import { BusquedaClienteParams } from '../../../../domain/entities/Cliente';
import Table from '../../components/Table';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { 
  FaUserPlus, FaSearch, FaEye, FaEdit, FaTrash, FaIdCard, 
  FaBuilding, FaUserTie, FaFilter, FaSortAmountDown
} from 'react-icons/fa';

interface ClienteListProps {
  title?: string;
}

const ClienteList: React.FC<ClienteListProps> = ({ title = "Gestión de Clientes" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clientes, loading, error, success } = useSelector((state: RootState) => state.cliente);
  
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  
  useEffect(() => {
    console.log("Cargando clientes...");
    dispatch(fetchClientes());
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (success && selectedClienteId) {
      toast.success('Cliente eliminado con éxito');
      setShowDeleteModal(false);
      setSelectedClienteId(null);
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, selectedClienteId]);
  
  const handleSearch = () => {
    const params: BusquedaClienteParams = {};
    
    if (search) {
      if (search.match(/^[0-9]+$/)) {
        // Si es solo números, buscar por documento
        params.search = search;
        params.type = 'doc';
      } else {
        // Si tiene letras, buscar por nombre
        params.search = search;
        params.type = 'nombre';
      }
    }
    
    dispatch(fetchClientes(params));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleEdit = (id: number) => {
    navigate(`/vendedor/clientes/editar/${id}`);
  };
  
  const handleDelete = (cliente: any) => {
    setSelectedClienteId(cliente.id_cliente);
    setSelectedCliente(cliente);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (selectedClienteId) {
      dispatch(eliminarCliente(selectedClienteId));
    }
  };
  
  const handleView = (id: number) => {
    navigate(`/vendedor/clientes/${id}`);
  };
  
  // Función para obtener el nombre del cliente dependiendo de si es persona o empresa
  const getNombreCliente = (cliente: any) => {
    if (cliente.tipo_documento === 'RUC') {
      return cliente.razon_social || 'Sin nombre';
    } else {
      return `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Sin nombre';
    }
  };
  
  const getClienteIcon = (tipoDocumento: string) => {
    return tipoDocumento === 'RUC' ? (
      <FaBuilding className="text-blue-500" />
    ) : (
      <FaUserTie className="text-indigo-500" />
    );
  };
  
  const columns = [
    { 
      header: 'Tipo',
      accessor: (cliente: any) => (
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 p-2 rounded-full">
            {getClienteIcon(cliente.tipo_documento)}
          </div>
        </div>
      )
    },
    { 
      header: 'Documento', 
      accessor: (cliente: any) => (
        <div className="flex items-center">
          <span className="font-medium text-gray-700 mr-2">{cliente.tipo_documento}:</span>
          <span>{cliente.numero_documento}</span>
        </div>
      )
    },
    { 
      header: 'Nombre / Razón Social',
      accessor: (cliente: any) => (
        <div className="font-medium">
          {cliente.tipo_documento === 'RUC' ? (
            <div className="flex items-center">
              <FaBuilding className="text-blue-500 mr-2" />
              <span>{cliente.razon_social || 'Sin nombre'}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <FaUserTie className="text-indigo-500 mr-2" />
              <span>{`${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Sin nombre'}</span>
            </div>
          )}
        </div>
      )
    },
    { 
      header: 'Correo',
      accessor: (cliente: any) => (
        <div className="flex items-center">
          <span className="text-gray-600 truncate max-w-[150px]">{cliente.correo}</span>
        </div>
      )
    },
    { 
      header: 'Celular',
      accessor: (cliente: any) => (
        <div className="flex items-center">
          <span className="text-gray-600">{cliente.numero_celular}</span>
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: (cliente: any) => (
        <div className="flex space-x-2 justify-end">
          <Button 
            size="sm" 
            variant="primary" 
            className="rounded-full flex items-center px-3 py-1"
            onClick={() => handleView(cliente.id_cliente)}
          >
            <FaEye className="mr-1" /> Ver
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="rounded-full flex items-center px-3 py-1"
            onClick={() => handleEdit(cliente.id_cliente)}
          >
            <FaEdit className="mr-1" /> Editar
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            className="rounded-full flex items-center px-3 py-1"
            onClick={() => handleDelete(cliente)}
          >
            <FaTrash className="mr-1" /> Eliminar
          </Button>
        </div>
      )
    }
  ];
  
  // Depuración para verificar que clientes está llegando
  console.log("Clientes en el componente:", clientes);
  
  // Verificar la estructura de clientes y extraer el array si es necesario
  let clientesArray = [];
  if (clientes && typeof clientes === 'object') {
    if ('data' in clientes && Array.isArray(clientes.data)) {
      clientesArray = clientes.data;
    } else if (Array.isArray(clientes)) {
      clientesArray = clientes;
    }
  }
  console.log("Array de clientes a mostrar:", clientesArray);
  
  return (
    <>
      <Card className="shadow-lg border border-gray-100">
        <div className="mb-6 flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg mr-4">
            <FaIdCard className="text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 text-sm">
              Gestione la información de todos sus clientes
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex items-center w-full md:w-3/5 mb-4 md:mb-0">
            <div className="relative flex-grow mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <FormInput 
                placeholder="Buscar por documento o nombre..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg"
              />
            </div>
            <Button 
              onClick={handleSearch}
              variant="secondary"
              className="rounded-lg flex items-center"
            >
              <FaFilter className="mr-2" /> Filtrar
            </Button>
          </div>
          
          <Button 
            onClick={() => navigate('/vendedor/clientes/nuevo')}
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg flex items-center"
          >
            <FaUserPlus className="mr-2" /> Nuevo Cliente
          </Button>
        </div>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Cargando clientes...</p>
          </div>
        ) : clientesArray.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <Table 
              columns={columns} 
              data={clientesArray}
              emptyMessage="No hay clientes registrados"
              className="min-w-full divide-y divide-gray-200"
            />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-100 shadow-sm p-12 text-center">
            <div className="bg-blue-100 inline-flex p-4 rounded-full mb-4">
              <FaUserPlus className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron clientes</h3>
            <p className="text-gray-500 mb-6">Comience registrando su primer cliente en el sistema</p>
            <Button 
              variant="primary" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg inline-flex items-center"
              onClick={() => navigate('/vendedor/clientes/nuevo')}
            >
              <FaUserPlus className="mr-2" /> Crear Primer Cliente
            </Button>
          </div>
        )}
      </Card>
      
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="p-6">
          {selectedCliente && (
            <div className="text-center mb-6">
              <div className="bg-red-100 inline-flex p-4 rounded-full mb-4">
                <FaTrash className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                ¿Eliminar cliente?
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">
                  {selectedCliente.tipo_documento === 'RUC' ? selectedCliente.razon_social : 
                    `${selectedCliente.nombres} ${selectedCliente.apellidos}`}
                </span>
                <br />
                <span className="text-sm">
                  {selectedCliente.tipo_documento}: {selectedCliente.numero_documento}
                </span>
              </p>
            </div>
          )}
          
          <p className="text-gray-500 mb-6 text-center">
            Esta acción no se puede deshacer. Se eliminará permanentemente toda la información asociada a este cliente.
          </p>
          
          <div className="flex justify-center space-x-4 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
              className="px-6 rounded-full"
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete} 
              disabled={loading}
              className="px-6 rounded-full"
            >
              {loading ? 'Eliminando...' : 'Eliminar Cliente'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClienteList;