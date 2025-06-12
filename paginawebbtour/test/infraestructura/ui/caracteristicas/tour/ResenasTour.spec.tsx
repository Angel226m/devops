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
    div: ({ children, className, initial, animate, exit, transition, ...rest }: any) => (
      <div data-testid="motion-div" className={className} {...rest}>
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children, mode }: any) => <div data-testid="animate-presence">{children}</div>
}));

// En lugar de mockear setTimeout, vamos a mockear useEffect directamente
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useEffect: (callback: Function) => {
      // Ejecutar el callback inmediatamente para simular carga instantánea
      callback();
      return undefined;
    }
  };
});

describe('ResenasTour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el botón para dejar reseña', () => {
    const { container } = render(<ResenasTour idTour={1} />);
    
    // Verificar que hay un botón para dejar reseña
    const botonResena = container.querySelector('button');
    expect(botonResena).not.toBeNull();
    expect(botonResena?.textContent).toContain('Dejar Reseña');
  });

  test('muestra el formulario al hacer clic en dejar reseña', () => {
    const { container } = render(<ResenasTour idTour={1} />);
    
    // Buscar el botón de dejar reseña
    const botonResena = container.querySelector('button');
    expect(botonResena).not.toBeNull();
    
    // Hacer clic en el botón
    if (botonResena) {
      fireEvent.click(botonResena);
    }
    
    // Verificar que aparece el formulario
    const formulario = container.querySelector('form');
    expect(formulario).not.toBeNull();
    
    // Verificar campos del formulario
    const nombreInput = container.querySelector('input[name="nombre"]');
    const correoInput = container.querySelector('input[name="correo"]');
    const comentarioTextarea = container.querySelector('textarea[name="comentario"]');
    
    expect(nombreInput).not.toBeNull();
    expect(correoInput).not.toBeNull();
    expect(comentarioTextarea).not.toBeNull();
  });

  test('cancela el formulario correctamente', () => {
    const { container } = render(<ResenasTour idTour={1} />);
    
    // Abrir formulario
    const botonResena = container.querySelector('button');
    if (botonResena) {
      fireEvent.click(botonResena);
    }
    
    // Verificar que el formulario está abierto
    expect(container.querySelector('form')).not.toBeNull();
    
    // Buscar botón de cancelar y hacer clic
    const botonCancelar = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.includes('Cancelar')
    );
    if (botonCancelar) {
      fireEvent.click(botonCancelar);
    }
    
    // Verificar que el formulario desaparece
    expect(container.querySelector('form')).toBeNull();
  });
});