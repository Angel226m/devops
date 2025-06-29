/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchClientePorId, 
  actualizarCliente, 
  clearErrors 
} from '../../../store/slices/clienteSlice';
import { ActualizarClienteRequest } from '../../../../domain/entities/Cliente';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Modal from '../../components/Modal';
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaBuilding, FaPencilAlt, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ClienteDetailProps {
  title?: string;
}

const ClienteDetail: React.FC<ClienteDetailProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clienteActual, loading, error, success } = useSelector((state: RootState) => state.cliente);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [formData, setFormData] = useState<ActualizarClienteRequest>({
    tipo_documento: '',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    razon_social: '',
    direccion_fiscal: '',
    correo: '',
    numero_celular: ''
  });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchClientePorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (clienteActual) {
      setIsEmpresa(clienteActual.tipo_documento === 'RUC');
      setFormData({
        tipo_documento: clienteActual.tipo_documento,
        numero_documento: clienteActual.numero_documento,
        nombres: clienteActual.nombres || '',
        apellidos: clienteActual.apellidos || '',
        razon_social: clienteActual.razon_social || '',
        direccion_fiscal: clienteActual.direccion_fiscal || '',
        correo: clienteActual.correo,
        numero_celular: clienteActual.numero_celular
      });
    }
  }, [clienteActual]);
  
  useEffect(() => {
    if (success) {
      toast.success('Cliente actualizado con éxito');
      setShowEditModal(false);
      if (id) {
        dispatch(fetchClientePorId(parseInt(id)));
      }
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (id) {
      // Preparar datos para envío
      const datosParaEnviar = { ...formData };
      
      // Validaciones condicionales
      if (isEmpresa) {
        if (!datosParaEnviar.razon_social || !datosParaEnviar.direccion_fiscal) {
          toast.error('La razón social y dirección fiscal son obligatorias para empresas');
          return;
        }
        datosParaEnviar.nombres = '';
        datosParaEnviar.apellidos = '';
      } else {
        if (!datosParaEnviar.nombres || !datosParaEnviar.apellidos) {
          toast.error('Los nombres y apellidos son obligatorios para personas naturales');
          return;
        }
        datosParaEnviar.razon_social = '';
        datosParaEnviar.direccion_fiscal = '';
      }
      
      dispatch(actualizarCliente({ 
        id: parseInt(id), 
        cliente: datosParaEnviar
      }));
    }
  };
  
  if (!clienteActual && loading) {
    return (
      <Card>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }
  
  if (!clienteActual) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-gray-500">No se encontró información del cliente</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => navigate('/vendedor/clientes')}
          >
            <FaArrowLeft className="mr-2" /> Volver a la lista
          </Button>
        </div>
      </Card>
    );
  }
  
  const detailTitle = title || "Detalles del Cliente";
  const isEmpresaActual = clienteActual.tipo_documento === 'RUC';
  
  return (
    <>
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            {isEmpresaActual ? 
              <FaBuilding className="text-blue-500 text-xl" /> :
              <FaUser className="text-blue-500 text-xl" />
            }
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{detailTitle}</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            {isEmpresaActual ? 
              <><FaBuilding className="mr-2 text-blue-500" /> Información de Empresa</> :
              <><FaUser className="mr-2 text-blue-500" /> Información Personal</>
            }
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FaIdCard className="mt-1 mr-3 text-gray-500" />
              <div>
                <h4 className="font-medium text-gray-700">Tipo de Documento</h4>
                <p className="text-gray-600">{clienteActual.tipo_documento}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaIdCard className="mt-1 mr-3 text-gray-500" />
              <div>
                <h4 className="font-medium text-gray-700">Número de Documento</h4>
                <p className="text-gray-600">{clienteActual.numero_documento}</p>
              </div>
            </div>
            
            {isEmpresaActual ? (
              // Campos de empresa
              <>
                <div className="flex items-start">
                  <FaBuilding className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-700">Razón Social</h4>
                    <p className="text-gray-600">{clienteActual.razon_social}</p>
                  </div>
                </div>
                
                <div className="flex items-start col-span-1 md:col-span-2">
                  <FaBuilding className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-700">Dirección Fiscal</h4>
                    <p className="text-gray-600">{clienteActual.direccion_fiscal}</p>
                  </div>
                </div>
              </>
            ) : (
              // Campos de persona natural
              <>
                <div className="flex items-start">
                  <FaUser className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-700">Nombres</h4>
                    <p className="text-gray-600">{clienteActual.nombres}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaUser className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-700">Apellidos</h4>
                    <p className="text-gray-600">{clienteActual.apellidos}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FaEnvelope className="mr-2 text-blue-500" /> Información de Contacto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FaEnvelope className="mt-1 mr-3 text-gray-500" />
              <div>
                <h4 className="font-medium text-gray-700">Correo Electrónico</h4>
                <p className="text-gray-600">{clienteActual.correo}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaPhone className="mt-1 mr-3 text-gray-500" />
              <div>
                <h4 className="font-medium text-gray-700">Número de Celular</h4>
                <p className="text-gray-600">{clienteActual.numero_celular}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button 
            variant="secondary"
            onClick={() => navigate('/vendedor/clientes')}
          >
            <FaArrowLeft className="mr-2" /> Volver
          </Button>
          
          <Button 
            variant="primary"
            onClick={() => setShowEditModal(true)}
          >
            <FaPencilAlt className="mr-2" /> Editar Datos
          </Button>
        </div>
      </Card>
      
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Editar ${isEmpresa ? 'Empresa' : 'Cliente'}`}
      >
        <div className="p-6">
          <div className="space-y-4">
            {isEmpresa ? (
              // Formulario para empresa
              <>
                <FormInput 
                  label="Razón Social" 
                  name="razon_social" 
                  value={formData.razon_social} 
                  onChange={handleChange} 
                  required
                />
                
                <FormInput 
                  label="Dirección Fiscal" 
                  name="direccion_fiscal" 
                  value={formData.direccion_fiscal} 
                  onChange={handleChange} 
                  required
                />
              </>
            ) : (
              // Formulario para persona natural
              <>
                <FormInput 
                  label="Nombres" 
                  name="nombres" 
                  value={formData.nombres} 
                  onChange={handleChange} 
                  required
                />
                
                <FormInput 
                  label="Apellidos" 
                  name="apellidos" 
                  value={formData.apellidos} 
                  onChange={handleChange} 
                  required
                />
              </>
            )}
            
            <FormInput 
              label="Correo Electrónico" 
              name="correo" 
              type="email"
              value={formData.correo} 
              onChange={handleChange} 
              required
            />
            
            <FormInput 
              label="Número de Celular" 
              name="numero_celular" 
              value={formData.numero_celular} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
            >
              Cancelar
            </Button>
            
            <Button 
              variant="primary"
              onClick={handleSubmit} 
              disabled={loading}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClienteDetail;*/
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchClientePorId, 
  actualizarCliente, 
  clearErrors 
} from '../../../store/slices/clienteSlice';
import { ActualizarClienteRequest } from '../../../../domain/entities/Cliente';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { 
  FaUser, FaIdCard, FaEnvelope, FaPhone, FaBuilding, 
  FaPencilAlt, FaArrowLeft, FaClipboardCheck, FaEdit, 
  FaCheck, FaMapMarkerAlt, FaCalendarAlt, FaHistory,
  FaUserEdit, FaSave,
  FaTimes
} from 'react-icons/fa';

interface ClienteDetailProps {
  title?: string;
}

const ClienteDetail: React.FC<ClienteDetailProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clienteActual, loading, error, success } = useSelector((state: RootState) => state.cliente);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [formData, setFormData] = useState<ActualizarClienteRequest>({
    tipo_documento: '',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    razon_social: '',
    direccion_fiscal: '',
    correo: '',
    numero_celular: ''
  });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchClientePorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (clienteActual) {
      setIsEmpresa(clienteActual.tipo_documento === 'RUC');
      setFormData({
        tipo_documento: clienteActual.tipo_documento,
        numero_documento: clienteActual.numero_documento,
        nombres: clienteActual.nombres || '',
        apellidos: clienteActual.apellidos || '',
        razon_social: clienteActual.razon_social || '',
        direccion_fiscal: clienteActual.direccion_fiscal || '',
        correo: clienteActual.correo,
        numero_celular: clienteActual.numero_celular
      });
    }
  }, [clienteActual]);
  
  useEffect(() => {
    if (success) {
      toast.success('Cliente actualizado con éxito');
      setShowEditModal(false);
      if (id) {
        dispatch(fetchClientePorId(parseInt(id)));
      }
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (id) {
      // Preparar datos para envío
      const datosParaEnviar = { ...formData };
      
      // Validaciones condicionales
      if (isEmpresa) {
        if (!datosParaEnviar.razon_social || !datosParaEnviar.direccion_fiscal) {
          toast.error('La razón social y dirección fiscal son obligatorias para empresas');
          return;
        }
        datosParaEnviar.nombres = '';
        datosParaEnviar.apellidos = '';
      } else {
        if (!datosParaEnviar.nombres || !datosParaEnviar.apellidos) {
          toast.error('Los nombres y apellidos son obligatorios para personas naturales');
          return;
        }
        datosParaEnviar.razon_social = '';
        datosParaEnviar.direccion_fiscal = '';
      }
      
      dispatch(actualizarCliente({ 
        id: parseInt(id), 
        cliente: datosParaEnviar
      }));
    }
  };
  
  if (!clienteActual && loading) {
    return (
      <Card className="shadow-lg border border-gray-100">
        <div className="flex flex-col justify-center items-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Cargando información del cliente...</p>
        </div>
      </Card>
    );
  }
  
  if (!clienteActual) {
    return (
      <Card className="shadow-lg border border-gray-100">
        <div className="p-12 text-center">
          <div className="bg-red-100 inline-flex p-4 rounded-full mb-4">
            <FaIdCard className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Cliente no encontrado</h3>
          <p className="text-gray-500 mb-6">No se encontró información para el cliente solicitado</p>
          <Button 
            variant="primary" 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg flex items-center mx-auto"
            onClick={() => navigate('/vendedor/clientes')}
          >
            <FaArrowLeft className="mr-2" /> Volver a la lista
          </Button>
        </div>
      </Card>
    );
  }
  
  const detailTitle = title || "Detalles del Cliente";
  const isEmpresaActual = clienteActual.tipo_documento === 'RUC';
  
  // Fechas ficticias para el historial de ejemplo
  const fechaRegistro = new Date();
  fechaRegistro.setMonth(fechaRegistro.getMonth() - 2);
  
  const fechaActualizacion = new Date();
  fechaActualizacion.setDate(fechaActualizacion.getDate() - 15);
  
  return (
    <>
      <Card className="shadow-lg border border-gray-100">
        <div className="mb-6 flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg mr-4">
            {isEmpresaActual ? 
              <FaBuilding className="text-xl" /> :
              <FaUser className="text-xl" />
            }
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{detailTitle}</h2>
            <p className="text-gray-500 text-sm">
              {isEmpresaActual ? 'Información empresarial' : 'Información personal del cliente'}
            </p>
          </div>
        </div>
        
        {/* Pestañas */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            <button
              className={`pb-3 px-1 flex items-center ${activeTab === 'info' ? 
                'border-b-2 border-blue-500 text-blue-600 font-medium' : 
                'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('info')}
            >
              <FaClipboardCheck className={`mr-2 ${activeTab === 'info' ? 'text-blue-500' : 'text-gray-400'}`} />
              Información Principal
            </button>
            <button
              className={`pb-3 px-1 flex items-center ${activeTab === 'history' ? 
                'border-b-2 border-blue-500 text-blue-600 font-medium' : 
                'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('history')}
            >
              <FaHistory className={`mr-2 ${activeTab === 'history' ? 'text-blue-500' : 'text-gray-400'}`} />
              Historial
            </button>
          </div>
        </div>
        
        {activeTab === 'info' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Columna de tarjeta de cliente - 2 columnas */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full transform translate-x-20 -translate-y-20"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
                  
                  <div className="flex items-center mb-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                      {isEmpresaActual ? 
                        <FaBuilding className="text-white text-xl" /> :
                        <FaUser className="text-white text-xl" />
                      }
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {isEmpresaActual ? 'Empresa' : 'Cliente Personal'}
                      </h3>
                      <p className="opacity-90 text-sm">Código: {clienteActual.id_cliente}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 mb-4">
                    <p className="text-sm opacity-80">Nombre / Razón Social</p>
                    <h3 className="text-xl font-bold mt-1">
                      {isEmpresaActual ? clienteActual.razon_social : 
                        `${clienteActual.nombres} ${clienteActual.apellidos}`}
                    </h3>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="bg-white bg-opacity-20 p-1 rounded-full">
                      <FaIdCard className="text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm opacity-80">Documento de Identidad</p>
                      <p className="font-medium">{clienteActual.tipo_documento}: {clienteActual.numero_documento}</p>
                    </div>
                  </div>
                </div>
                
                {/* Tarjeta de contacto */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" /> Información de Contacto
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaEnvelope className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Correo Electrónico</p>
                        <p className="font-medium text-gray-800">{clienteActual.correo || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPhone className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Número de Celular</p>
                        <p className="font-medium text-gray-800">{clienteActual.numero_celular || 'No especificado'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Columna de detalles - 3 columnas */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    {isEmpresaActual ? 
                      <><FaBuilding className="mr-2 text-blue-500" /> Información de la Empresa</> :
                      <><FaUser className="mr-2 text-blue-500" /> Información Personal</>
                    }
                  </h3>
                  
                  {isEmpresaActual ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Razón Social</h4>
                        <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {clienteActual.razon_social || 'No especificada'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" /> Dirección Fiscal
                        </h4>
                        <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {clienteActual.direccion_fiscal || 'No especificada'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Nombres</h4>
                        <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {clienteActual.nombres || 'No especificados'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Apellidos</h4>
                        <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {clienteActual.apellidos || 'No especificados'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaClipboardCheck className="mr-2 text-blue-500" /> Resumen del Cliente
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Tipo de Cliente</p>
                      <p className="font-medium text-gray-800 flex items-center">
                        {isEmpresaActual ? 
                          <><FaBuilding className="mr-2 text-blue-500" /> Empresa</> : 
                          <><FaUser className="mr-2 text-indigo-500" /> Persona</>
                        }
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Documento</p>
                      <p className="font-medium text-gray-800 flex items-center">
                        <FaIdCard className="mr-2 text-blue-500" />
                        {clienteActual.tipo_documento}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="font-medium text-green-600 flex items-center">
                        <FaCheck className="mr-2" /> Activo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
              <FaHistory className="mr-2 text-blue-500" /> Historial del Cliente
            </h3>
            
            <div className="relative border-l-2 border-blue-200 ml-3 pl-6 pb-2">
              {/* Registro */}
              <div className="mb-8">
                <div className="absolute -left-3 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-xs" />
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-500">
                      {fechaRegistro.toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h4 className="text-md font-medium text-gray-700">Registro del cliente</h4>
                  <p className="text-gray-600 mt-1">
                    El cliente fue registrado en el sistema con documento {clienteActual.tipo_documento}: {clienteActual.numero_documento}.
                  </p>
                </div>
              </div>
              
              {/* Última actualización */}
              <div className="mb-6">
                <div className="absolute -left-3 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                  <FaEdit className="text-white text-xs" />
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-500">
                      {fechaActualizacion.toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h4 className="text-md font-medium text-gray-700">Actualización de datos</h4>
                  <p className="text-gray-600 mt-1">
                    Se actualizó la información de contacto del cliente.
                  </p>
                </div>
              </div>
              
              {/* Punto actual */}
              <div>
                <div className="absolute -left-3 bg-indigo-500 w-6 h-6 rounded-full flex items-center justify-center">
                  <FaCheck className="text-white text-xs" />
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-indigo-500 mr-2" />
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h4 className="text-md font-medium text-gray-700">Estado Actual</h4>
                  <p className="text-gray-600 mt-1">
                    El cliente se encuentra activo en el sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end space-x-3">
          <Button 
            variant="secondary"
            className="rounded-lg flex items-center px-5"
            onClick={() => navigate('/vendedor/clientes')}
          >
            <FaArrowLeft className="mr-2" /> Volver
          </Button>
          
          <Button 
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg flex items-center px-5"
            onClick={() => setShowEditModal(true)}
          >
            <FaEdit className="mr-2" /> Editar Datos
          </Button>
        </div>
      </Card>
      
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title={`Editar ${isEmpresa ? 'Empresa' : 'Cliente'}`}
      >
        <div className="p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              {isEmpresa ? <FaBuilding className="text-blue-500" /> : <FaUserEdit className="text-blue-500" />}
            </div>
            <div>
              <h3 className="font-medium text-blue-800">
                {isEmpresa ? 'Actualizar datos de la empresa' : 'Actualizar datos del cliente'}
              </h3>
              <p className="text-sm text-blue-600">
                Modifique la información que necesite actualizar
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {isEmpresa ? (
              // Formulario para empresa
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-gray-500" /> Razón Social *
                  </label>
                  <FormInput 
                    name="razon_social" 
                    value={formData.razon_social} 
                    onChange={handleChange} 
                    required
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" /> Dirección Fiscal *
                  </label>
                  <FormInput 
                    name="direccion_fiscal" 
                    value={formData.direccion_fiscal} 
                    onChange={handleChange} 
                    required
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </>
            ) : (
              // Formulario para persona natural
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUser className="mr-2 text-gray-500" /> Nombres *
                  </label>
                  <FormInput 
                    name="nombres" 
                    value={formData.nombres} 
                    onChange={handleChange} 
                    required
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUser className="mr-2 text-gray-500" /> Apellidos *
                  </label>
                  <FormInput 
                    name="apellidos" 
                    value={formData.apellidos} 
                    onChange={handleChange} 
                    required
                    className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaEnvelope className="mr-2 text-gray-500" /> Correo Electrónico *
              </label>
              <FormInput 
                name="correo" 
                type="email"
                value={formData.correo} 
                onChange={handleChange} 
                required
                className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaPhone className="mr-2 text-gray-500" /> Número de Celular *
              </label>
                           <FormInput 
                  name="numero_celular" 
                  value={formData.numero_celular} 
                  onChange={handleChange} 
                  required
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              className="rounded-lg flex items-center px-4"
            >
              <FaTimes className="mr-2" /> Cancelar
            </Button>
            
            <Button 
              variant="primary"
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg flex items-center px-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClienteDetail;