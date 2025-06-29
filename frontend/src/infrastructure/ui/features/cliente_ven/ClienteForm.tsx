/*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  crearCliente, 
  fetchClientePorId, 
  actualizarCliente, 
  clearErrors 
} from '../../../store/slices/clienteSlice';
import { 
  NuevoClienteRequest, 
  ActualizarClienteRequest,
  tiposDocumento
} from '../../../../domain/entities/Cliente';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Card from '../../components/Card';
import { toast } from 'react-toastify';

interface ClienteFormProps {
  title?: string;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clienteActual, loading, error, success } = useSelector((state: RootState) => state.cliente);
  
  const [formData, setFormData] = useState<NuevoClienteRequest | ActualizarClienteRequest>({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    razon_social: '',
    direccion_fiscal: '',
    correo: '',
    numero_celular: ''
  });
  
  const [isEmpresa, setIsEmpresa] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchClientePorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (clienteActual && id) {
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
      
      setIsEmpresa(clienteActual.tipo_documento === 'RUC');
    }
  }, [clienteActual, id]);
  
  useEffect(() => {
    if (success) {
      toast.success(id ? 'Cliente actualizado con éxito' : 'Cliente creado con éxito');
      navigate('/vendedor/clientes');
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'tipo_documento') {
      setIsEmpresa(value === 'RUC');
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones condicionales
    if (isEmpresa) {
      if (!formData.razon_social || !formData.direccion_fiscal) {
        toast.error('La razón social y dirección fiscal son obligatorias para empresas');
        return;
      }
    } else {
      if (!formData.nombres || !formData.apellidos) {
        toast.error('Los nombres y apellidos son obligatorios para personas naturales');
        return;
      }
    }
    
    // Preparar datos para envío
    const datosParaEnviar = { ...formData };
    
    // Limpiar campos innecesarios según el tipo de documento
    if (isEmpresa) {
      datosParaEnviar.nombres = '';
      datosParaEnviar.apellidos = '';
    } else {
      datosParaEnviar.razon_social = '';
      datosParaEnviar.direccion_fiscal = '';
    }
    
    if (id) {
      dispatch(actualizarCliente({ 
        id: parseInt(id), 
        cliente: datosParaEnviar as ActualizarClienteRequest 
      }));
    } else {
      dispatch(crearCliente(datosParaEnviar as NuevoClienteRequest));
    }
  };
  
  const formTitle = title || (id ? 'Editar Cliente' : 'Nuevo Cliente');
  
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{formTitle}</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento *
            </label>
            <Select 
              name="tipo_documento" 
              value={formData.tipo_documento} 
              onChange={handleChange}
            >
              {tiposDocumento.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          
          <FormInput 
            label="Número de Documento" 
            name="numero_documento" 
            value={formData.numero_documento} 
            onChange={handleChange} 
            required
          />
          
          {isEmpresa ? (
            // Campos para empresas
            <>
              <FormInput 
                label="Razón Social" 
                name="razon_social" 
                value={formData.razon_social} 
                onChange={handleChange} 
                required={isEmpresa}
              />
              
              <div className="md:col-span-2">
                <FormInput 
                  label="Dirección Fiscal" 
                  name="direccion_fiscal" 
                  value={formData.direccion_fiscal} 
                  onChange={handleChange} 
                  required={isEmpresa}
                />
              </div>
            </>
          ) : (
            // Campos para personas naturales
            <>
              <FormInput 
                label="Nombres" 
                name="nombres" 
                value={formData.nombres} 
                onChange={handleChange} 
                required={!isEmpresa}
              />
              
              <FormInput 
                label="Apellidos" 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleChange} 
                required={!isEmpresa}
              />
            </>
          )}
          
          {/* Campos comunes *//*}
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
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/vendedor/clientes')}
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {id ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ClienteForm;*/
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  crearCliente, 
  fetchClientePorId, 
  actualizarCliente, 
  clearErrors 
} from '../../../store/slices/clienteSlice';
import { 
  NuevoClienteRequest, 
  ActualizarClienteRequest,
  tiposDocumento
} from '../../../../domain/entities/Cliente';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Card from '../../components/Card';
import { toast } from 'react-toastify';
import { 
  FaIdCard, FaUser, FaBuilding, FaEnvelope, FaPhone, 
  FaSave, FaTimes, FaArrowLeft, FaUserEdit, FaUserPlus 
} from 'react-icons/fa';

interface ClienteFormProps {
  title?: string;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { clienteActual, loading, error, success } = useSelector((state: RootState) => state.cliente);
  
  const [formData, setFormData] = useState<NuevoClienteRequest | ActualizarClienteRequest>({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    razon_social: '',
    direccion_fiscal: '',
    correo: '',
    numero_celular: ''
  });
  
  const [isEmpresa, setIsEmpresa] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (id) {
      dispatch(fetchClientePorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (clienteActual && id) {
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
      
      setIsEmpresa(clienteActual.tipo_documento === 'RUC');
    }
  }, [clienteActual, id]);
  
  useEffect(() => {
    if (success) {
      toast.success(id ? 'Cliente actualizado con éxito' : 'Cliente creado con éxito');
      navigate('/vendedor/clientes');
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate, id]);
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.tipo_documento) {
      errors.tipo_documento = 'El tipo de documento es obligatorio';
    }
    
    if (!formData.numero_documento) {
      errors.numero_documento = 'El número de documento es obligatorio';
    } else if (formData.tipo_documento === 'DNI' && !/^\d{8}$/.test(formData.numero_documento)) {
      errors.numero_documento = 'El DNI debe tener 8 dígitos numéricos';
    } else if (formData.tipo_documento === 'RUC' && !/^\d{11}$/.test(formData.numero_documento)) {
      errors.numero_documento = 'El RUC debe tener 11 dígitos numéricos';
    }
    
    if (isEmpresa) {
      if (!formData.razon_social) {
        errors.razon_social = 'La razón social es obligatoria';
      }
      if (!formData.direccion_fiscal) {
        errors.direccion_fiscal = 'La dirección fiscal es obligatoria';
      }
    } else {
      if (!formData.nombres) {
        errors.nombres = 'Los nombres son obligatorios';
      }
      if (!formData.apellidos) {
        errors.apellidos = 'Los apellidos son obligatorios';
      }
    }
    
    if (!formData.correo) {
      errors.correo = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'Formato de correo electrónico inválido';
    }
    
    if (!formData.numero_celular) {
      errors.numero_celular = 'El número de celular es obligatorio';
    } else if (!/^\d{9}$/.test(formData.numero_celular)) {
      errors.numero_celular = 'El número de celular debe tener 9 dígitos';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'tipo_documento') {
      setIsEmpresa(value === 'RUC');
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el error específico cuando el usuario corrige un campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }
    
    // Preparar datos para envío
    const datosParaEnviar = { ...formData };
    
    // Limpiar campos innecesarios según el tipo de documento
    if (isEmpresa) {
      datosParaEnviar.nombres = '';
      datosParaEnviar.apellidos = '';
    } else {
      datosParaEnviar.razon_social = '';
      datosParaEnviar.direccion_fiscal = '';
    }
    
    if (id) {
      dispatch(actualizarCliente({ 
        id: parseInt(id), 
        cliente: datosParaEnviar as ActualizarClienteRequest 
      }));
    } else {
      dispatch(crearCliente(datosParaEnviar as NuevoClienteRequest));
    }
  };
  
  const formTitle = title || (id ? 'Editar Cliente' : 'Nuevo Cliente');
  
  return (
    <Card className="shadow-lg border border-gray-100">
      <div className="mb-6 flex items-center">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg mr-4">
          {id ? <FaUserEdit className="text-xl" /> : <FaUserPlus className="text-xl" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
          <p className="text-gray-500 text-sm">
            {id ? 'Actualice la información del cliente' : 'Complete el formulario para registrar un nuevo cliente'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-start">
          <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
            <FaIdCard className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">Información de Identificación</h3>
            <p className="text-sm">Seleccione el tipo de documento e ingrese los datos según corresponda</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaIdCard className="mr-2 text-gray-500" /> Tipo de Documento *
              </label>
              <Select 
                name="tipo_documento" 
                value={formData.tipo_documento} 
                onChange={handleChange}
                className={`w-full rounded-lg ${validationErrors.tipo_documento ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
              >
                {tiposDocumento.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {validationErrors.tipo_documento && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.tipo_documento}</p>
              )}
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaIdCard className="mr-2 text-gray-500" /> Número de Documento *
              </label>
              <FormInput 
                name="numero_documento" 
                value={formData.numero_documento} 
                onChange={handleChange}
                placeholder={isEmpresa ? "Ingrese el RUC" : "Ingrese el número de DNI"}
                className={`rounded-lg ${validationErrors.numero_documento ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
              />
              {validationErrors.numero_documento && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.numero_documento}</p>
              )}
            </div>
          </div>
        </div>
        
        {isEmpresa ? (
          // Campos para empresas
          <div className="mt-8">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-start">
              <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                <FaBuilding className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Información de la Empresa</h3>
                <p className="text-sm">Ingrese los datos de la empresa</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-gray-500" /> Razón Social *
                  </label>
                  <FormInput 
                    name="razon_social" 
                    value={formData.razon_social} 
                    onChange={handleChange}
                    placeholder="Ingrese la razón social de la empresa" 
                    className={`rounded-lg ${validationErrors.razon_social ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                  />
                  {validationErrors.razon_social && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.razon_social}</p>
                  )}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-gray-500" /> Dirección Fiscal *
                  </label>
                  <FormInput 
                    name="direccion_fiscal" 
                    value={formData.direccion_fiscal} 
                    onChange={handleChange}
                    placeholder="Ingrese la dirección fiscal completa"
                    className={`rounded-lg ${validationErrors.direccion_fiscal ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                  />
                  {validationErrors.direccion_fiscal && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.direccion_fiscal}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Campos para personas naturales
          <div className="mt-8">
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-start">
              <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                <FaUser className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Datos Personales</h3>
                <p className="text-sm">Ingrese los datos personales del cliente</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUser className="mr-2 text-gray-500" /> Nombres *
                  </label>
                  <FormInput 
                    name="nombres" 
                    value={formData.nombres} 
                    onChange={handleChange}
                    placeholder="Ingrese los nombres" 
                    className={`rounded-lg ${validationErrors.nombres ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                  />
                  {validationErrors.nombres && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nombres}</p>
                  )}
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaUser className="mr-2 text-gray-500" /> Apellidos *
                  </label>
                  <FormInput 
                    name="apellidos" 
                    value={formData.apellidos} 
                    onChange={handleChange}
                    placeholder="Ingrese los apellidos" 
                    className={`rounded-lg ${validationErrors.apellidos ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                  />
                  {validationErrors.apellidos && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.apellidos}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Información de contacto */}
        <div className="mt-8">
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
              <FaEnvelope className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Información de Contacto</h3>
              <p className="text-sm">Ingrese los datos de contacto del cliente</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" /> Correo Electrónico *
                </label>
                <FormInput 
                  name="correo" 
                  type="email"
                  value={formData.correo} 
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com" 
                  className={`rounded-lg ${validationErrors.correo ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                {validationErrors.correo && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.correo}</p>
                )}
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" /> Número de Celular *
                </label>
                <FormInput 
                  name="numero_celular" 
                  value={formData.numero_celular} 
                  onChange={handleChange}
                  placeholder="Ejemplo: 987654321"
                  className={`rounded-lg ${validationErrors.numero_celular ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                {validationErrors.numero_celular && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.numero_celular}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="secondary"
            className="flex items-center rounded-lg px-6"
            onClick={() => navigate('/vendedor/clientes')}
          >
            <FaArrowLeft className="mr-2" /> Cancelar
          </Button>
          
          <Button 
            type="submit"
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center rounded-lg px-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                {id ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> {id ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ClienteForm;