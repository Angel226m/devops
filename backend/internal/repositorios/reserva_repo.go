package repositorios

import (
	"database/sql"
	"errors"
	"fmt"
	"sistema-toursseft/internal/entidades"
	"time"
)

// ReservaRepository maneja las operaciones de base de datos para reservas
type ReservaRepository struct {
	db *sql.DB
}

// NewReservaRepository crea una nueva instancia del repositorio
func NewReservaRepository(db *sql.DB) *ReservaRepository {
	return &ReservaRepository{
		db: db,
	}
}

// GetByID obtiene una reserva por su ID
/*
func (r *ReservaRepository) GetByID(id int) (*entidades.Reserva, error) {
	// Inicializar objeto de reserva
	reserva := &entidades.Reserva{}

	// Consulta para obtener datos básicos de la reserva
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia,
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.id_reserva = $1 AND r.eliminado = FALSE`

	err := r.db.QueryRow(query, id).Scan(
		&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
		&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
		&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
		&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("reserva no encontrada")
		}
		return nil, err
	}

	// Obtener las cantidades de pasajes individuales
	queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                    FROM pasajes_cantidad pc
                    INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                    WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

	rowsPasajes, err := r.db.Query(queryPasajes, id)
	if err != nil {
		return nil, err
	}
	defer rowsPasajes.Close()

	// Inicializar el slice de cantidades de pasajes
	reserva.CantidadPasajes = []entidades.PasajeCantidad{}

	// Iterar por cada registro de pasajes individuales
	for rowsPasajes.Next() {
		var pasajeCantidad entidades.PasajeCantidad
		err := rowsPasajes.Scan(
			&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
		)
		if err != nil {
			return nil, err
		}
		reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
	}

	if err = rowsPasajes.Err(); err != nil {
		return nil, err
	}

	// Obtener los paquetes de pasajes
	queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad,
                     pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                     pp.cantidad_total
                     FROM paquete_pasaje_detalle ppd
                     INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                     WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

	rowsPaquetes, err := r.db.Query(queryPaquetes, id)
	if err != nil {
		return nil, err
	}
	defer rowsPaquetes.Close()

	// Inicializar el slice de paquetes
	reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

	// Iterar por cada registro de paquetes
	for rowsPaquetes.Next() {
		var paquete entidades.PaquetePasajeDetalle
		err := rowsPaquetes.Scan(
			&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
			&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
		)
		if err != nil {
			return nil, err
		}
		reserva.Paquetes = append(reserva.Paquetes, paquete)
	}

	if err = rowsPaquetes.Err(); err != nil {
		return nil, err
	}

	// Obtener el método de pago (si existe)
	queryMetodoPago := `
		SELECT COALESCE(mp.nombre, 'No registrado')
		FROM pago p
		LEFT JOIN metodo_pago mp ON p.metodo_pago = mp.metodo_pago
		WHERE p.id_reserva = $1 AND p.eliminado = FALSE
		ORDER BY p.fecha_pago DESC
		LIMIT 1
	`
	var metodoPago string
	err = r.db.QueryRow(queryMetodoPago, id).Scan(&metodoPago)
	if err != nil && err != sql.ErrNoRows {
		// Si hay un error que no sea "no rows", registrarlo pero no fallar
		fmt.Printf("Error al obtener método de pago para reserva %d: %v\n", id, err)
	} else if err == nil {
		// Si se encontró un método de pago, asignarlo
		reserva.MetodoPago = metodoPago
	}

	return reserva, nil
}
*/

// GetByID obtiene una reserva por su ID
func (r *ReservaRepository) GetByID(id int) (*entidades.Reserva, error) {
	// Inicializar objeto de reserva
	reserva := &entidades.Reserva{}

	// Consulta para obtener datos básicos de la reserva
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.id_reserva = $1 AND r.eliminado = FALSE`

	err := r.db.QueryRow(query, id).Scan(
		&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
		&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
		&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
		&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("reserva no encontrada")
		}
		return nil, err
	}

	// Obtener las cantidades de pasajes individuales
	queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                    FROM pasajes_cantidad pc
                    INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                    WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

	rowsPasajes, err := r.db.Query(queryPasajes, id)
	if err != nil {
		return nil, err
	}
	defer rowsPasajes.Close()

	// Inicializar el slice de cantidades de pasajes
	reserva.CantidadPasajes = []entidades.PasajeCantidad{}

	// Iterar por cada registro de pasajes individuales
	for rowsPasajes.Next() {
		var pasajeCantidad entidades.PasajeCantidad
		err := rowsPasajes.Scan(
			&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
		)
		if err != nil {
			return nil, err
		}
		reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
	}

	if err = rowsPasajes.Err(); err != nil {
		return nil, err
	}

	// Obtener los paquetes de pasajes
	queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, 
                     pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                     pp.cantidad_total
                     FROM paquete_pasaje_detalle ppd
                     INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                     WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

	rowsPaquetes, err := r.db.Query(queryPaquetes, id)
	if err != nil {
		return nil, err
	}
	defer rowsPaquetes.Close()

	// Inicializar el slice de paquetes
	reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

	// Iterar por cada registro de paquetes
	for rowsPaquetes.Next() {
		var paquete entidades.PaquetePasajeDetalle
		err := rowsPaquetes.Scan(
			&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
			&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
		)
		if err != nil {
			return nil, err
		}
		reserva.Paquetes = append(reserva.Paquetes, paquete)
	}

	if err = rowsPaquetes.Err(); err != nil {
		return nil, err
	}

	// Obtener el método de pago (si existe) - CORREGIDO
	queryMetodoPago := `
		SELECT COALESCE(p.metodo_pago, 'No registrado') 
		FROM pago p
		WHERE p.id_reserva = $1 AND p.eliminado = FALSE
		ORDER BY p.fecha_pago DESC
		LIMIT 1
	`
	var metodoPago string
	err = r.db.QueryRow(queryMetodoPago, id).Scan(&metodoPago)
	if err != nil && err != sql.ErrNoRows {
		// Si hay un error que no sea "no rows", registrarlo pero no fallar
		fmt.Printf("Error al obtener método de pago para reserva %d: %v\n", id, err)
	} else if err == nil {
		// Si se encontró un método de pago, asignarlo
		reserva.MetodoPago = metodoPago
	}

	return reserva, nil
}

// Create guarda una nueva reserva en la base de datos
func (r *ReservaRepository) Create(reserva *entidades.NuevaReservaRequest) (int, error) {
	// Iniciar transacción
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}

	// Si hay error, hacer rollback
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Verificar que al menos haya un pasaje o un paquete
	if len(reserva.CantidadPasajes) == 0 && len(reserva.Paquetes) == 0 {
		return 0, errors.New("debe incluir al menos un pasaje o un paquete en la reserva")
	}

	// Primero, obtener información de la instancia del tour para verificar disponibilidad
	var cupoDisponible int
	queryInstancia := `SELECT cupo_disponible FROM instancia_tour 
                      WHERE id_instancia = $1 AND eliminado = FALSE 
                      AND estado = 'PROGRAMADO'`
	err = tx.QueryRow(queryInstancia, reserva.IDInstancia).Scan(&cupoDisponible)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, errors.New("la instancia del tour no existe, está eliminada o no está programada")
		}
		return 0, err
	}

	// Calcular el total de pasajeros
	totalPasajeros := 0

	// Sumar pasajeros de pasajes individuales
	for _, pasaje := range reserva.CantidadPasajes {
		totalPasajeros += pasaje.Cantidad
	}

	// Sumar pasajeros de paquetes
	for _, paquete := range reserva.Paquetes {
		// Obtener cantidad total de pasajeros por paquete
		var cantidadPorPaquete int
		queryPaquete := `SELECT cantidad_total FROM paquete_pasajes 
                        WHERE id_paquete = $1 AND eliminado = FALSE`
		err := tx.QueryRow(queryPaquete, paquete.IDPaquete).Scan(&cantidadPorPaquete)
		if err != nil {
			return 0, err
		}

		// Multiplicar por la cantidad de paquetes seleccionados
		totalPasajeros += cantidadPorPaquete * paquete.Cantidad
	}

	// Verificar disponibilidad
	if totalPasajeros > cupoDisponible {
		return 0, errors.New("no hay suficiente cupo disponible para la reserva")
	}

	// Establecer fecha de expiración por defecto (24 horas)
	fechaExpiracion := time.Now().Add(24 * time.Hour)

	// Consulta SQL para insertar una nueva reserva
	var idReserva int
	query := `INSERT INTO reserva (id_vendedor, id_cliente, id_instancia, 
             total_pagar, notas, estado, eliminado, fecha_expiracion)
             VALUES ($1, $2, $3, $4, $5, 'RESERVADO', FALSE, $6)
             RETURNING id_reserva`

	// Ejecutar la consulta con los datos de la reserva
	err = tx.QueryRow(
		query,
		reserva.IDVendedor,
		reserva.IDCliente,
		reserva.IDInstancia,
		reserva.TotalPagar,
		reserva.Notas,
		fechaExpiracion,
	).Scan(&idReserva)

	if err != nil {
		return 0, err
	}

	// Insertar las cantidades de pasajes individuales
	for _, pasaje := range reserva.CantidadPasajes {
		// Solo insertar si la cantidad es mayor que cero
		if pasaje.Cantidad > 0 {
			queryPasaje := `INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado)
                          VALUES ($1, $2, $3, FALSE)`

			_, err = tx.Exec(queryPasaje, idReserva, pasaje.IDTipoPasaje, pasaje.Cantidad)
			if err != nil {
				return 0, err
			}
		}
	}

	// Insertar los paquetes de pasajes
	for _, paquete := range reserva.Paquetes {
		// Solo insertar si la cantidad es mayor que cero
		if paquete.Cantidad > 0 {
			queryPaquete := `INSERT INTO paquete_pasaje_detalle (id_reserva, id_paquete, cantidad, eliminado)
                           VALUES ($1, $2, $3, FALSE)`

			_, err = tx.Exec(queryPaquete, idReserva, paquete.IDPaquete, paquete.Cantidad)
			if err != nil {
				return 0, err
			}
		}
	}

	// Actualizar el cupo disponible en la instancia del tour
	queryUpdateCupo := `UPDATE instancia_tour 
                       SET cupo_disponible = cupo_disponible - $1 
                       WHERE id_instancia = $2`
	_, err = tx.Exec(queryUpdateCupo, totalPasajeros, reserva.IDInstancia)
	if err != nil {
		return 0, err
	}

	// Commit de la transacción
	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return idReserva, nil
}

// Update actualiza la información de una reserva existente
func (r *ReservaRepository) Update(id int, reserva *entidades.ActualizarReservaRequest) error {
	// Iniciar transacción
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// Si hay error, hacer rollback
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Primero, obtener la reserva actual para calcular la diferencia de pasajeros
	var idInstanciaActual int
	var estadoActual string
	queryReservaActual := `SELECT id_instancia, estado FROM reserva 
                          WHERE id_reserva = $1 AND eliminado = FALSE`

	err = tx.QueryRow(queryReservaActual, id).Scan(&idInstanciaActual, &estadoActual)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("reserva no encontrada")
		}
		return err
	}

	// Obtener cantidad actual de pasajeros
	var totalPasajerosActual int
	if estadoActual != "CANCELADA" { // Solo contar si la reserva no estaba cancelada
		// Contar pasajeros de pasajes individuales
		queryPasajesActual := `SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad 
                             WHERE id_reserva = $1 AND eliminado = FALSE`
		err = tx.QueryRow(queryPasajesActual, id).Scan(&totalPasajerosActual)
		if err != nil {
			return err
		}

		// Contar pasajeros de paquetes
		queryPaquetesActual := `SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0)
                              FROM paquete_pasaje_detalle ppd
                              INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                              WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`
		var pasajerosPaquetesActual int
		err = tx.QueryRow(queryPaquetesActual, id).Scan(&pasajerosPaquetesActual)
		if err != nil {
			return err
		}

		totalPasajerosActual += pasajerosPaquetesActual
	}

	// Calcular la cantidad nueva de pasajeros
	totalPasajerosNuevo := 0

	// Sumar pasajeros de pasajes individuales
	for _, pasaje := range reserva.CantidadPasajes {
		totalPasajerosNuevo += pasaje.Cantidad
	}

	// Sumar pasajeros de paquetes
	for _, paquete := range reserva.Paquetes {
		// Obtener cantidad total de pasajeros por paquete
		var cantidadPorPaquete int
		queryPaquete := `SELECT cantidad_total FROM paquete_pasajes 
                        WHERE id_paquete = $1 AND eliminado = FALSE`
		err := tx.QueryRow(queryPaquete, paquete.IDPaquete).Scan(&cantidadPorPaquete)
		if err != nil {
			return err
		}

		// Multiplicar por la cantidad de paquetes seleccionados
		totalPasajerosNuevo += cantidadPorPaquete * paquete.Cantidad
	}

	// Verificar disponibilidad si cambia la cantidad o la instancia
	if idInstanciaActual != reserva.IDInstancia || totalPasajerosActual != totalPasajerosNuevo {
		// Si es la misma instancia, verificar solo la diferencia
		if idInstanciaActual == reserva.IDInstancia {
			var cupoDisponible int
			queryInstancia := `SELECT cupo_disponible FROM instancia_tour 
                            WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`
			err := tx.QueryRow(queryInstancia, reserva.IDInstancia).Scan(&cupoDisponible)
			if err != nil {
				if err == sql.ErrNoRows {
					return errors.New("la instancia del tour no existe, está eliminada o no está programada")
				}
				return err
			}

			// Calcular diferencia de pasajeros
			diferenciaPasajeros := totalPasajerosNuevo - totalPasajerosActual

			// Verificar si hay suficiente cupo
			if diferenciaPasajeros > cupoDisponible {
				return errors.New("no hay suficiente cupo disponible para la actualización de la reserva")
			}

			// Actualizar cupo si hay diferencia
			if diferenciaPasajeros != 0 {
				queryUpdateCupo := `UPDATE instancia_tour 
                               SET cupo_disponible = cupo_disponible - $1 
                               WHERE id_instancia = $2`
				_, err = tx.Exec(queryUpdateCupo, diferenciaPasajeros, reserva.IDInstancia)
				if err != nil {
					return err
				}
			}
		} else {
			// Si es una instancia diferente, restaurar cupo en la instancia anterior y verificar en la nueva
			if estadoActual != "CANCELADA" { // Solo restaurar si no estaba cancelada
				queryRestauraCupo := `UPDATE instancia_tour 
                                SET cupo_disponible = cupo_disponible + $1 
                                WHERE id_instancia = $2`
				_, err = tx.Exec(queryRestauraCupo, totalPasajerosActual, idInstanciaActual)
				if err != nil {
					return err
				}
			}

			// Verificar cupo en la nueva instancia
			var cupoDisponible int
			queryInstancia := `SELECT cupo_disponible FROM instancia_tour 
                            WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`
			err := tx.QueryRow(queryInstancia, reserva.IDInstancia).Scan(&cupoDisponible)
			if err != nil {
				if err == sql.ErrNoRows {
					return errors.New("la nueva instancia del tour no existe, está eliminada o no está programada")
				}
				return err
			}

			if totalPasajerosNuevo > cupoDisponible {
				return errors.New("no hay suficiente cupo disponible en la nueva instancia seleccionada")
			}

			// Actualizar cupo en la nueva instancia
			queryUpdateCupo := `UPDATE instancia_tour 
                           SET cupo_disponible = cupo_disponible - $1 
                           WHERE id_instancia = $2`
			_, err = tx.Exec(queryUpdateCupo, totalPasajerosNuevo, reserva.IDInstancia)
			if err != nil {
				return err
			}
		}
	}

	// Verificar cambio de estado
	if estadoActual != reserva.Estado {
		// Si se cancela la reserva, restaurar cupo
		if reserva.Estado == "CANCELADA" && estadoActual != "CANCELADA" {
			queryRestauraCupo := `UPDATE instancia_tour 
                               SET cupo_disponible = cupo_disponible + $1 
                               WHERE id_instancia = $2`
			_, err = tx.Exec(queryRestauraCupo, totalPasajerosActual, idInstanciaActual)
			if err != nil {
				return err
			}
		}

		// Si se reactiva una reserva cancelada, verificar cupo
		if estadoActual == "CANCELADA" && reserva.Estado != "CANCELADA" {
			var cupoDisponible int
			queryInstancia := `SELECT cupo_disponible FROM instancia_tour 
                            WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`
			err := tx.QueryRow(queryInstancia, reserva.IDInstancia).Scan(&cupoDisponible)
			if err != nil {
				if err == sql.ErrNoRows {
					return errors.New("la instancia del tour no existe, está eliminada o no está programada")
				}
				return err
			}

			if totalPasajerosNuevo > cupoDisponible {
				return errors.New("no hay suficiente cupo disponible para reactivar la reserva")
			}

			// Actualizar cupo al reactivar
			queryUpdateCupo := `UPDATE instancia_tour 
                           SET cupo_disponible = cupo_disponible - $1 
                           WHERE id_instancia = $2`
			_, err = tx.Exec(queryUpdateCupo, totalPasajerosNuevo, reserva.IDInstancia)
			if err != nil {
				return err
			}
		}
	}

	// Si el estado cambia a CONFIRMADA, eliminar la fecha de expiración
	var fechaExpiracionSQL interface{} = nil
	if reserva.Estado == "CONFIRMADA" {
		// Pasamos nil para establecer NULL en la base de datos
		fechaExpiracionSQL = nil
	} else if reserva.Estado == "RESERVADO" {
		// Para estado RESERVADO mantenemos o establecemos una fecha de expiración
		fechaExpiracion := time.Now().Add(24 * time.Hour)
		fechaExpiracionSQL = fechaExpiracion
	}

	// Actualizar la reserva con los nuevos datos
	query := `UPDATE reserva SET
              id_vendedor = $1,
              id_cliente = $2,
              id_instancia = $3,
              total_pagar = $4,
              notas = $5,
              estado = $6,
              fecha_expiracion = $7
              WHERE id_reserva = $8 AND eliminado = FALSE`

	// Ejecutar la actualización
	_, err = tx.Exec(
		query,
		reserva.IDVendedor,
		reserva.IDCliente,
		reserva.IDInstancia,
		reserva.TotalPagar,
		reserva.Notas,
		reserva.Estado,
		fechaExpiracionSQL,
		id,
	)

	if err != nil {
		return err
	}

	// Marcar como eliminados los registros de pasajes actuales
	queryDeletePasajes := `UPDATE pasajes_cantidad SET eliminado = TRUE WHERE id_reserva = $1`
	_, err = tx.Exec(queryDeletePasajes, id)
	if err != nil {
		return err
	}

	// Marcar como eliminados los registros de paquetes actuales
	queryDeletePaquetes := `UPDATE paquete_pasaje_detalle SET eliminado = TRUE WHERE id_reserva = $1`
	_, err = tx.Exec(queryDeletePaquetes, id)
	if err != nil {
		return err
	}

	// Insertar nuevas cantidades de pasajes
	for _, pasaje := range reserva.CantidadPasajes {
		// Solo insertar si la cantidad es mayor que cero
		if pasaje.Cantidad > 0 {
			queryPasaje := `INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado)
                         VALUES ($1, $2, $3, FALSE)`

			_, err = tx.Exec(queryPasaje, id, pasaje.IDTipoPasaje, pasaje.Cantidad)
			if err != nil {
				return err
			}
		}
	}

	// Insertar nuevos paquetes
	for _, paquete := range reserva.Paquetes {
		// Solo insertar si la cantidad es mayor que cero
		if paquete.Cantidad > 0 {
			queryPaquete := `INSERT INTO paquete_pasaje_detalle (id_reserva, id_paquete, cantidad, eliminado)
                          VALUES ($1, $2, $3, FALSE)`

			_, err = tx.Exec(queryPaquete, id, paquete.IDPaquete, paquete.Cantidad)
			if err != nil {
				return err
			}
		}
	}

	// Commit de la transacción
	return tx.Commit()
}

// UpdateEstado actualiza solo el estado de una reserva
func (r *ReservaRepository) UpdateEstado(id int, estado string) error {
	// Iniciar transacción
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// Si hay error, hacer rollback
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Obtener la reserva actual
	var idInstancia int
	var estadoActual string
	queryReservaActual := `SELECT id_instancia, estado FROM reserva 
                          WHERE id_reserva = $1 AND eliminado = FALSE`

	err = tx.QueryRow(queryReservaActual, id).Scan(&idInstancia, &estadoActual)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("reserva no encontrada")
		}
		return err
	}

	// Verificar cambio de estado para manejo de cupos
	if estadoActual != estado {
		// Si se cancela una reserva activa, restaurar cupo
		if estado == "CANCELADA" && estadoActual != "CANCELADA" {
			// Obtener total de pasajeros
			totalPasajeros, err := r.GetCantidadPasajerosByReservaTx(tx, id)
			if err != nil {
				return err
			}

			// Restaurar cupo
			queryRestauraCupo := `UPDATE instancia_tour 
                               SET cupo_disponible = cupo_disponible + $1 
                               WHERE id_instancia = $2`
			_, err = tx.Exec(queryRestauraCupo, totalPasajeros, idInstancia)
			if err != nil {
				return err
			}
		}

		// Si se reactiva una reserva cancelada, verificar y reducir cupo
		if estadoActual == "CANCELADA" && estado != "CANCELADA" {
			// Obtener total de pasajeros
			totalPasajeros, err := r.GetCantidadPasajerosByReservaTx(tx, id)
			if err != nil {
				return err
			}

			// Verificar cupo disponible
			var cupoDisponible int
			queryInstancia := `SELECT cupo_disponible FROM instancia_tour 
                            WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`
			err = tx.QueryRow(queryInstancia, idInstancia).Scan(&cupoDisponible)
			if err != nil {
				if err == sql.ErrNoRows {
					return errors.New("la instancia del tour no existe, está eliminada o no está programada")
				}
				return err
			}

			if totalPasajeros > cupoDisponible {
				return errors.New("no hay suficiente cupo disponible para reactivar la reserva")
			}

			// Reducir cupo
			queryUpdateCupo := `UPDATE instancia_tour 
                           SET cupo_disponible = cupo_disponible - $1 
                           WHERE id_instancia = $2`
			_, err = tx.Exec(queryUpdateCupo, totalPasajeros, idInstancia)
			if err != nil {
				return err
			}
		}
	}

	// Manejar fecha de expiración según el estado
	var fechaExpiracionSQL interface{} = nil

	if estado == "CONFIRMADA" {
		// Si se confirma, eliminar fecha de expiración
		fechaExpiracionSQL = nil
	} else if estado == "CANCELADA" {
		// Si se cancela, eliminar fecha de expiración
		fechaExpiracionSQL = nil
	} else if estado == "RESERVADO" {
		// Si está reservado, mantener una fecha de expiración de 24 horas desde ahora
		fechaExpiracion := time.Now().Add(24 * time.Hour)
		fechaExpiracionSQL = fechaExpiracion
	}

	// Actualizar estado y fecha de expiración
	query := `UPDATE reserva SET estado = $1, fecha_expiracion = $2 WHERE id_reserva = $3 AND eliminado = FALSE`
	_, err = tx.Exec(query, estado, fechaExpiracionSQL, id)
	if err != nil {
		return err
	}

	// Commit de la transacción
	return tx.Commit()
}

// GetCantidadPasajerosByReservaTx obtiene la cantidad total de pasajeros dentro de una transacción
func (r *ReservaRepository) GetCantidadPasajerosByReservaTx(tx *sql.Tx, id int) (int, error) {
	var totalPasajerosIndividuales int
	queryPasajes := `SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad 
                   WHERE id_reserva = $1 AND eliminado = FALSE`
	err := tx.QueryRow(queryPasajes, id).Scan(&totalPasajerosIndividuales)
	if err != nil {
		return 0, err
	}

	var totalPasajerosPaquetes int
	queryPaquetes := `SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0)
                    FROM paquete_pasaje_detalle ppd
                    INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                    WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`
	err = tx.QueryRow(queryPaquetes, id).Scan(&totalPasajerosPaquetes)
	if err != nil {
		return 0, err
	}

	return totalPasajerosIndividuales + totalPasajerosPaquetes, nil
}

// GetCantidadPasajerosByReserva obtiene la cantidad total de pasajeros en una reserva
func (r *ReservaRepository) GetCantidadPasajerosByReserva(id int) (int, error) {
	var totalPasajerosIndividuales int
	queryPasajes := `SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad 
                   WHERE id_reserva = $1 AND eliminado = FALSE`
	err := r.db.QueryRow(queryPasajes, id).Scan(&totalPasajerosIndividuales)
	if err != nil {
		return 0, err
	}

	var totalPasajerosPaquetes int
	queryPaquetes := `SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0)
                    FROM paquete_pasaje_detalle ppd
                    INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                    WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`
	err = r.db.QueryRow(queryPaquetes, id).Scan(&totalPasajerosPaquetes)
	if err != nil {
		return 0, err
	}

	return totalPasajerosIndividuales + totalPasajerosPaquetes, nil
}

// Delete realiza una eliminación lógica de una reserva
func (r *ReservaRepository) Delete(id int) error {
	// Iniciar transacción
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// Si hay error, hacer rollback
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Verificar si hay pagos asociados a esta reserva (que no estén eliminados)
	var countPagos int
	queryCheckPagos := `SELECT COUNT(*) FROM pago WHERE id_reserva = $1 AND eliminado = FALSE`
	err = tx.QueryRow(queryCheckPagos, id).Scan(&countPagos)
	if err != nil {
		return err
	}

	if countPagos > 0 {
		return errors.New("no se puede eliminar esta reserva porque tiene pagos asociados")
	}

	// Verificar si hay comprobantes asociados a esta reserva (que no estén eliminados)
	var countComprobantes int
	queryCheckComprobantes := `SELECT COUNT(*) FROM comprobante_pago WHERE id_reserva = $1 AND eliminado = FALSE`
	err = tx.QueryRow(queryCheckComprobantes, id).Scan(&countComprobantes)
	if err != nil {
		return err
	}

	if countComprobantes > 0 {
		return errors.New("no se puede eliminar esta reserva porque tiene comprobantes asociados")
	}

	// Obtener información de la reserva para restaurar cupo
	var idInstancia int
	var estado string
	queryReserva := `SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`
	err = tx.QueryRow(queryReserva, id).Scan(&idInstancia, &estado)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("reserva no encontrada")
		}
		return err
	}

	// Si la reserva no está cancelada, restaurar cupo
	if estado != "CANCELADA" {
		// Obtener total de pasajeros
		totalPasajeros, err := r.GetCantidadPasajerosByReservaTx(tx, id)
		if err != nil {
			return err
		}

		// Restaurar cupo
		queryRestauraCupo := `UPDATE instancia_tour 
                          SET cupo_disponible = cupo_disponible + $1 
                          WHERE id_instancia = $2`
		_, err = tx.Exec(queryRestauraCupo, totalPasajeros, idInstancia)
		if err != nil {
			return err
		}
	}

	// Marcar los registros de pasajes como eliminados (eliminación lógica)
	queryDeletePasajes := `UPDATE pasajes_cantidad SET eliminado = TRUE WHERE id_reserva = $1`
	_, err = tx.Exec(queryDeletePasajes, id)
	if err != nil {
		return err
	}

	// Marcar los registros de paquetes como eliminados (eliminación lógica)
	queryDeletePaquetes := `UPDATE paquete_pasaje_detalle SET eliminado = TRUE WHERE id_reserva = $1`
	_, err = tx.Exec(queryDeletePaquetes, id)
	if err != nil {
		return err
	}

	// Marcar la reserva como eliminada (eliminación lógica)
	queryDeleteReserva := `UPDATE reserva SET eliminado = TRUE WHERE id_reserva = $1`
	_, err = tx.Exec(queryDeleteReserva, id)
	if err != nil {
		return err
	}

	// Commit de la transacción
	return tx.Commit()
}

// List obtiene todas las reservas activas del sistema
func (r *ReservaRepository) List() ([]*entidades.Reserva, error) {
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.eliminado = FALSE
              ORDER BY r.fecha_reserva DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservas := []*entidades.Reserva{}

	// Iterar por cada reserva encontrada
	for rows.Next() {
		reserva := &entidades.Reserva{}
		err := rows.Scan(
			&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
			&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
			&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
			&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
		)
		if err != nil {
			return nil, err
		}

		// Obtener las cantidades de pasajes para cada reserva
		queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                       FROM pasajes_cantidad pc
                       INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                       WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

		rowsPasajes, err := r.db.Query(queryPasajes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.CantidadPasajes = []entidades.PasajeCantidad{}

		// Iterar por cada registro de pasaje
		for rowsPasajes.Next() {
			var pasajeCantidad entidades.PasajeCantidad
			err := rowsPasajes.Scan(
				&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
			)
			if err != nil {
				rowsPasajes.Close()
				return nil, err
			}
			reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
		}

		rowsPasajes.Close()
		if err = rowsPasajes.Err(); err != nil {
			return nil, err
		}

		// Obtener los paquetes de pasajes
		queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, 
                        pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                        pp.cantidad_total
                        FROM paquete_pasaje_detalle ppd
                        INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                        WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

		rowsPaquetes, err := r.db.Query(queryPaquetes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

		// Iterar por cada registro de paquete
		for rowsPaquetes.Next() {
			var paquete entidades.PaquetePasajeDetalle
			err := rowsPaquetes.Scan(
				&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
				&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
			)
			if err != nil {
				rowsPaquetes.Close()
				return nil, err
			}
			reserva.Paquetes = append(reserva.Paquetes, paquete)
		}

		rowsPaquetes.Close()
		if err = rowsPaquetes.Err(); err != nil {
			return nil, err
		}

		reservas = append(reservas, reserva)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reservas, nil
}

// ListByCliente lista todas las reservas activas de un cliente específico
func (r *ReservaRepository) ListByCliente(idCliente int) ([]*entidades.Reserva, error) {
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.id_cliente = $1 AND r.eliminado = FALSE
              ORDER BY r.fecha_reserva DESC`

	rows, err := r.db.Query(query, idCliente)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservas := []*entidades.Reserva{}

	// Iterar por cada reserva encontrada
	for rows.Next() {
		reserva := &entidades.Reserva{}
		err := rows.Scan(
			&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
			&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
			&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
			&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
		)
		if err != nil {
			return nil, err
		}

		// Obtener las cantidades de pasajes para cada reserva
		queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                       FROM pasajes_cantidad pc
                       INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                       WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

		rowsPasajes, err := r.db.Query(queryPasajes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.CantidadPasajes = []entidades.PasajeCantidad{}

		// Iterar por cada registro de pasaje
		for rowsPasajes.Next() {
			var pasajeCantidad entidades.PasajeCantidad
			err := rowsPasajes.Scan(
				&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
			)
			if err != nil {
				rowsPasajes.Close()
				return nil, err
			}
			reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
		}

		rowsPasajes.Close()
		if err = rowsPasajes.Err(); err != nil {
			return nil, err
		}

		// Obtener los paquetes de pasajes
		queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, 
                        pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                        pp.cantidad_total
                        FROM paquete_pasaje_detalle ppd
                        INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                        WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

		rowsPaquetes, err := r.db.Query(queryPaquetes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

		// Iterar por cada registro de paquete
		for rowsPaquetes.Next() {
			var paquete entidades.PaquetePasajeDetalle
			err := rowsPaquetes.Scan(
				&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
				&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
			)
			if err != nil {
				rowsPaquetes.Close()
				return nil, err
			}
			reserva.Paquetes = append(reserva.Paquetes, paquete)
		}

		rowsPaquetes.Close()
		if err = rowsPaquetes.Err(); err != nil {
			return nil, err
		}

		reservas = append(reservas, reserva)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reservas, nil
}

// ListByInstancia lista todas las reservas asociadas a una instancia específica de tour
func (r *ReservaRepository) ListByInstancia(idInstancia int) ([]*entidades.Reserva, error) {
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.id_instancia = $1 AND r.eliminado = FALSE
              ORDER BY r.fecha_reserva DESC`

	rows, err := r.db.Query(query, idInstancia)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservas := []*entidades.Reserva{}

	// Iterar por cada reserva encontrada
	for rows.Next() {
		reserva := &entidades.Reserva{}
		err := rows.Scan(
			&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
			&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
			&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
			&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
		)
		if err != nil {
			return nil, err
		}

		// Obtener las cantidades de pasajes para cada reserva
		queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                       FROM pasajes_cantidad pc
                       INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                       WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

		rowsPasajes, err := r.db.Query(queryPasajes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.CantidadPasajes = []entidades.PasajeCantidad{}

		// Iterar por cada registro de pasaje
		for rowsPasajes.Next() {
			var pasajeCantidad entidades.PasajeCantidad
			err := rowsPasajes.Scan(
				&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
			)
			if err != nil {
				rowsPasajes.Close()
				return nil, err
			}
			reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
		}

		rowsPasajes.Close()
		if err = rowsPasajes.Err(); err != nil {
			return nil, err
		}

		// Obtener los paquetes de pasajes
		queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, 
                        pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                        pp.cantidad_total
                        FROM paquete_pasaje_detalle ppd
                        INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                        WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

		rowsPaquetes, err := r.db.Query(queryPaquetes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

		// Iterar por cada registro de paquete
		for rowsPaquetes.Next() {
			var paquete entidades.PaquetePasajeDetalle
			err := rowsPaquetes.Scan(
				&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
				&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
			)
			if err != nil {
				rowsPaquetes.Close()
				return nil, err
			}
			reserva.Paquetes = append(reserva.Paquetes, paquete)
		}

		rowsPaquetes.Close()
		if err = rowsPaquetes.Err(); err != nil {
			return nil, err
		}

		reservas = append(reservas, reserva)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reservas, nil
}

// ListByFecha lista todas las reservas para una fecha específica de instancia
func (r *ReservaRepository) ListByFecha(fecha time.Time) ([]*entidades.Reserva, error) {
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE it.fecha_especifica = $1 AND r.eliminado = FALSE
              ORDER BY it.hora_inicio ASC, r.fecha_reserva DESC`

	rows, err := r.db.Query(query, fecha)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservas := []*entidades.Reserva{}

	// Iterar por cada reserva encontrada
	for rows.Next() {
		reserva := &entidades.Reserva{}
		err := rows.Scan(
			&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
			&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
			&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
			&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
		)
		if err != nil {
			return nil, err
		}

		// Obtener las cantidades de pasajes para cada reserva
		queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                       FROM pasajes_cantidad pc
                       INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                       WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

		rowsPasajes, err := r.db.Query(queryPasajes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.CantidadPasajes = []entidades.PasajeCantidad{}

		// Iterar por cada registro de pasaje
		for rowsPasajes.Next() {
			var pasajeCantidad entidades.PasajeCantidad
			err := rowsPasajes.Scan(
				&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
			)
			if err != nil {
				rowsPasajes.Close()
				return nil, err
			}
			reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
		}

		rowsPasajes.Close()
		if err = rowsPasajes.Err(); err != nil {
			return nil, err
		}

		// Obtener los paquetes de pasajes
		queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, 
                        pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                        pp.cantidad_total
                        FROM paquete_pasaje_detalle ppd
                        INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                        WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

		rowsPaquetes, err := r.db.Query(queryPaquetes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

		// Iterar por cada registro de paquete
		for rowsPaquetes.Next() {
			var paquete entidades.PaquetePasajeDetalle
			err := rowsPaquetes.Scan(
				&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
				&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
			)
			if err != nil {
				rowsPaquetes.Close()
				return nil, err
			}
			reserva.Paquetes = append(reserva.Paquetes, paquete)
		}

		rowsPaquetes.Close()
		if err = rowsPaquetes.Err(); err != nil {
			return nil, err
		}

		reservas = append(reservas, reserva)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reservas, nil
}

// ListByEstado lista todas las reservas por estado específico (RESERVADO, CANCELADA, CONFIRMADA)
func (r *ReservaRepository) ListByEstado(estado string) ([]*entidades.Reserva, error) {
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.estado = $1 AND r.eliminado = FALSE
              ORDER BY r.fecha_reserva DESC`

	rows, err := r.db.Query(query, estado)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservas := []*entidades.Reserva{}

	// Iterar por cada reserva encontrada
	for rows.Next() {
		reserva := &entidades.Reserva{}
		err := rows.Scan(
			&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
			&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
			&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
			&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
		)
		if err != nil {
			return nil, err
		}

		// Obtener las cantidades de pasajes para cada reserva
		queryPasajes := `SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad
                       FROM pasajes_cantidad pc
                       INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje
                       WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`

		rowsPasajes, err := r.db.Query(queryPasajes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.CantidadPasajes = []entidades.PasajeCantidad{}

		// Iterar por cada registro de pasaje
		for rowsPasajes.Next() {
			var pasajeCantidad entidades.PasajeCantidad
			err := rowsPasajes.Scan(
				&pasajeCantidad.IDTipoPasaje, &pasajeCantidad.NombreTipo, &pasajeCantidad.Cantidad,
			)
			if err != nil {
				rowsPasajes.Close()
				return nil, err
			}
			reserva.CantidadPasajes = append(reserva.CantidadPasajes, pasajeCantidad)
		}

		rowsPasajes.Close()
		if err = rowsPasajes.Err(); err != nil {
			return nil, err
		}

		// Obtener los paquetes de pasajes
		queryPaquetes := `SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, 
                        pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal,
                        pp.cantidad_total
                        FROM paquete_pasaje_detalle ppd
                        INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete
                        WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`

		rowsPaquetes, err := r.db.Query(queryPaquetes, reserva.ID)
		if err != nil {
			return nil, err
		}

		reserva.Paquetes = []entidades.PaquetePasajeDetalle{}

		// Iterar por cada registro de paquete
		for rowsPaquetes.Next() {
			var paquete entidades.PaquetePasajeDetalle
			err := rowsPaquetes.Scan(
				&paquete.IDPaquete, &paquete.NombrePaquete, &paquete.Cantidad,
				&paquete.PrecioUnitario, &paquete.Subtotal, &paquete.CantidadTotal,
			)
			if err != nil {
				rowsPaquetes.Close()
				return nil, err
			}
			reserva.Paquetes = append(reserva.Paquetes, paquete)
		}

		rowsPaquetes.Close()
		if err = rowsPaquetes.Err(); err != nil {
			return nil, err
		}

		reservas = append(reservas, reserva)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reservas, nil
}

// GetTotalReservasByInstancia obtiene el número total de reservas para una instancia específica
func (r *ReservaRepository) GetTotalReservasByInstancia(idInstancia int) (int, error) {
	var total int
	query := `SELECT COUNT(*) FROM reserva 
             WHERE id_instancia = $1 AND estado != 'CANCELADA' AND eliminado = FALSE`

	err := r.db.QueryRow(query, idInstancia).Scan(&total)
	if err != nil {
		return 0, err
	}

	return total, nil
}

// GetTotalPasajerosByInstancia obtiene el total de pasajeros reservados para una instancia específica
func (r *ReservaRepository) GetTotalPasajerosByInstancia(idInstancia int) (int, error) {
	// Primero, obtener todas las reservas no canceladas para esta instancia
	query := `SELECT id_reserva FROM reserva 
             WHERE id_instancia = $1 AND estado != 'CANCELADA' AND eliminado = FALSE`

	rows, err := r.db.Query(query, idInstancia)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	// Calcular el total de pasajeros sumando los de cada reserva
	totalPasajeros := 0

	for rows.Next() {
		var idReserva int
		err := rows.Scan(&idReserva)
		if err != nil {
			return 0, err
		}

		// Obtener pasajeros de esta reserva
		pasajerosReserva, err := r.GetCantidadPasajerosByReserva(idReserva)
		if err != nil {
			return 0, err
		}

		totalPasajeros += pasajerosReserva
	}

	if err = rows.Err(); err != nil {
		return 0, err
	}

	return totalPasajeros, nil
}

// VerificarDisponibilidadInstancia verifica si hay suficiente cupo en una instancia para un número de pasajeros
func (r *ReservaRepository) VerificarDisponibilidadInstancia(idInstancia int, cantidadPasajeros int) (bool, error) {
	var cupoDisponible int
	query := `SELECT cupo_disponible FROM instancia_tour 
             WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`

	err := r.db.QueryRow(query, idInstancia).Scan(&cupoDisponible)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, errors.New("la instancia del tour no existe, está eliminada o no está programada")
		}
		return false, err
	}

	return cantidadPasajeros <= cupoDisponible, nil
}

// ReservarInstanciaMercadoPago crea una reserva a través de Mercado Pago
func (r *ReservaRepository) ReservarInstanciaMercadoPago(reserva *entidades.ReservaMercadoPagoRequest) (int, string, error) {
	// Iniciar transacción
	tx, err := r.db.Begin()
	if err != nil {
		return 0, "", err
	}

	// Si hay error, hacer rollback
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Verificar que al menos haya un pasaje o un paquete
	if len(reserva.CantidadPasajes) == 0 && len(reserva.Paquetes) == 0 {
		return 0, "", errors.New("debe incluir al menos un pasaje o un paquete en la reserva")
	}

	// Primero, obtener información de la instancia del tour para verificar disponibilidad
	var cupoDisponible int
	var nombreTour string
	queryInstancia := `SELECT it.cupo_disponible, tt.nombre 
                      FROM instancia_tour it
                      INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
                      INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
                      WHERE it.id_instancia = $1 AND it.eliminado = FALSE 
                      AND it.estado = 'PROGRAMADO'`
	err = tx.QueryRow(queryInstancia, reserva.IDInstancia).Scan(&cupoDisponible, &nombreTour)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, "", errors.New("la instancia del tour no existe, está eliminada o no está programada")
		}
		return 0, "", err
	}

	// Calcular el total de pasajeros
	totalPasajeros := 0

	// Sumar pasajeros de pasajes individuales
	for _, pasaje := range reserva.CantidadPasajes {
		totalPasajeros += pasaje.Cantidad
	}

	// Sumar pasajeros de paquetes
	for _, paquete := range reserva.Paquetes {
		// Obtener cantidad total de pasajeros por paquete
		var cantidadPorPaquete int
		queryPaquete := `SELECT cantidad_total FROM paquete_pasajes 
                        WHERE id_paquete = $1 AND eliminado = FALSE`
		err := tx.QueryRow(queryPaquete, paquete.IDPaquete).Scan(&cantidadPorPaquete)
		if err != nil {
			return 0, "", err
		}

		// Multiplicar por la cantidad de paquetes seleccionados
		totalPasajeros += cantidadPorPaquete * paquete.Cantidad
	}

	// Verificar disponibilidad
	if totalPasajeros > cupoDisponible {
		return 0, "", errors.New("no hay suficiente cupo disponible para la reserva")
	}

	// Establecer fecha de expiración (24 horas desde ahora)
	fechaExpiracion := time.Now().Add(24 * time.Hour)

	// Consulta SQL para insertar una nueva reserva (sin canal ni sede)
	var idReserva int
	query := `INSERT INTO reserva (id_cliente, id_instancia, total_pagar, notas, estado, eliminado, fecha_expiracion)
             VALUES ($1, $2, $3, $4, 'RESERVADO', FALSE, $5)
             RETURNING id_reserva`

	// Ejecutar la consulta con los datos de la reserva
	err = tx.QueryRow(
		query,
		reserva.IDCliente,
		reserva.IDInstancia,
		reserva.TotalPagar,
		"Reserva generada a través de Mercado Pago",
		fechaExpiracion,
	).Scan(&idReserva)

	if err != nil {
		return 0, "", err
	}

	// Insertar las cantidades de pasajes individuales
	for _, pasaje := range reserva.CantidadPasajes {
		// Solo insertar si la cantidad es mayor que cero
		if pasaje.Cantidad > 0 {
			queryPasaje := `INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado)
                          VALUES ($1, $2, $3, FALSE)`

			_, err = tx.Exec(queryPasaje, idReserva, pasaje.IDTipoPasaje, pasaje.Cantidad)
			if err != nil {
				return 0, "", err
			}
		}
	}

	// Insertar los paquetes de pasajes
	for _, paquete := range reserva.Paquetes {
		// Solo insertar si la cantidad es mayor que cero
		if paquete.Cantidad > 0 {
			queryPaquete := `INSERT INTO paquete_pasaje_detalle (id_reserva, id_paquete, cantidad, eliminado)
                           VALUES ($1, $2, $3, FALSE)`

			_, err = tx.Exec(queryPaquete, idReserva, paquete.IDPaquete, paquete.Cantidad)
			if err != nil {
				return 0, "", err
			}
		}
	}

	// Actualizar el cupo disponible en la instancia del tour
	queryUpdateCupo := `UPDATE instancia_tour 
                       SET cupo_disponible = cupo_disponible - $1 
                       WHERE id_instancia = $2`
	_, err = tx.Exec(queryUpdateCupo, totalPasajeros, reserva.IDInstancia)
	if err != nil {
		return 0, "", err
	}

	// Commit de la transacción
	err = tx.Commit()
	if err != nil {
		return 0, "", err
	}

	return idReserva, nombreTour, nil
}

// ConfirmarReservaConPago confirma una reserva y registra su pago asociado
func (r *ReservaRepository) ConfirmarReservaConPago(idReserva int, idTransaccion string, monto float64) error {
	// Iniciar transacción
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// Si hay error, hacer rollback
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// 1. Actualizar estado de la reserva y eliminar fecha de expiración
	queryUpdateReserva := `UPDATE reserva SET estado = 'CONFIRMADA', fecha_expiracion = NULL WHERE id_reserva = $1 AND eliminado = FALSE`
	_, err = tx.Exec(queryUpdateReserva, idReserva)
	if err != nil {
		return err
	}

	// 2. Registrar el pago
	queryInsertPago := `INSERT INTO pago (id_reserva, metodo_pago, canal_pago, monto, comprobante, estado, fecha_pago, eliminado)
                        VALUES ($1, 'MERCADOPAGO', 'WEB', $2, $3, 'PROCESADO', NOW(), FALSE)`

	// Formato del comprobante: MP-{idTransaccion}
	comprobante := fmt.Sprintf("MP-%s", idTransaccion)

	_, err = tx.Exec(queryInsertPago, idReserva, monto, comprobante)
	if err != nil {
		return err
	}

	// Commit de la transacción
	return tx.Commit()
}

// SetExpirationDate establece una fecha de expiración para una reserva
func (r *ReservaRepository) SetExpirationDate(id int, fechaExpiracion time.Time) error {
	query := `UPDATE reserva SET fecha_expiracion = $1 WHERE id_reserva = $2 AND eliminado = FALSE`
	_, err := r.db.Exec(query, fechaExpiracion, id)
	return err
}

// GetExpiredReservations obtiene todas las reservas expiradas que necesitan ser procesadas
func (r *ReservaRepository) GetExpiredReservations() ([]*entidades.Reserva, error) {
	query := `SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, 
              r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado,
              c.nombres || ' ' || c.apellidos as nombre_cliente,
              COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor,
              tt.nombre as nombre_tour,
              to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour,
              to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour,
              to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour,
              r.fecha_expiracion
              FROM reserva r
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.estado = 'RESERVADO' 
              AND r.fecha_expiracion IS NOT NULL 
              AND r.fecha_expiracion < NOW() 
              AND r.eliminado = FALSE`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reservas := []*entidades.Reserva{}

	// Iterar por cada reserva encontrada
	for rows.Next() {
		reserva := &entidades.Reserva{}
		err := rows.Scan(
			&reserva.ID, &reserva.IDVendedor, &reserva.IDCliente, &reserva.IDInstancia,
			&reserva.FechaReserva, &reserva.TotalPagar, &reserva.Notas, &reserva.Estado, &reserva.Eliminado,
			&reserva.NombreCliente, &reserva.NombreVendedor, &reserva.NombreTour,
			&reserva.FechaTour, &reserva.HoraInicioTour, &reserva.HoraFinTour, &reserva.FechaExpiracion,
		)
		if err != nil {
			return nil, err
		}

		// Obtener pasajeros para restaurar cupo
		pasajeros, err := r.GetCantidadPasajerosByReserva(reserva.ID)
		if err != nil {
			// Registrar error pero continuar
			fmt.Printf("Error al obtener cantidad de pasajeros para reserva ID=%d: %v\n", reserva.ID, err)
		} else {
			// Añadir como dato adicional (no está en la estructura)
			reserva.TotalPasajeros = pasajeros
		}

		reservas = append(reservas, reserva)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return reservas, nil
}

// UpdateExpirationByPaymentMethod actualiza la fecha de expiración según el método de pago
func (r *ReservaRepository) UpdateExpirationByPaymentMethod(idReserva int, metodoPago string) error {
	// Determinar el tiempo de expiración según el método de pago
	var horasExpiracion int
	switch metodoPago {
	case "pago_efectivo", "bank_transfer", "atm", "ticket", "efectivo":
		horasExpiracion = 48 // 48 horas para pagos offline
	case "yape", "plin", "tunki":
		horasExpiracion = 36 // 36 horas para pagos móviles
	default:
		horasExpiracion = 24 // 24 horas para otros métodos
	}

	// Calcular nueva fecha de expiración
	fechaExpiracion := time.Now().Add(time.Hour * time.Duration(horasExpiracion))

	// Actualizar fecha de expiración
	query := `UPDATE reserva SET fecha_expiracion = $1 WHERE id_reserva = $2 AND eliminado = FALSE`
	_, err := r.db.Exec(query, fechaExpiracion, idReserva)
	return err
}

// CancelarReservasExpiradas cancela automáticamente las reservas expiradas
func (r *ReservaRepository) CancelarReservasExpiradas() (int, error) {
	// Obtener reservas expiradas
	reservasExpiradas, err := r.GetExpiredReservations()
	if err != nil {
		return 0, fmt.Errorf("error al obtener reservas expiradas: %w", err)
	}

	contador := 0
	for _, reserva := range reservasExpiradas {
		// Cancelar cada reserva expirada
		err := r.UpdateEstado(reserva.ID, "CANCELADA")
		if err != nil {
			fmt.Printf("Error al cancelar reserva expirada ID=%d: %v\n", reserva.ID, err)
			continue
		}

		contador++
		fmt.Printf("Reserva ID=%d cancelada automáticamente por expiración\n", reserva.ID)
	}

	return contador, nil
}
