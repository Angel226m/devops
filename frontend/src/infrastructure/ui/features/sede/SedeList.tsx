import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchSedes, deleteSede, fetchSedesPorCiudad } from '../../../store/slices/sedeSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';

interface SedeListProps {
  isGestionPage?: boolean;
}

const SedeList: React.FC<SedeListProps> = ({ isGestionPage = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { sedes: sedesData, loading, error } = useSelector((state: RootState) => state.sede);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [filtroCiudad, setFiltroCiudad] = useState('');
  const [ciudadesUnicas, setCiudadesUnicas] = useState<string[]>([]);
  
  // Extraer el array de sedes del objeto
  const extractSedesArray = (data: any): any[] => {
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object') {
      // Buscar propiedades comunes donde podría estar el array de sedes
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.sedes && Array.isArray(data.sedes)) {
        return data.sedes;
      } else if (data.items && Array.isArray(data.items)) {
        return data.items;
      } else if (data.results && Array.isArray(data.results)) {
        return data.results;
      } else if (data.content && Array.isArray(data.content)) {
        return data.content;
      }
      
      // Último intento: buscar la primera propiedad que sea un array
      for (const key in data) {
        if (Array.isArray(data[key])) {
          return data[key];
        }
      }
    }
    
    // Si todo falla, devolver array vacío
    return [];
  };
  
  // Asegúrate de que sedes sea siempre un array
  const sedes = extractSedesArray(sedesData);
  
  // Cargar sedes
  useEffect(() => {
    dispatch(fetchSedes());
  }, [dispatch]);
  
  // Extraer ciudades únicas para el filtro
  useEffect(() => {
    if (!Array.isArray(sedes)) {
      console.error("sedes no es un array:", sedes);
      setCiudadesUnicas([]);
      return;
    }
    
    try {
      const uniqueCities = [...new Set(sedes.map(sede => sede?.ciudad).filter(Boolean))];
      setCiudadesUnicas(uniqueCities as string[]);
    } catch (error) {
      console.error("Error procesando ciudades:", error);
      setCiudadesUnicas([]);
    }
  }, [sedes]);
  
  const handleEdit = (id: number) => {
    if (isGestionPage) {
      navigate(`/admin/gestion-sedes/editar/${id}`);
    } else {
      navigate(`/admin/sedes/editar/${id}`);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sede?')) {
      try {
        await dispatch(deleteSede(id)).unwrap();
        alert('Sede eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };
  
  const handleCreate = () => {
    if (isGestionPage) {
      navigate('/admin/gestion-sedes/nueva');
    } else {
      navigate('/admin/sedes/nueva');
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ciudad = e.target.value;
    setFiltroCiudad(ciudad);
    
    if (ciudad) {
      dispatch(fetchSedesPorCiudad(ciudad));
    } else {
      dispatch(fetchSedes());
    }
  };
  
  // Columnas para la tabla
  const columns = [
    { header: 'ID', accessor: 'id_sede' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Ciudad', accessor: 'ciudad' },
    { header: 'País', accessor: 'pais' },
    { header: 'Dirección', accessor: 'direccion' },
    { header: 'Teléfono', accessor: (row: any) => row.telefono || '-' },
    { 
      header: 'Acciones', 
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_sede)}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_sede)}
          >
            Eliminar
          </Button>
        </div>
      )
    },
  ];
  
  // Agrega un console.log para depurar
  console.log("Estado actual de sedesData:", sedesData);
  console.log("Estado actual de sedes (procesado):", sedes);
  console.log("Es un array:", Array.isArray(sedes));
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Sedes</h3>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            {error}
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Filtrar por Ciudad"
              name="filtroCiudad"
              value={filtroCiudad}
              onChange={handleFilterChange}
            >
              <option value="">Todas las ciudades</option>
              {ciudadesUnicas.map((ciudad, index) => (
                <option key={index} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </Select>
            
            <div className="flex items-end justify-end">
              <Button onClick={handleCreate}>
                Nueva Sede
              </Button>
            </div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={sedes} // Usar el array procesado
          loading={loading}
          emptyMessage="No hay sedes disponibles"
        />
      </div>
    </Card>
  );
};

export default SedeList;