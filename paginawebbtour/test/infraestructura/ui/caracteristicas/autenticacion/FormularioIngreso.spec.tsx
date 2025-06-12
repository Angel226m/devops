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
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
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
    
    // Verificar elementos principales del formulario usando querySelector
    expect(container.querySelector('h2')?.textContent).toBe('Iniciar Sesión');
    
    // Verificar otros elementos por sus roles o propiedades
    expect(screen.getByRole('textbox', { name: /correo electrónico/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/••••••/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDefined();
    
    // Verificar texto usando container.textContent
    expect(container.textContent).toContain('¿Olvidaste tu contraseña?');
    expect(container.textContent).toContain('¿No tienes una cuenta?');
    expect(container.textContent).toContain('Regístrate aquí');
  });

  test('permite escribir en los campos del formulario', () => {
    renderFormularioIngreso();
    
    const emailInput = screen.getByPlaceholderText(/correo@ejemplo.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••/i);
    
    fireEvent.change(emailInput, { target: { value: 'usuario@ejemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'contraseña123' } });
    
    expect(emailInput).toHaveValue('usuario@ejemplo.com');
    expect(passwordInput).toHaveValue('contraseña123');
  });

  test('muestra/oculta la contraseña cuando se hace clic en el botón de visibilidad', () => {
    renderFormularioIngreso();
    
    const passwordInput = screen.getByPlaceholderText(/••••••/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Encontrar el botón de visibilidad (el que está dentro del div con clase "relative")
    const visibilityButton = document.querySelector('.relative button');
    if (visibilityButton) {
      fireEvent.click(visibilityButton);
    }
    
    // Verificar que el tipo de input haya cambiado a "text"
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Hacer clic nuevamente para ocultar
    if (visibilityButton) {
      fireEvent.click(visibilityButton);
    }
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('maneja correctamente el estado del checkbox "Recordarme"', () => {
    renderFormularioIngreso();
    
    const rememberMeCheckbox = screen.getByRole('checkbox');
    expect(rememberMeCheckbox).not.toBeChecked();
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
    
    // Verificar que el texto informativo cambie
    const infoText = document.querySelector('.text-xs.text-gray-500');
    expect(infoText?.textContent).toContain('Su sesión se mantendrá activa durante 7 días');
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
    expect(infoText?.textContent).toContain('Su sesión expirará después de 1 hora de inactividad');
  });

  test('intenta enviar el formulario con datos completos', async () => {
    renderFormularioIngreso();
    
    // Completar formulario
    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), { 
      target: { value: 'usuario@ejemplo.com' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/••••••/i), { 
      target: { value: 'contraseña123' } 
    });
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar que el dispatch se haya llamado con los datos correctos
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    // Si el navegador se redirige, verifica que se llamó al mockNavigate
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});