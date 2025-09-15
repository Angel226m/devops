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

func TestInstanciaTourRepository_GetByID(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")
		rows := sqlmock.NewRows([]string{"id_instancia", "id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado", "eliminado", "nombre", "nombre_embarcacion", "nombre_sede", "nombre_chofer"}).
			AddRow(1, 1, fechaEspecifica, horaInicio, horaFin, sql.NullInt64{Int64: 1, Valid: true}, 1, 10, "PROGRAMADO", false, "Tour Aventura", "Barco Rápido", "Sede Central", "Juan Pérez")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.id_instancia = $1 AND i.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(rows)

		instancia, err := repo.GetByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, instancia)
		assert.Equal(t, 1, instancia.ID)
		assert.Equal(t, 1, instancia.IDTourProgramado)
		assert.Equal(t, fechaEspecifica, instancia.FechaEspecifica)
		assert.Equal(t, "2025-10-15", instancia.FechaEspecificaStr)
		assert.Equal(t, horaInicio, instancia.HoraInicio)
		assert.Equal(t, "09:00", instancia.HoraInicioStr)
		assert.Equal(t, horaFin, instancia.HoraFin)
		assert.Equal(t, "12:00", instancia.HoraFinStr)
		assert.Equal(t, sql.NullInt64{Int64: 1, Valid: true}, instancia.IDChofer)
		assert.Equal(t, 1, instancia.IDEmbarcacion)
		assert.Equal(t, 10, instancia.CupoDisponible)
		assert.Equal(t, "PROGRAMADO", instancia.Estado)
		assert.Equal(t, false, instancia.Eliminado)
		assert.Equal(t, "Tour Aventura", instancia.NombreTipoTour)
		assert.Equal(t, "Barco Rápido", instancia.NombreEmbarcacion)
		assert.Equal(t, "Sede Central", instancia.NombreSede)
		assert.Equal(t, "Juan Pérez", instancia.NombreChofer)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.id_instancia = $1 AND i.eliminado = false`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		instancia, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, instancia)
		assert.Equal(t, "instancia de tour no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.id_instancia = $1 AND i.eliminado = false`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		instancia, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, instancia)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("SuccessWithChofer", func(t *testing.T) {
		idChofer := 1
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         &idChofer,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado = 'DISPONIBLE')`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(1, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_chofer = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(1, "2025-10-15", "09:00", "12:00").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_embarcacion = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(1, "2025-10-15", "09:00", "12:00").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO instancia_tour (id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROGRAMADO', false) RETURNING id_instancia`)).
			WithArgs(1, fechaEspecifica, horaInicio, horaFin, 1, 1, 10).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia"}).AddRow(1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET estado = 'OCUPADA' WHERE id_embarcacion = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		id, err := repo.Create(instancia)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("SuccessWithoutChofer", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado = 'DISPONIBLE')`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_embarcacion = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(1, "2025-10-15", "09:00", "12:00").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO instancia_tour (id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROGRAMADO', false) RETURNING id_instancia`)).
			WithArgs(1, fechaEspecifica, horaInicio, horaFin, nil, 1, 10).
			WillReturnRows(sqlmock.NewRows([]string{"id_instancia"}).AddRow(1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET estado = 'OCUPADA' WHERE id_embarcacion = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		id, err := repo.Create(instancia)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("TourProgramadoNotFound", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "el tour programado especificado no existe", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("EmbarcacionNotAvailable", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado = 'DISPONIBLE')`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "la embarcación especificada no existe o no está disponible", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InvalidFechaFormat", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025/10/15", // Formato inválido
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "formato de fecha inválido, debe ser YYYY-MM-DD", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InvalidHoraInicioFormat", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "9:00", // Formato inválido
			HoraFin:          "12:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "formato de hora de inicio inválido, debe ser HH:MM", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("HoraFinNotAfterHoraInicio", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "12:00",
			HoraFin:          "09:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "la hora de fin debe ser posterior a la hora de inicio", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ChoferNotAvailable", func(t *testing.T) {
		idChofer := 1
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         &idChofer,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado = 'DISPONIBLE')`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(1, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "el chofer no está disponible en la fecha y horario especificados", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ChoferOccupied", func(t *testing.T) {
		idChofer := 1
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         &idChofer,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado = 'DISPONIBLE')`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(1, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_chofer = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(1, "2025-10-15", "09:00", "12:00").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "el chofer ya está asignado a otro tour en el mismo horario", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("EmbarcacionOccupied", func(t *testing.T) {
		idChofer := 1
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         &idChofer,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado = 'DISPONIBLE')`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(1, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_chofer = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(1, "2025-10-15", "09:00", "12:00").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_embarcacion = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(1, "2025-10-15", "09:00", "12:00").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "la embarcación ya está asignada a otro tour en el mismo horario", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		instancia := &entidades.NuevaInstanciaTourRequest{
			IDTourProgramado: 1,
			FechaEspecifica:  "2025-10-15",
			HoraInicio:       "09:00",
			HoraFin:          "12:00",
			IDChofer:         nil,
			IDEmbarcacion:    1,
			CupoDisponible:   10,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		id, err := repo.Create(instancia)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_Update(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("SuccessFullUpdate", func(t *testing.T) {
		idTourProgramado := 2
		fechaEspecifica := "2025-10-16"
		horaInicio := "10:00"
		horaFin := "13:00"
		idChofer := 2
		idEmbarcacion := 2
		cupoDisponible := 15
		estado := "EN_CURSO"
		instancia := &entidades.ActualizarInstanciaTourRequest{
			IDTourProgramado: &idTourProgramado,
			FechaEspecifica:  &fechaEspecifica,
			HoraInicio:       &horaInicio,
			HoraFin:          &horaFin,
			IDChofer:         &idChofer,
			IDEmbarcacion:    &idEmbarcacion,
			CupoDisponible:   &cupoDisponible,
			Estado:           &estado,
		}

		fechaEspecificaTime, _ := time.Parse("2006-01-02", "2025-10-16")
		horaInicioTime, _ := time.Parse("15:04", "10:00")
		horaFinTime, _ := time.Parse("15:04", "13:00")

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado"}).
				AddRow(1, time.Now(), time.Now(), time.Now(), sql.NullInt64{Int64: 1, Valid: true}, 1, 10, "PROGRAMADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM tour_programado WHERE id_tour_programado = $1 AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_jueves = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(2, "10:00", "13:00", "2025-10-16").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_chofer = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND id_instancia != $5 AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(2, "2025-10-16", "10:00", "13:00", 1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado IN ('DISPONIBLE', 'OCUPADA'))`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_embarcacion = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND id_instancia != $5 AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(2, "2025-10-16", "10:00", "13:00", 1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET estado = 'DISPONIBLE' WHERE id_embarcacion = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET estado = 'OCUPADA' WHERE id_embarcacion = $1`)).
			WithArgs(2).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET id_tour_programado = $1, fecha_especifica = $2, hora_inicio = $3, hora_fin = $4, id_chofer = $5, id_embarcacion = $6, cupo_disponible = $7, estado = $8 WHERE id_instancia = $9`)).
			WithArgs(2, fechaEspecificaTime, horaInicioTime, horaFinTime, 2, 2, 15, "EN_CURSO", 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Update(1, instancia)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("SuccessCancel", func(t *testing.T) {
		estado := "CANCELADO"
		instancia := &entidades.ActualizarInstanciaTourRequest{
			Estado: &estado,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado"}).
				AddRow(1, time.Now(), time.Now(), time.Now(), sql.NullInt64{}, 1, 10, "PROGRAMADO"))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET estado = 'DISPONIBLE' WHERE id_embarcacion = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET estado = $1 WHERE id_instancia = $2`)).
			WithArgs("CANCELADO", 1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Update(1, instancia)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		instancia := &entidades.ActualizarInstanciaTourRequest{
			CupoDisponible: new(int),
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		err := repo.Update(1, instancia)
		assert.Error(t, err)
		assert.Equal(t, "la instancia de tour especificada no existe", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InvalidFechaFormat", func(t *testing.T) {
		fechaEspecifica := "2025/10/16"
		instancia := &entidades.ActualizarInstanciaTourRequest{
			FechaEspecifica: &fechaEspecifica,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado"}).
				AddRow(1, time.Now(), time.Now(), time.Now(), sql.NullInt64{}, 1, 10, "PROGRAMADO"))

		err := repo.Update(1, instancia)
		assert.Error(t, err)
		assert.Equal(t, "formato de fecha inválido, debe ser YYYY-MM-DD", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("HoraFinNotAfterHoraInicio", func(t *testing.T) {
		horaInicio := "12:00"
		horaFin := "09:00"
		instancia := &entidades.ActualizarInstanciaTourRequest{
			HoraInicio: &horaInicio,
			HoraFin:    &horaFin,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado"}).
				AddRow(1, time.Now(), time.Now(), time.Now(), sql.NullInt64{}, 1, 10, "PROGRAMADO"))

		err := repo.Update(1, instancia)
		assert.Error(t, err)
		assert.Equal(t, "la hora de fin debe ser posterior a la hora de inicio", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ChoferNotAvailable", func(t *testing.T) {
		idChofer := 2
		instancia := &entidades.ActualizarInstanciaTourRequest{
			IDChofer: &idChofer,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado"}).
				AddRow(1, time.Now(), time.Now(), time.Now(), sql.NullInt64{Int64: 1, Valid: true}, 1, 10, "PROGRAMADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_.* = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		err := repo.Update(1, instancia)
		assert.Error(t, err)
		assert.Equal(t, "el chofer no está disponible en la fecha y horario especificados", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("EmbarcacionOccupied", func(t *testing.T) {
		idEmbarcacion := 2
		instancia := &entidades.ActualizarInstanciaTourRequest{
			IDEmbarcacion: &idEmbarcacion,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado"}).
				AddRow(1, time.Now(), time.Now(), time.Now(), sql.NullInt64{}, 1, 10, "PROGRAMADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false AND estado IN ('DISPONIBLE', 'OCUPADA'))`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_embarcacion = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND id_instancia != $5 AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))

		err := repo.Update(1, instancia)
		assert.Error(t, err)
		assert.Equal(t, "la embarcación ya está asignada a otro tour en el mismo horario", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		instancia := &entidades.ActualizarInstanciaTourRequest{
			CupoDisponible: new(int),
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.Update(1, instancia)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_Delete(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_embarcacion"}).AddRow(1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET eliminado = true WHERE id_instancia = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET estado = 'DISPONIBLE' WHERE id_embarcacion = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectCommit()

		err := repo.Delete(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("HasReservas", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "no se puede eliminar esta instancia de tour porque tiene reservas asociadas", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "instancia de tour no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_instancia = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_List(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")
		rows := sqlmock.NewRows([]string{"id_instancia", "id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado", "eliminado", "nombre", "nombre_embarcacion", "nombre_sede", "nombre_chofer"}).
			AddRow(1, 1, fechaEspecifica, horaInicio, horaFin, sql.NullInt64{Int64: 1, Valid: true}, 1, 10, "PROGRAMADO", false, "Tour Aventura", "Barco Rápido", "Sede Central", "Juan Pérez")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.eliminado = false ORDER BY i.fecha_especifica, i.hora_inicio`)).
			WillReturnRows(rows)

		instancias, err := repo.List()
		assert.NoError(t, err)
		assert.Len(t, instancias, 1)
		assert.Equal(t, 1, instancias[0].ID)
		assert.Equal(t, "2025-10-15", instancias[0].FechaEspecificaStr)
		assert.Equal(t, "09:00", instancias[0].HoraInicioStr)
		assert.Equal(t, "12:00", instancias[0].HoraFinStr)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.eliminado = false ORDER BY i.fecha_especifica, i.hora_inicio`)).
			WillReturnError(errors.New("database error"))

		instancias, err := repo.List()
		assert.Error(t, err)
		assert.Nil(t, instancias)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_ListByTourProgramado(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")
		rows := sqlmock.NewRows([]string{"id_instancia", "id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado", "eliminado", "nombre", "nombre_embarcacion", "nombre_sede", "nombre_chofer"}).
			AddRow(1, 1, fechaEspecifica, horaInicio, horaFin, sql.NullInt64{Int64: 1, Valid: true}, 1, 10, "PROGRAMADO", false, "Tour Aventura", "Barco Rápido", "Sede Central", "Juan Pérez")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.id_tour_programado = $1 AND i.eliminado = false ORDER BY i.fecha_especifica, i.hora_inicio`)).
			WithArgs(1).
			WillReturnRows(rows)

		instancias, err := repo.ListByTourProgramado(1)
		assert.NoError(t, err)
		assert.Len(t, instancias, 1)
		assert.Equal(t, 1, instancias[0].ID)
		assert.Equal(t, "2025-10-15", instancias[0].FechaEspecificaStr)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.id_tour_programado = $1 AND i.eliminado = false ORDER BY i.fecha_especifica, i.hora_inicio`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		instancias, err := repo.ListByTourProgramado(1)
		assert.Error(t, err)
		assert.Nil(t, instancias)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_ListByFiltros(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("SuccessWithFiltros", func(t *testing.T) {
		idTourProgramado := 1
		fechaInicio := "2025-10-01"
		fechaFin := "2025-10-31"
		estado := "PROGRAMADO"
		filtros := entidades.FiltrosInstanciaTour{
			IDTourProgramado: &idTourProgramado,
			FechaInicio:      &fechaInicio,
			FechaFin:         &fechaFin,
			Estado:           &estado,
		}

		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")
		rows := sqlmock.NewRows([]string{"id_instancia", "id_tour_programado", "fecha_especifica", "hora_inicio", "hora_fin", "id_chofer", "id_embarcacion", "cupo_disponible", "estado", "eliminado", "nombre", "nombre_embarcacion", "nombre_sede", "nombre_chofer"}).
			AddRow(1, 1, fechaEspecifica, horaInicio, horaFin, sql.NullInt64{Int64: 1, Valid: true}, 1, 10, "PROGRAMADO", false, "Tour Aventura", "Barco Rápido", "Sede Central", "Juan Pérez")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.eliminado = false AND i.id_tour_programado = $1 AND i.fecha_especifica >= $2 AND i.fecha_especifica <= $3 AND i.estado = $4 ORDER BY i.fecha_especifica, i.hora_inicio`)).
			WithArgs(1, "2025-10-01", "2025-10-31", "PROGRAMADO").
			WillReturnRows(rows)

		instancias, err := repo.ListByFiltros(filtros)
		assert.NoError(t, err)
		assert.Len(t, instancias, 1)
		assert.Equal(t, 1, instancias[0].ID)
		assert.Equal(t, "2025-10-15", instancias[0].FechaEspecificaStr)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		filtros := entidades.FiltrosInstanciaTour{}

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT i.id_instancia, i.id_tour_programado, i.fecha_especifica, i.hora_inicio, i.hora_fin, i.id_chofer, i.id_embarcacion, i.cupo_disponible, i.estado, i.eliminado, t.nombre, e.nombre, s.nombre, COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') FROM instancia_tour i INNER JOIN tour_programado tp ON i.id_tour_programado = tp.id_tour_programado INNER JOIN tipo_tour t ON tp.id_tipo_tour = t.id_tipo_tour INNER JOIN embarcacion e ON i.id_embarcacion = e.id_embarcacion INNER JOIN sede s ON tp.id_sede = s.id_sede LEFT JOIN usuario u ON i.id_chofer = u.id_usuario WHERE i.eliminado = false ORDER BY i.fecha_especifica, i.hora_inicio`)).
			WillReturnError(errors.New("database error"))

		instancias, err := repo.ListByFiltros(filtros)
		assert.Error(t, err)
		assert.Nil(t, instancias)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_AsignarChofer(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT fecha_especifica, hora_inicio, hora_fin, estado FROM instancia_tour WHERE id_instancia = $1`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"fecha_especifica", "hora_inicio", "hora_fin", "estado"}).
				AddRow(fechaEspecifica, horaInicio, horaFin, "PROGRAMADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(2, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_chofer = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND id_instancia != $5 AND estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(2, "2025-10-15", "09:00", "12:00", 1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE instancia_tour SET id_chofer = $1 WHERE id_instancia = $2`)).
			WithArgs(2, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.AsignarChofer(1, 2)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InstanciaNotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		err := repo.AsignarChofer(1, 2)
		assert.Error(t, err)
		assert.Equal(t, "la instancia de tour especificada no existe", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ChoferNotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		err := repo.AsignarChofer(1, 2)
		assert.Error(t, err)
		assert.Equal(t, "el chofer especificado no existe o no tiene rol de chofer", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotProgramado", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT fecha_especifica, hora_inicio, hora_fin, estado FROM instancia_tour WHERE id_instancia = $1`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"fecha_especifica", "hora_inicio", "hora_fin", "estado"}).
				AddRow(fechaEspecifica, horaInicio, horaFin, "EN_CURSO"))

		err := repo.AsignarChofer(1, 2)
		assert.Error(t, err)
		assert.Equal(t, "solo se puede asignar un chofer a instancias en estado PROGRAMADO", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ChoferNotAvailable", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT fecha_especifica, hora_inicio, hora_fin, estado FROM instancia_tour WHERE id_instancia = $1`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"fecha_especifica", "hora_inicio", "hora_fin", "estado"}).
				AddRow(fechaEspecifica, horaInicio, horaFin, "PROGRAMADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(2, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(false))

		err := repo.AsignarChofer(1, 2)
		assert.Error(t, err)
		assert.Equal(t, "el chofer no está disponible en la fecha y horario especificados", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ChoferOccupied", func(t *testing.T) {
		fechaEspecifica, _ := time.Parse("2006-01-02", "2025-10-15")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM usuario WHERE id_usuario = $1 AND rol = 'CHOFER' AND eliminado = false)`)).
			WithArgs(2).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT fecha_especifica, hora_inicio, hora_fin, estado FROM instancia_tour WHERE id_instancia = $1`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"fecha_especifica", "hora_inicio", "hora_fin", "estado"}).
				AddRow(fechaEspecifica, horaInicio, horaFin, "PROGRAMADO"))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM horario_chofer WHERE id_usuario = $1 AND disponible_miercoles = true AND hora_inicio <= $2::time AND hora_fin >= $3::time AND fecha_inicio <= $4 AND (fecha_fin IS NULL OR fecha_fin >= $4) AND eliminado = false)`)).
			WithArgs(2, "09:00", "12:00", "2025-10-15").
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS (SELECT 1 FROM instancia_tour WHERE id_chofer = $1 AND fecha_especifica = $2 AND ((hora_inicio <= $3::time AND hora_fin > $3::time) OR (hora_inicio < $4::time AND hora_fin >= $4::time) OR (hora_inicio >= $3::time AND hora_fin <= $4::time)) AND id_instancia != $5 AND estado IN ('PROGRAMADO', 'EN_CURSO') AND\
		// Continuación de TestInstanciaTourRepository_AsignarChofer

		estado IN ('PROGRAMADO', 'EN_CURSO') AND eliminado = false)`)).
			WithArgs(2, "2025-10-15", "09:00", "12:00", 1).
			WillReturnRows(sqlmock.NewRows([]string{"exists"}).AddRow(true))

		err := repo.AsignarChofer(1, 2)
		assert.Error(t, err)
		assert.Equal(t, "el chofer ya está asignado a otro tour en el mismo horario", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT EXISTS(SELECT 1 FROM instancia_tour WHERE id_instancia = $1 AND eliminado = false)`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.AsignarChofer(1, 2)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestInstanciaTourRepository_GenerarInstanciasDeTourProgramado(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewInstanciaTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		vigenciaDesde, _ := time.Parse("2006-01-02", "2025-10-01")
		vigenciaHasta, _ := time.Parse("2006-01-02", "2025-10-07")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		// Tour programado para lunes y miércoles
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT tp.id_tour_programado, tp.id_tipo_tour, tp.id_embarcacion, tp.id_horario, tp.id_sede, tp.id_chofer, tp.vigencia_desde, tp.vigencia_hasta, tp.cupo_maximo, tp.cupo_disponible FROM tour_programado tp WHERE tp.id_tour_programado = $1 AND tp.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "id_tipo_tour", "id_embarcacion", "id_horario", "id_sede", "id_chofer", "vigencia_desde", "vigencia_hasta", "cupo_maximo", "cupo_disponible"}).
				AddRow(1, 1, 1, 1, 1, sql.NullInt64{Int64: 1, Valid: true}, vigenciaDesde, vigenciaHasta, 10, 10))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT h.hora_inicio, h.hora_fin, h.disponible_lunes, h.disponible_martes, h.disponible_miercoles, h.disponible_jueves, h.disponible_viernes, h.disponible_sabado, h.disponible_domingo FROM horario_tour h WHERE h.id_horario = $1 AND h.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"hora_inicio", "hora_fin", "disponible_lunes", "disponible_martes", "disponible_miercoles", "disponible_jueves", "disponible_viernes", "disponible_sabado", "disponible_domingo"}).
				AddRow(horaInicio, horaFin, true, false, true, false, false, false, false))
		// Instancias para lunes (2025-10-01) y miércoles (2025-10-03)
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO instancia_tour (id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROGRAMADO', false)`)).
			WithArgs(1, time.Date(2025, 10, 1, 0, 0, 0, 0, time.UTC), horaInicio, horaFin, int64(1), 1, 10).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO instancia_tour (id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROGRAMADO', false)`)).
			WithArgs(1, time.Date(2025, 10, 3, 0, 0, 0, 0, time.UTC), horaInicio, horaFin, int64(1), 1, 10).
			WillReturnResult(sqlmock.NewResult(2, 1))
		mock.ExpectCommit()

		count, err := repo.GenerarInstanciasDeTourProgramado(1)
		assert.NoError(t, err)
		assert.Equal(t, 2, count) // 2 instancias creadas (lunes y miércoles)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("TourProgramadoNotFound", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT tp.id_tour_programado, tp.id_tipo_tour, tp.id_embarcacion, tp.id_horario, tp.id_sede, tp.id_chofer, tp.vigencia_desde, tp.vigencia_hasta, tp.cupo_maximo, tp.cupo_disponible FROM tour_programado tp WHERE tp.id_tour_programado = $1 AND tp.eliminado = false`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		count, err := repo.GenerarInstanciasDeTourProgramado(1)
		assert.Error(t, err)
		assert.Equal(t, 0, count)
		assert.Equal(t, "tour programado no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("HorarioNotFound", func(t *testing.T) {
		vigenciaDesde, _ := time.Parse("2006-01-02", "2025-10-01")
		vigenciaHasta, _ := time.Parse("2006-01-02", "2025-10-07")

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT tp.id_tour_programado, tp.id_tipo_tour, tp.id_embarcacion, tp.id_horario, tp.id_sede, tp.id_chofer, tp.vigencia_desde, tp.vigencia_hasta, tp.cupo_maximo, tp.cupo_disponible FROM tour_programado tp WHERE tp.id_tour_programado = $1 AND tp.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "id_tipo_tour", "id_embarcacion", "id_horario", "id_sede", "id_chofer", "vigencia_desde", "vigencia_hasta", "cupo_maximo", "cupo_disponible"}).
				AddRow(1, 1, 1, 1, 1, sql.NullInt64{}, vigenciaDesde, vigenciaHasta, 10, 10))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT h.hora_inicio, h.hora_fin, h.disponible_lunes, h.disponible_martes, h.disponible_miercoles, h.disponible_jueves, h.disponible_viernes, h.disponible_sabado, h.disponible_domingo FROM horario_tour h WHERE h.id_horario = $1 AND h.eliminado = false`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		count, err := repo.GenerarInstanciasDeTourProgramado(1)
		assert.Error(t, err)
		assert.Equal(t, 0, count)
		assert.Equal(t, "sql: no rows in result set", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NoDiasDisponibles", func(t *testing.T) {
		vigenciaDesde, _ := time.Parse("2006-01-02", "2025-10-01")
		vigenciaHasta, _ := time.Parse("2006-01-02", "2025-10-07")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT tp.id_tour_programado, tp.id_tipo_tour, tp.id_embarcacion, tp.id_horario, tp.id_sede, tp.id_chofer, tp.vigencia_desde, tp.vigencia_hasta, tp.cupo_maximo, tp.cupo_disponible FROM tour_programado tp WHERE tp.id_tour_programado = $1 AND tp.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "id_tipo_tour", "id_embarcacion", "id_horario", "id_sede", "id_chofer", "vigencia_desde", "vigencia_hasta", "cupo_maximo", "cupo_disponible"}).
				AddRow(1, 1, 1, 1, 1, sql.NullInt64{}, vigenciaDesde, vigenciaHasta, 10, 10))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT h.hora_inicio, h.hora_fin, h.disponible_lunes, h.disponible_martes, h.disponible_miercoles, h.disponible_jueves, h.disponible_viernes, h.disponible_sabado, h.disponible_domingo FROM horario_tour h WHERE h.id_horario = $1 AND h.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"hora_inicio", "hora_fin", "disponible_lunes", "disponible_martes", "disponible_miercoles", "disponible_jueves", "disponible_viernes", "disponible_sabado", "disponible_domingo"}).
				AddRow(horaInicio, horaFin, false, false, false, false, false, false, false))
		mock.ExpectCommit()

		count, err := repo.GenerarInstanciasDeTourProgramado(1)
		assert.Error(t, err)
		assert.Equal(t, 0, count)
		assert.Equal(t, "no se pudo crear ninguna instancia: no hay días disponibles en el rango de fechas", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBErrorOnInsert", func(t *testing.T) {
		vigenciaDesde, _ := time.Parse("2006-01-02", "2025-10-01")
		vigenciaHasta, _ := time.Parse("2006-01-02", "2025-10-07")
		horaInicio, _ := time.Parse("15:04", "09:00")
		horaFin, _ := time.Parse("15:04", "12:00")

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT tp.id_tour_programado, tp.id_tipo_tour, tp.id_embarcacion, tp.id_horario, tp.id_sede, tp.id_chofer, tp.vigencia_desde, tp.vigencia_hasta, tp.cupo_maximo, tp.cupo_disponible FROM tour_programado tp WHERE tp.id_tour_programado = $1 AND tp.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_tour_programado", "id_tipo_tour", "id_embarcacion", "id_horario", "id_sede", "id_chofer", "vigencia_desde", "vigencia_hasta", "cupo_maximo", "cupo_disponible"}).
				AddRow(1, 1, 1, 1, 1, sql.NullInt64{}, vigenciaDesde, vigenciaHasta, 10, 10))
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT h.hora_inicio, h.hora_fin, h.disponible_lunes, h.disponible_martes, h.disponible_miercoles, h.disponible_jueves, h.disponible_viernes, h.disponible_sabado, h.disponible_domingo FROM horario_tour h WHERE h.id_horario = $1 AND h.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"hora_inicio", "hora_fin", "disponible_lunes", "disponible_martes", "disponible_miercoles", "disponible_jueves", "disponible_viernes", "disponible_sabado", "disponible_domingo"}).
				AddRow(horaInicio, horaFin, true, false, false, false, false, false, false))
		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO instancia_tour (id_tour_programado, fecha_especifica, hora_inicio, hora_fin, id_chofer, id_embarcacion, cupo_disponible, estado, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROGRAMADO', false)`)).
			WithArgs(1, time.Date(2025, 10, 1, 0, 0, 0, 0, time.UTC), horaInicio, horaFin, nil, 1, 10).
			WillReturnError(errors.New("database error"))

		count, err := repo.GenerarInstanciasDeTourProgramado(1)
		assert.Error(t, err)
		assert.Equal(t, 0, count)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
