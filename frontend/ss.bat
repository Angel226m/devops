@echo off
setlocal enabledelayedexpansion

:: Crear la carpeta src si no existe
if not exist src mkdir src

:: Cambiar al directorio src
cd src

:: Crear carpetas y archivos en domain
mkdir domain\entities
mkdir domain\value-objects
echo. > domain\entities\Sede.ts
echo. > domain\entities\Usuario.ts
echo. > domain\entities\Embarcacion.ts
echo. > domain\entities\TipoTour.ts
echo. > domain\entities\HorarioTour.ts
echo. > domain\entities\ChoferHorario.ts
echo. > domain\entities\TourProgramado.ts
echo. > domain\entities\MetodoPago.ts
echo. > domain\entities\CanalVenta.ts
echo. > domain\entities\Cliente.ts
echo. > domain\entities\Reserva.ts
echo. > domain\entities\TipoPasaje.ts
echo. > domain\entities\PasajesCantidad.ts
echo. > domain\entities\Pago.ts
echo. > domain\entities\ComprobantePago.ts
echo. > domain\value-objects\Email.ts
echo. > domain\value-objects\PhoneNumber.ts
echo. > domain\value-objects\DateRange.ts
echo. > domain\value-objects\Money.ts

:: Crear carpetas y archivos en application
mkdir application\ports\in
mkdir application\ports\out
mkdir application\use-cases\sede
mkdir application\use-cases\usuario
mkdir application\use-cases\embarcacion
mkdir application\use-cases\tipoTour
mkdir application\use-cases\horarioTour
mkdir application\use-cases\choferHorario
mkdir application\use-cases\tourProgramado
mkdir application\use-cases\metodoPago
mkdir application\use-cases\canalVenta
mkdir application\use-cases\cliente
mkdir application\use-cases\reserva
mkdir application\use-cases\tipoPasaje
mkdir application\use-cases\pasajesCantidad
mkdir application\use-cases\pago
mkdir application\use-cases\comprobantePago

:: Archivos en ports/in
echo. > application\ports\in\SedeController.ts
echo. > application\ports\in\UsuarioController.ts
echo. > application\ports\in\EmbarcacionController.ts
echo. > application\ports\in\TipoTourController.ts
echo. > application\ports\in\HorarioTourController.ts
echo. > application\ports\in\ChoferHorarioController.ts
echo. > application\ports\in\TourProgramadoController.ts
echo. > application\ports\in\MetodoPagoController.ts
echo. > application\ports\in\CanalVentaController.ts
echo. > application\ports\in\ClienteController.ts
echo. > application\ports\in\ReservaController.ts
echo. > application\ports\in\TipoPasajeController.ts
echo. > application\ports\in\PasajesCantidadController.ts
echo. > application\ports\in\PagoController.ts
echo. > application\ports\in\ComprobantePagoController.ts

:: Archivos en ports/out
echo. > application\ports\out\SedeRepository.ts
echo. > application\ports\out\UsuarioRepository.ts
echo. > application\ports\out\EmbarcacionRepository.ts
echo. > application\ports\out\TipoTourRepository.ts
echo. > application\ports\out\HorarioTourRepository.ts
echo. > application\ports\out\ChoferHorarioRepository.ts
echo. > application\ports\out\TourProgramadoRepository.ts
echo. > application\ports\out\MetodoPagoRepository.ts
echo. > application\ports\out\CanalVentaRepository.ts
echo. > application\ports\out\ClienteRepository.ts
echo. > application\ports\out\ReservaRepository.ts
echo. > application\ports\out\TipoPasajeRepository.ts
echo. > application\ports\out\PasajesCantidadRepository.ts
echo. > application\ports\out\PagoRepository.ts
echo. > application\ports\out\ComprobantePagoRepository.ts

:: Archivos en use-cases para cada entidad
echo. > application\use-cases\sede\ListarSedes.ts
echo. > application\use-cases\sede\ObtenerSedePorId.ts
echo. > application\use-cases\sede\CrearSede.ts
echo. > application\use-cases\sede\ActualizarSede.ts
echo. > application\use-cases\sede\EliminarSede.ts
echo. > application\use-cases\usuario\ListarUsuarios.ts
echo. > application\use-cases\usuario\ObtenerUsuarioPorId.ts
echo. > application\use-cases\usuario\CrearUsuario.ts
echo. > application\use-cases\usuario\ActualizarUsuario.ts
echo. > application\use-cases\usuario\EliminarUsuario.ts
echo. > application\use-cases\embarcacion\ListarEmbarcaciones.ts
echo. > application\use-cases\embarcacion\ObtenerEmbarcacionPorId.ts
echo. > application\use-cases\embarcacion\CrearEmbarcacion.ts
echo. > application\use-cases\embarcacion\ActualizarEmbarcacion.ts
echo. > application\use-cases\embarcacion\EliminarEmbarcacion.ts
echo. > application\use-cases\tipoTour\ListarTiposTour.ts
echo. > application\use-cases\tipoTour\ObtenerTipoTourPorId.ts
echo. > application\use-cases\tipoTour\CrearTipoTour.ts
echo. > application\use-cases\tipoTour\ActualizarTipoTour.ts
echo. > application\use-cases\tipoTour\EliminarTipoTour.ts
echo. > application\use-cases\horarioTour\ListarHorariosTour.ts
echo. > application\use-cases\horarioTour\ObtenerHorarioTourPorId.ts
echo. > application\use-cases\horarioTour\CrearHorarioTour.ts
echo. > application\use-cases\horarioTour\ActualizarHorarioTour.ts
echo. > application\use-cases\horarioTour\EliminarHorarioTour.ts
echo. > application\use-cases\choferHorario\ListarChoferesHorario.ts
echo. > application\use-cases\choferHorario\ObtenerChoferHorarioPorId.ts
echo. > application\use-cases\choferHorario\CrearChoferHorario.ts
echo. > application\use-cases\choferHorario\ActualizarChoferHorario.ts
echo. > application\use-cases\choferHorario\EliminarChoferHorario.ts
echo. > application\use-cases\tourProgramado\ListarToursProgramados.ts
echo. > application\use-cases\tourProgramado\ObtenerTourProgramadoPorId.ts
echo. > application\use-cases\tourProgramado\CrearTourProgramado.ts
echo. > application\use-cases\tourProgramado\ActualizarTourProgramado.ts
echo. > application\use-cases\tourProgramado\EliminarTourProgramado.ts
echo. > application\use-cases\metodoPago\ListarMetodosPago.ts
echo. > application\use-cases\metodoPago\ObtenerMetodoPagoPorId.ts
echo. > application\use-cases\metodoPago\CrearMetodoPago.ts
echo. > application\use-cases\metodoPago\ActualizarMetodoPago.ts
echo. > application\use-cases\metodoPago\EliminarMetodoPago.ts
echo. > application\use-cases\canalVenta\ListarCanalesVenta.ts
echo. > application\use-cases\canalVenta\ObtenerCanalVentaPorId.ts
echo. > application\use-cases\canalVenta\CrearCanalVenta.ts
echo. > application\use-cases\canalVenta\ActualizarCanalVenta.ts
echo. > application\use-cases\canalVenta\EliminarCanalVenta.ts
echo. > application\use-cases\cliente\ListarClientes.ts
echo. > application\use-cases\cliente\ObtenerClientePorId.ts
echo. > application\use-cases\cliente\CrearCliente.ts
echo. > application\use-cases\cliente\ActualizarCliente.ts
echo. > application\use-cases\cliente\EliminarCliente.ts
echo. > application\use-cases\reserva\ListarReservas.ts
echo. > application\use-cases\reserva\ObtenerReservaPorId.ts
echo. > application\use-cases\reserva\CrearReserva.ts
echo. > application\use-cases\reserva\ActualizarReserva.ts
echo. > application\use-cases\reserva\EliminarReserva.ts
echo. > application\use-cases\tipoPasaje\ListarTiposPasaje.ts
echo. > application\use-cases\tipoPasaje\ObtenerTipoPasajePorId.ts
echo. > application\use-cases\tipoPasaje\CrearTipoPasaje.ts
echo. > application\use-cases\tipoPasaje\ActualizarTipoPasaje.ts
echo. > application\use-cases\tipoPasaje\EliminarTipoPasaje.ts
echo. > application\use-cases\pasajesCantidad\ListarPasajesCantidad.ts
echo. > application\use-cases\pasajesCantidad\ObtenerPasajeCantidadPorId.ts
echo. > application\use-cases\pasajesCantidad\CrearPasajeCantidad.ts
echo. > application\use-cases\pasajesCantidad\ActualizarPasajeCantidad.ts
echo. > application\use-cases\pasajesCantidad\EliminarPasajeCantidad.ts
echo. > application\use-cases\pago\ListarPagos.ts
echo. > application\use-cases\pago\ObtenerPagoPorId.ts
echo. > application\use-cases\pago\CrearPago.ts
echo. > application\use-cases\pago\ActualizarPago.ts
echo. > application\use-cases\pago\EliminarPago.ts
echo. > application\use-cases\comprobantePago\ListarComprobantesPago.ts
echo. > application\use-cases\comprobantePago\ObtenerComprobantePagoPorId.ts
echo. > application\use-cases\comprobantePago\CrearComprobantePago.ts
echo. > application\use-cases\comprobantePago\ActualizarComprobantePago.ts
echo. > application\use-cases\comprobantePago\EliminarComprobantePago.ts

:: Crear carpetas y archivos en infrastructure
mkdir infrastructure\api
mkdir infrastructure\repositories
mkdir infrastructure\ui\components
mkdir infrastructure\ui\features\sede
mkdir infrastructure\ui\features\usuario
mkdir infrastructure\ui\features\embarcacion
mkdir infrastructure\ui\features\tipoTour
mkdir infrastructure\ui\features\horarioTour
mkdir infrastructure\ui\features\choferHorario
mkdir infrastructure\ui\features\tourProgramado
mkdir infrastructure\ui\features\metodoPago
mkdir infrastructure\ui\features\canalVenta
mkdir infrastructure\ui\features\cliente
mkdir infrastructure\ui\features\reserva
mkdir infrastructure\ui\features\tipoPasaje
mkdir infrastructure\ui\features\pasajesCantidad
mkdir infrastructure\ui\features\pago
mkdir infrastructure\ui\features\comprobantePago
mkdir infrastructure\ui\pages
mkdir infrastructure\ui\layouts
mkdir infrastructure\ui\styles
mkdir infrastructure\store\slices

:: Archivos en api
echo. > infrastructure\api\axiosClient.ts
echo. > infrastructure\api\endpoints.ts

:: Archivos en repositories
echo. > infrastructure\repositories\SedeRepoHttp.ts
echo. > infrastructure\repositories\UsuarioRepoHttp.ts
echo. > infrastructure\repositories\EmbarcacionRepoHttp.ts
echo. > infrastructure\repositories\TipoTourRepoHttp.ts
echo. > infrastructure\repositories\HorarioTourRepoHttp.ts
echo. > infrastructure\repositories\ChoferHorarioRepoHttp.ts
echo. > infrastructure\repositories\TourProgramadoRepoHttp.ts
echo. > infrastructure\repositories\MetodoPagoRepoHttp.ts
echo. > infrastructure\repositories\CanalVentaRepoHttp.ts
echo. > infrastructure\repositories\ClienteRepoHttp.ts
echo. > infrastructure\repositories\ReservaRepoHttp.ts
echo. > infrastructure\repositories\TipoPasajeRepoHttp.ts
echo. > infrastructure\repositories\PasajesCantidadRepoHttp.ts
echo. > infrastructure\repositories\PagoRepoHttp.ts
echo. > infrastructure\repositories\ComprobantePagoRepoHttp.ts

:: Archivos en ui/components
echo. > infrastructure\ui\components\Button.tsx
echo. > infrastructure\ui\components\Card.tsx
echo. > infrastructure\ui\components\Modal.tsx
echo. > infrastructure\ui\components\Table.tsx
echo. > infrastructure\ui\components\FormInput.tsx
echo. > infrastructure\ui\components\Select.tsx
echo. > infrastructure\ui\components\DatePicker.tsx

:: Archivos en ui/features para cada entidad
echo. > infrastructure\ui\features\sede\SedeList.tsx
echo. > infrastructure\ui\features\sede\SedeForm.tsx
echo. > infrastructure\ui\features\sede\SedeDetail.tsx
echo. > infrastructure\ui\features\usuario\UsuarioList.tsx
echo. > infrastructure\ui\features\usuario\UsuarioForm.tsx
echo. > infrastructure\ui\features\usuario\UsuarioDetail.tsx
echo. > infrastructure\ui\features\embarcacion\EmbarcacionList.tsx
echo. > infrastructure\ui\features\embarcacion\EmbarcacionForm.tsx
echo. > infrastructure\ui\features\embarcacion\EmbarcacionDetail.tsx
echo. > infrastructure\ui\features\tipoTour\TipoTourList.tsx
echo. > infrastructure\ui\features\tipoTour\TipoTourForm.tsx
echo. > infrastructure\ui\features\tipoTour\TipoTourDetail.tsx
echo. > infrastructure\ui\features\horarioTour\HorarioTourList.tsx
echo. > infrastructure\ui\features\horarioTour\HorarioTourForm.tsx
echo. > infrastructure\ui\features\horarioTour\HorarioTourDetail.tsx
echo. > infrastructure\ui\features\choferHorario\ChoferHorarioList.tsx
echo. > infrastructure\ui\features\choferHorario\ChoferHorarioForm.tsx
echo. > infrastructure\ui\features\choferHorario\ChoferHorarioDetail.tsx
echo. > infrastructure\ui\features\tourProgramado\TourProgramadoList.tsx
echo. > infrastructure\ui\features\tourProgramado\TourProgramadoForm.tsx
echo. > infrastructure\ui\features\tourProgramado\TourProgramadoDetail.tsx
echo. > infrastructure\ui\features\metodoPago\MetodoPagoList.tsx
echo. > infrastructure\ui\features\metodoPago\MetodoPagoForm.tsx
echo. > infrastructure\ui\features\metodoPago\MetodoPagoDetail.tsx
echo. > infrastructure\ui\features\canalVenta\CanalVentaList.tsx
echo. > infrastructure\ui\features\canalVenta\CanalVentaForm.tsx
echo. > infrastructure\ui\features\canalVenta\CanalVentaDetail.tsx
echo. > infrastructure\ui\features\cliente\ClienteList.tsx
echo. > infrastructure\ui\features\cliente\ClienteForm.tsx
echo. > infrastructure\ui\features\cliente\ClienteDetail.tsx
echo. > infrastructure\ui\features\reserva\ReservaList.tsx
echo. > infrastructure\ui\features\reserva\ReservaForm.tsx
echo. > infrastructure\ui\features\reserva\ReservaDetail.tsx
echo. > infrastructure\ui\features\tipoPasaje\TipoPasajeList.tsx
echo. > infrastructure\ui\features\tipoPasaje\TipoPasajeForm.tsx
echo. > infrastructure\ui\features\tipoPasaje\TipoPasajeDetail.tsx
echo. > infrastructure\ui\features\pasajesCantidad\PasajesCantidadList.tsx
echo. > infrastructure\ui\features\pasajesCantidad\PasajesCantidadForm.tsx
echo. > infrastructure\ui\features\pasajesCantidad\PasajesCantidadDetail.tsx
echo. > infrastructure\ui\features\pago\PagoList.tsx
echo. > infrastructure\ui\features\pago\PagoForm.tsx
echo. > infrastructure\ui\features\pago\PagoDetail.tsx
echo. > infrastructure\ui\features\comprobantePago\ComprobantePagoList.tsx
echo. > infrastructure\ui\features\comprobantePago\ComprobantePagoForm.tsx
echo. > infrastructure\ui\features\comprobantePago\ComprobantePagoDetail.tsx

:: Archivos en ui/pages
echo. > infrastructure\ui\pages\AdminDashboard.tsx
echo. > infrastructure\ui\pages\SedesPage.tsx
echo. > infrastructure\ui\pages\UsuariosPage.tsx
echo. > infrastructure\ui\pages\EmbarcacionesPage.tsx
echo. > infrastructure\ui\pages\TiposTourPage.tsx
echo. > infrastructure\ui\pages\HorariosTourPage.tsx
echo. > infrastructure\ui\pages\ChoferesHorarioPage.tsx
echo. > infrastructure\ui\pages\ToursProgramadosPage.tsx
echo. > infrastructure\ui\pages\MetodosPagoPage.tsx
echo. > infrastructure\ui\pages\CanalesVentaPage.tsx
echo. > infrastructure\ui\pages\ClientesPage.tsx
echo. > infrastructure\ui\pages\ReservasPage.tsx
echo. > infrastructure\ui\pages\TiposPasajePage.tsx
echo. > infrastructure\ui\pages\PasajesCantidadPage.tsx
echo. > infrastructure\ui\pages\PagosPage.tsx
echo. > infrastructure\ui\pages\ComprobantesPagoPage.tsx
echo. > infrastructure\ui\pages\LoginPage.tsx
echo. > infrastructure\ui\pages\RegisterPage.tsx
echo. > infrastructure\ui\pages\NotFoundPage.tsx
echo. > infrastructure\ui\pages\ErrorPage.tsx

:: Archivos en ui/layouts
echo. > infrastructure\ui\layouts\AdminLayout.tsx
echo. > infrastructure\ui\layouts\VendorLayout.tsx
echo. > infrastructure\ui\layouts\AuthLayout.tsx

:: Archivos en ui/styles
echo. > infrastructure\ui\styles\index.css
echo. > infrastructure\ui\styles\variables.css
echo. > infrastructure\ui\styles\print.css

:: Archivos en store
echo. > infrastructure\store\index.ts
echo. > infrastructure\store\slices\sedeSlice.ts
echo. > infrastructure\store\slices\usuarioSlice.ts
echo. > infrastructure\store\slices\embarcacionSlice.ts
echo. > infrastructure\store\slices\tipoTourSlice.ts
echo. > infrastructure\store\slices\horarioTourSlice.ts
echo. > infrastructure\store\slices\choferHorarioSlice.ts
echo. > infrastructure\store\slices\tourProgramadoSlice.ts
echo. > infrastructure\store\slices\metodoPagoSlice.ts
echo. > infrastructure\store\slices\canalVentaSlice.ts
echo. > infrastructure\store\slices\clienteSlice.ts
echo. > infrastructure\store\slices\reservaSlice.ts
echo. > infrastructure\store\slices\tipoPasajeSlice.ts
echo. > infrastructure\store\slices\pasajesCantidadSlice.ts
echo. > infrastructure\store\slices\pagoSlice.ts
echo. > infrastructure\store\slices\comprobantePagoSlice.ts
echo. > infrastructure\store\slices\authSlice.ts

:: Crear carpetas y archivos en shared
mkdir shared\utils
mkdir shared\constants
echo. > shared\utils\formatters.ts
echo. > shared\utils\validators.ts
echo. > shared\utils\notifications.ts
echo. > shared\utils\helpers.ts
echo. > shared\constants\apiPaths.ts
echo. > shared\constants\theme.ts
echo. > shared\constants\appRoutes.ts
echo. > shared\constants\roles.ts

echo Estructura de src/ creada exitosamente.