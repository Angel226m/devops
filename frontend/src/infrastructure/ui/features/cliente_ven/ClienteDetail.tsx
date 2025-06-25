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

export default ClienteDetail;