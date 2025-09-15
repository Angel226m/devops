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

func TestCanalVentaRepository_GetByID(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_canal", "id_sede", "nombre", "descripcion", "eliminado", "nombre_sede"}).
			AddRow(1, 2, "Online", "Canal de venta online", false, "Sede Principal")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.id_canal = $1`)).
			WithArgs(1).
			WillReturnRows(rows)

		canal, err := repo.GetByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, canal)
		assert.Equal(t, 1, canal.ID)
		assert.Equal(t, 2, canal.IDSede)
		assert.Equal(t, "Online", canal.Nombre)
		assert.Equal(t, "Canal de venta online", canal.Descripcion)
		assert.Equal(t, false, canal.Eliminado)
		assert.Equal(t, "Sede Principal", canal.NombreSede)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.id_canal = $1`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		canal, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, canal)
		assert.Equal(t, "canal de venta no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.id_canal = $1`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		canal, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, canal)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCanalVentaRepository_GetByNombre(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_canal", "id_sede", "nombre", "descripcion", "eliminado"}).
			AddRow(1, 2, "Online", "Canal de venta online", false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_canal, id_sede, nombre, descripcion, eliminado FROM canal_venta WHERE nombre = $1 AND id_sede = $2 AND eliminado = false`)).
			WithArgs("Online", 2).
			WillReturnRows(rows)

		canal, err := repo.GetByNombre("Online", 2)
		assert.NoError(t, err)
		assert.NotNil(t, canal)
		assert.Equal(t, 1, canal.ID)
		assert.Equal(t, 2, canal.IDSede)
		assert.Equal(t, "Online", canal.Nombre)
		assert.Equal(t, "Canal de venta online", canal.Descripcion)
		assert.Equal(t, false, canal.Eliminado)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_canal, id_sede, nombre, descripcion, eliminado FROM canal_venta WHERE nombre = $1 AND id_sede = $2 AND eliminado = false`)).
			WithArgs("Online", 2).
			WillReturnError(sql.ErrNoRows)

		canal, err := repo.GetByNombre("Online", 2)
		assert.Error(t, err)
		assert.Nil(t, canal)
		assert.Equal(t, "canal de venta no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCanalVentaRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		canal := &entidades.NuevoCanalVentaRequest{
			IDSede:      2,
			Nombre:      "Online",
			Descripcion: "Canal de venta online",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO canal_venta (id_sede, nombre, descripcion, eliminado) VALUES ($1, $2, $3, false) RETURNING id_canal`)).
			WithArgs(2, "Online", "Canal de venta online").
			WillReturnRows(sqlmock.NewRows([]string{"id_canal"}).AddRow(1))

		id, err := repo.Create(canal)
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		canal := &entidades.NuevoCanalVentaRequest{
			IDSede:      2,
			Nombre:      "Online",
			Descripcion: "Canal de venta online",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO canal_venta (id_sede, nombre, descripcion, eliminado) VALUES ($1, $2, $3, false) RETURNING id_canal`)).
			WithArgs(2, "Online", "Canal de venta online").
			WillReturnError(errors.New("database error"))

		id, err := repo.Create(canal)
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCanalVentaRepository_Update(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		canal := &entidades.ActualizarCanalVentaRequest{
			IDSede:      2,
			Nombre:      "Online Updated",
			Descripcion: "Canal actualizado",
			Eliminado:   false,
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE canal_venta SET id_sede = $1, nombre = $2, descripcion = $3, eliminado = $4 WHERE id_canal = $5`)).
			WithArgs(2, "Online Updated", "Canal actualizado", false, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Update(1, canal)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		canal := &entidades.ActualizarCanalVentaRequest{
			IDSede:      2,
			Nombre:      "Online Updated",
			Descripcion: "Canal actualizado",
			Eliminado:   false,
		}

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE canal_venta SET id_sede = $1, nombre = $2, descripcion = $3, eliminado = $4 WHERE id_canal = $5`)).
			WithArgs(2, "Online Updated", "Canal actualizado", false, 1).
			WillReturnError(errors.New("database error"))

		err := repo.Update(1, canal)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCanalVentaRepository_Delete(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE canal_venta SET eliminado = true WHERE id_canal = $1`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Delete(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("ReservasExist", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "no se puede eliminar este canal de venta porque está siendo utilizado en reservas", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("PagosExist", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "no se puede eliminar este canal de venta porque está siendo utilizado en pagos", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM reserva WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*) FROM pago WHERE id_canal = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE canal_venta SET eliminado = true WHERE id_canal = $1`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		err := repo.Delete(1)
		assert.Error(t, err)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCanalVentaRepository_List(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_canal", "id_sede", "nombre", "descripcion", "eliminado", "nombre_sede"}).
			AddRow(1, 2, "Online", "Canal de venta online", false, "Sede Principal").
			AddRow(2, 2, "Presencial", "Canal presencial", false, "Sede Principal")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.eliminado = false ORDER BY cv.nombre ASC`)).
			WillReturnRows(rows)

		canales, err := repo.List()
		assert.NoError(t, err)
		assert.Len(t, canales, 2)
		assert.Equal(t, 1, canales[0].ID)
		assert.Equal(t, "Online", canales[0].Nombre)
		assert.Equal(t, 2, canales[1].ID)
		assert.Equal(t, "Presencial", canales[1].Nombre)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.eliminado = false ORDER BY cv.nombre ASC`)).
			WillReturnError(errors.New("database error"))

		canales, err := repo.List()
		assert.Error(t, err)
		assert.Nil(t, canales)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestCanalVentaRepository_ListBySede(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_canal", "id_sede", "nombre", "descripcion", "eliminado", "nombre_sede"}).
			AddRow(1, 2, "Online", "Canal de venta online", false, "Sede Principal")

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.id_sede = $1 AND cv.eliminado = false ORDER BY cv.nombre ASC`)).
			WithArgs(2).
			WillReturnRows(rows)

		canales, err := repo.ListBySede(2)
		assert.NoError(t, err)
		assert.Len(t, canales, 1)
		assert.Equal(t, 1, canales[0].ID)
		assert.Equal(t, "Online", canales[0].Nombre)
		assert.Equal(t, "Sede Principal", canales[0].NombreSede)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT cv.id_canal, cv.id_sede, cv.nombre, cv.descripcion, cv.eliminado, s.nombre as nombre_sede FROM canal_venta cv INNER JOIN sede s ON cv.id_sede = s.id_sede WHERE cv.id_sede = $1 AND cv.eliminado = false ORDER BY cv.nombre ASC`)).
			WithArgs(2).
			WillReturnError(errors.New("database error"))

		canales, err := repo.ListBySede(2)
		assert.Error(t, err)
		assert.Nil(t, canales)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
