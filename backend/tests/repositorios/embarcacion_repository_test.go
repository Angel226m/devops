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

func TestEmbarcacionRepository_GetByID(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}).
			AddRow(1, 1, "Barco Rápido", 20, "Embarcación rápida para tours", false, "DISPONIBLE")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(rows)

		embarcacion, err := repo.GetByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, embarcacion)
		assert.Equal(t, 1, embarcacion.ID)
		assert.Equal(t, 1, embarcacion.IDSede)
		assert.Equal(t, "Barco Rápido", embarcacion.Nombre)
		assert.Equal(t, 20, embarcacion.Capacidad)
		assert.Equal(t, "Embarcación rápida para tours", embarcacion.Descripcion)
		assert.Equal(t, false, embarcacion.Eliminado)
		assert.Equal(t, "DISPONIBLE", embarcacion.Estado)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		embarcacion, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, embarcacion)
		assert.Equal(t, "embarcación no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE id_embarcacion = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		embarcacion, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, embarcacion)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_GetByNombre(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}).
			AddRow(1, 1, "Barco Rápido", 20, "Embarcación rápida para tours", false, "DISPONIBLE")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE nombre = $1 AND eliminado = false`)).
			WithArgs("Barco Rápido").
			WillReturnRows(rows)

		embarcacion, err := repo.GetByNombre("Barco Rápido")
		assert.NoError(t, err)
		assert.NotNil(t, embarcacion)
		assert.Equal(t, 1, embarcacion.ID)
		assert.Equal(t, 1, embarcacion.IDSede)
		assert.Equal(t, "Barco Rápido", embarcacion.Nombre)
		assert.Equal(t, 20, embarcacion.Capacidad)
		assert.Equal(t, "Embarcación rápida para tours", embarcacion.Descripcion)
		assert.Equal(t, false, embarcacion.Eliminado)
		assert.Equal(t, "DISPONIBLE", embarcacion.Estado)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE nombre = $1 AND eliminado = false`)).
			WithArgs("Barco Inexistente").
			WillReturnError(sql.ErrNoRows)

		embarcacion, err := repo.GetByNombre("Barco Inexistente")
		assert.Error(t, err)
		assert.Nil(t, embarcacion)
		assert.Equal(t, "embarcación no encontrada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE nombre = $1 AND eliminado = false`)).
			WithArgs("Barco Rápido").
			WillReturnError(errors.New("database error"))

		embarcacion, err := repo.GetByNombre("Barco Rápido")
		assert.Error(t, err)
		assert.Nil(t, embarcacion)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		embarcacion := &entidades.NuevaEmbarcacionRequest{
			IDSede:      1,
			Nombre:      "Barco Rápido",
			Capacidad:   20,
			Descripcion: "Embarcación rápida para tours",
			Estado:      "DISPONIBLE",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO embarcacion (id_sede, nombre, capacidad, descripcion, estado, eliminado) VALUES ($1, $2, $3, $4, $5, false) RETURNING id_embarcacion`)).
			WithArgs(1, "Barco Rápido", 20, "Embarcación rápida para tours", "DISPONIBLE").
			WillReturnRows(sqlmock.NewRows([]string{"id_embarcacion"}).AddRow(1))

		id, err := repo.Create(embarcacion)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		embarcacion := &entidades.NuevaEmbarcacionRequest{
			IDSede:      1,
			Nombre:      "Barco Rápido",
			Capacidad:   20,
			Descripcion: "Embarcación rápida para tours",
			Estado:      "DISPONIBLE",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO embarcacion (id_sede, nombre, capacidad, descripcion, estado, eliminado) VALUES ($1, $2, $3, $4, $5, false) RETURNING id_embarcacion`)).
			WithArgs(1, "Barco Rápido", 20, "Embarcación rápida para tours", "DISPONIBLE").
			WillReturnError(errors.New("database error"))

		id, err := repo.Create(embarcacion)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_Update(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		embarcacion := &entidades.ActualizarEmbarcacionRequest{
			IDSede:      2,
			Nombre:      "Barco Actualizado",
			Capacidad:   25,
			Descripcion: "Embarcación actualizada",
			Estado:      "OCUPADA",
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET id_sede = $1, nombre = $2, capacidad = $3, descripcion = $4, estado = $5 WHERE id_embarcacion = $6 AND eliminado = false`)).
			WithArgs(2, "Barco Actualizado", 25, "Embarcación actualizada", "OCUPADA", 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Update(1, embarcacion)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		embarcacion := &entidades.ActualizarEmbarcacionRequest{
			IDSede:      2,
			Nombre:      "Barco Actualizado",
			Capacidad:   25,
			Descripcion: "Embarcación actualizada",
			Estado:      "OCUPADA",
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET id_sede = $1, nombre = $2, capacidad = $3, descripcion = $4, estado = $5 WHERE id_embarcacion = $6 AND eliminado = false`)).
			WithArgs(2, "Barco Actualizado", 25, "Embarcación actualizada", "OCUPADA", 1).
			WillReturnResult(sqlmock.NewResult(0, 0))

		err := repo.Update(1, embarcacion)
		assert.Error(t, err)
		assert.Equal(t, "embarcación no encontrada o ya fue eliminada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		embarcacion := &entidades.ActualizarEmbarcacionRequest{
			IDSede:      2,
			Nombre:      "Barco Actualizado",
			Capacidad:   25,
			Descripcion: "Embarcación actualizada",
			Estado:      "OCUPADA",
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET id_sede = $1, nombre = $2, capacidad = $3, descripcion = $4, estado = $5 WHERE id_embarcacion = $6 AND eliminado = false`)).
			WithArgs(2, "Barco Actualizado", 25, "Embarcación actualizada", "OCUPADA", 1).
			WillReturnError(errors.New("database error"))

		err := repo.Update(1, embarcacion)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_SoftDelete(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET eliminado = true WHERE id_embarcacion = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.SoftDelete(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET eliminado = true WHERE id_embarcacion = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(0, 0))

		err := repo.SoftDelete(1)
		assert.Error(t, err)
		assert.Equal(t, "embarcación no encontrada o ya fue eliminada", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE embarcacion SET eliminado = true WHERE id_embarcacion = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.SoftDelete(1)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_List(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}).
			AddRow(1, 1, "Barco Rápido", 20, "Embarcación rápida para tours", false, "DISPONIBLE").
			AddRow(2, 1, "Barco Lento", 30, "Embarcación para paseos tranquilos", false, "OCUPADA")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE eliminado = false ORDER BY nombre`)).
			WillReturnRows(rows)

		embarcaciones, err := repo.List()
		assert.NoError(t, err)
		assert.Len(t, embarcaciones, 2)
		assert.Equal(t, "Barco Lento", embarcaciones[0].Nombre)
		assert.Equal(t, "Barco Rápido", embarcaciones[1].Nombre)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Empty", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE eliminado = false ORDER BY nombre`)).
			WillReturnRows(sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}))

		embarcaciones, err := repo.List()
		assert.NoError(t, err)
		assert.Empty(t, embarcaciones)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE eliminado = false ORDER BY nombre`)).
			WillReturnError(errors.New("database error"))

		embarcaciones, err := repo.List()
		assert.Error(t, err)
		assert.Nil(t, embarcaciones)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_ListBySede(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}).
			AddRow(1, 1, "Barco Rápido", 20, "Embarcación rápida para tours", false, "DISPONIBLE")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE id_sede = $1 AND eliminado = false ORDER BY nombre`)).
			WithArgs(1).
			WillReturnRows(rows)

		embarcaciones, err := repo.ListBySede(1)
		assert.NoError(t, err)
		assert.Len(t, embarcaciones, 1)
		assert.Equal(t, "Barco Rápido", embarcaciones[0].Nombre)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Empty", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE id_sede = $1 AND eliminado = false ORDER BY nombre`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}))

		embarcaciones, err := repo.ListBySede(1)
		assert.NoError(t, err)
		assert.Empty(t, embarcaciones)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE id_sede = $1 AND eliminado = false ORDER BY nombre`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		embarcaciones, err := repo.ListBySede(1)
		assert.Error(t, err)
		assert.Nil(t, embarcaciones)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestEmbarcacionRepository_ListByEstado(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewEmbarcacionRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}).
			AddRow(1, 1, "Barco Rápido", 20, "Embarcación rápida para tours", false, "DISPONIBLE")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE estado = $1 AND eliminado = false ORDER BY nombre`)).
			WithArgs("DISPONIBLE").
			WillReturnRows(rows)

		embarcaciones, err := repo.ListByEstado("DISPONIBLE")
		assert.NoError(t, err)
		assert.Len(t, embarcaciones, 1)
		assert.Equal(t, "Barco Rápido", embarcaciones[0].Nombre)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("Empty", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE estado = $1 AND eliminado = false ORDER BY nombre`)).
			WithArgs("DISPONIBLE").
			WillReturnRows(sqlmock.NewRows([]string{"id_embarcacion", "id_sede", "nombre", "capacidad", "descripcion", "eliminado", "estado"}))

		embarcaciones, err := repo.ListByEstado("DISPONIBLE")
		assert.NoError(t, err)
		assert.Empty(t, embarcaciones)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_embarcacion, id_sede, nombre, capacidad, descripcion, eliminado, estado FROM embarcacion WHERE estado = $1 AND eliminado = false ORDER BY nombre`)).
			WithArgs("DISPONIBLE").
			WillReturnError(errors.New("database error"))

		embarcaciones, err := repo.ListByEstado("DISPONIBLE")
		assert.Error(t, err)
		assert.Nil(t, embarcaciones)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
