/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchUsuarios, fetchUsuariosPorRol, deleteUsuario } from '../../../store/slices/usuarioSlice';
import { fetchUserSedes } from '../../../store/slices/authSlice';
import { FiEdit, FiTrash2, FiEye, FiFilter, FiPlus } from 'react-icons/fi';

const UsuarioList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { usuarios, loading, error } = useSelector((state: RootState) => state.usuario);
  const { user, selectedSede, availableSedes } = useSelector((state: RootState) => state.auth);
  
  const [filtroRol, setFiltroRol] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');
  const [modalConfirmacion, setModalConfirmacion] = useState<{ mostrar: boolean; id: number | null }>({
    mostrar: false,
    id: null,
  });

   // Separar los efectos para evitar llamadas repetidas
  // Efecto para cargar sedes - solo se ejecuta una vez al montar
  useEffect(() => {
    dispatch(fetchUserSedes());
  }, []); // Sin dependencias = solo al montar el componente

  // Efecto para cargar usuarios cuando cambia el filtro
  useEffect(() => {
    if (filtroRol) {
      dispatch(fetchUsuariosPorRol(filtroRol));
    } else {
      dispatch(fetchUsuarios());
    }
  }, [filtroRol]); // Solo se ejecuta cuando cambia el filtro

  const handleFiltrarPorRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroRol(e.target.value);
  };

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const confirmarEliminar = (id: number) => {
    setModalConfirmacion({ mostrar: true, id });
  };

  const eliminarUsuario = async () => {
    if (modalConfirmacion.id) {
      try {
        await dispatch(deleteUsuario(modalConfirmacion.id)).unwrap();
        setModalConfirmacion({ mostrar: false, id: null });
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const cancelarEliminar = () => {
    setModalConfirmacion({ mostrar: false, id: null });
  };

  // Filtrar usuarios primero por sede seleccionada (si corresponde)
  const usuariosFiltradosPorSede = usuarios.filter(usuario => {
    // Si el administrador ha seleccionado una sede específica,
    // solo mostrar usuarios de esa sede
    if (selectedSede && user?.rol === 'ADMIN') {
      return usuario.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada o no es admin, mostrar todos
    return true;
  });

  // Luego filtrar por búsqueda
  const usuariosFiltrados = usuariosFiltradosPorSede.filter(usuario => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      usuario.nombres.toLowerCase().includes(terminoBusqueda) ||
      usuario.apellidos.toLowerCase().includes(terminoBusqueda) ||
      usuario.correo.toLowerCase().includes(terminoBusqueda) ||
      (usuario.numero_documento && usuario.numero_documento.toLowerCase().includes(terminoBusqueda))
    );
  });
  // Obtener nombre de rol para mostrar
  const getNombreRol = (rol: string) => {
    switch (rol) {
      case 'ADMIN': return 'Administrador';
      case 'VENDEDOR': return 'Vendedor';
      case 'CHOFER': return 'Chofer';
      default: return rol;
    }
  };

  // Obtener nombre de la sede
  const getNombreSede = (id_sede: number | null) => {
    if (!id_sede) return 'Sin sede asignada';
    const sede = availableSedes?.find((sede) => sede.id_sede === id_sede);
    return sede ? sede.nombre : `Sede ${id_sede}`;
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Gestión de Usuarios
          {selectedSede && (
            <span className="ml-2 text-lg font-normal text-gray-600">
              - {selectedSede.nombre}
            </span>
          )}
        </h2>
        <button
          onClick={() => navigate('/admin/usuarios/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={handleBusqueda}
              className="w-full px-10 py-2 border border-gray-300 rounded-md"
            />
            <span className="absolute left-3 top-2 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-500" />
            <select
              value={filtroRol}
              onChange={handleFiltrarPorRol}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="VENDEDOR">Vendedores</option>
              <option value="CHOFER">Choferes</option>
            </select>
          </div>
        </div>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <div className="bg-gray-100 p-6 text-center rounded-md">
          <p className="text-gray-600">
            {busqueda ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 
             selectedSede ? `No hay usuarios registrados en la sede ${selectedSede.nombre}.` : 
             'No hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map(usuario => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {usuario.nombres} {usuario.apellidos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {usuario.tipo_documento}: {usuario.numero_documento}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{usuario.correo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.rol === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : usuario.rol === 'VENDEDOR' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getNombreRol(usuario.rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.id_sede ? (
                      <span>{getNombreSede(usuario.id_sede)}</span>
                    ) : (
                      <span className="text-gray-400 italic">Sin sede asignada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/admin/usuarios/${usuario.id_usuario}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver detalle"
                      >
                        <FiEye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/usuarios/${usuario.id_usuario}/editar`}
                        className="text-amber-600 hover:text-amber-900"
                        title="Editar"
                      >
                        <FiEdit size={18} />
                      </Link>
                      <button
                        onClick={() => confirmarEliminar(usuario.id_usuario)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación de eliminación *//*}
      {modalConfirmacion.mostrar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarEliminar}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarUsuario}
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

export default UsuarioList;*/

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchUsuarios, fetchUsuariosPorRol, deleteUsuario } from '../../../store/slices/usuarioSlice';
import { fetchUserSedes } from '../../../store/slices/authSlice';
import { FiEdit, FiTrash2, FiEye, FiFilter, FiPlus } from 'react-icons/fi';

const UsuarioList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { usuarios, loading, error } = useSelector((state: RootState) => state.usuario);
  const { user, selectedSede, availableSedes } = useSelector((state: RootState) => state.auth);
  
  const [filtroRol, setFiltroRol] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');
  const [modalConfirmacion, setModalConfirmacion] = useState<{ mostrar: boolean; id: number | null }>({
    mostrar: false,
    id: null,
  });

  // Control local de carga de datos
  const [usuariosLoaded, setUsuariosLoaded] = useState(false);
  const [sedesLoaded, setSedesLoaded] = useState(false);
  
  // Referencia para seguimiento del filtro anterior
  const previousFiltroRol = useRef(filtroRol);

  // Efecto para cargar sedes cuando sea necesario
  useEffect(() => {
    if (!sedesLoaded && availableSedes.length === 0) {
      console.log("⚡ Cargando sedes - no hay sedes cargadas aún");
      dispatch(fetchUserSedes());
      setSedesLoaded(true); // Marcar como que ya se intentó cargar
    }
  }, [availableSedes.length, sedesLoaded, dispatch]);

  // Efecto para cargar usuarios cuando sea necesario
  useEffect(() => {
    if (!usuariosLoaded && usuarios.length === 0) {
      console.log("⚡ Cargando usuarios - no hay usuarios cargados aún");
      dispatch(fetchUsuarios());
      setUsuariosLoaded(true); // Marcar como que ya se intentó cargar
    }
  }, [usuarios.length, usuariosLoaded, dispatch]);

  // Efecto separado que se ejecuta solo cuando cambia el filtro de rol
  useEffect(() => {
    // Solo ejecutar si ya se cargaron datos y el filtro realmente cambió
    if (usuariosLoaded && previousFiltroRol.current !== filtroRol) {
      if (filtroRol) {
        console.log(`⚡ Filtrando usuarios por rol: ${filtroRol}`);
        dispatch(fetchUsuariosPorRol(filtroRol));
      } else if (previousFiltroRol.current) {
        // Solo recargar todos si venimos de un filtro
        console.log("⚡ Cargando todos los usuarios al quitar filtro");
        dispatch(fetchUsuarios());
      }
      previousFiltroRol.current = filtroRol;
    }
  }, [filtroRol, usuariosLoaded, dispatch]);

  // Memoizar funciones para evitar re-renders innecesarios
  const handleFiltrarPorRol = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroRol(e.target.value);
  }, []);

  const handleBusqueda = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  }, []);

  const confirmarEliminar = useCallback((id: number) => {
    setModalConfirmacion({ mostrar: true, id });
  }, []);

  const eliminarUsuario = useCallback(async () => {
    if (modalConfirmacion.id) {
      try {
        await dispatch(deleteUsuario(modalConfirmacion.id)).unwrap();
        setModalConfirmacion({ mostrar: false, id: null });
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  }, [modalConfirmacion.id, dispatch]);

  const cancelarEliminar = useCallback(() => {
    setModalConfirmacion({ mostrar: false, id: null });
  }, []);

  // Filtrar usuarios primero por sede seleccionada (si corresponde)
  const usuariosFiltradosPorSede = usuarios.filter(usuario => {
    // Si el administrador ha seleccionado una sede específica,
    // solo mostrar usuarios de esa sede
    if (selectedSede && user?.rol === 'ADMIN') {
      return usuario.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada o no es admin, mostrar todos
    return true;
  });

  // Luego filtrar por búsqueda
  const usuariosFiltrados = usuariosFiltradosPorSede.filter(usuario => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      usuario.nombres.toLowerCase().includes(terminoBusqueda) ||
      usuario.apellidos.toLowerCase().includes(terminoBusqueda) ||
      usuario.correo.toLowerCase().includes(terminoBusqueda) ||
      (usuario.numero_documento && usuario.numero_documento.toLowerCase().includes(terminoBusqueda))
    );
  });

  // Obtener nombre de rol para mostrar
  const getNombreRol = (rol: string) => {
    switch (rol) {
      case 'ADMIN': return 'Administrador';
      case 'VENDEDOR': return 'Vendedor';
      case 'CHOFER': return 'Chofer';
      default: return rol;
    }
  };

  // Obtener nombre de la sede
  const getNombreSede = (id_sede: number | null) => {
    if (!id_sede) return 'Sin sede asignada';
    const sede = availableSedes?.find((sede) => sede.id_sede === id_sede);
    return sede ? sede.nombre : `Sede ${id_sede}`;
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Gestión de Usuarios
          {selectedSede && (
            <span className="ml-2 text-lg font-normal text-gray-600">
              - {selectedSede.nombre}
            </span>
          )}
        </h2>
        <button
          onClick={() => navigate('/admin/usuarios/nuevo')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-3 md:space-y-0">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={handleBusqueda}
              className="w-full px-10 py-2 border border-gray-300 rounded-md"
            />
            <span className="absolute left-3 top-2 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-500" />
            <select
              value={filtroRol}
              onChange={handleFiltrarPorRol}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="VENDEDOR">Vendedores</option>
              <option value="CHOFER">Choferes</option>
            </select>
          </div>
        </div>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <div className="bg-gray-100 p-6 text-center rounded-md">
          <p className="text-gray-600">
            {busqueda ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 
             selectedSede ? `No hay usuarios registrados en la sede ${selectedSede.nombre}.` : 
             'No hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map(usuario => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {usuario.nombres} {usuario.apellidos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {usuario.tipo_documento}: {usuario.numero_documento}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{usuario.correo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.rol === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : usuario.rol === 'VENDEDOR' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getNombreRol(usuario.rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.id_sede ? (
                      <span>{getNombreSede(usuario.id_sede)}</span>
                    ) : (
                      <span className="text-gray-400 italic">Sin sede asignada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/admin/usuarios/${usuario.id_usuario}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver detalle"
                      >
                        <FiEye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/usuarios/editar/${usuario.id_usuario}`}
                        className="text-amber-600 hover:text-amber-900"
                        title="Editar"
                      >
                        <FiEdit size={18} />
                      </Link>
                      <button
                        onClick={() => confirmarEliminar(usuario.id_usuario)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {modalConfirmacion.mostrar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarEliminar}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarUsuario}
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

export default UsuarioList;