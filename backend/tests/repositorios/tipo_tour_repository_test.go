package repositorios_test

import (
	"database/sql"
	"errors"
	"regexp"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestTipoTourRepository_GetByID(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_tipo_tour", "id_sede", "nombre", "descripcion", "duracion_minutos", "url_imagen", "eliminado", "nombre_sede"}).
			AddRow(1, 2, "Tour Aventura", sql.NullString{String: "Tour de montaña", Valid: true}, 120, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, false, "Sede Principal")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.id_tipo_tour = $1`)).
			WithArgs(1).
			WillReturnRows(rows)

		tipoTour, err := repo.GetByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, tipoTour)
		assert.Equal(t, 1, tipoTour.ID)
		assert.Equal(t, 2, tipoTour.IDSede)
		assert.Equal(t, "Tour Aventura", tipoTour.Nombre)
		assert.Equal(t, sql.NullString{String: "Tour de montaña", Valid: true}, tipoTour.Descripcion)
		assert.Equal(t, 120, tipoTour.DuracionMinutos)
		assert.Equal(t, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, tipoTour.URLImagen)
		assert.Equal(t, false, tipoTour.Eliminado)
		assert.Equal(t, "Sede Principal", tipoTour.NombreSede)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.id_tipo_tour = $1`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		tipoTour, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, tipoTour)
		assert.Equal(t, "tipo de tour no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.id_tipo_tour = $1`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		tipoTour, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, tipoTour)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestTipoTourRepository_GetByNombre(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_tipo_tour", "id_sede", "nombre", "descripcion", "duracion_minutos", "url_imagen", "eliminado"}).
			AddRow(1, 2, "Tour Aventura", sql.NullString{String: "Tour de montaña", Valid: true}, 120, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tipo_tour, id_sede, nombre, descripcion, duracion_minutos, url_imagen, eliminado FROM tipo_tour WHERE nombre = $1 AND id_sede = $2`)).
			WithArgs("Tour Aventura", 2).
			WillReturnRows(rows)

		tipoTour, err := repo.GetByNombre("Tour Aventura", 2)
		assert.NoError(t, err)
		assert.NotNil(t, tipoTour)
		assert.Equal(t, 1, tipoTour.ID)
		assert.Equal(t, 2, tipoTour.IDSede)
		assert.Equal(t, "Tour Aventura", tipoTour.Nombre)
		assert.Equal(t, sql.NullString{String: "Tour de montaña", Valid: true}, tipoTour.Descripcion)
		assert.Equal(t, 120, tipoTour.DuracionMinutos)
		assert.Equal(t, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, tipoTour.URLImagen)
		assert.Equal(t, false, tipoTour.Eliminado)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tipo_tour, id_sede, nombre, descripcion, duracion_minutos, url_imagen, eliminado FROM tipo_tour WHERE nombre = $1 AND id_sede = $2`)).
			WithArgs("Tour Aventura", 2).
			WillReturnError(sql.ErrNoRows)

		tipoTour, err := repo.GetByNombre("Tour Aventura", 2)
		assert.Error(t, err)
		assert.Nil(t, tipoTour)
		assert.Equal(t, "tipo de tour no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_tipo_tour, id_sede, nombre, descripcion, duracion_minutos, url_imagen, eliminado FROM tipo_tour WHERE nombre = $1 AND id_sede = $2`)).
			WithArgs("Tour Aventura", 2).
			WillReturnError(errors.New("database error"))

		tipoTour, err := repo.GetByNombre("Tour Aventura", 2)
		assert.Error(t, err)
		assert.Nil(t, tipoTour)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestTipoTourRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		tipoTour := &entidades.NuevoTipoTourRequest{
			IDSede:          2,
			Nombre:          "Tour Aventura",
			Descripcion:     "Tour de montaña",
			DuracionMinutos: 120,
			URLImagen:       "http://example.com/tour.jpg",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO tipo_tour (id_sede, nombre, descripcion, duracion_minutos, url_imagen, eliminado) VALUES ($1, $2, $3, $4, $5, false) RETURNING id_tipo_tour`)).
			WithArgs(2, "Tour Aventura", "Tour de montaña", 120, "http://example.com/tour.jpg").
			WillReturnRows(sqlmock.NewRows([]string{"id_tipo_tour"}).AddRow(1))

		id, err := repo.Create(tipoTour)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		tipoTour := &entidades.NuevoTipoTourRequest{
			IDSede:          2,
			Nombre:          "Tour Aventura",
			Descripcion:     "Tour de montaña",
			DuracionMinutos: 120,
			URLImagen:       "http://example.com/tour.jpg",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO tipo_tour (id_sede, nombre, descripcion, duracion_minutos, url_imagen, eliminado) VALUES ($1, $2, $3, $4, $5, false) RETURNING id_tipo_tour`)).
			WithArgs(2, "Tour Aventura", "Tour de montaña", 120, "http://example.com/tour.jpg").
			WillReturnError(errors.New("database error"))

		id, err := repo.Create(tipoTour)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestTipoTourRepository_Update(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		tipoTour := &entidades.ActualizarTipoTourRequest{
			IDSede:          2,
			Nombre:          "Tour Aventura Actualizado",
			Descripcion:     "Tour de montaña actualizado",
			DuracionMinutos: 150,
			URLImagen:       "http://example.com/tour_updated.jpg",
			Eliminado:       false,
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE tipo_tour SET id_sede = $1, nombre = $2, descripcion = $3, duracion_minutos = $4, url_imagen = $5, eliminado = $6 WHERE id_tipo_tour = $7`)).
			WithArgs(2, "Tour Aventura Actualizado", "Tour de montaña actualizado", 150, "http://example.com/tour_updated.jpg", false, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Update(1, tipoTour)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		tipoTour := &entidades.ActualizarTipoTourRequest{
			IDSede:          2,
			Nombre:          "Tour Aventura Actualizado",
			Descripcion:     "Tour de montaña actualizado",
			DuracionMinutos: 150,
			URLImagen:       "http://example.com/tour_updated.jpg",
			Eliminado:       false,
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE tipo_tour SET id_sede = $1, nombre = $2, descripcion = $3, duracion_minutos = $4, url_imagen = $5, eliminado = $6 WHERE id_tipo_tour = $7`)).
			WithArgs(2, "Tour Aventura Actualizado", "Tour de montaña actualizado", 150, "http://example.com/tour_updated.jpg", false, 1).
			WillReturnError(errors.New("database error"))

		err := repo.Update(1, tipoTour)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestTipoTourRepository_Delete(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE tipo_tour SET eliminado = true WHERE id_tipo_tour = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Delete(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE tipo_tour SET eliminado = true WHERE id_tipo_tour = $1`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestTipoTourRepository_List(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_tipo_tour", "id_sede", "nombre", "descripcion", "duracion_minutos", "url_imagen", "eliminado", "nombre_sede"}).
			AddRow(1, 2, "Tour Aventura", sql.NullString{String: "Tour de montaña", Valid: true}, 120, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, false, "Sede Principal").
			AddRow(2, 2, "Tour Cultural", sql.NullString{String: "Tour histórico", Valid: true}, 90, sql.NullString{String: "http://example.com/cultural.jpg", Valid: true}, false, "Sede Principal")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.eliminado = false ORDER BY t.nombre`)).
			WillReturnRows(rows)

		tiposTour, err := repo.List()
		assert.NoError(t, err)
		assert.Len(t, tiposTour, 2)
		assert.Equal(t, 1, tiposTour[0].ID)
		assert.Equal(t, "Tour Aventura", tiposTour[0].Nombre)
		assert.Equal(t, sql.NullString{String: "Tour de montaña", Valid: true}, tiposTour[0].Descripcion)
		assert.Equal(t, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, tiposTour[0].URLImagen)
		assert.Equal(t, 2, tiposTour[1].ID)
		assert.Equal(t, "Tour Cultural", tiposTour[1].Nombre)
		assert.Equal(t, sql.NullString{String: "Tour histórico", Valid: true}, tiposTour[1].Descripcion)
		assert.Equal(t, sql.NullString{String: "http://example.com/cultural.jpg", Valid: true}, tiposTour[1].URLImagen)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.eliminado = false ORDER BY t.nombre`)).
			WillReturnError(errors.New("database error"))

		tiposTour, err := repo.List()
		assert.Error(t, err)
		assert.Nil(t, tiposTour)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestTipoTourRepository_ListBySede(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewTipoTourRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_tipo_tour", "id_sede", "nombre", "descripcion", "duracion_minutos", "url_imagen", "eliminado", "nombre_sede"}).
			AddRow(1, 2, "Tour Aventura", sql.NullString{String: "Tour de montaña", Valid: true}, 120, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, false, "Sede Principal")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.id_sede = $1 AND t.eliminado = false ORDER BY t.nombre`)).
			WithArgs(2).
			WillReturnRows(rows)

		tiposTour, err := repo.ListBySede(2)
		assert.NoError(t, err)
		assert.Len(t, tiposTour, 1)
		assert.Equal(t, 1, tiposTour[0].ID)
		assert.Equal(t, "Tour Aventura", tiposTour[0].Nombre)
		assert.Equal(t, sql.NullString{String: "Tour de montaña", Valid: true}, tiposTour[0].Descripcion)
		assert.Equal(t, sql.NullString{String: "http://example.com/tour.jpg", Valid: true}, tiposTour[0].URLImagen)
		assert.Equal(t, "Sede Principal", tiposTour[0].NombreSede)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT t.id_tipo_tour, t.id_sede, t.nombre, t.descripcion, t.duracion_minutos, t.url_imagen, t.eliminado, s.nombre as nombre_sede FROM tipo_tour t INNER JOIN sede s ON t.id_sede = s.id_sede WHERE t.id_sede = $1 AND t.eliminado = false ORDER BY t.nombre`)).
			WithArgs(2).
			WillReturnError(errors.New("database error"))

		tiposTour, err := repo.ListBySede(2)
		assert.Error(t, err)
		assert.Nil(t, tiposTour)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
