import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TarjetaTour from '../../../../../src/infraestructura/ui/caracteristicas/tour/TarjetaTour';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations = {
        'tours.desde': 'Desde',
        'tours.consultar': 'Consultar precio',
        'tours.verDetalles': 'Ver Detalles'
      };
      return translations[key] || key;
    }
  }),
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, variants, className, ...rest }: any) => (
      <div data-testid="motion-div" className={className} {...rest}>
        {children}
      </div>
    )
  }
}));

describe('TarjetaTour', () => {
  // Datos de prueba para el tour
  const tourMock = {
    id: 1,
    nombre: 'Tour a las Islas Ballestas',
    descripcion: 'Un fascinante recorrido por las Islas Ballestas donde podrás observar diversas especies marinas.',
    precio: 100,
    duracion: 120, // en minutos
    calificacion: 4.5,
    imagen: 'https://example.com/imagen-tour.jpg',
    ubicacion: 'Paracas, Perú'
  };

  // Tour sin precio para probar ese caso
  const tourSinPrecioMock = {
    ...tourMock,
    id: 2,
    precio: 0
  };

  // Función auxiliar para renderizar el componente
  const renderTarjetaTour = (tour = tourMock) => {
    return render(
      <MemoryRouter>
        <TarjetaTour tour={tour} />
      </MemoryRouter>
    );
  };

  test('renderiza correctamente los datos del tour', () => {
    const { container } = renderTarjetaTour();
    
    // Verificar que se muestra el nombre del tour
    expect(container.textContent).toContain('Tour a las Islas Ballestas');
    
    // Verificar que se muestra la descripción
    expect(container.textContent).toContain('Un fascinante recorrido');
    
    // Verificar que se muestra la ubicación
    expect(container.textContent).toContain('Paracas');
    
    // Verificar que se muestra la duración
    expect(container.textContent).toContain('2h');
  });
});