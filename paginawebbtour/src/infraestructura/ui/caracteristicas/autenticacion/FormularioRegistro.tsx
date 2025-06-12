 




import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { registrarCliente } from '../../../store/slices/sliceAutenticacion';
import { NuevoClienteRequest } from '../../../../dominio/entidades/Cliente';
import Boton from '../../componentes/comunes/Boton';
import Entrada from '../../componentes/comunes/Entrada';
import Alerta from '../../componentes/comunes/Alerta';

const FormularioRegistro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cargando, error } = useSelector((state: RootState) => state.autenticacion);
  
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    numero_celular: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errorTerminos, setErrorTerminos] = useState('');

  useEffect(() => {
    // Limpiar el estado cuando el componente se monta
    setRegistroExitoso(false);
    setErrores({});
    setErrorTerminos('');
    setErrorGeneral(null);
  }, []);

  // Actualizar el error general cuando cambia el error en el estado de Redux
  useEffect(() => {
    if (error) {
      setErrorGeneral(error);
    }
  }, [error]);

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = "El nombre es obligatorio";
    }
    
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios";
    }
    
    if (!formData.numero_documento.trim()) {
      nuevosErrores.numero_documento = "El número de documento es obligatorio";
    } else if (formData.tipo_documento === 'DNI' && !/^\d{8}$/.test(formData.numero_documento)) {
      nuevosErrores.numero_documento = "El DNI debe tener 8 dígitos numéricos";
    }
    
    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = "Ingrese un correo electrónico válido";
    }
    
    if (!formData.numero_celular.trim()) {
      nuevosErrores.numero_celular = "El número de celular es obligatorio";
    } else if (!/^\d{9}$/.test(formData.numero_celular)) {
      nuevosErrores.numero_celular = "El número de celular debe tener 9 dígitos";
    }
    
    if (!formData.contrasena) {
      nuevosErrores.contrasena = "La contraseña es obligatoria";
    } else if (formData.contrasena.length < 6) {
      nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.contrasena !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }
    
    // Validar términos y condiciones
    if (!aceptaTerminos) {
      setErrorTerminos("Debe aceptar los términos y condiciones para continuar");
    } else {
      setErrorTerminos('');
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0 && aceptaTerminos;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Limpiar error general al cambiar cualquier campo
    if (errorGeneral) {
      setErrorGeneral(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar el error general antes de validar
    setErrorGeneral(null);
    
    if (!validarFormulario()) {
      return;
    }
    
    try {
      const clienteNuevo: NuevoClienteRequest = {
        tipo_documento: formData.tipo_documento,
        numero_documento: formData.numero_documento,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        numero_celular: formData.numero_celular,
        contrasena: formData.contrasena
      };

      const resultado = await dispatch(registrarCliente(clienteNuevo)).unwrap();
      
      if (resultado.exitoso) {
        setRegistroExitoso(true);
        
        // Si se inició sesión automáticamente, redirigir a la página principal
        if (resultado.respuestaLogin) {
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          // Si solo se registró pero no se inició sesión, redirigir a la página de ingreso
          setTimeout(() => {
            navigate('/ingresar');
          }, 2000);
        }
      } else {
        setErrorGeneral("No se pudo completar el registro. Por favor, intente nuevamente.");
      }
    } catch (error: any) {
      console.error('Error al registrar:', error);
      
      // Detectar mensajes específicos de error
      let mensajeError = error.message || "Ocurrió un error al registrar. Por favor, intente nuevamente.";
      
      if (mensajeError.toLowerCase().includes("correo")) {
        setErrores(prev => ({
          ...prev,
          correo: mensajeError
        }));
        setErrorGeneral("El correo electrónico proporcionado ya está registrado o no es válido.");
      } else if (mensajeError.toLowerCase().includes("documento")) {
        setErrores(prev => ({
          ...prev,
          numero_documento: mensajeError
        }));
        setErrorGeneral("El número de documento proporcionado ya está registrado o no es válido.");
      } else if (mensajeError.toLowerCase().includes("celular") || mensajeError.toLowerCase().includes("teléfono")) {
        setErrores(prev => ({
          ...prev,
          numero_celular: mensajeError
        }));
        setErrorGeneral("El número de celular proporcionado ya está registrado o no es válido.");
      } else if (mensajeError.toLowerCase().includes("contraseña")) {
        setErrores(prev => ({
          ...prev,
          contrasena: mensajeError
        }));
        setErrorGeneral("La contraseña no cumple con los requisitos de seguridad.");
      } else {
        setErrorGeneral(mensajeError);
      }
    }
  };

  if (registroExitoso) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-auto"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">¡Registro exitoso!</h2>
          <p className="mt-2 text-gray-600">Su cuenta ha sido creada correctamente. Redirigiendo...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Crear una Cuenta
      </h2>
      
      {errorGeneral && (
        <Alerta 
          tipo="error" 
          mensaje={errorGeneral}
          className="mb-4" 
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Entrada
            label="Nombres"
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            error={errores.nombres}
            placeholder="Ingrese sus nombres"
            required
          />
          
          <Entrada
            label="Apellidos"
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            error={errores.apellidos}
            placeholder="Ingrese sus apellidos"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento
            </label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-colors"
            >
              <option value="DNI">DNI</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </div>
          
          <Entrada
            label="Número de Documento"
            type="text"
            name="numero_documento"
            value={formData.numero_documento}
            onChange={handleChange}
            error={errores.numero_documento}
            placeholder="Ingrese su número de documento"
            required
          />
        </div>

        <Entrada
          label="Correo Electrónico"
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          error={errores.correo}
          placeholder="correo@ejemplo.com"
          required
        />

        <Entrada
          label="Número de Celular"
          type="tel"
          name="numero_celular"
          value={formData.numero_celular}
          onChange={handleChange}
          error={errores.numero_celular}
          placeholder="9XXXXXXXX"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Entrada
            label="Contraseña"
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            error={errores.contrasena}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <Entrada
            label="Confirmar Contraseña"
            type="password"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            error={errores.confirmarContrasena}
            placeholder="Repita su contraseña"
            required
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terminos"
              name="terminos"
              type="checkbox"
              checked={aceptaTerminos}
              onChange={() => setAceptaTerminos(!aceptaTerminos)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terminos" className="font-medium text-gray-700">
              Acepto los <Link to="/terminos" className="text-blue-600 hover:text-blue-500">Términos y Condiciones</Link>
            </label>
            {errorTerminos && (
              <p className="mt-1 text-sm text-red-600">{errorTerminos}</p>
            )}
          </div>
        </div>

        <Boton
          type="submit"
          texto="Crear Cuenta"
          variante="primary"
          tamano="lg"
          ancho="full"
          cargando={cargando}
          className="mt-6"
        />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/ingresar" className="font-medium text-blue-600 hover:text-blue-500">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioRegistro;