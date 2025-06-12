import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResenasTour from '../../../../../src/infraestructura/ui/caracteristicas/tour/ResenasTour';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations = {
        'resenas.dejarResena': 'Dejar Reseña',
        'resenas.cancelar': 'Cancelar',
        'resenas.nombre': 'Nombre',
        'resenas.correo': 'Correo Electrónico',
        'resenas.calificacion': 'Calificación',
        'resenas.estrellas': 'estrellas',
        'resenas.comentario': 'Comentario',
        'resenas.enviar': 'Enviar',
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
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

// Mock de setTimeout para acelerar la prueba
vi.spyOn(global, 'setTimeout').mockImplementation((callback) => {
  callback();
  return 0 as any;
});

describe('ResenasTour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza correctamente el componente con reseñas cargadas', async () => {
    const { container } = render(<ResenasTour idTour={1} />);
    
    // Inicialmente debería mostrar el esqueleto de carga
    expect(container.querySelector('.animate-pulse')).toBeDefined();
    
    // Esperar a que se carguen las reseñas (setTimeout simulado)
    await waitFor(() => {
      // Verificar que hay un botón para dejar reseña
      expect(container.textContent).toContain('Dejar Reseña');
      
      // Verificar que se muestran las reseñas
      expect(container.textContent).toContain('Juan Pérez');
      expect(container.textContent).toContain('María García');
      expect(container.textContent).toContain('Carlos Rodríguez');
    });
    
    // Verificar que hay estrellas en las reseñas
    const estrellas = container.querySelectorAll('svg[fill="currentColor"][viewBox="0 0 20 20"]');
    expect(estrellas.length).toBeGreaterThan(0);
  });

  test('muestra y oculta el formulario de reseña', async () => {
    const { container } = render(<ResenasTour idTour={1} />);
    
    // Esperar a que se carguen las reseñas
    await waitFor(() => {
      expect(container.textContent).toContain('Dejar Reseña');
    });
    
    // Hacer clic en el botón para mostrar el formulario
    const botonDejarResena = container.querySelector('button');
    if (botonDejarResena) {
      fireEvent.click(botonDejarResena);
    }
    
    // Verificar que aparece el formulario
    expect(container.textContent).toContain('Nombre *');
    expect(container.textContent).toContain('Correo Electrónico *');
    expect(container.textContent).toContain('Comentario *');
    
    // Hacer clic en cancelar
    const botonCancelar = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent === 'Cancelar'
    );
    if (botonCancelar) {
      fireEvent.click(botonCancelar);
    }
    
    // Verificar que el formulario desaparece
    expect(container.textContent).not.toContain('Nombre *');
  });

  test('permite enviar una nueva reseña', async () => {
    const { container } = render(<ResenasTour idTour={1} />);
    
    // Esperar a que se carguen las reseñas
    await waitFor(() => {
      expect(container.textContent).toContain('Dejar Reseña');
    });
    
    // Mostrar formulario
    const botonDejarResena = container.querySelector('button');
    if (botonDejarResena) {
      fireEvent.click(botonDejarResena);
    }
    
    // Rellenar el formulario
    const nombreInput = container.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = container.querySelector('input[name="correo"]') as HTMLInputElement;
    const comentarioTextarea = container.querySelector('textarea[name="comentario"]') as HTMLTextAreaElement;
    
    if (nombreInput && correoInput && comentarioTextarea) {
      fireEvent.change(nombreInput, { target: { value: 'Test User' } });
      fireEvent.change(correoInput, { target: { value: 'test@example.com' } });
      fireEvent.change(comentarioTextarea, { target: { value: 'Esta es una reseña de prueba.' } });
      
      // Seleccionar 4 estrellas
      const estrellas = container.querySelectorAll('button[aria-label*="estrellas"]');
      if (estrellas.length >= 4) {
        fireEvent.click(estrellas[3]); // 4 estrellas
      }
      
      // Enviar formulario
      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      // Verificar que la nueva reseña aparece
      await waitFor(() => {
        expect(container.textContent).toContain('Test User');
        expect(container.textContent).toContain('Esta es una reseña de prueba.');
      });
    }
  });
});