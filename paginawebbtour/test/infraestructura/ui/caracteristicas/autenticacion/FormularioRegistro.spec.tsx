import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import FormularioRegistro from '../../../../../src/infraestructura/ui/caracteristicas/autenticacion/FormularioRegistro';

// Mock dispatch function
const mockDispatch = vi.fn().mockReturnValue(Promise.resolve({ 
  exitoso: true, 
  respuestaLogin: { token: 'test-token' } 
}));

// Mock de React Router DOM
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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

// Mock de Redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn().mockImplementation(selector => 
      selector({
        autenticacion: {
          cargando: false,
          error: null
        }
      })
    )
  };
});

// Mock de Redux store action
vi.mock('../../../../../src/infraestructura/store/slices/sliceAutenticacion', () => ({
  registrarCliente: vi.fn().mockImplementation((cliente) => ({
    type: 'auth/register',
    payload: cliente
  })),
}));

describe('FormularioRegistro', () => {
  // Configurar un store de Redux para las pruebas
  const mockStore = configureStore({
    reducer: {
      autenticacion: (state = { cargando: false, error: null }, action) => state
    }
  });

  // Función de ayuda para renderizar el componente con todos los proveedores necesarios
  const renderFormularioRegistro = () => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <FormularioRegistro />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza correctamente el formulario de registro', () => {
    renderFormularioRegistro();
    
    // Verificar que el título del formulario se muestra
    expect(screen.getByText('Crear una Cuenta')).toBeDefined();
    
    // Verificar que el botón de crear cuenta se muestra
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeDefined();
  });

  // Modifica este test para usar getByPlaceholderText o getByTestId
 test('valida que las contraseñas coincidan', async () => {
  renderFormularioRegistro();
  
  // Llenar todos los campos requeridos para que la validación funcione correctamente
  fireEvent.change(screen.getByPlaceholderText(/Ingrese sus nombres/i), { 
    target: { value: 'Juan' } 
  });
  
  fireEvent.change(screen.getByPlaceholderText(/Ingrese sus apellidos/i), { 
    target: { value: 'Pérez' } 
  });
  
  fireEvent.change(screen.getByPlaceholderText(/Ingrese su número de documento/i), { 
    target: { value: '12345678' } 
  });
  
  fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), { 
    target: { value: 'juan@ejemplo.com' } 
  });
  
  fireEvent.change(screen.getByPlaceholderText(/9XXXXXXXX/i), { 
    target: { value: '987654321' } 
  });
  
  // Llenar campos con contraseñas diferentes
  fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), { 
    target: { value: 'password123' } 
  });
  
  fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
    target: { value: 'diferente123' } 
  });
  
  // Aceptar términos
  const terminosCheckbox = screen.getByLabelText(/Acepto los Términos y Condiciones/i);
  fireEvent.click(terminosCheckbox);
  
  // Intentar enviar el formulario
  const botonCrearCuenta = screen.getByRole('button', { name: /Crear Cuenta/i });
  fireEvent.click(botonCrearCuenta);
  
  // Aumentar el tiempo de espera y utilizar una función más robusta para encontrar el mensaje
  await waitFor(() => {
    // Intenta múltiples formas de encontrar el mensaje de error
    const errorMessages = screen.getAllByText(/contraseñas no coinciden|passwords do not match/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  }, { timeout: 2000 }); // Aumentar timeout a 2 segundos
});

  test('intenta enviar el formulario con datos completos y términos aceptados', async () => {
    renderFormularioRegistro();
    
    // Completar todos los campos requeridos
    fireEvent.change(screen.getByPlaceholderText(/Ingrese sus nombres/i), { 
      target: { value: 'Juan' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Ingrese sus apellidos/i), { 
      target: { value: 'Pérez' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Ingrese su número de documento/i), { 
      target: { value: '12345678' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), { 
      target: { value: 'juan@ejemplo.com' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/9XXXXXXXX/i), { 
      target: { value: '987654321' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), { 
      target: { value: 'password123' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Repita su contraseña/i), { 
      target: { value: 'password123' } 
    });
    
    // Aceptar términos
    const terminosCheckbox = screen.getByLabelText(/Acepto los Términos y Condiciones/i);
    fireEvent.click(terminosCheckbox);
    
    // Enviar formulario
    const botonCrearCuenta = screen.getByRole('button', { name: /Crear Cuenta/i });
    fireEvent.click(botonCrearCuenta);
    
    // Verificar que el dispatch se haya llamado
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});