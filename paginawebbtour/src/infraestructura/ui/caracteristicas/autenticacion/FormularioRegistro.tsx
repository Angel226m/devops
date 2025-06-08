 
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Boton from '../../componentes/comunes/Boton';
import Entrada from '../../componentes/comunes/Entrada';

const FormularioRegistro = () => {
  const { t } = useTranslation();
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = t('validacion.requerido');
    }
    
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = t('validacion.requerido');
    }
    
    if (!formData.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = t('validacion.requerido');
    } else if (formData.tipoDocumento === 'DNI' && !/^\d{8}$/.test(formData.numeroDocumento)) {
      nuevosErrores.numeroDocumento = t('validacion.dniInvalido');
    }
    
    if (!formData.correo.trim()) {
      nuevosErrores.correo = t('validacion.requerido');
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = t('validacion.correoInvalido');
    }
    
    if (!formData.contrasena) {
      nuevosErrores.contrasena = t('validacion.requerido');
    } else if (formData.contrasena.length < 6) {
      nuevosErrores.contrasena = t('validacion.contrasenaCorta');
    }
    
    if (formData.contrasena !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = t('validacion.contrasenaNoCoincide');
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setCargando(true);
    
    try {
      // En un caso real, aquí se haría la petición a la API de registro
      console.log('Enviando datos de registro:', formData);
      
      // Simulamos una petición
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirigir o mostrar mensaje de éxito
      alert(t('registro.exitoso'));
      
    } catch (error) {
      console.error('Error al registrar:', error);
      alert(t('registro.error'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Entrada
              label={t('registro.nombres')}
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              error={errores.nombres}
              required
            />
          </div>
          <div>
            <Entrada
              label={t('registro.apellidos')}
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={errores.apellidos}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('registro.tipoDocumento')}
            </label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            >
              <option value="DNI">DNI</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="CE">Carné de Extranjería</option>
            </select>
          </div>
          <div>
            <Entrada
              label={t('registro.numeroDocumento')}
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              error={errores.numeroDocumento}
              required
            />
          </div>
        </div>

        <Entrada
          label={t('registro.correo')}
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          error={errores.correo}
          required
        />

        <Entrada
          label={t('registro.telefono')}
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          error={errores.telefono}
        />

        <Entrada
          label={t('registro.contrasena')}
          type="password"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          error={errores.contrasena}
          required
        />

        <Entrada
          label={t('registro.confirmarContrasena')}
          type="password"
          name="confirmarContrasena"
          value={formData.confirmarContrasena}
          onChange={handleChange}
          error={errores.confirmarContrasena}
          required
        />

        <div className="flex items-center">
          <input
            id="terminos"
            name="terminos"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terminos" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {t('registro.aceptoTerminos')} <Link to="/terminos" className="text-primary-600 hover:text-primary-500">{t('registro.terminos')}</Link>
          </label>
        </div>

        <Boton
          type="submit"
          texto={t('registro.crearCuenta')}
          variante="primary"
          tamano="lg"
          ancho="full"
          cargando={cargando}
        />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('registro.yaTienesCuenta')}{' '}
            <Link to="/ingresar" className="font-medium text-primary-600 hover:text-primary-500">
              {t('registro.iniciarSesion')}
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioRegistro;