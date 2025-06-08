@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ====================================================================
echo =                  CREADOR DE ESTRUCTURA DE PROYECTO               =
echo ====================================================================
echo.
echo Este script creará la estructura completa de directorios y archivos
echo en la carpeta src del proyecto.
echo.

REM Verificar si existe la carpeta src
if not exist src (
    echo Creando directorio principal src...
    mkdir src
) else (
    echo El directorio src ya existe.
)

cd src

REM Crear archivos en la raíz de src
echo Creando archivos en la raíz...
echo. > App.tsx
echo. > index.css
echo. > main.tsx
echo. > vite-env.d.ts

REM Crear estructura de aplicación
echo Creando estructura de aplicación...
mkdir aplicacion\puertos\entrada
mkdir aplicacion\puertos\salida
mkdir aplicacion\casos-de-uso\canalVenta
mkdir aplicacion\casos-de-uso\horarioChofer
mkdir aplicacion\casos-de-uso\cliente
mkdir aplicacion\casos-de-uso\comprobantePago
mkdir aplicacion\casos-de-uso\embarcacion
mkdir aplicacion\casos-de-uso\horarioTour
mkdir aplicacion\casos-de-uso\metodoPago
mkdir aplicacion\casos-de-uso\pago
mkdir aplicacion\casos-de-uso\paquetePasajes
mkdir aplicacion\casos-de-uso\cantidadPasajes
mkdir aplicacion\casos-de-uso\reserva
mkdir aplicacion\casos-de-uso\sede
mkdir aplicacion\casos-de-uso\tipoPasaje
mkdir aplicacion\casos-de-uso\tipoTour
mkdir aplicacion\casos-de-uso\tourProgramado
mkdir aplicacion\casos-de-uso\usuario

REM Crear archivos de puertos/entrada
echo Creando archivos de puertos/entrada...
echo. > aplicacion\puertos\entrada\ControladorCanalVenta.ts
echo. > aplicacion\puertos\entrada\ControladorHorarioChofer.ts
echo. > aplicacion\puertos\entrada\ControladorCliente.ts
echo. > aplicacion\puertos\entrada\ControladorComprobantePago.ts
echo. > aplicacion\puertos\entrada\ControladorEmbarcacion.ts
echo. > aplicacion\puertos\entrada\ControladorHorarioTour.ts
echo. > aplicacion\puertos\entrada\ControladorIdioma.ts
echo. > aplicacion\puertos\entrada\ControladorMetodoPago.ts
echo. > aplicacion\puertos\entrada\ControladorPago.ts
echo. > aplicacion\puertos\entrada\ControladorPaquetePasajes.ts
echo. > aplicacion\puertos\entrada\ControladorCantidadPasajes.ts
echo. > aplicacion\puertos\entrada\ControladorReserva.ts
echo. > aplicacion\puertos\entrada\ControladorSede.ts
echo. > aplicacion\puertos\entrada\ControladorTipoPasaje.ts
echo. > aplicacion\puertos\entrada\ControladorTipoTour.ts
echo. > aplicacion\puertos\entrada\ControladorTour.ts
echo. > aplicacion\puertos\entrada\ControladorTourProgramado.ts
echo. > aplicacion\puertos\entrada\ControladorUsuario.ts

REM Crear archivos de puertos/salida
echo Creando archivos de puertos/salida...
echo. > aplicacion\puertos\salida\RepositorioCanalVenta.ts
echo. > aplicacion\puertos\salida\RepositorioHorarioChofer.ts
echo. > aplicacion\puertos\salida\RepositorioCliente.ts
echo. > aplicacion\puertos\salida\RepositorioComprobantePago.ts
echo. > aplicacion\puertos\salida\RepositorioEmbarcacion.ts
echo. > aplicacion\puertos\salida\RepositorioHorarioTour.ts
echo. > aplicacion\puertos\salida\RepositorioIdioma.ts
echo. > aplicacion\puertos\salida\RepositorioMetodoPago.ts
echo. > aplicacion\puertos\salida\RepositorioPago.ts
echo. > aplicacion\puertos\salida\RepositorioPaquetePasajes.ts
echo. > aplicacion\puertos\salida\RepositorioCantidadPasajes.ts
echo. > aplicacion\puertos\salida\RepositorioReserva.ts
echo. > aplicacion\puertos\salida\RepositorioSede.ts
echo. > aplicacion\puertos\salida\RepositorioTipoPasaje.ts
echo. > aplicacion\puertos\salida\RepositorioTipoTour.ts
echo. > aplicacion\puertos\salida\RepositorioTourProgramado.ts
echo. > aplicacion\puertos\salida\RepositorioTour.ts
echo. > aplicacion\puertos\salida\RepositorioUsuario.ts

REM Crear archivos de casos de uso
echo Creando archivos de casos de uso...

REM canalVenta
echo. > aplicacion\casos-de-uso\canalVenta\ActualizarCanalVenta.ts
echo. > aplicacion\casos-de-uso\canalVenta\CrearCanalVenta.ts
echo. > aplicacion\casos-de-uso\canalVenta\EliminarCanalVenta.ts
echo. > aplicacion\casos-de-uso\canalVenta\ListarCanalesVenta.ts
echo. > aplicacion\casos-de-uso\canalVenta\ObtenerCanalVentaPorId.ts

REM horarioChofer
echo. > aplicacion\casos-de-uso\horarioChofer\ActualizarHorarioChofer.ts
echo. > aplicacion\casos-de-uso\horarioChofer\CrearHorarioChofer.ts
echo. > aplicacion\casos-de-uso\horarioChofer\EliminarHorarioChofer.ts
echo. > aplicacion\casos-de-uso\horarioChofer\ListarHorariosChofer.ts
echo. > aplicacion\casos-de-uso\horarioChofer\ListarHorariosChoferPorDia.ts
echo. > aplicacion\casos-de-uso\horarioChofer\ObtenerHorarioChoferPorId.ts

REM cliente
echo. > aplicacion\casos-de-uso\cliente\ActualizarCliente.ts
echo. > aplicacion\casos-de-uso\cliente\CrearCliente.ts
echo. > aplicacion\casos-de-uso\cliente\EliminarCliente.ts
echo. > aplicacion\casos-de-uso\cliente\ListarClientes.ts
echo. > aplicacion\casos-de-uso\cliente\ObtenerClientePorId.ts

REM comprobantePago
echo. > aplicacion\casos-de-uso\comprobantePago\ActualizarComprobantePago.ts
echo. > aplicacion\casos-de-uso\comprobantePago\CrearComprobantePago.ts
echo. > aplicacion\casos-de-uso\comprobantePago\EliminarComprobantePago.ts
echo. > aplicacion\casos-de-uso\comprobantePago\ListarComprobantesPago.ts
echo. > aplicacion\casos-de-uso\comprobantePago\ObtenerComprobantePagoPorId.ts

REM embarcacion
echo. > aplicacion\casos-de-uso\embarcacion\ActualizarEmbarcacion.ts
echo. > aplicacion\casos-de-uso\embarcacion\CrearEmbarcacion.ts
echo. > aplicacion\casos-de-uso\embarcacion\EliminarEmbarcacion.ts
echo. > aplicacion\casos-de-uso\embarcacion\ListarEmbarcaciones.ts
echo. > aplicacion\casos-de-uso\embarcacion\ListarEmbarcacionesPorChofer.ts
echo. > aplicacion\casos-de-uso\embarcacion\ListarEmbarcacionesPorSede.ts
echo. > aplicacion\casos-de-uso\embarcacion\ObtenerEmbarcacionPorId.ts

REM horarioTour
echo. > aplicacion\casos-de-uso\horarioTour\ActualizarHorarioTour.ts
echo. > aplicacion\casos-de-uso\horarioTour\CrearHorarioTour.ts
echo. > aplicacion\casos-de-uso\horarioTour\EliminarHorarioTour.ts
echo. > aplicacion\casos-de-uso\horarioTour\ListarHorarioPorTipoTour.ts
echo. > aplicacion\casos-de-uso\horarioTour\ListarHorariosTour.ts
echo. > aplicacion\casos-de-uso\horarioTour\ListarHorariosTourPorDia.ts.ts
echo. > aplicacion\casos-de-uso\horarioTour\ObtenerHorarioTourPorId.ts

REM metodoPago
echo. > aplicacion\casos-de-uso\metodoPago\ActualizarMetodoPago.ts
echo. > aplicacion\casos-de-uso\metodoPago\CrearMetodoPago.ts
echo. > aplicacion\casos-de-uso\metodoPago\EliminarMetodoPago.ts
echo. > aplicacion\casos-de-uso\metodoPago\ListarMetodosPago.ts
echo. > aplicacion\casos-de-uso\metodoPago\ObtenerMetodoPagoPorId.ts

REM pago
echo. > aplicacion\casos-de-uso\pago\ActualizarPago.ts
echo. > aplicacion\casos-de-uso\pago\CrearPago.ts
echo. > aplicacion\casos-de-uso\pago\EliminarPago.ts
echo. > aplicacion\casos-de-uso\pago\ListarPagos.ts
echo. > aplicacion\casos-de-uso\pago\ObtenerPagoPorId.ts

REM paquetePasajes
echo. > aplicacion\casos-de-uso\paquetePasajes\ActualizarPaquetePasajes.ts
echo. > aplicacion\casos-de-uso\paquetePasajes\CrearPaquetePasajes.ts
echo. > aplicacion\casos-de-uso\paquetePasajes\EliminarPaquetePasajes.ts
echo. > aplicacion\casos-de-uso\paquetePasajes\ListarPaquetesPasajes.ts
echo. > aplicacion\casos-de-uso\paquetePasajes\ObtenerPaquetePasajesPorId.ts

REM cantidadPasajes
echo. > aplicacion\casos-de-uso\cantidadPasajes\ActualizarCantidadPasaje.ts
echo. > aplicacion\casos-de-uso\cantidadPasajes\CrearCantidadPasaje.ts
echo. > aplicacion\casos-de-uso\cantidadPasajes\EliminarCantidadPasaje.ts
echo. > aplicacion\casos-de-uso\cantidadPasajes\ListarCantidadesPasaje.ts
echo. > aplicacion\casos-de-uso\cantidadPasajes\ObtenerCantidadPasajePorId.ts

REM reserva
echo. > aplicacion\casos-de-uso\reserva\ActualizarReserva.ts
echo. > aplicacion\casos-de-uso\reserva\CrearReserva.ts
echo. > aplicacion\casos-de-uso\reserva\EliminarReserva.ts
echo. > aplicacion\casos-de-uso\reserva\ListarReservas.ts
echo. > aplicacion\casos-de-uso\reserva\ObtenerReservaPorId.ts

REM sede
echo. > aplicacion\casos-de-uso\sede\ActualizarSede.ts
echo. > aplicacion\casos-de-uso\sede\CrearSede.ts
echo. > aplicacion\casos-de-uso\sede\EliminarSede.ts
echo. > aplicacion\casos-de-uso\sede\ListarSedes.ts
echo. > aplicacion\casos-de-uso\sede\ObtenerSedePorId.ts
echo. > aplicacion\casos-de-uso\sede\RestaurarSede.ts

REM tipoPasaje
echo. > aplicacion\casos-de-uso\tipoPasaje\ActualizarTipoPasaje.ts
echo. > aplicacion\casos-de-uso\tipoPasaje\CrearTipoPasaje.ts
echo. > aplicacion\casos-de-uso\tipoPasaje\EliminarTipoPasaje.ts
echo. > aplicacion\casos-de-uso\tipoPasaje\ListarTiposPasaje.ts
echo. > aplicacion\casos-de-uso\tipoPasaje\ObtenerTipoPasajePorId.ts

REM tipoTour
echo. > aplicacion\casos-de-uso\tipoTour\ActualizarTipoTour.ts
echo. > aplicacion\casos-de-uso\tipoTour\CrearTipoTour.ts
echo. > aplicacion\casos-de-uso\tipoTour\EliminarTipoTour.ts
echo. > aplicacion\casos-de-uso\tipoTour\ListarTiposTour.ts
echo. > aplicacion\casos-de-uso\tipoTour\ListarTourPorSede.ts
echo. > aplicacion\casos-de-uso\tipoTour\ObtenerTipoTourPorId.ts

REM tourProgramado
echo. > aplicacion\casos-de-uso\tourProgramado\ActualizarTourProgramado.ts
echo. > aplicacion\casos-de-uso\tourProgramado\CrearTourProgramado.ts
echo. > aplicacion\casos-de-uso\tourProgramado\EliminarTourProgramado.ts
echo. > aplicacion\casos-de-uso\tourProgramado\ListarToursProgramados.ts
echo. > aplicacion\casos-de-uso\tourProgramado\ObtenerTourProgramadoPorId.ts

REM usuario
echo. > aplicacion\casos-de-uso\usuario\ActualizarUsuario.ts
echo. > aplicacion\casos-de-uso\usuario\CrearUsuario.ts
echo. > aplicacion\casos-de-uso\usuario\EliminarUsuario.ts
echo. > aplicacion\casos-de-uso\usuario\ListarUsuarios.ts
echo. > aplicacion\casos-de-uso\usuario\ObtenerUsuarioPorId.ts

REM Crear estructura de dominio
echo Creando estructura de dominio...
mkdir dominio\entidades
mkdir dominio\objetos-valor

REM Crear archivos de entidades
echo Creando archivos de entidades...
echo. > dominio\entidades\CanalVenta.ts
echo. > dominio\entidades\HorarioChofer.ts
echo. > dominio\entidades\Cliente.ts
echo. > dominio\entidades\ComprobantePago.ts
echo. > dominio\entidades\Embarcacion.ts
echo. > dominio\entidades\HorarioTour.ts
echo. > dominio\entidades\Idioma.ts
echo. > dominio\entidades\MetodoPago.ts
echo. > dominio\entidades\Pago.ts
echo. > dominio\entidades\PaquetePasajes.ts
echo. > dominio\entidades\CantidadPasajes.ts
echo. > dominio\entidades\Reserva.ts
echo. > dominio\entidades\Sede.ts
echo. > dominio\entidades\TipoPasaje.ts
echo. > dominio\entidades\TipoTour.ts
echo. > dominio\entidades\TourProgramado.ts
echo. > dominio\entidades\Usuario.ts

REM Crear archivos de objetos-valor
echo Creando archivos de objetos-valor...
echo. > dominio\objetos-valor\RangoFecha.ts
echo. > dominio\objetos-valor\Email.ts
echo. > dominio\objetos-valor\Dinero.ts
echo. > dominio\objetos-valor\NumeroTelefono.ts

REM Crear estructura de infraestructura
echo Creando estructura de infraestructura...
mkdir infraestructura\api
mkdir infraestructura\i18n
mkdir infraestructura\repositorios
mkdir infraestructura\servicios\idioma\traducciones
mkdir infraestructura\store\slices
mkdir infraestructura\ui\componentes\comunes
mkdir infraestructura\ui\componentes\layout
mkdir infraestructura\ui\componentes\navegacion
mkdir infraestructura\ui\caracteristicas\autenticacion
mkdir infraestructura\ui\caracteristicas\carrito
mkdir infraestructura\ui\caracteristicas\inicio
mkdir infraestructura\ui\caracteristicas\reserva
mkdir infraestructura\ui\caracteristicas\tour
mkdir infraestructura\ui\layouts
mkdir infraestructura\ui\paginas\privadas
mkdir infraestructura\ui\paginas\publicas
mkdir infraestructura\ui\rutas
mkdir infraestructura\ui\estilos

REM Crear archivos de api
echo Creando archivos de api...
echo. > infraestructura\api\clienteAxios.ts
echo. > infraestructura\api\endpoints.ts
echo. > infraestructura\api\clientePublico.ts

REM Crear archivos de i18n
echo Creando archivos de i18n...
echo. > infraestructura\i18n\i18n.ts

REM Crear archivos de repositorios
echo Creando archivos de repositorios...
echo. > infraestructura\repositorios\RepoCanalVentaHttp.ts
echo. > infraestructura\repositorios\RepoHorarioChoferHttp.ts
echo. > infraestructura\repositorios\RepoClienteHttp.ts
echo. > infraestructura\repositorios\RepoComprobantePagoHttp.ts
echo. > infraestructura\repositorios\RepoEmbarcacionHttp.ts
echo. > infraestructura\repositorios\RepoHorarioTourHttp.ts
echo. > infraestructura\repositorios\RepoIdiomaHttp.ts
echo. > infraestructura\repositorios\RepoMetodoPagoHttp.ts
echo. > infraestructura\repositorios\RepoPagoHttp.ts
echo. > infraestructura\repositorios\RepoPaquetePasajesHttp.ts
echo. > infraestructura\repositorios\RepoCantidadPasajesHttp.ts
echo. > infraestructura\repositorios\RepoReservaHttp.ts
echo. > infraestructura\repositorios\RepoSedeHttp.ts
echo. > infraestructura\repositorios\RepoTipoPasajeHttp.ts
echo. > infraestructura\repositorios\RepoTipoTourHttp.ts
echo. > infraestructura\repositorios\RepoTourProgramadoHttp.ts
echo. > infraestructura\repositorios\RepoTourHttps.ts
echo. > infraestructura\repositorios\RepoUsuarioHttp.ts

REM Crear archivos de servicios/idioma
echo Creando archivos de servicios/idioma...
echo. > infraestructura\servicios\idioma\ContextoIdioma.tsx
echo. > infraestructura\servicios\idioma\traducciones\en.ts
echo. > infraestructura\servicios\idioma\traducciones\es.ts

REM Crear archivos de store
echo Creando archivos de store...
echo. > infraestructura\store\index.ts
echo. > infraestructura\store\slices\sliceAutenticacion.ts
echo. > infraestructura\store\slices\sliceCanalVenta.ts
echo. > infraestructura\store\slices\sliceCarrito.ts
echo. > infraestructura\store\slices\sliceHorarioChofer.ts
echo. > infraestructura\store\slices\sliceCliente.ts
echo. > infraestructura\store\slices\sliceComprobantePago.ts
echo. > infraestructura\store\slices\sliceEmbarcacion.ts
echo. > infraestructura\store\slices\sliceHorarioTour.ts
echo. > infraestructura\store\slices\sliceIdioma.ts
echo. > infraestructura\store\slices\sliceLenguaje.ts
echo. > infraestructura\store\slices\sliceMetodoPago.ts
echo. > infraestructura\store\slices\slicePago.ts
echo. > infraestructura\store\slices\slicePaquetePasajes.ts
echo. > infraestructura\store\slices\sliceCantidadPasajes.ts
echo. > infraestructura\store\slices\sliceReserva.ts
echo. > infraestructura\store\slices\sliceSede.ts
echo. > infraestructura\store\slices\sliceTipoPasaje.ts
echo. > infraestructura\store\slices\sliceTipoTour.ts
echo. > infraestructura\store\slices\sliceTourProgramado.ts
echo. > infraestructura\store\slices\sliceTour.ts
echo. > infraestructura\store\slices\sliceUsuario.ts

REM Crear archivos de ui/componentes
echo Creando archivos de ui/componentes...
echo. > infraestructura\ui\componentes\comunes\Alerta.tsx
echo. > infraestructura\ui\componentes\comunes\Insignia.tsx
echo. > infraestructura\ui\componentes\comunes\Boton.tsx
echo. > infraestructura\ui\componentes\comunes\Tarjeta.tsx
echo. > infraestructura\ui\componentes\comunes\SelectorFecha.tsx
echo. > infraestructura\ui\componentes\comunes\Entrada.tsx
echo. > infraestructura\ui\componentes\comunes\Cargador.tsx
echo. > infraestructura\ui\componentes\layout\Contenedor.tsx
echo. > infraestructura\ui\componentes\layout\PiePagina.tsx
echo. > infraestructura\ui\componentes\layout\Encabezado.tsx
echo. > infraestructura\ui\componentes\layout\Logo.tsx
echo. > infraestructura\ui\componentes\layout\Seccion.tsx
echo. > infraestructura\ui\componentes\navegacion\CambiadorIdioma.tsx

REM Crear archivos de ui/caracteristicas
echo Creando archivos de ui/caracteristicas...
echo. > infraestructura\ui\caracteristicas\autenticacion\FormularioIngreso.tsx
echo. > infraestructura\ui\caracteristicas\autenticacion\FormularioRegistro.tsx
echo. > infraestructura\ui\caracteristicas\carrito\ItemCarrito.tsx
echo. > infraestructura\ui\caracteristicas\carrito\ResumenCarrito.tsx
echo. > infraestructura\ui\caracteristicas\inicio\ToursDestacados.tsx
echo. > infraestructura\ui\caracteristicas\inicio\Hero.tsx
echo. > infraestructura\ui\caracteristicas\inicio\SuscripcionBoletin.tsx
echo. > infraestructura\ui\caracteristicas\inicio\Socios.tsx
echo. > infraestructura\ui\caracteristicas\inicio\Testimonios.tsx
echo. > infraestructura\ui\caracteristicas\reserva\DetalleReserva.tsx
echo. > infraestructura\ui\caracteristicas\reserva\FormularioReserva.tsx
echo. > infraestructura\ui\caracteristicas\reserva\ListaReservas.tsx
echo. > infraestructura\ui\caracteristicas\tour\SelectorPasaje.tsx
echo. > infraestructura\ui\caracteristicas\tour\ToursRelacionados.tsx
echo. > infraestructura\ui\caracteristicas\tour\FormularioReservacion.tsx
echo. > infraestructura\ui\caracteristicas\tour\TarjetaTour.tsx
echo. > infraestructura\ui\caracteristicas\tour\DetalleTour.tsx
echo. > infraestructura\ui\caracteristicas\tour\FiltrosTour.tsx
echo. > infraestructura\ui\caracteristicas\tour\GaleriaTour.tsx
echo. > infraestructura\ui\caracteristicas\tour\ListaTours.tsx
echo. > infraestructura\ui\caracteristicas\tour\ResenasTour.tsx

REM Crear archivos de ui/layouts
echo Creando archivos de ui/layouts...
echo. > infraestructura\ui\layouts\LayoutAutenticacion.tsx
echo. > infraestructura\ui\layouts\LayoutPrincipal.tsx
echo. > infraestructura\ui\layouts\BarraNavegacion.tsx
echo. > infraestructura\ui\layouts\LayoutVendedor.tsx

REM Crear archivos de ui/paginas
echo Creando archivos de ui/paginas...
echo. > infraestructura\ui\paginas\privadas\PaginaCarrito.tsx
echo. > infraestructura\ui\paginas\privadas\PaginaPago.tsx
echo. > infraestructura\ui\paginas\privadas\PaginaProcesoPago.tsx
echo. > infraestructura\ui\paginas\privadas\PaginaPerfil.tsx
echo. > infraestructura\ui\paginas\privadas\PaginaDetalleReserva.tsx
echo. > infraestructura\ui\paginas\privadas\PaginaReservaExitosa.tsx
echo. > infraestructura\ui\paginas\privadas\PaginaReservasUsuario.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaSobreNosotros.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaContacto.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaPreguntas.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaInicio.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaIngreso.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaNoEncontrada.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaRecuperacion.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaRegistro.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaSedes.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaDetalleTour.tsx
echo. > infraestructura\ui\paginas\publicas\PaginaTours.tsx

REM Crear archivos de ui/rutas
echo Creando archivos de ui/rutas...
echo. > infraestructura\ui\rutas\EnrutadorApp.tsx
echo. > infraestructura\ui\rutas\RutasPrivadas.tsx
echo. > infraestructura\ui\rutas\RutasPublicas.tsx

REM Crear archivos de ui/estilos
echo Creando archivos de ui/estilos...
echo. > infraestructura\ui\estilos\animaciones.css
echo. > infraestructura\ui\estilos\index.css
echo. > infraestructura\ui\estilos\impresion.css
echo. > infraestructura\ui\estilos\variables.css

REM Crear estructura de compartidos
echo Creando estructura de compartidos...
mkdir compartidos\constantes
mkdir compartidos\utilidades

REM Crear archivos de compartidos/constantes
echo Creando archivos de compartidos/constantes...
echo. > compartidos\constantes\rutasApi.ts
echo. > compartidos\constantes\rutasApp.ts
echo. > compartidos\constantes\roles.ts
echo. > compartidos\constantes\tema.ts

REM Crear archivos de compartidos/utilidades
echo Creando archivos de compartidos/utilidades...
echo. > compartidos\utilidades\formateadores.ts
echo. > compartidos\utilidades\ayudantes.ts
echo. > compartidos\utilidades\notificaciones.ts
echo. > compartidos\utilidades\validadores.ts

cd ..

echo.
echo ====================================================================
echo =                ESTRUCTURA CREADA EXITOSAMENTE                    =
echo ====================================================================
echo.
echo Se ha creado la estructura completa del proyecto en la carpeta src.
echo.

pause