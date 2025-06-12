import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import FormularioIngreso from '../../../../../src/infraestructura/ui/caracteristicas/autenticacion/FormularioIngreso';

// Mock para navigate
const mockNavigate = vi.fn();

// Mock de React Router DOM
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode, to: string }) => (
      <a href={to}>{children}</a>
    )
  };
});

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
  }
}));

// Crear un mock de dispatch
const mockDispatch = vi.fn().mockImplementation(() => Promise.resolve({ payload: {} }));

// Mock de Redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

// Mock de Redux store action
vi.mock('../../../../../src/infraestructura/store/slices/sliceAutenticacion', () => ({
  iniciarSesion: vi.fn().mockImplementation((credentials) => ({
    type: 'auth/login',
    payload: credentials
  })),
}));

describe('FormularioIngreso', () => {
  // Configurar un store de Redux para las pruebas
  const mockStore = configureStore({
    reducer: {
      autenticacion: (state = { cargando: false, error: null }, action) => state
    }
  });

  // Función de ayuda para renderizar el componente con todos los proveedores necesarios
  const renderFormularioIngreso = () => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <FormularioIngreso />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza correctamente el formulario de ingreso', () => {
    const { container } = renderFormularioIngreso();
    
    // Verificar el título del formulario
    expect(container.querySelector('h2')?.textContent).toBe('Iniciar Sesión');
    
    // Verificar campos del formulario usando atributos más directos
    expect(container.querySelector('input[type="email"]')).not.toBeNull();
    expect(container.querySelector('input[type="password"]')).not.toBeNull();
    
    // Verificar botón de submit
    expect(container.querySelector('button[type="submit"]')).not.toBeNull();
    
    // Verificar enlaces
    expect(container.querySelector('a[href="/recuperar-contrasena"]')).not.toBeNull();
    expect(container.querySelector('a[href="/registrarse"]')).not.toBeNull();
  });

  test('permite escribir en los campos del formulario', () => {
    const { container } = renderFormularioIngreso();
    
    // Obtener los campos directamente
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
    
    if (!emailInput || !passwordInput) {
      throw new Error('No se encontraron los campos de entrada');
    }
    
    // Simular escritura en los campos
    fireEvent.change(emailInput, { target: { value: 'usuario@ejemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'contraseña123' } });
    
    // Verificar que los valores se actualizaron
    expect(emailInput.value).toBe('usuario@ejemplo.com');
    expect(passwordInput.value).toBe('contraseña123');
  });

  test('muestra/oculta la contraseña cuando se hace clic en el botón de visibilidad', () => {
    const { container } = renderFormularioIngreso();
    
    // Obtener el input de contraseña
    const passwordInput = container.querySelector('input[name="contrasena"]') as HTMLInputElement;
    
    if (!passwordInput) {
      throw new Error('No se encontró el campo de contraseña');
    }
    
    expect(passwordInput.type).toBe('password');
    
    // Obtener el botón de visibilidad
    const visibilityButton = container.querySelector('.relative button');
    
    if (!visibilityButton) {
      throw new Error('No se encontró el botón de visibilidad');
    }
    
    // Hacer clic para mostrar la contraseña
    fireEvent.click(visibilityButton);
    
    // Verificar que ahora es visible (type="text")
    expect(passwordInput.type).toBe('text');
    
    // Hacer clic nuevamente para ocultar
    fireEvent.click(visibilityButton);
    
    // Verificar que vuelve a estar oculta
    expect(passwordInput.type).toBe('password');
  });

  test('maneja correctamente el estado del checkbox "Recordarme"', () => {
    const { container } = renderFormularioIngreso();
    
    // Obtener el checkbox
    const rememberMeCheckbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    
    if (!rememberMeCheckbox) {
      throw new Error('No se encontró el checkbox de recordarme');
    }
    
    // Verificar estado inicial
    expect(rememberMeCheckbox.checked).toBe(false);
    
    // Hacer clic para activar
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.checked).toBe(true);
    
    // Verificar que el texto informativo cambió
    const infoText = container.querySelector('.text-xs.text-gray-500');
    expect(infoText?.textContent).toContain('Su sesión se mantendrá activa durante 7 días');
    
    // Hacer clic para desactivar
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.checked).toBe(false);
    
    // Verificar que el texto volvió al inicial
    expect(infoText?.textContent).toContain('Su sesión expirará después de 1 hora de inactividad');
  });

  test('intenta enviar el formulario con datos completos', async () => {
    const { container } = renderFormularioIngreso();
    
    // Completar formulario
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('No se encontraron los elementos del formulario');
    }
    
    fireEvent.change(emailInput, { target: { value: 'usuario@ejemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'contraseña123' } });
    
    // Enviar formulario
    fireEvent.click(submitButton);
    
    // Esperar a que se llame al dispatch
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('muestra mensaje de error cuando falla la autenticación', async () => {
    // Configurar el mock para simular un error
    mockDispatch.mockRejectedValueOnce({ 
      message: 'Error al iniciar sesión. Por favor, intente nuevamente.' 
    });
    
    const { container } = renderFormularioIngreso();
    
    // Completar y enviar formulario
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('No se encontraron los elementos del formulario');
    }
    
    fireEvent.change(emailInput, { target: { value: 'usuario@ejemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'contraseña_incorrecta' } });
    
    fireEvent.click(submitButton);
    
    // Esperar a que aparezca cualquier mensaje de error
    await waitFor(() => {
      const errorElement = container.querySelector('.bg-red-50');
      expect(errorElement).not.toBeNull();
    });
  });
});