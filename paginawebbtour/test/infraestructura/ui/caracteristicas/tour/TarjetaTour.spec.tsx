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
    expect(container.textContent).toContain('Un fascinante recorrido por las Islas Ballestas');
    
    // Verificar que se muestra el precio
    expect(container.textContent).toContain('Desde');
    expect(container.textContent).toContain('S/100');
    
    // Verificar que se muestra la duración
    expect(container.textContent).toContain('2h');
    
    // Verificar que se muestra la calificación
    expect(container.textContent).toContain('4.5');
    
    // Verificar que se muestra la ubicación
    expect(container.textContent).toContain('Paracas, Perú');
    
    // Verificar que se muestra el botón de Ver Detalles
    expect(container.textContent).toContain('Ver Detalles');
  });

  test('renderiza correctamente un tour sin precio', () => {
    const { container } = renderTarjetaTour(tourSinPrecioMock);
    
    // Verificar que se muestra el mensaje de consultar precio
    expect(container.textContent).toContain('Consultar precio');
    
    // Verificar que no se muestra el precio
    expect(container.textContent).not.toContain('S/0');
  });

  test('muestra un fallback cuando la imagen no carga', () => {
    const { container } = renderTarjetaTour();
    
    // Encontrar la imagen
    const imagen = container.querySelector('img');
    expect(imagen).toBeDefined();
    
    if (imagen) {
      // Simular error en la carga de la imagen
      fireEvent.error(imagen);
      
      // Verificar que el div de fallback aparece
      const fallbackDiv = container.querySelector('.bg-gradient-to-br.from-blue-200');
      expect(fallbackDiv).toBeDefined();
      
      // Verificar que el texto del tour aparece en el fallback
      expect(fallbackDiv?.textContent).toContain('Tour a las Islas Ballestas');
    }
  });

  test('formatea correctamente la duración', () => {
    // Probar tour con duración en horas y minutos
    const tourLargo = {
      ...tourMock,
      duracion: 90 // 1h 30min
    };
    
    const { container: container1 } = renderTarjetaTour(tourLargo);
    expect(container1.textContent).toContain('1h 30min');
    
    // Probar tour con duración solo en minutos
    const tourCorto = {
      ...tourMock,
      duracion: 45 // solo 45min
    };
    
    const { container: container2 } = renderTarjetaTour(tourCorto);
    expect(container2.textContent).toContain('45min');
  });

  test('navega a la página de detalle al hacer clic en Ver Detalles', () => {
    const { container } = renderTarjetaTour();
    
    // Encontrar el enlace de Ver Detalles
    const enlaceDetalle = container.querySelector('a[href="/tours/1"]');
    expect(enlaceDetalle).toBeDefined();
    
    // Verificar que hay múltiples enlaces al mismo tour (imagen, título y botón)
    const enlaces = container.querySelectorAll('a[href="/tours/1"]');
    expect(enlaces.length).toBeGreaterThan(1);
  });
});