@echo off
echo Creando estructura de carpetas para tests con Vitest...

:: Crear carpeta principal de test (singular)
mkdir test

:: Crear estructura dentro de test similar a src
mkdir test\aplicacion
mkdir test\aplicacion\casos-de-uso
mkdir test\aplicacion\casos-de-uso\canalVenta
mkdir test\aplicacion\casos-de-uso\cantidadPasajes
mkdir test\aplicacion\casos-de-uso\cliente
mkdir test\aplicacion\casos-de-uso\comprobantePago
mkdir test\aplicacion\casos-de-uso\embarcacion
mkdir test\aplicacion\casos-de-uso\galeriaTour
mkdir test\aplicacion\casos-de-uso\horarioChofer
mkdir test\aplicacion\casos-de-uso\horarioTour
mkdir test\aplicacion\casos-de-uso\instanciaTour
mkdir test\aplicacion\casos-de-uso\metodoPago
mkdir test\aplicacion\casos-de-uso\pago
mkdir test\aplicacion\casos-de-uso\paquetePasajes
mkdir test\aplicacion\casos-de-uso\reserva
mkdir test\aplicacion\casos-de-uso\sede
mkdir test\aplicacion\casos-de-uso\tipoPasaje
mkdir test\aplicacion\casos-de-uso\tipoTour
mkdir test\aplicacion\casos-de-uso\tourProgramado
mkdir test\aplicacion\casos-de-uso\usuario
mkdir test\aplicacion\puertos
mkdir test\aplicacion\puertos\entrada
mkdir test\aplicacion\puertos\salida

:: Compartidos
mkdir test\compartidos
mkdir test\compartidos\constantes
mkdir test\compartidos\utilidades

:: Dominio
mkdir test\dominio
mkdir test\dominio\entidades
mkdir test\dominio\objetos-valor

:: Infraestructura
mkdir test\infraestructura
mkdir test\infraestructura\api
mkdir test\infraestructura\i18n
mkdir test\infraestructura\repositorios
mkdir test\infraestructura\servicios
mkdir test\infraestructura\servicios\idioma
mkdir test\infraestructura\store
mkdir test\infraestructura\store\slices
mkdir test\infraestructura\ui
mkdir test\infraestructura\ui\caracteristicas
mkdir test\infraestructura\ui\caracteristicas\autenticacion
mkdir test\infraestructura\ui\caracteristicas\carrito
mkdir test\infraestructura\ui\caracteristicas\inicio
mkdir test\infraestructura\ui\caracteristicas\reserva
mkdir test\infraestructura\ui\caracteristicas\tour
mkdir test\infraestructura\ui\componentes
mkdir test\infraestructura\ui\componentes\comunes
mkdir test\infraestructura\ui\componentes\layout
mkdir test\infraestructura\ui\componentes\navegacion
mkdir test\infraestructura\ui\layouts
mkdir test\infraestructura\ui\paginas
mkdir test\infraestructura\ui\paginas\privadas
mkdir test\infraestructura\ui\paginas\publicas
mkdir test\infraestructura\ui\rutas

:: Crear archivos de prueba de ejemplo vacíos
type nul > test\aplicacion\casos-de-uso\cliente\AutenticarCliente.spec.ts
type nul > test\infraestructura\ui\componentes\comunes\Boton.spec.tsx
type nul > test\infraestructura\ui\caracteristicas\autenticacion\FormularioIngreso.spec.tsx
type nul > test\infraestructura\store\slices\sliceAutenticacion.spec.ts
type nul > test\compartidos\utilidades\validadores.spec.ts

:: Crear archivos de configuración necesarios
type nul > vitest.config.ts
type nul > test\setup.ts

echo.
echo Estructura de carpetas y archivos para tests creados exitosamente.
echo.
echo Recuerda instalar Vitest y configurar tu proyecto:
echo npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
echo.
echo Actualiza tu package.json con estos scripts:
echo "test": "vitest run",
echo "test:watch": "vitest",
echo "test:coverage": "vitest run --coverage"