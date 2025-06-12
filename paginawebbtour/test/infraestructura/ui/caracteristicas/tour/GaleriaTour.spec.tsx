import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GaleriaTour from '../../../../../src/infraestructura/ui/caracteristicas/tour/GaleriaTour';

// Mock para listarGaleriasTourPorTipoTour
const mockListarGaleriasTourPorTipoTour = vi.fn();
// Mock para obtenerTipoTourPorId
const mockObtenerTipoTourPorId = vi.fn();

// Mock de las acciones Redux
vi.mock('../../../../../src/infraestructura/store/slices/sliceGaleriaTour', () => ({
  listarGaleriasTourPorTipoTour: (id: number) => {
    mockListarGaleriasTourPorTipoTour(id);
    return { type: 'galeriaTour/listar', payload: id };
  }
}));

vi.mock('../../../../../src/infraestructura/store/slices/sliceTipoTour', () => ({
  obtenerTipoTourPorId: (id: number) => {
    mockObtenerTipoTourPorId(id);
    return { type: 'tipoTour/obtener', payload: id };
  }
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations = {
        'tour.imagen': 'Imagen',
        'tour.verMasImagenes': 'Ver más imágenes',
        'tour.sinImagenesDisponibles': 'No hay imágenes disponibles',
        'tour.errorCargaGaleria': 'Error al cargar la galería',
        'general.cerrar': 'Cerrar',
        'general.anterior': 'Anterior',
        'general.siguiente': 'Siguiente'
      };
      return translations[key] || key;
    }
  }),
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: any) => (
      <div data-testid="motion-div" className={className} {...rest}>
        {children}
      </div>
    ),
    img: ({ src, alt, className, ...rest }: any) => (
      <img data-testid="motion-img" src={src} alt={alt} className={className} {...rest} />
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

// Definición de tipos para el estado
interface GaleriaTourState {
  galeriasTour: Array<{
    id_galeria: number;
    id_tipo_tour: number;
    url_imagen: string;
  }>;
  cargando: boolean;
  error: string | null;
}

interface TipoTourState {
  tipoTourActual: {
    id_tipo_tour: number;
    nombre: string;
    descripcion: string;
    url_imagen: { Valid: boolean; String: string } | string;
  } | null;
  cargando: boolean;
  error: string | null;
}

interface RootState {
  galeriaTour: GaleriaTourState;
  tipoTour: TipoTourState;
}

describe('GaleriaTour', () => {
  // Datos de prueba
  const mockImagenes = [
    { id_galeria: 1, id_tipo_tour: 1, url_imagen: 'https://example.com/imagen1.jpg' },
    { id_galeria: 2, id_tipo_tour: 1, url_imagen: 'https://example.com/imagen2.jpg' },
    { id_galeria: 3, id_tipo_tour: 1, url_imagen: 'https://example.com/imagen3.jpg' }
  ];

  const mockTipoTour = {
    id_tipo_tour: 1,
    nombre: 'Tour a las Islas Ballestas',
    descripcion: 'Un tour increíble',
    url_imagen: { Valid: true, String: 'https://example.com/imagen-principal.jpg' }
  };

  // Configurar store de Redux con tipos correctos
  const createMockStore = (initialState: Partial<RootState> = {}) => {
    const defaultState: RootState = {
      galeriaTour: {
        galeriasTour: [],
        cargando: false,
        error: null,
        ...initialState.galeriaTour
      },
      tipoTour: {
        tipoTourActual: null,
        cargando: false,
        error: null,
        ...initialState.tipoTour
      }
    };

    return configureStore({
      reducer: {
        galeriaTour: (state = defaultState.galeriaTour, action) => state,
        tipoTour: (state = defaultState.tipoTour, action) => state
      }
    });
  };

  // Función auxiliar para renderizar el componente
  const renderGaleriaTour = (props: any = {}, initialState: Partial<RootState> = {}) => {
    const defaultProps = {
      idTipoTour: 1,
      nombreTour: 'Tour a las Islas Ballestas',
      ...props
    };

    const store = createMockStore(initialState);

    return render(
      <Provider store={store}>
        <GaleriaTour {...defaultProps} />
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockListarGaleriasTourPorTipoTour.mockResolvedValue({ payload: mockImagenes });
    mockObtenerTipoTourPorId.mockResolvedValue({ payload: mockTipoTour });
  });

  test('muestra el cargador cuando está cargando datos', () => {
    const { container } = renderGaleriaTour({}, {
      galeriaTour: { cargando: true },
      tipoTour: { cargando: true }
    });
    
    // Buscar el componente de carga
    const cargador = container.querySelector('.flex.items-center.justify-center.bg-gray-100');
    expect(cargador).not.toBeNull();
  });

  test('muestra mensaje de error cuando hay un error', () => {
    const { container } = renderGaleriaTour({}, {
      galeriaTour: { error: 'Error al cargar imágenes' }
    });
    
    // Buscar el mensaje de error
    const mensajeError = container.querySelector('.bg-red-50');
    expect(mensajeError).not.toBeNull();
    expect(container.textContent).toContain('Error al cargar imágenes');
  });
});