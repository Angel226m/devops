import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import DetalleTour from '../../../../../src/infraestructura/ui/caracteristicas/tour/DetalleTour';

// Mock para navigate
const mockNavigate = vi.fn();

// Mock de React Router DOM
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ idTour: '1' }),
    useNavigate: () => mockNavigate
  };
});

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations = {
        'tour.minutos': 'minutos',
        'tour.ubicacionGenerica': 'Ubicación',
        'tour.descripcion': 'Descripción',
        'tour.detalles': 'Detalles',
        'tour.horarios': 'Horarios',
        'tour.recomendaciones': 'Recomendaciones',
        'tour.queIncluye': 'Qué incluye',
        'tour.queNoIncluye': 'Qué no incluye',
        'tour.horariosDisponibles': 'Horarios Disponibles',
        'tour.sinHorariosDisponibles': 'No hay horarios disponibles',
        'tour.recomendacionesIntro': 'Para disfrutar al máximo de su experiencia, le recomendamos:',
        'tour.noIncluye.comidas': 'Comidas y bebidas',
        'tour.noIncluye.propinas': 'Propinas',
        'tour.recomendaciones.ropa': 'Use ropa cómoda y adecuada para el clima',
        'tour.recomendaciones.calzado': 'Lleve calzado apropiado',
        'tour.recomendaciones.proteccion': 'Use protector solar y sombrero',
        'tour.recomendaciones.agua': 'Lleve agua',
        'tour.recomendaciones.documentos': 'Lleve sus documentos de identidad'
      };
      return translations[key] || key;
    }
  }),
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div data-testid="motion-div" {...rest}>{children}</div>,
    h1: ({ children, ...rest }: any) => <h1 data-testid="motion-h1" {...rest}>{children}</h1>
  }
}));

// Mock functions para Redux actions
const mockObtenerTipoTourPorId = vi.fn();
const mockLimpiarTipoTourActual = vi.fn();
const mockListarToursDisponiblesSinDuplicados = vi.fn();

// Mock de Redux slices
vi.mock('../../../../../src/infraestructura/store/slices/sliceTipoTour', () => ({
  obtenerTipoTourPorId: (id: number) => {
    mockObtenerTipoTourPorId(id);
    return { type: 'tipoTour/obtenerPorId', payload: id };
  },
  limpiarTipoTourActual: () => {
    mockLimpiarTipoTourActual();
    return { type: 'tipoTour/limpiar' };
  }
}));

vi.mock('../../../../../src/infraestructura/store/slices/sliceTourProgramado', () => ({
  listarToursDisponiblesSinDuplicados: () => {
    mockListarToursDisponiblesSinDuplicados();
    return { type: 'tourProgramado/listarDisponibles' };
  }
}));

// Definir tipos para el estado
interface TipoTourState {
  tipoTourActual: any;
  cargando: boolean;
  error: string | null;
}

interface TourProgramadoState {
  toursDisponibles: any[];
  cargando: boolean;
  error: string | null;
}

interface StoreOverrides {
  tipoTour?: Partial<TipoTourState>;
  tourProgramado?: Partial<TourProgramadoState>;
}

describe('DetalleTour', () => {
  // Crear datos mock para el estado
  const mockTipoTour = {
    id_tipo_tour: 1,
    nombre: 'Tour a las Islas Ballestas',
    descripcion: 'Un tour increíble por las islas Ballestas.',
    duracion_minutos: 120,
    nombre_sede: 'Paracas'
  };
  
  const mockToursDisponibles = [
    {
      id: 1,
      id_tipo_tour: 1,
      hora_inicio: '2023-01-01T09:00:00Z',
      hora_fin: '2023-01-01T11:00:00Z',
      vigencia_hasta: '2023-12-31T23:59:59Z'
    },
    {
      id: 2,
      id_tipo_tour: 1,
      hora_inicio: '2023-01-01T14:00:00Z',
      hora_fin: '2023-01-01T16:00:00Z',
      vigencia_hasta: '2023-12-31T23:59:59Z'
    }
  ];
  
  // Configurar store de Redux con tipos correctos
  const createMockStore = (overrides: StoreOverrides = {}) => {
    return configureStore({
      reducer: {
        tipoTour: (state = {
          tipoTourActual: mockTipoTour,
          cargando: false,
          error: null
        }, action) => {
          if (overrides.tipoTour) {
            return { ...state, ...overrides.tipoTour };
          }
          return state;
        },
        tourProgramado: (state = {
          toursDisponibles: mockToursDisponibles,
          cargando: false,
          error: null
        }, action) => {
          if (overrides.tourProgramado) {
            return { ...state, ...overrides.tourProgramado };
          }
          return state;
        }
      }
    });
  };
  
  // Función de ayuda para renderizar el componente
  const renderDetalleTour = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/tour/1']}>
          <Routes>
            <Route path="/tour/:idTour" element={<DetalleTour />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza correctamente los detalles del tour', () => {
    const { container } = renderDetalleTour();
    
    // Verificar que se muestren los datos principales del tour
    expect(container.textContent).toContain('Tour a las Islas Ballestas');
    expect(container.textContent).toContain('120 minutos');
    expect(container.textContent).toContain('Paracas');
  });

  test('muestra las pestañas de navegación y cambia entre ellas', async () => {
    const { container } = renderDetalleTour();
    
    // Verificar pestañas
    const detallesTab = container.querySelector('button:nth-child(2)'); // Segunda pestaña
    const horariosTab = container.querySelector('button:nth-child(3)'); // Tercera pestaña
    const recomendacionesTab = container.querySelector('button:nth-child(4)'); // Cuarta pestaña
    
    // Por defecto debería estar en 'descripción'
    expect(container.textContent).toContain('El tour incluye:');
    
    // Cambiar a 'detalles'
    if (detallesTab) {
      fireEvent.click(detallesTab);
    }
    
    // Esperar a que cambie el contenido
    await waitFor(() => {
      expect(container.textContent).toContain('Qué incluye');
    });
    
    // Cambiar a 'horarios'
    if (horariosTab) {
      fireEvent.click(horariosTab);
    }
    
    // Esperar a que cambie el contenido
    await waitFor(() => {
      expect(container.textContent).toContain('Horarios Disponibles');
    });
    
    // Cambiar a 'recomendaciones'
    if (recomendacionesTab) {
      fireEvent.click(recomendacionesTab);
    }
    
    // Esperar a que cambie el contenido
    await waitFor(() => {
      expect(container.textContent).toContain('Para disfrutar al máximo de su experiencia');
    });
  });

  test('muestra un cargador cuando está cargando datos', () => {
    const loadingStore = createMockStore({
      tipoTour: {
        tipoTourActual: null,
        cargando: true,
        error: null
      }
    });
    
    const { container } = render(
      <Provider store={loadingStore}>
        <MemoryRouter initialEntries={['/tour/1']}>
          <Routes>
            <Route path="/tour/:idTour" element={<DetalleTour />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Buscar el componente de carga
    const loadingContainer = container.querySelector('.flex.justify-center.items-center.py-20');
    expect(loadingContainer).not.toBeNull();
  });

  test('muestra un mensaje de error cuando hay un error', () => {
    const errorStore = createMockStore({
      tipoTour: {
        tipoTourActual: null,
        cargando: false,
        error: 'Error al cargar el tour'
      }
    });
    
    const { container } = render(
      <Provider store={errorStore}>
        <MemoryRouter initialEntries={['/tour/1']}>
          <Routes>
            <Route path="/tour/:idTour" element={<DetalleTour />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Buscar el mensaje de error
    expect(container.textContent).toContain('Error al cargar el tour');
    expect(container.textContent).toContain('Por favor, intenta recargar la página o vuelve al listado de tours.');
  });

  test('muestra horarios disponibles correctamente', async () => {
    const { container } = renderDetalleTour();
    
    // Cambiar a la pestaña de horarios
    const horariosTab = container.querySelector('button:nth-child(3)'); // Tercera pestaña
    
    if (horariosTab) {
      fireEvent.click(horariosTab);
    }
    
    // Esperar a que se muestren los horarios
    await waitFor(() => {
      expect(container.textContent).toContain('Horarios Disponibles');
    });
  });

 test('muestra el botón para volver al listado de tours', () => {
  const { container } = renderDetalleTour();
  
  // Buscar el botón por un selector más específico o por su texto completo
  // El botón probablemente tenga alguna clase o esté en una posición específica
  // Por ejemplo, si el botón está en la parte superior de la página:
  const botonVolver = container.querySelector('button[class*="volver"], a[class*="volver"]') || 
                     Array.from(container.querySelectorAll('button')).find(btn => 
                       btn.textContent?.includes('Volver a la lista'));
  
  expect(botonVolver).not.toBeNull();
  
  if (botonVolver) {
    expect(botonVolver.textContent).toContain('Volver');
    
    // Hacer clic en el botón
    fireEvent.click(botonVolver);
    
    // Verificar que el navigate se haya llamado con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/tours');
  }
});
});