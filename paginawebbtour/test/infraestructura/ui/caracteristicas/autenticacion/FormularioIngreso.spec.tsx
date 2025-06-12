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
    renderFormularioIngreso();
    
    // Verificar elementos principales del formulario
    // Usando getByText, getByRole y getByPlaceholderText según la hoja de trucos
    expect(screen.getByText(/Iniciar Sesión/i)).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /correo electrónico/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/••••••/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeTruthy();
    expect(screen.getByText(/¿Olvidaste tu contraseña?/i)).toBeTruthy();
    expect(screen.getByText(/¿No tienes una cuenta?/i)).toBeTruthy();
    expect(screen.getByText(/Regístrate aquí/i)).toBeTruthy();
  });

  test('permite escribir en los campos del formulario', () => {
    renderFormularioIngreso();
    
    // Usar getByRole y getByPlaceholderText según corresponda
    const emailInput = screen.getByRole('textbox', { name: /correo electrónico/i });
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
    
    // Usar getByRole con name vacío para el botón de visibilidad
    const buttons = screen.getAllByRole('button');
    const visibilityButton = buttons.find(button => 
      button.getAttribute('type') === 'button' && 
      button.classList.contains('absolute')
    );
    
    if (visibilityButton) {
      fireEvent.click(visibilityButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      fireEvent.click(visibilityButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    } else {
      // Si no se encuentra el botón, fallará el test
      expect(visibilityButton).toBeTruthy();
    }
  });

  test('maneja correctamente el estado del checkbox "Recordarme"', () => {
    renderFormularioIngreso();
    
    // Usar getByRole para el checkbox
    const rememberMeCheckbox = screen.getByRole('checkbox', { 
      name: /mantener sesión activa por 7 días/i 
    });
    
    expect(rememberMeCheckbox).not.toBeChecked();
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
    
    // Verificar que el texto informativo cambie
    expect(screen.getByText(/su sesión se mantendrá activa durante 7 días/i)).toBeTruthy();
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
    expect(screen.getByText(/su sesión expirará después de 1 hora de inactividad/i)).toBeTruthy();
  });

  test('intenta enviar el formulario con datos completos', async () => {
    renderFormularioIngreso();
    
    // Completar formulario
    fireEvent.change(screen.getByRole('textbox', { name: /correo electrónico/i }), { 
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