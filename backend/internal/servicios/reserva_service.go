package servicios

import (
	"database/sql"
	"errors"
	"fmt"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"time"
)

// ReservaService maneja la lógica de negocio para reservas
type ReservaService struct {
	db                 *sql.DB
	reservaRepo        *repositorios.ReservaRepository
	clienteRepo        *repositorios.ClienteRepository
	instanciaTourRepo  *repositorios.InstanciaTourRepository
	tipoPasajeRepo     *repositorios.TipoPasajeRepository
	paquetePasajesRepo *repositorios.PaquetePasajesRepository
	usuarioRepo        *repositorios.UsuarioRepository
}

// NewReservaService crea una nueva instancia de ReservaService
func NewReservaService(
	db *sql.DB,
	reservaRepo *repositorios.ReservaRepository,
	clienteRepo *repositorios.ClienteRepository,
	instanciaTourRepo *repositorios.InstanciaTourRepository,
	tipoPasajeRepo *repositorios.TipoPasajeRepository,
	paquetePasajesRepo *repositorios.PaquetePasajesRepository,
	usuarioRepo *repositorios.UsuarioRepository,
) *ReservaService {
	return &ReservaService{
		db:                 db,
		reservaRepo:        reservaRepo,
		clienteRepo:        clienteRepo,
		instanciaTourRepo:  instanciaTourRepo,
		tipoPasajeRepo:     tipoPasajeRepo,
		paquetePasajesRepo: paquetePasajesRepo,
		usuarioRepo:        usuarioRepo,
	}
}

// Create crea una nueva reserva
func (s *ReservaService) Create(reserva *entidades.NuevaReservaRequest) (int, error) {
	// Verificar que el cliente existe
	_, err := s.clienteRepo.GetByID(reserva.IDCliente)
	if err != nil {
		return 0, errors.New("el cliente especificado no existe")
	}

	// Verificar que la instancia de tour existe
	instanciaTour, err := s.instanciaTourRepo.GetByID(reserva.IDInstancia)
	if err != nil {
		return 0, errors.New("la instancia de tour especificada no existe")
	}

	// Verificar que la instancia de tour está en estado PROGRAMADO
	if instanciaTour.Estado != "PROGRAMADO" {
		return 0, errors.New("no se puede reservar en una instancia que no está programada")
	}

	// Si se especifica un vendedor, verificar que existe y es vendedor
	if reserva.IDVendedor != nil {
		usuario, err := s.usuarioRepo.GetByID(*reserva.IDVendedor)
		if err != nil {
			return 0, errors.New("el vendedor especificado no existe")
		}
		if usuario.Rol != "VENDEDOR" && usuario.Rol != "ADMIN" {
			return 0, errors.New("el usuario especificado no es un vendedor")
		}
	}

	// Verificar que los tipos de pasaje existen
	totalPasajerosIndividuales := 0
	for _, pasaje := range reserva.CantidadPasajes {
		_, err := s.tipoPasajeRepo.GetByID(pasaje.IDTipoPasaje)
		if err != nil {
			return 0, errors.New("uno de los tipos de pasaje especificados no existe")
		}
		totalPasajerosIndividuales += pasaje.Cantidad
	}

	// Verificar que los paquetes existen y calcular total de pasajeros
	totalPasajerosPaquetes := 0
	for _, paquete := range reserva.Paquetes {
		paqueteInfo, err := s.paquetePasajesRepo.GetByID(paquete.IDPaquete)
		if err != nil {
			return 0, errors.New("uno de los paquetes especificados no existe")
		}
		totalPasajerosPaquetes += paqueteInfo.CantidadTotal * paquete.Cantidad
	}

	// Calcular total de pasajeros
	totalPasajeros := totalPasajerosIndividuales + totalPasajerosPaquetes

	// Verificar disponibilidad de cupo
	if totalPasajeros > instanciaTour.CupoDisponible {
		return 0, errors.New("no hay suficiente cupo disponible para la cantidad de pasajeros solicitada")
	}

	// Crear reserva
	id, err := s.reservaRepo.Create(reserva)
	if err != nil {
		return 0, err
	}

	return id, nil
}

// GetByID obtiene una reserva por su ID
func (s *ReservaService) GetByID(id int) (*entidades.Reserva, error) {
	return s.reservaRepo.GetByID(id)
}

// Update actualiza una reserva existente
func (s *ReservaService) Update(id int, reserva *entidades.ActualizarReservaRequest) error {
	// Verificar que la reserva existe
	_, err := s.reservaRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Verificar que el cliente existe
	_, err = s.clienteRepo.GetByID(reserva.IDCliente)
	if err != nil {
		return errors.New("el cliente especificado no existe")
	}

	// Verificar que la instancia de tour existe
	instanciaTour, err := s.instanciaTourRepo.GetByID(reserva.IDInstancia)
	if err != nil {
		return errors.New("la instancia de tour especificada no existe")
	}

	// Verificar que la instancia de tour está en estado PROGRAMADO
	if instanciaTour.Estado != "PROGRAMADO" {
		return errors.New("no se puede reservar en una instancia que no está programada")
	}

	// Si se especifica un vendedor, verificar que existe y es vendedor
	if reserva.IDVendedor != nil {
		usuario, err := s.usuarioRepo.GetByID(*reserva.IDVendedor)
		if err != nil {
			return errors.New("el vendedor especificado no existe")
		}
		if usuario.Rol != "VENDEDOR" && usuario.Rol != "ADMIN" {
			return errors.New("el usuario especificado no es un vendedor")
		}
	}

	// Verificar que los tipos de pasaje existen
	for _, pasaje := range reserva.CantidadPasajes {
		_, err := s.tipoPasajeRepo.GetByID(pasaje.IDTipoPasaje)
		if err != nil {
			return errors.New("uno de los tipos de pasaje especificados no existe")
		}
	}

	// Verificar que los paquetes existen
	for _, paquete := range reserva.Paquetes {
		_, err := s.paquetePasajesRepo.GetByID(paquete.IDPaquete)
		if err != nil {
			return errors.New("uno de los paquetes especificados no existe")
		}
	}

	// El repositorio maneja internamente la lógica de verificar cupos y actualizar instancias
	return s.reservaRepo.Update(id, reserva)
}

// CambiarEstado cambia el estado de una reserva
func (s *ReservaService) CambiarEstado(id int, estado string) error {
	// Verificar que la reserva existe
	_, err := s.reservaRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Verificar que el estado es válido
	if estado != "RESERVADO" && estado != "CANCELADA" && estado != "CONFIRMADA" {
		return errors.New("estado de reserva inválido")
	}

	// Actualizar estado de la reserva
	return s.reservaRepo.UpdateEstado(id, estado)
}

// Delete realiza una eliminación lógica de una reserva
func (s *ReservaService) Delete(id int) error {
	// Verificar que la reserva existe
	_, err := s.reservaRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Eliminar reserva (lógicamente)
	return s.reservaRepo.Delete(id)
}

// List obtiene todas las reservas activas del sistema
func (s *ReservaService) List() ([]*entidades.Reserva, error) {
	return s.reservaRepo.List()
}

// ListByCliente lista todas las reservas de un cliente específico
func (s *ReservaService) ListByCliente(idCliente int) ([]*entidades.Reserva, error) {
	// Verificar que el cliente existe
	_, err := s.clienteRepo.GetByID(idCliente)
	if err != nil {
		return nil, errors.New("el cliente especificado no existe")
	}

	return s.reservaRepo.ListByCliente(idCliente)
}

// ListByInstancia lista todas las reservas para una instancia específica
func (s *ReservaService) ListByInstancia(idInstancia int) ([]*entidades.Reserva, error) {
	// Verificar que la instancia existe
	_, err := s.instanciaTourRepo.GetByID(idInstancia)
	if err != nil {
		return nil, errors.New("la instancia de tour especificada no existe")
	}

	return s.reservaRepo.ListByInstancia(idInstancia)
}

// ListByFecha lista todas las reservas para una fecha específica
func (s *ReservaService) ListByFecha(fecha time.Time) ([]*entidades.Reserva, error) {
	return s.reservaRepo.ListByFecha(fecha)
}

// ListByEstado lista todas las reservas por estado específico
func (s *ReservaService) ListByEstado(estado string) ([]*entidades.Reserva, error) {
	// Verificar que el estado es válido
	if estado != "RESERVADO" && estado != "CANCELADA" && estado != "CONFIRMADA" {
		return nil, errors.New("estado de reserva inválido")
	}

	return s.reservaRepo.ListByEstado(estado)
}

// ListAllReservas lista todas las reservas (para ADMIN)
func (s *ReservaService) ListAllReservas() ([]*entidades.Reserva, error) {
	return s.reservaRepo.List()
}

// ReservarConMercadoPago crea una reserva y genera una preferencia de pago para Mercado Pago
func (s *ReservaService) ReservarConMercadoPago(
	request *entidades.ReservaMercadoPagoRequest,
	mercadoPagoService *MercadoPagoService,
	frontendURL string,
) (*entidades.ReservaMercadoPagoResponse, error) {
	// Verificar que el cliente existe
	cliente, err := s.clienteRepo.GetByID(request.IDCliente)
	if err != nil {
		return nil, errors.New("el cliente especificado no existe")
	}

	// Verificar que la instancia existe y está programada
	instancia, err := s.instanciaTourRepo.GetByID(request.IDInstancia)
	if err != nil {
		return nil, errors.New("la instancia de tour especificada no existe")
	}

	if instancia.Estado != "PROGRAMADO" {
		return nil, errors.New("no se puede reservar en una instancia que no está programada")
	}

	// Verificar que los tipos de pasaje existen
	totalPasajerosIndividuales := 0
	for _, pasaje := range request.CantidadPasajes {
		_, err := s.tipoPasajeRepo.GetByID(pasaje.IDTipoPasaje)
		if err != nil {
			return nil, errors.New("uno de los tipos de pasaje especificados no existe")
		}
		totalPasajerosIndividuales += pasaje.Cantidad
	}

	// Verificar que los paquetes existen y calcular total de pasajeros
	totalPasajerosPaquetes := 0
	for _, paquete := range request.Paquetes {
		paqueteInfo, err := s.paquetePasajesRepo.GetByID(paquete.IDPaquete)
		if err != nil {
			return nil, errors.New("uno de los paquetes especificados no existe")
		}
		totalPasajerosPaquetes += paqueteInfo.CantidadTotal * paquete.Cantidad
	}

	// Calcular total de pasajeros
	totalPasajeros := totalPasajerosIndividuales + totalPasajerosPaquetes

	// Verificar disponibilidad de cupo
	if totalPasajeros > instancia.CupoDisponible {
		return nil, errors.New("no hay suficiente cupo disponible para la cantidad de pasajeros solicitada")
	}

	// Crear la reserva y obtener su ID
	idReserva, nombreTour, err := s.reservaRepo.ReservarInstanciaMercadoPago(request)
	if err != nil {
		return nil, err
	}

	// Actualizar datos del cliente si es necesario
	if request.Telefono != "" && cliente.NumeroCelular == "" {
		actualizarClienteRequest := &entidades.ActualizarClienteRequest{
			Nombres:         cliente.Nombres,
			Apellidos:       cliente.Apellidos,
			Correo:          cliente.Correo,
			NumeroCelular:   request.Telefono,
			NumeroDocumento: cliente.NumeroDocumento,
		}

		err = s.clienteRepo.Update(cliente.ID, actualizarClienteRequest)
		if err != nil {
			// No fallar la reserva por esto, solo registrar el error
			fmt.Printf("Error al actualizar teléfono del cliente: %v\n", err)
		}
	}

	if request.Documento != "" && cliente.NumeroDocumento == "" {
		actualizarClienteRequest := &entidades.ActualizarClienteRequest{
			Nombres:         cliente.Nombres,
			Apellidos:       cliente.Apellidos,
			Correo:          cliente.Correo,
			NumeroCelular:   cliente.NumeroCelular,
			NumeroDocumento: request.Documento,
		}

		err = s.clienteRepo.Update(cliente.ID, actualizarClienteRequest)
		if err != nil {
			// No fallar la reserva por esto, solo registrar el error
			fmt.Printf("Error al actualizar documento del cliente: %v\n", err)
		}
	}

	// Crear preferencia de pago en Mercado Pago
	preferencia, err := mercadoPagoService.CreatePreference(
		nombreTour,
		request.TotalPagar,
		idReserva,
		cliente,
		frontendURL,
	)
	if err != nil {
		// Si falla la creación de la preferencia, cancelamos la reserva
		_ = s.reservaRepo.UpdateEstado(idReserva, "CANCELADA")
		return nil, fmt.Errorf("error al crear preferencia de pago: %v", err)
	}

	// Crear respuesta con los datos de la preferencia
	respuesta := &entidades.ReservaMercadoPagoResponse{
		IDReserva:        idReserva,
		NombreTour:       nombreTour,
		PreferenceID:     preferencia.ID,
		InitPoint:        preferencia.InitPoint,
		SandboxInitPoint: preferencia.SandboxInitPoint,
	}

	return respuesta, nil
}

// ConfirmarPagoReserva confirma una reserva después de recibir el pago
func (s *ReservaService) ConfirmarPagoReserva(idReserva int, idTransaccion string, monto float64) error {
	// Verificar que la reserva existe
	reserva, err := s.reservaRepo.GetByID(idReserva)
	if err != nil {
		return errors.New("la reserva especificada no existe")
	}

	// Verificar que la reserva está en estado RESERVADO
	if reserva.Estado != "RESERVADO" {
		return errors.New("la reserva no está en estado RESERVADO")
	}

	// Actualizar estado de la reserva a CONFIRMADA
	err = s.reservaRepo.UpdateEstado(idReserva, "CONFIRMADA")
	if err != nil {
		return fmt.Errorf("error al confirmar la reserva: %v", err)
	}

	return nil
}

// GetTotalPasajerosByInstancia obtiene el total de pasajeros reservados para una instancia
func (s *ReservaService) GetTotalPasajerosByInstancia(idInstancia int) (int, error) {
	// Verificar que la instancia existe
	_, err := s.instanciaTourRepo.GetByID(idInstancia)
	if err != nil {
		return 0, errors.New("la instancia de tour especificada no existe")
	}

	return s.reservaRepo.GetTotalPasajerosByInstancia(idInstancia)
}

// VerificarDisponibilidadInstancia verifica si hay suficiente cupo en una instancia
func (s *ReservaService) VerificarDisponibilidadInstancia(idInstancia int, cantidadPasajeros int) (bool, error) {
	// Verificar que la instancia existe
	_, err := s.instanciaTourRepo.GetByID(idInstancia)
	if err != nil {
		return false, errors.New("la instancia de tour especificada no existe")
	}

	return s.reservaRepo.VerificarDisponibilidadInstancia(idInstancia, cantidadPasajeros)
}

// UpdateEstado actualiza el estado de una reserva
func (s *ReservaService) UpdateEstado(id int, estado string) error {
	// Verificar que existe la reserva
	_, err := s.reservaRepo.GetByID(id)
	if err != nil {
		return errors.New("la reserva especificada no existe")
	}

	// Validar que el estado sea uno de los permitidos
	estadosPermitidos := map[string]bool{
		"RESERVADO":  true,
		"CONFIRMADA": true,
		"CANCELADA":  true,
		"COMPLETADA": true,
		"ANULADA":    true,
	}

	if !estadosPermitidos[estado] {
		return errors.New("estado de reserva no válido")
	}

	// Actualizar estado en la base de datos
	return s.reservaRepo.UpdateEstado(id, estado)
}

// En servicios/reserva_service.go

// VerificarYConfirmarPago verifica el estado del pago con Mercado Pago y actualiza la reserva si es necesario
func (s *ReservaService) VerificarYConfirmarPago(idReserva int, status string, paymentID string,
	preferenceID string, mercadoPagoService *MercadoPagoService) (string, error) {
	// Verificar que la reserva existe
	reserva, err := s.GetByID(idReserva)
	if err != nil {
		return "", fmt.Errorf("error al obtener la reserva: %v", err)
	}

	// Si ya está confirmada, no hacer nada
	if reserva.Estado == "CONFIRMADA" {
		return "CONFIRMADA", nil
	}

	// Determinar estado del pago según los parámetros recibidos
	estadoPago := ""

	// Si tenemos status directo, usarlo
	if status != "" {
		estadoPago = status
	} else if paymentID != "" {
		// Si tenemos payment_id, verificar con Mercado Pago
		paymentInfo, err := mercadoPagoService.GetPaymentInfo(paymentID)
		if err != nil {
			return "", fmt.Errorf("error al obtener información del pago: %v", err)
		}
		estadoPago = paymentInfo.Status
	} else if preferenceID != "" {
		// Si tenemos preference_id, verificar con Mercado Pago
		status, _, _, err := mercadoPagoService.VerificarEstadoPago(preferenceID, "")
		if err != nil {
			return "", fmt.Errorf("error al verificar estado del pago: %v", err)
		}
		estadoPago = status
	} else {
		return "", fmt.Errorf("no se proporcionó información suficiente para verificar el pago")
	}

	// Si el pago está aprobado, confirmar la reserva
	if estadoPago == "approved" {
		// Confirmar reserva con pago
		err = s.reservaRepo.ConfirmarReservaConPago(idReserva, paymentID, reserva.TotalPagar)
		if err != nil {
			return "", fmt.Errorf("error al confirmar reserva con pago: %v", err)
		}
		return "CONFIRMADA", nil
	}

	// Si el pago está rechazado, actualizar estado
	if estadoPago == "rejected" || estadoPago == "cancelled" {
		err = s.UpdateEstado(idReserva, "CANCELADA")
		if err != nil {
			return "", fmt.Errorf("error al actualizar estado de la reserva: %v", err)
		}
		return "CANCELADA", nil
	}

	// En otros casos, mantener el estado actual
	return reserva.Estado, nil
}
