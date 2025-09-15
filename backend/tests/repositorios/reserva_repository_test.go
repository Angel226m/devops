package repositorios_test

import (
	"database/sql"
	"errors"
	"regexp"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestReservaRepository_GetByID(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewReservaRepository(db)

	t.Run("Success", func(t *testing.T) {
		fechaReserva := time.Now()
		fechaExpiracion := fechaReserva.Add(24 * time.Hour)
		rowsReserva := sqlmock.NewRows([]string{"id_reserva", "id_vendedor", "id_cliente", "id_instancia", "fecha_reserva", "total_pagar", "notas", "estado", "eliminado", "nombre_cliente", "nombre_vendedor", "nombre_tour", "fecha_tour", "hora_inicio_tour", "hora_fin_tour", "fecha_expiracion"}).
			AddRow(1, nil, 1, 1, fechaReserva, 100.0, "Notas de prueba", "RESERVADO", false, "Juan Pérez", "Web", "Tour Aventura", "15/10/2025", "09:00", "12:00", fechaExpiracion)

		rowsPasajes := sqlmock.NewRows([]string{"id_tipo_pasaje", "nombre", "cantidad"}).
			AddRow(1, "Adulto", 2)

		rowsPaquetes := sqlmock.NewRows([]string{"id_paquete", "nombre_paquete", "cantidad", "precio_unitario", "subtotal", "cantidad_total"}).
			AddRow(1, "Paquete Familiar", 1, 50.0, 50.0, 4)

		rowsMetodoPago := sqlmock.NewRows([]string{"metodo_pago"}).AddRow("Mercado Pago")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado, c.nombres || ' ' || c.apellidos as nombre_cliente, COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor, tt.nombre as nombre_tour, to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour, to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour, to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour, r.fecha_expiracion FROM reserva r INNER JOIN cliente c ON r.id_cliente = c.id_cliente LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour WHERE r.id_reserva = $1 AND r.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(rowsReserva)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT pc.id_tipo_pasaje, tp.nombre, pc.cantidad FROM pasajes_cantidad pc INNER JOIN tipo_pasaje tp ON pc.id_tipo_pasaje = tp.id_tipo_pasaje WHERE pc.id_reserva = $1 AND pc.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(rowsPasajes)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT ppd.id_paquete, pp.nombre as nombre_paquete, ppd.cantidad, pp.precio_total as precio_unitario, (ppd.cantidad * pp.precio_total) as subtotal, pp.cantidad_total FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(rowsPaquetes)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(p.metodo_pago, 'No registrado') FROM pago p WHERE p.id_reserva = $1 AND p.eliminado = FALSE ORDER BY p.fecha_pago DESC LIMIT 1`)).
			WithArgs(1).
			WillReturnRows(rowsMetodoPago)

		reserva, err := repo.GetByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, reserva)
		assert.Equal(t, 1, reserva.ID)
		assert.Nil(t, reserva.IDVendedor)
		assert.Equal(t, 1, reserva.IDCliente)
		assert.Equal(t, 1, reserva.IDInstancia)
		assert.Equal(t, 100.0, reserva.TotalPagar)
		assert.Equal(t, "Notas de prueba", reserva.Notas)
		assert.Equal(t, "RESERVADO", reserva.Estado)
		assert.Equal(t, false, reserva.Eliminado)
		assert.Equal(t, "Juan Pérez", reserva.NombreCliente)
		assert.Equal(t, "Web", reserva.NombreVendedor)
		assert.Equal(t, "Tour Aventura", reserva.NombreTour)
		assert.Equal(t, "15/10/2025", reserva.FechaTour)
		assert.Equal(t, "09:00", reserva.HoraInicioTour)
		assert.Equal(t, "12:00", reserva.HoraFinTour)
		assert.Equal(t, fechaExpiracion, *reserva.FechaExpiracion)
		assert.Len(t, reserva.CantidadPasajes, 1)
		assert.Equal(t, 1, reserva.CantidadPasajes[0].IDTipoPasaje)
		assert.Equal(t, "Adulto", reserva.CantidadPasajes[0].NombreTipo)
		assert.Equal(t, 2, reserva.CantidadPasajes[0].Cantidad)
		assert.Len(t, reserva.Paquetes, 1)
		assert.Equal(t, 1, reserva.Paquetes[0].IDPaquete)
		assert.Equal(t, "Paquete Familiar", reserva.Paquetes[0].NombrePaquete)
		assert.Equal(t, 1, reserva.Paquetes[0].Cantidad)
		assert.Equal(t, 50.0, reserva.Paquetes[0].PrecioUnitario)
		assert.Equal(t, 50.0, reserva.Paquetes[0].Subtotal)
		assert.Equal(t, 4, reserva.Paquetes[0].CantidadTotal)
		assert.Equal(t, "Mercado Pago", reserva.MetodoPago)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado, c.nombres || ' ' || c.apellidos as nombre_cliente, COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor, tt.nombre as nombre_tour, to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour, to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour, to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour, r.fecha_expiracion FROM reserva r INNER JOIN cliente c ON r.id_cliente = c.id_cliente LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour WHERE r.id_reserva = $1 AND r.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		reserva, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, reserva)
		assert.Equal(t, "reserva no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT r.id_reserva, r.id_vendedor, r.id_cliente, r.id_instancia, r.fecha_reserva, r.total_pagar, r.notas, r.estado, r.eliminado, c.nombres || ' ' || c.apellidos as nombre_cliente, COALESCE(u.nombres || ' ' || u.apellidos, 'Web') as nombre_vendedor, tt.nombre as nombre_tour, to_char(it.fecha_especifica, 'DD/MM/YYYY') as fecha_tour, to_char(it.hora_inicio, 'HH24:MI') as hora_inicio_tour, to_char(it.hora_fin, 'HH24:MI') as hora_fin_tour, r.fecha_expiracion FROM reserva r INNER JOIN cliente c ON r.id_cliente = c.id_cliente LEFT JOIN usuario u ON r.id_vendedor = u.id_usuario INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour WHERE r.id_reserva = $1 AND r.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		reserva, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, reserva)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestReservaRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewReservaRepository(db)

	t.Run("Success", func(t *testing.T) {
		reserva := &entidades.NuevaReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			IDVendedor:  nil,
			TotalPagar:  100.0,
			Notas:       "Notas de prueba",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 2},
			},
			Paquetes: []entidades.PaqueteRequest{
				{IDPaquete: 1, Cantidad: 1},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(10))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cantidad_total FROM paquete_pasajes WHERE id_paquete = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cantidad_total"}).AddRow(4))
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO reserva (id_vendedor, id_cliente, id_instancia, total_pagar, notas, estado, eliminado, fecha_expiracion) VALUES ($1, $2, $3, $4, $5, 'RESERVADO', FALSE, $6) RETURNING id_reserva`)).
			WithArgs(nil, 1, 1, 100.0, "Notas de prueba", sqlmock.AnyArg()).
			WillReturnRows(sqlmock.NewRows([]string{"id_reserva"}).AddRow(1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 2).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO paquete_pasaje_detalle (id_reserva, id_paquete, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible - $1 WHERE id_instancia = $2`)).
			WithArgs(6, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		id, err := repo.Create(reserva)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NoPasajesOrPaquetes", func(t *testing.T) {
		reserva := &entidades.NuevaReservaRequest{
			IDCliente:       1,
			IDInstancia:     1,
			TotalPagar:      100.0,
			Notas:           "Notas de prueba",
			CantidadPasajes: []entidades.PasajeCantidadRequest{},
			Paquetes:        []entidades.PaqueteRequest{},
		}

		id, err := repo.Create(reserva)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "debe incluir al menos un pasaje o un paquete en la reserva", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InstanceNotFound", func(t *testing.T) {
		reserva := &entidades.NuevaReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  100.0,
			Notas:       "Notas de prueba",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 2},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		id, err := repo.Create(reserva)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "la instancia del tour no existe, está eliminada o no está programada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InsufficientCupo", func(t *testing.T) {
		reserva := &entidades.NuevaReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  100.0,
			Notas:       "Notas de prueba",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 10},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(5))

		id, err := repo.Create(reserva)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "no hay suficiente cupo disponible para la reserva", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		reserva := &entidades.NuevaReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  100.0,
			Notas:       "Notas de prueba",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 2},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(10))
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO reserva (id_vendedor, id_cliente, id_instancia, total_pagar, notas, estado, eliminado, fecha_expiracion) VALUES ($1, $2, $3, $4, $5, 'RESERVADO', FALSE, $6) RETURNING id_reserva`)).
			WithArgs(nil, 1, 1, 100.0, "Notas de prueba", sqlmock.AnyArg()).
			WillReturnError(errors.New("database error"))

		id, err := repo.Create(reserva)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestReservaRepository_Update(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewReservaRepository(db)

	t.Run("SuccessSameInstance", func(t *testing.T) {
		reserva := &entidades.ActualizarReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			IDVendedor:  nil,
			TotalPagar:  150.0,
			Notas:       "Notas actualizadas",
			Estado:      "RESERVADO",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 3},
			},
			Paquetes: []entidades.PaqueteRequest{
				{IDPaquete: 1, Cantidad: 1},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(4))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cantidad_total FROM paquete_pasajes WHERE id_paquete = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cantidad_total"}).AddRow(4))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(10))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible - $1 WHERE id_instancia = $2`)).
			WithArgs(1, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE reserva SET id_vendedor = $1, id_cliente = $2, id_instancia = $3, total_pagar = $4, notas = $5, estado = $6, fecha_expiracion = $7 WHERE id_reserva = $8 AND eliminado = FALSE`)).
			WithArgs(nil, 1, 1, 150.0, "Notas actualizadas", "RESERVADO", sqlmock.AnyArg(), 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE pasajes_cantidad SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE paquete_pasaje_detalle SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 3).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO paquete_pasaje_detalle (id_reserva, id_paquete, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Update(1, reserva)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("SuccessDifferentInstance", func(t *testing.T) {
		reserva := &entidades.ActualizarReservaRequest{
			IDCliente:   1,
			IDInstancia: 2,
			IDVendedor:  nil,
			TotalPagar:  150.0,
			Notas:       "Notas actualizadas",
			Estado:      "RESERVADO",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 3},
			},
			Paquetes: []entidades.PaqueteRequest{
				{IDPaquete: 1, Cantidad: 1},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(4))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cantidad_total FROM paquete_pasajes WHERE id_paquete = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cantidad_total"}).AddRow(4))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible + $1 WHERE id_instancia = $2`)).
			WithArgs(6, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(10))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible - $1 WHERE id_instancia = $2`)).
			WithArgs(7, 2).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE reserva SET id_vendedor = $1, id_cliente = $2, id_instancia = $3, total_pagar = $4, notas = $5, estado = $6, fecha_expiracion = $7 WHERE id_reserva = $8 AND eliminado = FALSE`)).
			WithArgs(nil, 1, 2, 150.0, "Notas actualizadas", "RESERVADO", sqlmock.AnyArg(), 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE pasajes_cantidad SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE paquete_pasaje_detalle SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 3).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO paquete_pasaje_detalle (id_reserva, id_paquete, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Update(1, reserva)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		reserva := &entidades.ActualizarReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  150.0,
			Notas:       "Notas actualizadas",
			Estado:      "RESERVADO",
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		err := repo.Update(1, reserva)
		assert.Error(t, err)
		assert.Equal(t, "reserva no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InsufficientCupo", func(t *testing.T) {
		reserva := &entidades.ActualizarReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  150.0,
			Notas:       "Notas actualizadas",
			Estado:      "RESERVADO",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 10},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(5))

		err := repo.Update(1, reserva)
		assert.Error(t, err)
		assert.Equal(t, "no hay suficiente cupo disponible para la actualización de la reserva", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("CancelRestoresCupo", func(t *testing.T) {
		reserva := &entidades.ActualizarReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  150.0,
			Notas:       "Notas actualizadas",
			Estado:      "CANCELADA",
			CantidadPasajes: []entidades.PasajeCantidadRequest{
				{IDTipoPasaje: 1, Cantidad: 3},
			},
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(0))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible + $1 WHERE id_instancia = $2`)).
			WithArgs(2, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE reserva SET id_vendedor = $1, id_cliente = $2, id_instancia = $3, total_pagar = $4, notas = $5, estado = $6, fecha_expiracion = $7 WHERE id_reserva = $8 AND eliminado = FALSE`)).
			WithArgs(nil, 1, 1, 150.0, "Notas actualizadas", "CANCELADA", nil, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE pasajes_cantidad SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE paquete_pasaje_detalle SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO pasajes_cantidad (id_reserva, id_tipo_pasaje, cantidad, eliminado) VALUES ($1, $2, $3, FALSE)`)).
			WithArgs(1, 1, 3).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Update(1, reserva)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		reserva := &entidades.ActualizarReservaRequest{
			IDCliente:   1,
			IDInstancia: 1,
			TotalPagar:  150.0,
			Notas:       "Notas actualizadas",
			Estado:      "RESERVADO",
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.Update(1, reserva)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestReservaRepository_UpdateEstado(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewReservaRepository(db)

	t.Run("SuccessCancel", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(4))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible + $1 WHERE id_instancia = $2`)).
			WithArgs(6, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE reserva SET estado = $1, fecha_expiracion = $2 WHERE id_reserva = $3 AND eliminado = FALSE`)).
			WithArgs("CANCELADA", nil, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.UpdateEstado(1, "CANCELADA")
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("SuccessReactivate", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "CANCELADA"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(4))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(10))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible - $1 WHERE id_instancia = $2`)).
			WithArgs(6, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE reserva SET estado = $1, fecha_expiracion = $2 WHERE id_reserva = $3 AND eliminado = FALSE`)).
			WithArgs("RESERVADO", sqlmock.AnyArg(), 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.UpdateEstado(1, "RESERVADO")
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		err := repo.UpdateEstado(1, "CANCELADA")
		assert.Error(t, err)
		assert.Equal(t, "reserva no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InsufficientCupoReactivate", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "CANCELADA"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(10))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cupo_disponible FROM instancia_tour WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"cupo_disponible"}).AddRow(5))

		err := repo.UpdateEstado(1, "RESERVADO")
		assert.Error(t, err)
		assert.Equal(t, "no hay suficiente cupo disponible para reactivar la reserva", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.UpdateEstado(1, "CANCELADA")
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestReservaRepository_GetCantidadPasajerosByReserva(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewReservaRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(4))

		count, err := repo.GetCantidadPasajerosByReserva(1)
		assert.NoError(t, err)
		assert.Equal(t, 6, count)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		count, err := repo.GetCantidadPasajerosByReserva(1)
		assert.Error(t, err)
		assert.Equal(t, 0, count)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestReservaRepository_Delete(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewReservaRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM comprobante_pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia", "estado"}).AddRow(1, "RESERVADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(cantidad), 0) FROM pasajes_cantidad WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(2))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COALESCE(SUM(ppd.cantidad * pp.cantidad_total), 0) FROM paquete_pasaje_detalle ppd INNER JOIN paquete_pasajes pp ON ppd.id_paquete = pp.id_paquete WHERE ppd.id_reserva = $1 AND ppd.eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"sum"}).AddRow(4))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET cupo_disponible = cupo_disponible + $1 WHERE id_instancia = $2`)).
			WithArgs(6, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE pasajes_cantidad SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE paquete_pasaje_detalle SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE reserva SET eliminado = TRUE WHERE id_reserva = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Delete(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("PagosExist", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "no se puede eliminar esta reserva porque tiene pagos asociados", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ComprobantesExist", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM comprobante_pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "no se puede eliminar esta reserva porque tiene comprobantes asociados", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM comprobante_pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "reserva no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM comprobante_pago WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_instancia, estado FROM reserva WHERE id_reserva = $1 AND eliminado = FALSE`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
