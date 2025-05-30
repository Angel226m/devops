/*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  createUsuario, 
  updateUsuario, 
  fetchUsuarioPorId, 
  clearUsuarioError 
} from '../../../store/slices/usuarioSlice';
import { fetchUserSedes } from '../../../store/slices/authSlice';
import { NuevoUsuarioRequest, ActualizarUsuarioRequest } from '../../../../domain/entities/Usuario';

const UsuarioForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { usuarioSeleccionado, loading, error } = useSelector((state: RootState) => state.usuario);
  const { availableSedes, selectedSede } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<NuevoUsuarioRequest>({
    id_sede: selectedSede?.id_sede || null,
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    rol: 'VENDEDOR',
    nacionalidad: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    contrasena: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserSedes());

    if (isEditing) {
      dispatch(fetchUsuarioPorId(parseInt(id)));
    }

    return () => {
      dispatch(clearUsuarioError());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && usuarioSeleccionado) {
      // Si la fecha viene en formato ISO, extraer solo la parte de la fecha
      const formatearFechaParaFormulario = (fechaISO: string | undefined): string => {
        if (!fechaISO) return '';
        try {
          // Extraer solo la parte de la fecha (YYYY-MM-DD)
          return fechaISO.split('T')[0];
        } catch (error) {
          return '';
        }
      };

      setFormData({
        id_sede: usuarioSeleccionado.id_sede,
        nombres: usuarioSeleccionado.nombres,
        apellidos: usuarioSeleccionado.apellidos,
        correo: usuarioSeleccionado.correo,
        telefono: usuarioSeleccionado.telefono || '',
        direccion: usuarioSeleccionado.direccion || '',
        fecha_nacimiento: formatearFechaParaFormulario(usuarioSeleccionado.fecha_nacimiento),
        rol: usuarioSeleccionado.rol,
        nacionalidad: usuarioSeleccionado.nacionalidad || '',
        tipo_documento: usuarioSeleccionado.tipo_documento,
        numero_documento: usuarioSeleccionado.numero_documento,
        contrasena: '',  // No mostrar contraseña en edición
      });
    }
  }, [isEditing, usuarioSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Manejo específico para el id_sede cuando cambia el rol
    if (name === 'rol') {
      if (value === 'ADMIN') {
        // Para administradores, quitar la sede
        setFormData(prevState => ({
          ...prevState,
          rol: value as 'ADMIN' | 'VENDEDOR' | 'CHOFER',
          id_sede: null
        }));
        return;
      } else if (formData.id_sede === null) {
        // Para otros roles, asignar una sede por defecto si no tiene
        const defaultSede = selectedSede?.id_sede || 
                          (availableSedes && availableSedes.length > 0 ? availableSedes[0].id_sede : null);
        
        setFormData(prevState => ({
          ...prevState,
          rol: value as 'ADMIN' | 'VENDEDOR' | 'CHOFER',
          id_sede: defaultSede
        }));
        return;
      }
    }
    
    // Manejo específico para id_sede
    if (name === 'id_sede') {
      setFormData(prevState => ({
        ...prevState,
        id_sede: value === '' ? null : Number(value)
      }));
      return;
    }
    
    // Para el resto de campos, actualizamos normalmente
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Limpiar errores
    if (name === 'contrasena' || name === 'confirmPassword') {
      setPasswordError('');
    }
    setFormError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };

  const validateForm = () => {
    // Validación básica
    if (!formData.nombres || !formData.apellidos || !formData.correo) {
      setFormError('Todos los campos obligatorios deben ser completados.');
      return false;
    }

    // Validar restricción: admin sin sede o no admin con sede
    if (formData.rol === 'ADMIN' && formData.id_sede !== null) {
      setFormError('Los administradores no deben tener una sede asignada.');
      return false;
    }
    
    if (formData.rol !== 'ADMIN' && formData.id_sede === null) {
      setFormError('Los vendedores y choferes deben tener una sede asignada.');
      return false;
    }

    // Validación de contraseña solo para creación
    if (!isEditing) {
      if (!formData.contrasena) {
        setPasswordError('La contraseña es obligatoria.');
        return false;
      }
      
      if (formData.contrasena.length < 8) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres.');
        return false;
      }
      
      if (formData.contrasena !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden.');
        return false;
      }
    }

    return true;
  };

  // Función para formatear la fecha al formato que espera el backend
  const formatearFechaParaAPI = (fecha: string): string => {
    if (!fecha) return '';
    // Convertir de YYYY-MM-DD a YYYY-MM-DDT00:00:00Z
    return `${fecha}T00:00:00Z`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        // Para edición, preparamos objeto de actualización
        const updateData: ActualizarUsuarioRequest = {
          ...formData,
          // Formatear la fecha para el API
          fecha_nacimiento: formData.fecha_nacimiento ? formatearFechaParaAPI(formData.fecha_nacimiento) : ''
        };
        
        // Omitir contraseña si está vacía
        if (!updateData.contrasena) {
          delete updateData.contrasena;
        }

        await dispatch(updateUsuario({ id: parseInt(id), usuario: updateData })).unwrap();
      } else {
        // Para creación, enviamos el formulario completo
        await dispatch(createUsuario({
          ...formData,
          // Formatear la fecha para el API
          fecha_nacimiento: formatearFechaParaAPI(formData.fecha_nacimiento)
        })).unwrap();
      }
      
      navigate('/admin/usuarios');
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      setFormError(err.message || 'Error al guardar usuario. Verifica los datos e intenta nuevamente.');
    }
  };

  if (loading && isEditing) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {formError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos personales *//*}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Datos Personales</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="CE">Carnet de Extranjería</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad
              </label>
              <input
                type="text"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Datos de contacto y rol *//*}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Datos de Contacto y Rol</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ADMIN">Administrador</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="CHOFER">Chofer</option>
              </select>
              {formData.rol === 'ADMIN' ? (
                <p className="text-sm text-gray-500 mt-1">
                  Los administradores no tendrán sede asignada
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Los {formData.rol === 'VENDEDOR' ? 'vendedores' : 'choferes'} deben tener una sede asignada
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede {formData.rol !== 'ADMIN' ? '*' : ''}
              </label>
              <select
                name="id_sede"
                value={formData.id_sede === null ? '' : formData.id_sede}
                onChange={handleChange}
                required={formData.rol !== 'ADMIN'}
                disabled={formData.rol === 'ADMIN'}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  formData.rol === 'ADMIN' ? 'bg-gray-100' : ''
                }`}
              >
                <option value="">Seleccionar sede</option>
                {availableSedes.map(sede => (
                  <option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña - Solo requerida en creación *//*}
            {(!isEditing || (isEditing && formData.contrasena)) && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Nueva Contraseña' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required={!isEditing}
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required={!isEditing && !!formData.contrasena}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}

            {passwordError && (
              <div className="mb-4 text-red-500 text-sm">
                {passwordError}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;*/
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  createUsuario, 
  updateUsuario, 
  fetchUsuarioPorId, 
  clearUsuarioError,
  fetchUsuarioIdiomas
} from '../../../store/slices/usuarioSlice';
import { fetchUserSedes } from '../../../store/slices/authSlice';
import { fetchIdiomas } from '../../../store/slices/idiomaSlice';
import { NuevoUsuarioRequest, ActualizarUsuarioRequest } from '../../../../domain/entities/Usuario';

const UsuarioForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { usuarioSeleccionado, usuarioIdiomas, loading, error } = useSelector((state: RootState) => state.usuario);
  const { availableSedes, selectedSede } = useSelector((state: RootState) => state.auth);
  const { idiomas } = useSelector((state: RootState) => state.idioma);

  const [formData, setFormData] = useState<NuevoUsuarioRequest>({
    id_sede: selectedSede?.id_sede || null,
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    rol: 'VENDEDOR',
    nacionalidad: '',
    tipo_documento: 'DNI',
    numero_documento: '',
    contrasena: '',
    idiomas_ids: [], // NUEVO CAMPO
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserSedes());
    dispatch(fetchIdiomas()); // CARGAR IDIOMAS DISPONIBLES

    if (isEditing) {
      dispatch(fetchUsuarioPorId(parseInt(id)));
      dispatch(fetchUsuarioIdiomas(parseInt(id))); // CARGAR IDIOMAS DEL USUARIO
    }

    return () => {
      dispatch(clearUsuarioError());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && usuarioSeleccionado) {
      const formatearFechaParaFormulario = (fechaISO: string | undefined): string => {
        if (!fechaISO) return '';
        try {
          return fechaISO.split('T')[0];
        } catch (error) {
          return '';
        }
      };

      setFormData({
        id_sede: usuarioSeleccionado.id_sede,
        nombres: usuarioSeleccionado.nombres,
        apellidos: usuarioSeleccionado.apellidos,
        correo: usuarioSeleccionado.correo,
        telefono: usuarioSeleccionado.telefono || '',
        direccion: usuarioSeleccionado.direccion || '',
        fecha_nacimiento: formatearFechaParaFormulario(usuarioSeleccionado.fecha_nacimiento),
        rol: usuarioSeleccionado.rol,
        nacionalidad: usuarioSeleccionado.nacionalidad || '',
        tipo_documento: usuarioSeleccionado.tipo_documento,
        numero_documento: usuarioSeleccionado.numero_documento,
        contrasena: '',
        idiomas_ids: usuarioIdiomas.map(ui => ui.id_idioma), // CARGAR IDIOMAS DEL USUARIO
      });
    }
  }, [isEditing, usuarioSeleccionado, usuarioIdiomas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'rol') {
      if (value === 'ADMIN') {
        setFormData(prevState => ({
          ...prevState,
          rol: value as 'ADMIN' | 'VENDEDOR' | 'CHOFER',
          id_sede: null
        }));
        return;
      } else if (formData.id_sede === null) {
        const defaultSede = selectedSede?.id_sede || 
                          (availableSedes && availableSedes.length > 0 ? availableSedes[0].id_sede : null);
        
        setFormData(prevState => ({
          ...prevState,
          rol: value as 'ADMIN' | 'VENDEDOR' | 'CHOFER',
          id_sede: defaultSede
        }));
        return;
      }
    }
    
    if (name === 'id_sede') {
      setFormData(prevState => ({
        ...prevState,
        id_sede: value === '' ? null : Number(value)
      }));
      return;
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'contrasena' || name === 'confirmPassword') {
      setPasswordError('');
    }
    setFormError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };

  // NUEVA FUNCIÓN PARA MANEJAR SELECCIÓN DE IDIOMAS
  const handleIdiomaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idiomaId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData(prevState => ({
      ...prevState,
      idiomas_ids: isChecked 
        ? [...(prevState.idiomas_ids || []), idiomaId]
        : (prevState.idiomas_ids || []).filter(id => id !== idiomaId)
    }));
  };

  const validateForm = () => {
    if (!formData.nombres || !formData.apellidos || !formData.correo) {
      setFormError('Todos los campos obligatorios deben ser completados.');
      return false;
    }

    if (formData.rol === 'ADMIN' && formData.id_sede !== null) {
      setFormError('Los administradores no deben tener una sede asignada.');
      return false;
    }
    
    if (formData.rol !== 'ADMIN' && formData.id_sede === null) {
      setFormError('Los vendedores y choferes deben tener una sede asignada.');
      return false;
    }

    if (!isEditing) {
      if (!formData.contrasena) {
        setPasswordError('La contraseña es obligatoria.');
        return false;
      }
      
      if (formData.contrasena.length < 8) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres.');
        return false;
      }
      
      if (formData.contrasena !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden.');
        return false;
      }
    }

    return true;
  };

  const formatearFechaParaAPI = (fecha: string): string => {
    if (!fecha) return '';
    return `${fecha}T00:00:00Z`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        const updateData: ActualizarUsuarioRequest = {
          ...formData,
          fecha_nacimiento: formData.fecha_nacimiento ? formatearFechaParaAPI(formData.fecha_nacimiento) : ''
        };
        
        if (!updateData.contrasena) {
          delete updateData.contrasena;
        }

        await dispatch(updateUsuario({ id: parseInt(id), usuario: updateData })).unwrap();
      } else {
        await dispatch(createUsuario({
          ...formData,
          fecha_nacimiento: formatearFechaParaAPI(formData.fecha_nacimiento)
        })).unwrap();
      }
      
      navigate('/admin/usuarios');
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      setFormError(err.message || 'Error al guardar usuario. Verifica los datos e intenta nuevamente.');
    }
  };

  if (loading && isEditing) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {formError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos personales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Datos Personales</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento *
              </label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="CE">Carnet de Extranjería</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad
              </label>
              <input
                type="text"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Datos de contacto y rol */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Datos de Contacto y Rol</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ADMIN">Administrador</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="CHOFER">Chofer</option>
              </select>
              {formData.rol === 'ADMIN' ? (
                <p className="text-sm text-gray-500 mt-1">
                  Los administradores no tendrán sede asignada
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  Los {formData.rol === 'VENDEDOR' ? 'vendedores' : 'choferes'} deben tener una sede asignada
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede {formData.rol !== 'ADMIN' ? '*' : ''}
              </label>
              <select
                name="id_sede"
                value={formData.id_sede === null ? '' : formData.id_sede}
                onChange={handleChange}
                required={formData.rol !== 'ADMIN'}
                disabled={formData.rol === 'ADMIN'}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  formData.rol === 'ADMIN' ? 'bg-gray-100' : ''
                }`}
              >
                <option value="">Seleccionar sede</option>
                {availableSedes.map(sede => (
                  <option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña - Solo requerida en creación */}
            {(!isEditing || (isEditing && formData.contrasena)) && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Nueva Contraseña' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required={!isEditing}
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEditing ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required={!isEditing && !!formData.contrasena}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}

            {passwordError && (
              <div className="mb-4 text-red-500 text-sm">
                {passwordError}
              </div>
            )}
          </div>
        </div>

        {/* NUEVA SECCIÓN: IDIOMAS */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Idiomas que maneja</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {idiomas.map(idioma => (
              <label key={idioma.id_idioma} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={idioma.id_idioma}
                  checked={(formData.idiomas_ids || []).includes(idioma.id_idioma)}
                  onChange={handleIdiomaChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">{idioma.nombre}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Selecciona los idiomas que puede manejar este usuario
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;