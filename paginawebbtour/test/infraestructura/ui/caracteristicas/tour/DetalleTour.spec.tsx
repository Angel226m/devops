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
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    h1: ({ children, ...rest }: any) => <h1 {...rest}>{children}</h1>
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
  
  // Configurar store de Redux
  const createMockStore = (overrideState = {}) => {
    return configureStore({
      reducer: {
        tipoTour: (state = {
          tipoTourActual: mockTipoTour,
          cargando: false,
          error: null
        }, action) => {
          return { ...state, ...overrideState?.tipoTour };
        },
        tourProgramado: (state = {
          toursDisponibles: mockToursDisponibles,
          cargando: false,
          error: null
        }, action) => {
          return { ...state, ...overrideState?.tourProgramado };
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

  test('muestra las pestañas de navegación y cambia entre ellas', () => {
    const { container } = renderDetalleTour();
    
    // Verificar pestañas
    expect(container.textContent).toContain('Descripción');
    expect(container.textContent).toContain('Detalles');
    expect(container.textContent).toContain('Horarios');
    expect(container.textContent).toContain('Recomendaciones');
    
    // Por defecto debería estar en 'descripción'
    expect(container.textContent).toContain('El tour incluye:');
    
    // Cambiar a 'detalles'
    const detallesTab = screen.getByText('Detalles');
    fireEvent.click(detallesTab);
    expect(container.textContent).toContain('Qué incluye');
    expect(container.textContent).toContain('Qué no incluye');
    
    // Cambiar a 'horarios'
    const horariosTab = screen.getByText('Horarios');
    fireEvent.click(horariosTab);
    expect(container.textContent).toContain('Horarios Disponibles');
    
    // Cambiar a 'recomendaciones'
    const recomendacionesTab = screen.getByText('Recomendaciones');
    fireEvent.click(recomendacionesTab);
    expect(container.textContent).toContain('Para disfrutar al máximo de su experiencia, le recomendamos:');
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
    
    // Debería mostrar el componente de carga
    const cargador = container.querySelector('.flex.justify-center.items-center.py-20');
    expect(cargador).toBeDefined();
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
    
    // Debería mostrar el mensaje de error
    expect(container.textContent).toContain('Error al cargar el tour');
    expect(container.textContent).toContain('Por favor, intenta recargar la página o vuelve al listado de tours.');
  });

  test('muestra horarios disponibles correctamente', () => {
    const { container } = renderDetalleTour();
    
    // Cambiar a la pestaña de horarios
    fireEvent.click(screen.getByText('Horarios'));
    
    // Verificar que se muestren los horarios disponibles
    expect(container.textContent).toContain('Horarios Disponibles');
    
    // Verificar que se muestre información sobre disponibilidad
    expect(container.textContent).toContain('Información de disponibilidad:');
    expect(container.textContent).toContain('Los horarios mostrados corresponden a las próximas salidas disponibles.');
  });

  test('muestra el botón para volver al listado de tours', () => {
    const { container } = renderDetalleTour();
    
    // Buscar el botón por su texto
    const botonVolver = screen.getByText('← Volver a la lista de tours');
    expect(botonVolver).toBeDefined();
    
    // Hacer clic en el botón
    fireEvent.click(botonVolver);
    
    // Verificar que el navigate se haya llamado con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/tours');
  });
});