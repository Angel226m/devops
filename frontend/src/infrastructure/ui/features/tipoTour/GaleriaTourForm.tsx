import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { 
  createGaleriaTour, 
  getGaleriaTourById, 
  updateGaleriaTour 
} from '../../../store/slices/galeriaTourSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';

interface GaleriaTourFormProps {
  tipoTourId: number;
  galeriaId?: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const GaleriaTourForm: React.FC<GaleriaTourFormProps> = ({
  tipoTourId,
  galeriaId = null,
  onSuccess,
  onCancel
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedGaleria, loading, error } = useSelector((state: RootState) => state.galeriaTour);

  const [formData, setFormData] = useState({
    id_tipo_tour: tipoTourId,
    url_imagen: '',
    descripcion: '',
    orden: 1
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (galeriaId) {
      dispatch(getGaleriaTourById(galeriaId))
        .unwrap()
        .then(data => {
          setFormData({
            id_tipo_tour: data.id_tipo_tour,
            url_imagen: data.url_imagen,
            descripcion: data.descripcion || '',
            orden: data.orden
          });
        })
        .catch(error => {
          console.error("Error al cargar los datos de la imagen:", error);
        });
    }
  }, [dispatch, galeriaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'orden') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 1
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (galeriaId) {
        // Actualizar imagen existente
        await dispatch(updateGaleriaTour({
          id: galeriaId,
          galeria: {
            url_imagen: formData.url_imagen,
            descripcion: formData.descripcion,
            orden: formData.orden
          }
        })).unwrap();
      } else {
        // Crear nueva imagen
        await dispatch(createGaleriaTour(formData)).unwrap();
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error al guardar la imagen:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">URL de imagen <span className="text-red-500">*</span></label>
        <FormInput
          type="text"
          name="url_imagen"
          value={formData.url_imagen}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          rows={3}
          placeholder="Descripción opcional de la imagen"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Orden <span className="text-red-500">*</span></label>
        <FormInput
          type="number"
          name="orden"
          value={formData.orden.toString()}
          onChange={handleChange}
          required
          min={1}
          disabled={loading}
          placeholder="Posición en la galería"
        />
      </div>
      
      {formData.url_imagen && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Vista previa</label>
          <div className="w-full h-48 border border-gray-300 rounded overflow-hidden">
            <img 
              src={formData.url_imagen} 
              alt="Vista previa" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=URL+Inválida';
              }}
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {galeriaId ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default GaleriaTourForm;