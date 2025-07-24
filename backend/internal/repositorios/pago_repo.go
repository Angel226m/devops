package repositorios

import (
	"database/sql"
	"errors"
	"fmt"
	"sistema-toursseft/internal/entidades"
	"time"
)

// PagoRepository maneja las operaciones de base de datos para pagos
type PagoRepository struct {
	db *sql.DB
}

// NewPagoRepository crea una nueva instancia del repositorio
func NewPagoRepository(db *sql.DB) *PagoRepository {
	return &PagoRepository{
		db: db,
	}
}

// GetByID obtiene un pago por su ID
func (r *PagoRepository) GetByID(id int) (*entidades.Pago, error) {
	pago := &entidades.Pago{}

	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              COALESCE(s.nombre, 'Web') as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE p.id_pago = $1 AND p.eliminado = FALSE`

	var idSede sql.NullInt64

	err := r.db.QueryRow(query, id).Scan(
		&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSede,
		&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
		&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
		&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("pago no encontrado")
		}
		return nil, err
	}

	// Convertir el campo nullable a puntero
	if idSede.Valid {
		idSedeInt := int(idSede.Int64)
		pago.IDSede = &idSedeInt
	} else {
		pago.IDSede = nil
	}

	return pago, nil
}

/*
// Create guarda un nuevo pago en la base de datos
func (r *PagoRepository) Create(pago *entidades.NuevoPagoRequest) (int, error) {
	var id int
	query := `INSERT INTO pago (id_reserva, metodo_pago, canal_pago, id_sede, monto, comprobante,
              numero_comprobante, url_comprobante, eliminado)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
              RETURNING id_pago`

	err := r.db.QueryRow(
		query,
		pago.IDReserva,
		pago.MetodoPago,
		pago.CanalPago,
		pago.IDSede, // Si es nil, se insertará NULL
		pago.Monto,
		pago.Comprobante,
		pago.NumeroComprobante,
		pago.URLComprobante,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}
*/
// Create guarda un nuevo pago en la base de datos y genera automáticamente el número de comprobante y URL
func (r *PagoRepository) Create(pago *entidades.NuevoPagoRequest) (int, error) {
	// Comenzamos una transacción para asegurar que todas las operaciones son atómicas
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Paso 1: Obtener el número de comprobante más alto actual
	var maxNumero int
	queryMax := `SELECT COALESCE(MAX(CAST(SUBSTRING(numero_comprobante, 9) AS INTEGER)), 0)
				 FROM pago
				 WHERE numero_comprobante ~ '^N-COMP-\d+$'`

	err = tx.QueryRow(queryMax).Scan(&maxNumero)
	if err != nil {
		return 0, err
	}

	// Paso 2: Generar el nuevo número de comprobante
	nuevoNumero := maxNumero + 1
	numeroComprobante := fmt.Sprintf("N-COMP-%05d", nuevoNumero)
	urlComprobante := fmt.Sprintf("https://tu-sitio.com/comprobantes/N-COMP-%05d.pdf", nuevoNumero)

	// Paso 3: Insertar el nuevo pago con los valores generados
	var id int
	query := `INSERT INTO pago (id_reserva, metodo_pago, canal_pago, id_sede, monto, comprobante, 
			  numero_comprobante, url_comprobante, eliminado)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
			  RETURNING id_pago`

	// Si el usuario proporciona un número de comprobante, respetarlo, sino usar el generado
	numeroComprobanteFinal := numeroComprobante
	if pago.NumeroComprobante != "" {
		numeroComprobanteFinal = pago.NumeroComprobante
	}

	// Si el usuario proporciona una URL de comprobante, respetarla, sino usar la generada
	urlComprobanteFinal := urlComprobante
	if pago.URLComprobante != "" {
		urlComprobanteFinal = pago.URLComprobante
	}

	err = tx.QueryRow(
		query,
		pago.IDReserva,
		pago.MetodoPago,
		pago.CanalPago,
		pago.IDSede, // Si es nil, se insertará NULL
		pago.Monto,
		pago.Comprobante,
		numeroComprobanteFinal,
		urlComprobanteFinal,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	// Confirmar la transacción
	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return id, nil
}

// Update actualiza la información de un pago
func (r *PagoRepository) Update(id int, pago *entidades.ActualizarPagoRequest) error {
	query := `UPDATE pago SET
              metodo_pago = $1,
              canal_pago = $2,
              id_sede = $3,
              monto = $4,
              comprobante = $5,
              numero_comprobante = $6,
              url_comprobante = $7,
              estado = $8
              WHERE id_pago = $9 AND eliminado = FALSE`

	_, err := r.db.Exec(
		query,
		pago.MetodoPago,
		pago.CanalPago,
		pago.IDSede,
		pago.Monto,
		pago.Comprobante,
		pago.NumeroComprobante,
		pago.URLComprobante,
		pago.Estado,
		id,
	)

	return err
}

// UpdateEstado actualiza solo el estado de un pago
func (r *PagoRepository) UpdateEstado(id int, estado string) error {
	query := `UPDATE pago SET estado = $1 WHERE id_pago = $2 AND eliminado = FALSE`
	_, err := r.db.Exec(query, estado, id)
	return err
}

// Delete elimina un pago
func (r *PagoRepository) Delete(id int) error {
	// Verificar si hay comprobantes asociados a este pago a través de la reserva
	var idReserva int
	queryGetReserva := `SELECT id_reserva FROM pago WHERE id_pago = $1 AND eliminado = FALSE`
	err := r.db.QueryRow(queryGetReserva, id).Scan(&idReserva)
	if err != nil {
		return err
	}

	// Eliminación lógica
	query := `UPDATE pago SET eliminado = TRUE WHERE id_pago = $1`
	_, err = r.db.Exec(query, id)
	return err
}

// List lista todos los pagos activos
func (r *PagoRepository) List() ([]*entidades.Pago, error) {
	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              COALESCE(s.nombre, 'Web') as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE p.eliminado = FALSE
              ORDER BY p.fecha_pago DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pagos := []*entidades.Pago{}

	for rows.Next() {
		pago := &entidades.Pago{}
		var idSede sql.NullInt64

		err := rows.Scan(
			&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSede,
			&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
			&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
			&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
		)
		if err != nil {
			return nil, err
		}

		// Convertir el campo nullable a puntero
		if idSede.Valid {
			idSedeInt := int(idSede.Int64)
			pago.IDSede = &idSedeInt
		} else {
			pago.IDSede = nil
		}

		pagos = append(pagos, pago)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pagos, nil
}

// ListByReserva lista todos los pagos de una reserva específica
func (r *PagoRepository) ListByReserva(idReserva int) ([]*entidades.Pago, error) {
	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              COALESCE(s.nombre, 'Web') as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE p.id_reserva = $1 AND p.eliminado = FALSE
              ORDER BY p.fecha_pago DESC`

	rows, err := r.db.Query(query, idReserva)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pagos := []*entidades.Pago{}

	for rows.Next() {
		pago := &entidades.Pago{}
		var idSede sql.NullInt64

		err := rows.Scan(
			&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSede,
			&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
			&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
			&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
		)
		if err != nil {
			return nil, err
		}

		// Convertir el campo nullable a puntero
		if idSede.Valid {
			idSedeInt := int(idSede.Int64)
			pago.IDSede = &idSedeInt
		} else {
			pago.IDSede = nil
		}

		pagos = append(pagos, pago)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pagos, nil
}

// GetTotalPagadoByReserva obtiene el total pagado de una reserva específica
func (r *PagoRepository) GetTotalPagadoByReserva(idReserva int) (float64, error) {
	var totalPagado float64
	query := `SELECT COALESCE(SUM(monto), 0) FROM pago WHERE id_reserva = $1 AND estado = 'PROCESADO' AND eliminado = FALSE`

	err := r.db.QueryRow(query, idReserva).Scan(&totalPagado)
	if err != nil {
		return 0, err
	}

	return totalPagado, nil
}

// ListByEstado lista todos los pagos con un estado específico
func (r *PagoRepository) ListByEstado(estado string) ([]*entidades.Pago, error) {
	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              COALESCE(s.nombre, 'Web') as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE p.estado = $1 AND p.eliminado = FALSE
              ORDER BY p.fecha_pago DESC`

	rows, err := r.db.Query(query, estado)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pagos := []*entidades.Pago{}

	for rows.Next() {
		pago := &entidades.Pago{}
		var idSede sql.NullInt64

		err := rows.Scan(
			&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSede,
			&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
			&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
			&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
		)
		if err != nil {
			return nil, err
		}

		// Convertir el campo nullable a puntero
		if idSede.Valid {
			idSedeInt := int(idSede.Int64)
			pago.IDSede = &idSedeInt
		} else {
			pago.IDSede = nil
		}

		pagos = append(pagos, pago)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pagos, nil
}

// ListByCliente lista todos los pagos de un cliente específico
func (r *PagoRepository) ListByCliente(idCliente int) ([]*entidades.Pago, error) {
	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              COALESCE(s.nombre, 'Web') as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE r.id_cliente = $1 AND p.eliminado = FALSE
              ORDER BY p.fecha_pago DESC`

	rows, err := r.db.Query(query, idCliente)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pagos := []*entidades.Pago{}

	for rows.Next() {
		pago := &entidades.Pago{}
		var idSede sql.NullInt64

		err := rows.Scan(
			&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSede,
			&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
			&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
			&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
		)
		if err != nil {
			return nil, err
		}

		// Convertir el campo nullable a puntero
		if idSede.Valid {
			idSedeInt := int(idSede.Int64)
			pago.IDSede = &idSedeInt
		} else {
			pago.IDSede = nil
		}

		pagos = append(pagos, pago)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pagos, nil
}

// ListBySede lista todos los pagos de una sede específica
func (r *PagoRepository) ListBySede(idSede int) ([]*entidades.Pago, error) {
	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              s.nombre as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              INNER JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE p.id_sede = $1 AND p.eliminado = FALSE
              ORDER BY p.fecha_pago DESC`

	rows, err := r.db.Query(query, idSede)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pagos := []*entidades.Pago{}

	for rows.Next() {
		pago := &entidades.Pago{}
		var idSedeDB sql.NullInt64

		err := rows.Scan(
			&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSedeDB,
			&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
			&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
			&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
		)
		if err != nil {
			return nil, err
		}

		// Convertir el campo nullable a puntero
		if idSedeDB.Valid {
			idSedeInt := int(idSedeDB.Int64)
			pago.IDSede = &idSedeInt
		} else {
			pago.IDSede = nil
		}

		pagos = append(pagos, pago)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pagos, nil
}

// CrearPagoMercadoPago crea un pago específico para MercadoPago
/*
func (r *PagoRepository) CrearPagoMercadoPago(idReserva int, monto float64, referenciaPago string) (int, error) {
	var id int
	query := `INSERT INTO pago (id_reserva, metodo_pago, canal_pago, id_sede, monto, comprobante, estado, eliminado)
              VALUES ($1, 'MERCADOPAGO', 'WEB', NULL, $2, $3, 'PROCESADO', FALSE)
              RETURNING id_pago`

	err := r.db.QueryRow(
		query,
		idReserva,
		monto,
		referenciaPago,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}
*/

// CrearPagoMercadoPago crea un pago específico para MercadoPago con generación automática de comprobante
func (r *PagoRepository) CrearPagoMercadoPago(idReserva int, monto float64, referenciaPago string) (int, error) {
	// Comenzamos una transacción para asegurar que todas las operaciones son atómicas
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Paso 1: Obtener el número de comprobante más alto actual
	var maxNumero int
	queryMax := `SELECT COALESCE(MAX(CAST(SUBSTRING(numero_comprobante, 9) AS INTEGER)), 0)
				 FROM pago
				 WHERE numero_comprobante ~ '^N-COMP-\d+$'`

	err = tx.QueryRow(queryMax).Scan(&maxNumero)
	if err != nil {
		return 0, err
	}

	// Paso 2: Generar el nuevo número de comprobante
	nuevoNumero := maxNumero + 1
	numeroComprobante := fmt.Sprintf("N-COMP-%05d", nuevoNumero)
	urlComprobante := fmt.Sprintf("https://tu-sitio.com/comprobantes/N-COMP-%05d.pdf", nuevoNumero)

	// Paso 3: Insertar el nuevo pago con los valores generados
	var id int
	query := `INSERT INTO pago (id_reserva, metodo_pago, canal_pago, id_sede, monto, comprobante, 
			  numero_comprobante, url_comprobante, estado, eliminado)
			  VALUES ($1, 'MERCADOPAGO', 'WEB', NULL, $2, $3, $4, $5, 'PROCESADO', FALSE)
			  RETURNING id_pago`

	err = tx.QueryRow(
		query,
		idReserva,
		monto,
		referenciaPago,
		numeroComprobante,
		urlComprobante,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	// Confirmar la transacción
	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return id, nil
}

// ListByFecha lista todos los pagos de una fecha específica
func (r *PagoRepository) ListByFecha(fecha time.Time) ([]*entidades.Pago, error) {
	// Consulta para obtener pagos en una fecha específica
	query := `SELECT p.id_pago, p.id_reserva, p.metodo_pago, p.canal_pago, p.id_sede,
              p.monto, p.fecha_pago, p.estado, p.comprobante, p.numero_comprobante, p.url_comprobante, p.eliminado,
              c.nombres, c.apellidos, c.numero_documento,
              COALESCE(s.nombre, 'Web') as nombre_sede,
              tt.nombre, it.fecha_especifica
              FROM pago p
              INNER JOIN reserva r ON p.id_reserva = r.id_reserva
              INNER JOIN cliente c ON r.id_cliente = c.id_cliente
              LEFT JOIN sede s ON p.id_sede = s.id_sede
              INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
              INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
              INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
              WHERE DATE(p.fecha_pago) = $1 AND p.eliminado = FALSE
              ORDER BY p.fecha_pago DESC`

	rows, err := r.db.Query(query, fecha.Format("2006-01-02"))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pagos := []*entidades.Pago{}

	for rows.Next() {
		pago := &entidades.Pago{}
		var idSede sql.NullInt64

		err := rows.Scan(
			&pago.ID, &pago.IDReserva, &pago.MetodoPago, &pago.CanalPago, &idSede,
			&pago.Monto, &pago.FechaPago, &pago.Estado, &pago.Comprobante, &pago.NumeroComprobante, &pago.URLComprobante, &pago.Eliminado,
			&pago.NombreCliente, &pago.ApellidosCliente, &pago.DocumentoCliente,
			&pago.NombreSede, &pago.TourNombre, &pago.TourFecha,
		)
		if err != nil {
			return nil, err
		}

		// Convertir el campo nullable a puntero
		if idSede.Valid {
			idSedeInt := int(idSede.Int64)
			pago.IDSede = &idSedeInt
		} else {
			pago.IDSede = nil
		}

		pagos = append(pagos, pago)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return pagos, nil
}

// ActualizarComprobantesFaltantes actualiza los números de comprobante y URLs para pagos que no los tienen
func (r *PagoRepository) ActualizarComprobantesFaltantes() (int, error) {
	// Comenzamos una transacción
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Identificar el último número de comprobante
	var maxNumero int
	queryMax := `SELECT COALESCE(MAX(CAST(SUBSTRING(numero_comprobante, 9) AS INTEGER)), 0)
				 FROM pago
				 WHERE numero_comprobante ~ '^N-COMP-\d+$'`

	err = tx.QueryRow(queryMax).Scan(&maxNumero)
	if err != nil {
		return 0, err
	}

	// Obtener IDs de pagos sin número de comprobante
	rows, err := tx.Query(`SELECT id_pago FROM pago 
						   WHERE (numero_comprobante IS NULL OR numero_comprobante = '') 
						   AND eliminado = FALSE
						   ORDER BY id_pago`)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	// Actualizar cada pago con un nuevo número secuencial
	actualizados := 0
	for rows.Next() {
		var idPago int
		if err := rows.Scan(&idPago); err != nil {
			return actualizados, err
		}

		// Incrementar contador y generar nuevo número
		maxNumero++
		numeroComprobante := fmt.Sprintf("N-COMP-%05d", maxNumero)
		urlComprobante := fmt.Sprintf("https://tu-sitio.com/comprobantes/N-COMP-%05d.pdf", maxNumero)

		// Actualizar el pago
		_, err = tx.Exec(`UPDATE pago SET 
						  numero_comprobante = $1, 
						  url_comprobante = $2 
						  WHERE id_pago = $3`,
			numeroComprobante, urlComprobante, idPago)
		if err != nil {
			return actualizados, err
		}

		actualizados++
	}

	if err = rows.Err(); err != nil {
		return actualizados, err
	}

	// Confirmar la transacción
	if err = tx.Commit(); err != nil {
		return actualizados, err
	}

	return actualizados, nil
}
