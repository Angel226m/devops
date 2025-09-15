package repositorios_test

import (
	"errors"
	"regexp"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestHorarioChoferRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewHorarioChoferRepository(db)

	t.Run("Success", func(t *testing.T) {
		fechaInicio := time.Now()
		fechaFin := fechaInicio.Add(7 * 24 * time.Hour) // Una semana después
		horario := &entidades.NuevoHorarioChoferRequest{
			IDUsuario:           1,
			IDSede:              2,
			HoraInicio:          "08:00",
			HoraFin:             "16:00",
			DisponibleLunes:     true,
			DisponibleMartes:    false,
			DisponibleMiercoles: true,
			DisponibleJueves:    false,
			DisponibleViernes:   true,
			DisponibleSabado:    false,
			DisponibleDomingo:   false,
			FechaInicio:         fechaInicio,
			FechaFin:            &fechaFin,
		}

		// Convertir HoraInicio y HoraFin a time.Time para los argumentos esperados
		horaInicio, _ := time.Parse("15:04", horario.HoraInicio)
		horaFin, _ := time.Parse("15:04", horario.HoraFin)

		// Consulta SQL normalizada (coincide con lo que espera el driver)
		query := `INSERT INTO horario_chofer \( id_usuario, id_sede, hora_inicio, hora_fin, disponible_lunes, disponible_martes, disponible_miercoles, disponible_jueves, disponible_viernes, disponible_sabado, disponible_domingo, fecha_inicio, fecha_fin, eliminado \) VALUES \( \$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14 \) RETURNING id_horario_chofer`
		mock.ExpectQuery(regexp.QuoteMeta(query)).
			WithArgs(
				horario.IDUsuario,
				horario.IDSede,
				horaInicio,
				horaFin,
				horario.DisponibleLunes,
				horario.DisponibleMartes,
				horario.DisponibleMiercoles,
				horario.DisponibleJueves,
				horario.DisponibleViernes,
				horario.DisponibleSabado,
				horario.DisponibleDomingo,
				horario.FechaInicio,
				horario.FechaFin,
				false,
			).
			WillReturnRows(sqlmock.NewRows([]string{"id_horario_chofer"}).AddRow(1))

		id, err := repo.Create(horario)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InvalidHoraInicio", func(t *testing.T) {
		horario := &entidades.NuevoHorarioChoferRequest{
			IDUsuario:       1,
			IDSede:          2,
			HoraInicio:      "25:00", // Formato inválido
			HoraFin:         "16:00",
			DisponibleLunes: true,
			FechaInicio:     time.Now(),
		}

		id, err := repo.Create(horario)
		assert.Error(t, err)
		assert.Equal(t, "formato de hora de inicio inválido, debe ser HH:MM", err.Error())
		assert.Equal(t, 0, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("InvalidHoraFin", func(t *testing.T) {
		horario := &entidades.NuevoHorarioChoferRequest{
			IDUsuario:       1,
			IDSede:          2,
			HoraInicio:      "08:00",
			HoraFin:         "16:60", // Formato inválido
			DisponibleLunes: true,
			FechaInicio:     time.Now(),
		}

		id, err := repo.Create(horario)
		assert.Error(t, err)
		assert.Equal(t, "formato de hora de fin inválido, debe ser HH:MM", err.Error())
		assert.Equal(t, 0, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NoDiasDisponibles", func(t *testing.T) {
		horario := &entidades.NuevoHorarioChoferRequest{
			IDUsuario:           1,
			IDSede:              2,
			HoraInicio:          "08:00",
			HoraFin:             "16:00",
			DisponibleLunes:     false,
			DisponibleMartes:    false,
			DisponibleMiercoles: false,
			DisponibleJueves:    false,
			DisponibleViernes:   false,
			DisponibleSabado:    false,
			DisponibleDomingo:   false,
			FechaInicio:         time.Now(),
		}

		id, err := repo.Create(horario)
		assert.Error(t, err)
		assert.Equal(t, "debe seleccionar al menos un día disponible", err.Error())
		assert.Equal(t, 0, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		fechaInicio := time.Now()
		fechaFin := fechaInicio.Add(7 * 24 * time.Hour)
		horario := &entidades.NuevoHorarioChoferRequest{
			IDUsuario:       1,
			IDSede:          2,
			HoraInicio:      "08:00",
			HoraFin:         "16:00",
			DisponibleLunes: true,
			FechaInicio:     fechaInicio,
			FechaFin:        &fechaFin,
		}

		// Convertir HoraInicio y HoraFin a time.Time para los argumentos esperados
		horaInicio, _ := time.Parse("15:04", horario.HoraInicio)
		horaFin, _ := time.Parse("15:04", horario.HoraFin)

		// Consulta SQL normalizada
		query := `INSERT INTO horario_chofer \( id_usuario, id_sede, hora_inicio, hora_fin, disponible_lunes, disponible_martes, disponible_miercoles, disponible_jueves, disponible_viernes, disponible_sabado, disponible_domingo, fecha_inicio, fecha_fin, eliminado \) VALUES \( \$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14 \) RETURNING id_horario_chofer`
		mock.ExpectQuery(regexp.QuoteMeta(query)).
			WithArgs(
				horario.IDUsuario,
				horario.IDSede,
				horaInicio,
				horaFin,
				horario.DisponibleLunes,
				horario.DisponibleMartes,
				horario.DisponibleMiercoles,
				horario.DisponibleJueves,
				horario.DisponibleViernes,
				horario.DisponibleSabado,
				horario.DisponibleDomingo,
				horario.FechaInicio,
				horario.FechaFin,
				false,
			).
			WillReturnError(errors.New("database error"))

		id, err := repo.Create(horario)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.Equal(t, 0, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
