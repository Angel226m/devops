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
          
          {/* Campos comunes */}
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

export default ClienteForm;