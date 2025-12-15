// archivo: repositorios/horario_chofer_repository_test.go
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

var (
	mockHoraInicio  = time.Date(0, 1, 1, 8, 0, 0, 0, time.UTC)
	mockHoraFin     = time.Date(0, 1, 1, 17, 0, 0, 0, time.UTC)
	mockFechaInicio = time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC)
	mockFechaFin    = time.Date(2025, 12, 31, 0, 0, 0, 0, time.UTC)
)

func TestHorarioChoferRepository_GetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewHorarioChoferRepository(db)

	t.Run("Success - Found", func(t *testing.T) {
		expected := &entidades.HorarioChofer{
			ID:                  1,
			IDUsuario:           10,
			IDSede:              5,
			HoraInicio:          mockHoraInicio,
			HoraFin:             mockHoraFin,
			DisponibleLunes:     true,
			DisponibleMartes:    false,
			DisponibleMiercoles: true,
			DisponibleJueves:    true,
			DisponibleViernes:   true,
			DisponibleSabado:    false,
			DisponibleDomingo:   false,
			FechaInicio:         mockFechaInicio,
			FechaFin:            &mockFechaFin,
			Eliminado:           false,
			NombreChofer:        "Carlos",
			ApellidosChofer:     "López",
			DocumentoChofer:     "11223344",
			TelefonoChofer:      "999888777",
			NombreSede:          "Sede Norte",
		}

		rows := sqlmock.NewRows([]string{
			"id_horario_chofer", "id_usuario", "id_sede", "hora_inicio", "hora_fin",
			"disponible_lunes", "disponible_martes", "disponible_miercoles",
			"disponible_jueves", "disponible_viernes", "disponible_sabado",
			"disponible_domingo", "fecha_inicio", "fecha_fin", "eliminado",
			"nombres", "apellidos", "numero_documento", "telefono", "nombre",
		}).AddRow(
			expected.ID, expected.IDUsuario, expected.IDSede,
			expected.HoraInicio, expected.HoraFin,
			expected.DisponibleLunes, expected.DisponibleMartes, expected.DisponibleMiercoles,
			expected.DisponibleJueves, expected.DisponibleViernes, expected.DisponibleSabado,
			expected.DisponibleDomingo, expected.FechaInicio, expected.FechaFin, expected.Eliminado,
			expected.NombreChofer, expected.ApellidosChofer,
			expected.DocumentoChofer, expected.TelefonoChofer, expected.NombreSede,
		)

		mock.ExpectQuery(regexp.QuoteMeta("SELECT hc.id_horario_chofer")).
			WithArgs(1).
			WillReturnRows(rows)

		result, err := repo.GetByID(1)

		assert.NoError(t, err)
		assert.NotNil(t, result)
		assert.Equal(t, expected, result)
	})

	t.Run("Not Found - Returns nil", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT hc.id_horario_chofer")).
			WithArgs(999).
			WillReturnError(sql.ErrNoRows)

		result, err := repo.GetByID(999)

		assert.NoError(t, err) // o assert.Error si prefieres error en vez de nil
		assert.Nil(t, result)
	})

	t.Run("Database Error", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT hc.id_horario_chofer")).
			WithArgs(1).
			WillReturnError(errors.New("connection timeout"))

		result, err := repo.GetByID(1)

		assert.Error(t, err)
		assert.Nil(t, result)
	})

	assert.NoError(t, mock.ExpectationsWereMet())
}

// Los otros tests permanecen igual que antes, pero los incluyo para que tengas todo completo

func TestHorarioChoferRepository_ListActiveByChofer(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewHorarioChoferRepository(db)

	rows := sqlmock.NewRows([]string{
		"id_horario_chofer", "id_usuario", "id_sede", "hora_inicio", "hora_fin",
		"disponible_lunes", "disponible_martes", "disponible_miercoles",
		"disponible_jueves", "disponible_viernes", "disponible_sabado",
		"disponible_domingo", "fecha_inicio", "fecha_fin", "eliminado",
		"nombres", "apellidos", "numero_documento", "telefono", "nombre",
	}).AddRow(
		1, 10, 5, mockHoraInicio, mockHoraFin,
		true, true, true, true, true, false, false,
		mockFechaInicio, nil, false,
		"Juan", "Pérez", "12345678", "987654321", "Central",
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT hc.id_horario_chofer")).
		WithArgs(10).
		WillReturnRows(rows)

	result, err := repo.ListActiveByChofer(10)

	assert.NoError(t, err)
	assert.Len(t, result, 1)
	assert.Equal(t, "Juan", result[0].NombreChofer)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestHorarioChoferRepository_ListByDia(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewHorarioChoferRepository(db)

	for dia, nombre := range map[int]string{1: "Lunes", 2: "Martes", 7: "Domingo"} {
		t.Run(nombre, func(t *testing.T) {
			rows := sqlmock.NewRows([]string{
				"id_horario_chofer", "id_usuario", "id_sede", "hora_inicio", "hora_fin",
				"disponible_lunes", "disponible_martes", "disponible_miercoles",
				"disponible_jueves", "disponible_viernes", "disponible_sabado",
				"disponible_domingo", "fecha_inicio", "fecha_fin", "eliminado",
				"nombres", "apellidos", "numero_documento", "telefono", "nombre",
			}).AddRow(1, 10, 5, mockHoraInicio, mockHoraFin,
				dia == 1, dia == 2, dia == 3, dia == 4, dia == 5, dia == 6, dia == 7,
				mockFechaInicio, nil, false, "Ana", "Gómez", "87654321", "123456789", "Norte")

			mock.ExpectQuery(regexp.QuoteMeta("SELECT hc.id_horario_chofer")).
				WillReturnRows(rows)

			result, err := repo.ListByDia(dia)

			assert.NoError(t, err)
			assert.Len(t, result, 1)
		})
	}

	t.Run("Día inválido", func(t *testing.T) {
		result, err := repo.ListByDia(8)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "día de la semana inválido")
		assert.Nil(t, result)
	})

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestHorarioChoferRepository_VerifyHorarioOverlap(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewHorarioChoferRepository(db)

	t.Run("Solapamiento con fecha fin nula", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COUNT(*) FROM horario_chofer")).
			WithArgs(10, mockHoraInicio, mockHoraFin, mockFechaInicio).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		hasOverlap, err := repo.VerifyHorarioOverlap(10, mockHoraInicio, mockHoraFin, &mockFechaInicio, nil, 0)
		assert.NoError(t, err)
		assert.True(t, hasOverlap)
	})

	t.Run("Sin solapamiento con fecha fin", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COUNT(*) FROM horario_chofer")).
			WithArgs(10, mockHoraInicio, mockHoraFin, mockFechaInicio, mockFechaFin).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		hasOverlap, err := repo.VerifyHorarioOverlap(10, mockHoraInicio, mockHoraFin, &mockFechaInicio, &mockFechaFin, 0)
		assert.NoError(t, err)
		assert.False(t, hasOverlap)
	})

	t.Run("Excluir propio ID", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COUNT(*) FROM horario_chofer")).
			WithArgs(10, mockHoraInicio, mockHoraFin, mockFechaInicio, 3).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		hasOverlap, err := repo.VerifyHorarioOverlap(10, mockHoraInicio, mockHoraFin, &mockFechaInicio, nil, 3)
		assert.NoError(t, err)
		assert.False(t, hasOverlap)
	})

	assert.NoError(t, mock.ExpectationsWereMet())
}
