 /*


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchUsuarioPorId, deleteUsuario, clearUsuarioSeleccionado } from '../../../store/slices/usuarioSlice';
import { FiEdit, FiTrash2, FiArrowLeft, FiGlobe, FiPlus } from 'react-icons/fi';
import { fetchUserSedes } from '../../../store/slices/authSlice';

// Interfaz para los idiomas del usuario
interface IdiomaUsuario {
  id_idioma: number;
  nombre: string;
  codigo: string;
  nivel?: string;
  fecha_asignacion?: string;
}

const UsuarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { usuarioSeleccionado, loading, error } = useSelector((state: RootState) => state.usuario);
  const { availableSedes } = useSelector((state: RootState) => state.auth);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idiomasUsuario, setIdiomasUsuario] = useState<IdiomaUsuario[]>([]);
  const [loadingIdiomas, setLoadingIdiomas] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUsuarioPorId(parseInt(id)));
      dispatch(fetchUserSedes());
      fetchIdiomasUsuario(parseInt(id));
    }
    
    return () => {
      dispatch(clearUsuarioSeleccionado());
    };
  }, [dispatch, id]);

  // Función para obtener los idiomas del usuario
  const fetchIdiomasUsuario = async (userId: number) => {
    setLoadingIdiomas(true);
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await api.get(`/admin/usuarios/${userId}/idiomas`);
      // setIdiomasUsuario(response.data);
      
      // Por ahora, datos de ejemplo mientras implementas la llamada real:
      setIdiomasUsuario([
        { id_idioma: 1, nombre: 'Español', codigo: 'es', nivel: 'Nativo' },
        { id_idioma: 2, nombre: 'Inglés', codigo: 'en', nivel: 'Intermedio' },
      ]);
    } catch (error) {
      console.error('Error al cargar idiomas del usuario:', error);
    } finally {
      setLoadingIdiomas(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteUsuario(parseInt(id))).unwrap();
        navigate('/admin/usuarios');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  // Obtener nombre de sede
  const getNombreSede = (id_sede: number | null) => {
    if (!id_sede) return 'Sin sede asignada';
    const sede = availableSedes.find(sede => sede.id_sede === id_sede);
    return sede ? sede.nombre : `Sede ${id_sede}`;
  };

  // Formatear fecha
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return String(dateString);
    }
  };

  // Obtener color de badge para el nivel de idioma
  const getNivelColor = (nivel: string | undefined) => {
    switch (nivel?.toLowerCase()) {
      case 'nativo':
        return 'bg-green-100 text-green-800';
      case 'avanzado':
        return 'bg-blue-100 text-blue-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'básico':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <Link to="/admin/usuarios" className="mt-2 inline-block text-red-700 underline">
          Volver a la lista de usuarios
        </Link>
      </div>
    );
  }

  if (!usuarioSeleccionado) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>No se encontró el usuario solicitado.</p>
        <Link to="/admin/usuarios" className="mt-2 inline-block text-yellow-700 underline">
          Volver a la lista de usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            to="/admin/usuarios" 
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold">Detalle de Usuario</h2>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/admin/usuarios/${id}/editar`}
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            <FiEdit className="mr-2" />
            Editar
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FiTrash2 className="mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal *//*}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información Personal</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Nombre Completo</div>
              <div className="text-base">
                {usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Tipo de Documento</div>
              <div className="text-base">{usuarioSeleccionado.tipo_documento}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Número de Documento</div>
              <div className="text-base">{usuarioSeleccionado.numero_documento}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Nacimiento</div>
              <div className="text-base">{formatDate(usuarioSeleccionado.fecha_nacimiento)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Nacionalidad</div>
              <div className="text-base">{usuarioSeleccionado.nacionalidad || 'No especificada'}</div>
            </div>
          </div>
        </div>
        
        {/* Información de Contacto *//*}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información de Contacto</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Correo Electrónico</div>
              <div className="text-base">{usuarioSeleccionado.correo}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Teléfono</div>
              <div className="text-base">{usuarioSeleccionado.telefono || 'No especificado'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Dirección</div>
              <div className="text-base">{usuarioSeleccionado.direccion || 'No especificada'}</div>
            </div>
          </div>
        </div>
        
        {/* Información Laboral *//*}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información del Sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500">Rol</div>
              <div className="text-base">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  usuarioSeleccionado.rol === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : usuarioSeleccionado.rol === 'VENDEDOR' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  {usuarioSeleccionado.rol === 'ADMIN' 
                    ? 'Administrador' 
                    : usuarioSeleccionado.rol === 'VENDEDOR' 
                      ? 'Vendedor' 
                      : 'Chofer'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Sede Asignada</div>
              <div className="text-base">
                {usuarioSeleccionado.id_sede 
                  ? getNombreSede(usuarioSeleccionado.id_sede)
                  : <span className="text-gray-400 italic">Sin sede asignada</span>}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Registro</div>
              <div className="text-base">
                {formatDate(usuarioSeleccionado.fecha_registro)}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Idiomas *//*}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
              <FiGlobe className="mr-2" />
              Idiomas
            </h3>
            <Link
              to={`/admin/usuarios/${id}/idiomas`}
              className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
            >
              <FiPlus className="mr-1" size={14} />
              Gestionar
            </Link>
          </div>
          
          {loadingIdiomas ? (
            <div className="flex justify-center py-4">
              <div className="text-gray-500">Cargando idiomas...</div>
            </div>
          ) : idiomasUsuario.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {idiomasUsuario.map((idioma) => (
                <div key={idioma.id_idioma} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{idioma.nombre}</div>
                      <div className="text-sm text-gray-500">Código: {idioma.codigo}</div>
                    </div>
                    {idioma.nivel && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNivelColor(idioma.nivel)}`}>
                        {idioma.nivel}
                      </span>
                    )}
                  </div>
                  {idioma.fecha_asignacion && (
                    <div className="text-xs text-gray-400 mt-2">
                      Asignado: {formatDate(idioma.fecha_asignacion)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiGlobe size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay idiomas asignados a este usuario</p>
              <Link
                to={`/admin/usuarios/${id}/idiomas`}
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                <FiPlus className="mr-2" size={16} />
                Asignar primer idioma
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación *//*}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Está seguro de que desea eliminar al usuario <span className="font-semibold">{usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}</span>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioDetail;*/

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchUsuarioPorId, deleteUsuario, clearUsuarioSeleccionado } from '../../../store/slices/usuarioSlice';
import { FiEdit, FiTrash2, FiArrowLeft, FiGlobe, FiPlus } from 'react-icons/fi';
import { fetchUserSedes } from '../../../store/slices/authSlice';

// Interfaz para los idiomas del usuario
interface IdiomaUsuario {
  id_idioma: number;
  nombre: string;
  codigo: string;
  nivel?: string;
  fecha_asignacion?: string;
}

const UsuarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { usuarioSeleccionado, loading, error } = useSelector((state: RootState) => state.usuario);
  const { availableSedes } = useSelector((state: RootState) => state.auth);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idiomasUsuario, setIdiomasUsuario] = useState<IdiomaUsuario[]>([]);
  const [loadingIdiomas, setLoadingIdiomas] = useState(false);
  
  // Referencias para prevenir efectos múltiples
  const dataFetchedRef = useRef<{
    usuario: boolean;
    sedes: boolean;
    idiomas: boolean;
  }>({
    usuario: false,
    sedes: false,
    idiomas: false
  });

  // Cargar datos una sola vez usando un único efecto y referencias
  useEffect(() => {
    // Cargar datos del usuario si es necesario
    if (id && !dataFetchedRef.current.usuario) {
      dataFetchedRef.current.usuario = true;
      console.log(`⚡ Cargando datos del usuario ID: ${id}`);
      dispatch(fetchUsuarioPorId(parseInt(id)));
    }
    
    // Cargar sedes si es necesario
    if (!dataFetchedRef.current.sedes && availableSedes.length === 0) {
      dataFetchedRef.current.sedes = true;
      console.log("⚡ Cargando sedes disponibles");
      dispatch(fetchUserSedes());
    }
    
    // Cargar idiomas del usuario si es necesario
    if (id && !dataFetchedRef.current.idiomas) {
      dataFetchedRef.current.idiomas = true;
      console.log(`⚡ Cargando idiomas del usuario ID: ${id}`);
      fetchIdiomasUsuario(parseInt(id));
    }
    
    // Limpiar al desmontar
    return () => {
      dispatch(clearUsuarioSeleccionado());
    };
  }, [dispatch, id, availableSedes.length]);

  // Función para obtener los idiomas del usuario
  const fetchIdiomasUsuario = async (userId: number) => {
    if (loadingIdiomas) return; // Evitar múltiples solicitudes
    
    setLoadingIdiomas(true);
    try {
      // Aquí deberías hacer la llamada a tu API
      // const response = await api.get(`/admin/usuarios/${userId}/idiomas`);
      // setIdiomasUsuario(response.data);
      
      // Por ahora, datos de ejemplo mientras implementas la llamada real:
      setTimeout(() => {
        setIdiomasUsuario([
          { id_idioma: 1, nombre: 'Español', codigo: 'es', nivel: 'Nativo' },
          { id_idioma: 2, nombre: 'Inglés', codigo: 'en', nivel: 'Intermedio' },
        ]);
        setLoadingIdiomas(false);
      }, 500);
    } catch (error) {
      console.error('Error al cargar idiomas del usuario:', error);
      setLoadingIdiomas(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteUsuario(parseInt(id))).unwrap();
        navigate('/admin/usuarios');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  // Obtener nombre de sede
  const getNombreSede = (id_sede: number | null) => {
    if (!id_sede) return 'Sin sede asignada';
    const sede = availableSedes.find(sede => sede.id_sede === id_sede);
    return sede ? sede.nombre : `Sede ${id_sede}`;
  };

  // Formatear fecha
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return String(dateString);
    }
  };

  // Obtener color de badge para el nivel de idioma
  const getNivelColor = (nivel: string | undefined) => {
    switch (nivel?.toLowerCase()) {
      case 'nativo':
        return 'bg-green-100 text-green-800';
      case 'avanzado':
        return 'bg-blue-100 text-blue-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'básico':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !usuarioSeleccionado) {
    return <div className="p-4">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <Link to="/admin/usuarios" className="mt-2 inline-block text-red-700 underline">
          Volver a la lista de usuarios
        </Link>
      </div>
    );
  }

  if (!usuarioSeleccionado) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>No se encontró el usuario solicitado.</p>
        <Link to="/admin/usuarios" className="mt-2 inline-block text-yellow-700 underline">
          Volver a la lista de usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            to="/admin/usuarios" 
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold">Detalle de Usuario</h2>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/admin/usuarios/${id}/editar`}
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          >
            <FiEdit className="mr-2" />
            Editar
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FiTrash2 className="mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información Personal</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Nombre Completo</div>
              <div className="text-base">
                {usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Tipo de Documento</div>
              <div className="text-base">{usuarioSeleccionado.tipo_documento}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Número de Documento</div>
              <div className="text-base">{usuarioSeleccionado.numero_documento}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Nacimiento</div>
              <div className="text-base">{formatDate(usuarioSeleccionado.fecha_nacimiento)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Nacionalidad</div>
              <div className="text-base">{usuarioSeleccionado.nacionalidad || 'No especificada'}</div>
            </div>
          </div>
        </div>
        
        {/* Información de Contacto */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información de Contacto</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Correo Electrónico</div>
              <div className="text-base">{usuarioSeleccionado.correo}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Teléfono</div>
              <div className="text-base">{usuarioSeleccionado.telefono || 'No especificado'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Dirección</div>
              <div className="text-base">{usuarioSeleccionado.direccion || 'No especificada'}</div>
            </div>
          </div>
        </div>
        
        {/* Información Laboral */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Información del Sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500">Rol</div>
              <div className="text-base">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  usuarioSeleccionado.rol === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : usuarioSeleccionado.rol === 'VENDEDOR' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  {usuarioSeleccionado.rol === 'ADMIN' 
                    ? 'Administrador' 
                    : usuarioSeleccionado.rol === 'VENDEDOR' 
                      ? 'Vendedor' 
                      : 'Chofer'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Sede Asignada</div>
              <div className="text-base">
                {usuarioSeleccionado.id_sede 
                  ? getNombreSede(usuarioSeleccionado.id_sede)
                  : <span className="text-gray-400 italic">Sin sede asignada</span>}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-500">Fecha de Registro</div>
              <div className="text-base">
                {formatDate(usuarioSeleccionado.fecha_registro)}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Idiomas */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
              <FiGlobe className="mr-2" />
              Idiomas
            </h3>
            <Link
              to={`/admin/usuarios/${id}/idiomas`}
              className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
            >
              <FiPlus className="mr-1" size={14} />
              Gestionar
            </Link>
          </div>
          
          {loadingIdiomas ? (
            <div className="flex justify-center py-4">
              <div className="text-gray-500">Cargando idiomas...</div>
            </div>
          ) : idiomasUsuario.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {idiomasUsuario.map((idioma) => (
                <div key={idioma.id_idioma} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{idioma.nombre}</div>
                      <div className="text-sm text-gray-500">Código: {idioma.codigo}</div>
                    </div>
                    {idioma.nivel && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNivelColor(idioma.nivel)}`}>
                        {idioma.nivel}
                      </span>
                    )}
                  </div>
                  {idioma.fecha_asignacion && (
                    <div className="text-xs text-gray-400 mt-2">
                      Asignado: {formatDate(idioma.fecha_asignacion)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiGlobe size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay idiomas asignados a este usuario</p>
              <Link
                to={`/admin/usuarios/${id}/idiomas`}
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                <FiPlus className="mr-2" size={16} />
                Asignar primer idioma
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">
              ¿Está seguro de que desea eliminar al usuario <span className="font-semibold">{usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}</span>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioDetail;